import { storage, bucketName, getPublicUrl, isGCSEnabled } from '../config/gcs.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

interface UploadResult {
  filename: string;
  publicUrl: string;
  gcsUri: string;
  size: number;
}

async function ensureUploadDir(folder: string): Promise<string> {
  const dir = path.join(UPLOAD_DIR, folder);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function uploadFile(
  buffer: Buffer,
  originalFilename: string,
  folder: string,
  contentType?: string
): Promise<UploadResult> {
  const ext = path.extname(originalFilename);
  const filename = `${folder}/${uuidv4()}${ext}`;

  if (isGCSEnabled() && storage && bucketName) {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);

    await file.save(buffer, {
      metadata: {
        contentType: contentType || 'application/octet-stream',
      },
    });

    return {
      filename,
      publicUrl: getPublicUrl(filename),
      gcsUri: `gs://${bucketName}/${filename}`,
      size: buffer.length,
    };
  }

  const dir = await ensureUploadDir(folder);
  const localFilename = `${uuidv4()}${ext}`;
  const localPath = path.join(dir, localFilename);

  await fs.writeFile(localPath, buffer);

  return {
    filename,
    publicUrl: `/uploads/${folder}/${localFilename}`,
    gcsUri: `file://${localPath}`,
    size: buffer.length,
  };
}

export async function deleteFile(filename: string): Promise<void> {
  if (isGCSEnabled() && storage && bucketName) {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);
    await file.delete();
    return;
  }

  const localPath = path.join(UPLOAD_DIR, filename);
  try {
    await fs.unlink(localPath);
  } catch {
  }
}

export async function getFileBuffer(filename: string): Promise<Buffer> {
  if (isGCSEnabled() && storage && bucketName) {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);
    const [buffer] = await file.download();
    return buffer;
  }

  const localPath = path.join(UPLOAD_DIR, filename);
  return fs.readFile(localPath);
}

export async function generateSignedUrl(
  filename: string,
  expiresInMinutes = 60
): Promise<string> {
  if (isGCSEnabled() && storage && bucketName) {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });

    return url;
  }

  return `/uploads/${filename}`;
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
