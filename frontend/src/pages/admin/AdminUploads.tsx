import { useState } from 'react';
import { Upload, FileText, Image, Music, Video } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { useCollections } from '@/hooks/useCollections';
import { UploadDropzone } from '@/components/upload/UploadDropzone';
import { uploadDocuments, uploadImages, uploadAudio, uploadVideo } from '@/services/upload';
import type { MediaType } from '@/types';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function AdminUploads() {
  const { branches } = useBranches();
  const [selectedBranch, setSelectedBranch] = useState('');
  const { collections } = useCollections({ branch: selectedBranch || undefined });

  const [mediaType, setMediaType] = useState<MediaType>('DOCUMENT');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [collectionId, setCollectionId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedCount, setUploadedCount] = useState(0);

  const resetForm = () => {
    setSelectedFiles([]);
    setTitle('');
    setDescription('');
    setTags('');
    setUploadProgress(0);
    setStatus('idle');
    setErrorMessage('');
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
      setUploadedCount((prev) => prev + selectedFiles.length);
      setTimeout(resetForm, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const mediaTypes: { type: MediaType; label: string; icon: typeof FileText }[] = [
    { type: 'DOCUMENT', label: 'Documents', icon: FileText },
    { type: 'IMAGE', label: 'Images', icon: Image },
    { type: 'AUDIO', label: 'Audio', icon: Music },
    { type: 'VIDEO', label: 'Video', icon: Video },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <Upload className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Upload Archive Items</h2>
            <p className="text-sm text-gray-500">
              Upload documents, images, audio, or video to the archives
            </p>
          </div>
          {uploadedCount > 0 && (
            <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {uploadedCount} uploaded this session
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Media Type
            </label>
            <div className="grid grid-cols-4 gap-3">
              {mediaTypes.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setMediaType(type);
                    setSelectedFiles([]);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-colors ${
                    mediaType === type
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch *
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setCollectionId('');
                }}
                required
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.slug}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection *
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                required
                disabled={!selectedBranch}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              >
                <option value="">Select collection</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <UploadDropzone
            mediaType={mediaType}
            onFilesSelected={setSelectedFiles}
            disabled={status === 'uploading'}
          />

          {selectedFiles.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected files ({selectedFiles.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white border rounded text-xs text-gray-600"
                  >
                    {file.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
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

          {status === 'uploading' && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Upload successful! Files have been added to the archive.
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              disabled={status === 'uploading'}
              className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={!selectedFiles.length || !collectionId || status === 'uploading'}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload Files
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
