import api from './api';
import type { UploadResponse, ArchiveItem } from '@/types';

interface DocumentUploadData {
  collectionId: string;
  title?: string;
  description?: string;
  language?: string;
  tags?: string;
  recordDate?: string;
}

interface ImageUploadData {
  collectionId: string;
  caption?: string;
  photographer?: string;
  location?: string;
  dateTaken?: string;
  tags?: string;
}

interface MediaUploadData {
  collectionId: string;
  title?: string;
  description?: string;
  language?: string;
  tags?: string;
  recordDate?: string;
}

export async function uploadDocuments(
  files: File[],
  data: DocumentUploadData,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const response = await api.post<UploadResponse>('/upload/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
  return response.data;
}

export async function uploadImages(
  files: File[],
  data: ImageUploadData,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const response = await api.post<UploadResponse>('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
  return response.data;
}

export async function uploadAudio(
  file: File,
  data: MediaUploadData,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('audio', file);
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const response = await api.post<UploadResponse>('/upload/audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
  return response.data;
}

export async function uploadVideo(
  file: File,
  data: MediaUploadData,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('video', file);
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const response = await api.post<UploadResponse>('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
  return response.data;
}

export async function getUploadStatus(itemId: string): Promise<ArchiveItem> {
  const response = await api.get<ArchiveItem>(`/upload/status/${itemId}`);
  return response.data;
}
