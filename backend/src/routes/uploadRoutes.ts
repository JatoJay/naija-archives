import { Router } from 'express';
import {
  uploadDocuments,
  uploadImages,
  uploadAudio,
  uploadVideo,
  getUploadStatus,
} from '../controllers/uploadController.js';
import { authenticate, requireArchivist } from '../middleware/auth.js';
import {
  uploadDocument,
  uploadImage,
  uploadAudio as uploadAudioMiddleware,
  uploadVideo as uploadVideoMiddleware,
} from '../middleware/upload.js';

const router = Router();

router.post(
  '/document',
  authenticate,
  requireArchivist,
  uploadDocument.array('files', 20),
  uploadDocuments
);

router.post(
  '/image',
  authenticate,
  requireArchivist,
  uploadImage.array('images', 50),
  uploadImages
);

router.post(
  '/audio',
  authenticate,
  requireArchivist,
  uploadAudioMiddleware.single('audio'),
  uploadAudio
);

router.post(
  '/video',
  authenticate,
  requireArchivist,
  uploadVideoMiddleware.single('video'),
  uploadVideo
);

router.get('/status/:itemId', getUploadStatus);

export default router;
