import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  uploadDocuments,
  uploadImages,
  uploadAudio,
  uploadVideo,
} from '@/services/upload';

export function useUpload() {
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const documentUpload = useMutation({
    mutationFn: ({
      files,
      data,
    }: {
      files: File[];
      data: Parameters<typeof uploadDocuments>[1];
    }) => uploadDocuments(files, data, setProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['recent-items'] });
      setProgress(0);
    },
    onError: () => {
      setProgress(0);
    },
  });

  const imageUpload = useMutation({
    mutationFn: ({
      files,
      data,
    }: {
      files: File[];
      data: Parameters<typeof uploadImages>[1];
    }) => uploadImages(files, data, setProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['recent-items'] });
      setProgress(0);
    },
    onError: () => {
      setProgress(0);
    },
  });

  const audioUpload = useMutation({
    mutationFn: ({
      file,
      data,
    }: {
      file: File;
      data: Parameters<typeof uploadAudio>[1];
    }) => uploadAudio(file, data, setProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['recent-items'] });
      setProgress(0);
    },
    onError: () => {
      setProgress(0);
    },
  });

  const videoUpload = useMutation({
    mutationFn: ({
      file,
      data,
    }: {
      file: File;
      data: Parameters<typeof uploadVideo>[1];
    }) => uploadVideo(file, data, setProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['recent-items'] });
      setProgress(0);
    },
    onError: () => {
      setProgress(0);
    },
  });

  return {
    progress,
    documentUpload,
    imageUpload,
    audioUpload,
    videoUpload,
    isUploading:
      documentUpload.isPending ||
      imageUpload.isPending ||
      audioUpload.isPending ||
      videoUpload.isPending,
  };
}
