export function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'tif'];
  return imageExtensions.includes(getFileExtension(filename).toLowerCase());
}

export function isVideoFile(filename: string): boolean {
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  return videoExtensions.includes(getFileExtension(filename).toLowerCase());
}

export function isAudioFile(filename: string): boolean {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];
  return audioExtensions.includes(getFileExtension(filename).toLowerCase());
}

export function isDocumentFile(filename: string): boolean {
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
  return documentExtensions.includes(getFileExtension(filename).toLowerCase());
}

export function getMimeTypeIcon(mimeType: string | null): string {
  if (!mimeType) return 'file';

  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'file-text';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'file-text';

  return 'file';
}
