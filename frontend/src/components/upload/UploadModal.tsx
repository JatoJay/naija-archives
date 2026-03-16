import { useState } from 'react';
import { X, Loader2, Check, AlertCircle } from 'lucide-react';
import { useUIStore } from '@/store';
import { useCollections } from '@/hooks/useCollections';
import { UploadDropzone } from './UploadDropzone';
import { uploadDocuments, uploadImages, uploadAudio, uploadVideo } from '@/services/upload';
import type { MediaType } from '@/types';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function UploadModal() {
  const { isUploadModalOpen, setUploadModalOpen } = useUIStore();
  const { collections } = useCollections();
  const [mediaType, setMediaType] = useState<MediaType>('DOCUMENT');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [collectionId, setCollectionId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setSelectedFiles([]);
    setTitle('');
    setDescription('');
    setTags('');
    setUploadProgress(0);
    setStatus('idle');
    setErrorMessage('');
  };

  const handleClose = () => {
    if (status !== 'uploading') {
      resetForm();
      setUploadModalOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles.length || !collectionId) return;

    setStatus('uploading');
    setErrorMessage('');

    try {
      const commonData = {
        collectionId,
        title,
        description,
        tags,
      };

      switch (mediaType) {
        case 'DOCUMENT':
          await uploadDocuments(selectedFiles, commonData, setUploadProgress);
          break;
        case 'IMAGE':
          await uploadImages(selectedFiles, { ...commonData, caption: description }, setUploadProgress);
          break;
        case 'AUDIO':
          await uploadAudio(selectedFiles[0], commonData, setUploadProgress);
          break;
        case 'VIDEO':
          await uploadVideo(selectedFiles[0], commonData, setUploadProgress);
          break;
      }

      setStatus('success');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  if (!isUploadModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Upload to Archives</h2>
          <button
            onClick={handleClose}
            disabled={status === 'uploading'}
            className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['DOCUMENT', 'IMAGE', 'AUDIO', 'VIDEO'] as MediaType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setMediaType(type);
                    setSelectedFiles([]);
                  }}
                  className={`px-3 py-2 text-sm rounded-md border ${
                    mediaType === type
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection *
            </label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a collection</option>
              {collections?.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.title}
                </option>
              ))}
            </select>
          </div>

          <UploadDropzone
            mediaType={mediaType}
            onFilesSelected={setSelectedFiles}
            disabled={status === 'uploading'}
          />

          {selectedFiles.length > 0 && (
            <div className="text-sm text-gray-600">
              {selectedFiles.length} file(s) selected:{' '}
              {selectedFiles.map((f) => f.name).join(', ')}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter a title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Enter a description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Comma-separated tags"
            />
          </div>

          {status === 'uploading' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading... {uploadProgress}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              Upload successful!
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={status === 'uploading'}
              className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFiles.length || !collectionId || status === 'uploading'}
              className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
