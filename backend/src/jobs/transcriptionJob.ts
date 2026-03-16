import Queue from 'bull';
import { prisma } from '../config/database.js';
import { transcribeFromGcsUri } from '../services/transcriptionService.js';
import { IndexingStatus } from '@prisma/client';
import { logger } from '../utils/logger.js';

interface TranscriptionJobData {
  itemId: string;
  gcsUri: string;
  branchSlug: string;
  collectionId: string;
  language: string;
  mediaType: string;
}

const transcriptionQueue = new Queue<TranscriptionJobData>(
  'transcription',
  process.env.REDIS_URL || 'redis://localhost:6379'
);

const indexingQueue = new Queue(
  'indexing',
  process.env.REDIS_URL || 'redis://localhost:6379'
);

transcriptionQueue.process(async (job) => {
  const { itemId, gcsUri, branchSlug, collectionId, language, mediaType } = job.data;

  logger.info(`Processing transcription job for item ${itemId}`);

  try {
    await prisma.archiveItem.update({
      where: { id: itemId },
      data: { indexingStatus: IndexingStatus.PROCESSING },
    });

    const result = await transcribeFromGcsUri(gcsUri, language);

    if (!result.transcript || result.transcript.trim().length === 0) {
      await prisma.archiveItem.update({
        where: { id: itemId },
        data: { indexingStatus: IndexingStatus.INDEXED },
      });
      return { success: true, message: 'No transcript generated' };
    }

    const item = await prisma.archiveItem.update({
      where: { id: itemId },
      data: {
        extractedText: result.transcript,
        metadata: {
          transcriptionConfidence: result.confidence,
        },
      },
    });

    await indexingQueue.add({
      itemId,
      branchSlug,
      collectionId,
      text: result.transcript,
      title: item.title,
      mediaType,
    });

    logger.info(`Successfully transcribed item ${itemId}`);

    return { success: true, transcriptLength: result.transcript.length };
  } catch (error) {
    logger.error(`Failed to transcribe item ${itemId}`, { error });

    await prisma.archiveItem.update({
      where: { id: itemId },
      data: { indexingStatus: IndexingStatus.FAILED },
    });

    throw error;
  }
});

transcriptionQueue.on('completed', (job, result) => {
  logger.info(`Transcription job ${job.id} completed`, result);
});

transcriptionQueue.on('failed', (job, err) => {
  logger.error(`Transcription job ${job?.id} failed`, { error: err.message });
});

export { transcriptionQueue };
