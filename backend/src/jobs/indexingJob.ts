import Queue from 'bull';
import { prisma } from '../config/database.js';
import { generateEmbeddings } from '../services/embeddingService.js';
import { upsertVectors } from '../services/qdrantService.js';
import { chunkText, cleanText } from '../utils/textExtractor.js';
import { IndexingStatus } from '@prisma/client';
import { logger } from '../utils/logger.js';

interface IndexingJobData {
  itemId: string;
  branchSlug: string;
  collectionId: string;
  text: string;
  title: string;
  mediaType: string;
}

const indexingQueue = new Queue<IndexingJobData>(
  'indexing',
  process.env.REDIS_URL || 'redis://localhost:6379'
);

indexingQueue.process(async (job) => {
  const { itemId, branchSlug, collectionId, text, title, mediaType } = job.data;

  logger.info(`Processing indexing job for item ${itemId}`);

  try {
    await prisma.archiveItem.update({
      where: { id: itemId },
      data: { indexingStatus: IndexingStatus.PROCESSING },
    });

    const cleanedText = cleanText(text);
    const chunks = chunkText(cleanedText, 500, 50);

    if (chunks.length === 0) {
      await prisma.archiveItem.update({
        where: { id: itemId },
        data: { indexingStatus: IndexingStatus.INDEXED },
      });
      return { success: true, message: 'No text to index' };
    }

    const embeddings = await generateEmbeddings(chunks);

    const payloads = chunks.map((chunk, index) => ({
      itemId,
      branchSlug,
      collectionId,
      chunkIndex: index,
      text: chunk,
      mediaType,
      title,
    }));

    const pointIds = await upsertVectors(embeddings, payloads);

    await prisma.archiveItem.update({
      where: { id: itemId },
      data: {
        indexingStatus: IndexingStatus.INDEXED,
        qdrantPointIds: pointIds,
      },
    });

    logger.info(`Successfully indexed item ${itemId} with ${pointIds.length} vectors`);

    return { success: true, vectorCount: pointIds.length };
  } catch (error) {
    logger.error(`Failed to index item ${itemId}`, { error });

    await prisma.archiveItem.update({
      where: { id: itemId },
      data: { indexingStatus: IndexingStatus.FAILED },
    });

    throw error;
  }
});

indexingQueue.on('completed', (job, result) => {
  logger.info(`Indexing job ${job.id} completed`, result);
});

indexingQueue.on('failed', (job, err) => {
  logger.error(`Indexing job ${job?.id} failed`, { error: err.message });
});

export { indexingQueue };
