import { Storage } from '@google-cloud/storage';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

export const storage = projectId && keyFilename
  ? new Storage({ projectId, keyFilename })
  : null;

export const bucketName = process.env.GCS_BUCKET_NAME || 'nigeria-archives-media';

export const isGCSEnabled = (): boolean => !!storage;

export async function initializeGCSBucket(): Promise<void> {
  if (!storage) {
    console.log('⚠️ GCS not configured - file uploads will use Supabase Storage');
    return;
  }
  try {
    const [exists] = await storage.bucket(bucketName).exists();
    if (!exists) {
      console.log(`⚠️ GCS bucket '${bucketName}' does not exist. Please create it manually.`);
    } else {
      console.log(`✅ GCS bucket '${bucketName}' is accessible`);
    }
  } catch (error) {
    console.error('❌ Failed to check GCS bucket:', error);
  }
}

export function getPublicUrl(filename: string): string {
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}
