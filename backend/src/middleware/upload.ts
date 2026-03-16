import multer from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const documentFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf',
    'application/vnd.oasis.opendocument.text',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, TXT, RTF, ODT'));
  }
};

const imageFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/bmp',
    'image/webp',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: JPG, PNG, TIFF, BMP, WEBP'));
  }
};

const audioFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/mp4',
    'audio/m4a',
    'audio/flac',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: MP3, WAV, OGG, M4A, FLAC'));
  }
};

const videoFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/webm',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: MP4, MOV, AVI, MKV, WEBM'));
  }
};

export const uploadDocument = multer({
  storage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 20,
  },
});

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 50,
  },
});

export const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 200 * 1024 * 1024,
    files: 1,
  },
});

export const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024,
    files: 1,
  },
});
