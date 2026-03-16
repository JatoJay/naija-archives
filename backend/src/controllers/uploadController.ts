import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { uploadFile, getMediaFolder } from '../services/storageService.js';
import { extractTextFromPdf } from '../utils/textExtractor.js';
import { extractTextFromImage } from '../services/ocrService.js';
import { MediaType, IndexingStatus } from '@prisma/client';
import Queue from 'bull';

const redisUrl = process.env.REDIS_URL || '';
const indexingQueue = redisUrl ? new Queue('indexing', redisUrl) : null;
const transcriptionQueue = redisUrl ? new Queue('transcription', redisUrl) : null;

export async function uploadDocuments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[];
    const { collectionId, title, description, language, tags, recordDate } = req.body;

    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: { branch: true },
    });

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }

    const results = [];

    for (const file of files) {
      const folder = getMediaFolder('DOCUMENT');
      const uploadResult = await uploadFile(
        file.buffer,
        file.originalname,
        folder,
        file.mimetype
      );

      let extractedText = '';
      if (file.mimetype === 'application/pdf') {
        extractedText = await extractTextFromPdf(file.buffer);
      } else if (file.mimetype === 'text/plain') {
        extractedText = file.buffer.toString('utf-8');
      }

      const item = await prisma.archiveItem.create({
        data: {
          collectionId,
          title: title || file.originalname,
          description,
          mediaType: MediaType.DOCUMENT,
          fileUrl: uploadResult.publicUrl,
          fileSizeBytes: BigInt(uploadResult.size),
          mimeType: file.mimetype,
          extractedText,
          language: language || 'en',
          tags: tags || '',
          indexingStatus: extractedText ? IndexingStatus.PENDING : IndexingStatus.FAILED,
          uploadedBy: req.user?.id,
          recordDate: recordDate ? new Date(recordDate) : null,
        },
      });

      if (extractedText && indexingQueue) {
        await indexingQueue.add({
          itemId: item.id,
          branchSlug: collection.branch.slug,
          collectionId: collection.id,
          text: extractedText,
          title: item.title,
          mediaType: 'DOCUMENT',
        });
      }

      results.push(item);
    }

    res.status(201).json({
      message: `${results.length} document(s) uploaded successfully`,
      items: results,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadImages(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[];
    const { collectionId, caption, photographer, location, dateTaken, tags } = req.body;

    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: { branch: true },
    });

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }

    const results = [];

    for (const file of files) {
      const folder = getMediaFolder('IMAGE');
      const uploadResult = await uploadFile(
        file.buffer,
        file.originalname,
        folder,
        file.mimetype
      );

      let extractedText = '';
      try {
        extractedText = await extractTextFromImage(file.buffer);
      } catch {
        console.error('OCR failed for image:', file.originalname);
      }

      const item = await prisma.archiveItem.create({
        data: {
          collectionId,
          title: caption || file.originalname,
          description: caption,
          mediaType: MediaType.IMAGE,
          fileUrl: uploadResult.publicUrl,
          fileSizeBytes: BigInt(uploadResult.size),
          mimeType: file.mimetype,
          extractedText,
          tags: tags || '',
          metadata: {
            photographer,
            location,
            dateTaken,
          },
          indexingStatus: extractedText ? IndexingStatus.PENDING : IndexingStatus.INDEXED,
          uploadedBy: req.user?.id,
          recordDate: dateTaken ? new Date(dateTaken) : null,
        },
      });

      if (extractedText && indexingQueue) {
        await indexingQueue.add({
          itemId: item.id,
          branchSlug: collection.branch.slug,
          collectionId: collection.id,
          text: extractedText,
          title: item.title,
          mediaType: 'IMAGE',
        });
      }

      results.push(item);
    }

    res.status(201).json({
      message: `${results.length} image(s) uploaded successfully`,
      items: results,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadAudio(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const file = req.file;
    const { collectionId, title, description, language, tags, recordDate } = req.body;

    if (!file) {
      throw new AppError('No file uploaded', 400);
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: { branch: true },
    });

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }

    const folder = getMediaFolder('AUDIO');
    const uploadResult = await uploadFile(
      file.buffer,
      file.originalname,
      folder,
      file.mimetype
    );

    const item = await prisma.archiveItem.create({
      data: {
        collectionId,
        title: title || file.originalname,
        description,
        mediaType: MediaType.AUDIO,
        fileUrl: uploadResult.publicUrl,
        fileSizeBytes: BigInt(uploadResult.size),
        mimeType: file.mimetype,
        language: language || 'en',
        tags: tags || '',
        indexingStatus: IndexingStatus.PENDING,
        uploadedBy: req.user?.id,
        recordDate: recordDate ? new Date(recordDate) : null,
      },
    });

    if (transcriptionQueue) {
      await transcriptionQueue.add({
        itemId: item.id,
        gcsUri: uploadResult.gcsUri,
        branchSlug: collection.branch.slug,
        collectionId: collection.id,
        language: language || 'en-US',
        mediaType: 'AUDIO',
      });
    }

    res.status(201).json({
      message: 'Audio uploaded successfully. Transcription in progress.',
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadVideo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const file = req.file;
    const { collectionId, title, description, language, tags, recordDate } = req.body;

    if (!file) {
      throw new AppError('No file uploaded', 400);
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: { branch: true },
    });

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }

    const folder = getMediaFolder('VIDEO');
    const uploadResult = await uploadFile(
      file.buffer,
      file.originalname,
      folder,
      file.mimetype
    );

    const item = await prisma.archiveItem.create({
      data: {
        collectionId,
        title: title || file.originalname,
        description,
        mediaType: MediaType.VIDEO,
        fileUrl: uploadResult.publicUrl,
        fileSizeBytes: BigInt(uploadResult.size),
        mimeType: file.mimetype,
        language: language || 'en',
        tags: tags || '',
        indexingStatus: IndexingStatus.PENDING,
        uploadedBy: req.user?.id,
        recordDate: recordDate ? new Date(recordDate) : null,
      },
    });

    if (transcriptionQueue) {
      await transcriptionQueue.add({
        itemId: item.id,
        gcsUri: uploadResult.gcsUri,
        branchSlug: collection.branch.slug,
        collectionId: collection.id,
        language: language || 'en-US',
        mediaType: 'VIDEO',
      });
    }

    res.status(201).json({
      message: 'Video uploaded successfully. Transcription in progress.',
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUploadStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { itemId } = req.params;

    const item = await prisma.archiveItem.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        title: true,
        indexingStatus: true,
        mediaType: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!item) {
      throw new AppError('Item not found', 404);
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
}
