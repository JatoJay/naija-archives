import { storage, bucketName, getPublicUrl } from '../config/gcs.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

interface UploadResult {
  filename: string;
  publicUrl: string;
  gcsUri: string;
  size: number;
}

export async function uploadFile(
  buffer: Buffer,
  originalFilename: string,
  folder: string,
  contentType?: string
): Promise<UploadResult> {
  const ext = path.extname(originalFilename);
  const filename = `${folder}/${uuidv4()}${ext}`;

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  await file.save(buffer, {
    metadata: {
      contentType: contentType || 'application/octet-stream',
    },
  });

  await file.makePublic();

  return {
    filename,
    publicUrl: getPublicUrl(filename),
    gcsUri: `gs://${bucketName}/${filename}`,
    size: buffer.length,
  };
}

export async function deleteFile(filename: string): Promise<void> {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  await file.delete();
}

export async function getFileBuffer(filename: string): Promise<Buffer> {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  const [buffer] = await file.download();
  return buffer;
}

export async function generateSignedUrl(
  filename: string,
  expiresInMinutes = 60
): Promise<string> {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  });

  return url;
}

export function getMediaFolder(mediaType: string): string {
  const folders: Record<string, string> = {
    DOCUMENT: 'documents',
    IMAGE: 'images',
    AUDIO: 'audio',
    VIDEO: 'video',
  };
  return folders[mediaType] || 'misc';
}
