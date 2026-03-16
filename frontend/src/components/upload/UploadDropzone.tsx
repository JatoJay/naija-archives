import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, Music, Video } from 'lucide-react';
import type { MediaType } from '@/types';

interface UploadDropzoneProps {
  mediaType: MediaType;
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

const ACCEPT_MAP: Record<MediaType, Record<string, string[]>> = {
  DOCUMENT: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
  },
  IMAGE: {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
  },
  AUDIO: {
    'audio/mpeg': ['.mp3'],
    'audio/wav': ['.wav'],
    'audio/ogg': ['.ogg'],
    'audio/flac': ['.flac'],
  },
  VIDEO: {
    'video/mp4': ['.mp4'],
    'video/webm': ['.webm'],
    'video/quicktime': ['.mov'],
  },
};

const ICON_MAP: Record<MediaType, typeof File> = {
  DOCUMENT: File,
  IMAGE: Image,
  AUDIO: Music,
  VIDEO: Video,
};

const LABEL_MAP: Record<MediaType, string> = {
  DOCUMENT: 'documents',
  IMAGE: 'images',
  AUDIO: 'audio files',
  VIDEO: 'video files',
};

export function UploadDropzone({
  mediaType,
  onFilesSelected,
  maxFiles = 10,
  disabled = false,
}: UploadDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT_MAP[mediaType],
    maxFiles: mediaType === 'AUDIO' || mediaType === 'VIDEO' ? 1 : maxFiles,
    disabled,
  });

  const Icon = ICON_MAP[mediaType];
  const label = LABEL_MAP[mediaType];

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-green-500 bg-green-50'
          : disabled
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
          : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className={`p-3 rounded-full ${isDragActive ? 'bg-green-100' : 'bg-gray-100'}`}>
          {isDragActive ? (
            <Upload className="h-6 w-6 text-green-600" />
          ) : (
            <Icon className="h-6 w-6 text-gray-400" />
          )}
        </div>
        {isDragActive ? (
          <p className="text-sm text-green-600 font-medium">Drop files here...</p>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-green-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {mediaType === 'AUDIO' || mediaType === 'VIDEO'
                ? `Upload ${label} (1 file at a time)`
                : `Upload ${label} (up to ${maxFiles} files)`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
