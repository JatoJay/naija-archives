import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Tag, FileText, Image, Music, Video, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ReactPlayer from 'react-player';
import api from '@/services/api';
import { formatDate, formatFileSize, formatMediaType } from '@/utils/formatters';
import type { ArchiveItem } from '@/types';

async function getItemById(id: string): Promise<ArchiveItem> {
  const response = await api.get<ArchiveItem>(`/collections/items/${id}`);
  return response.data;
}

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getItemById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-96 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Item not found</h1>
        <p className="text-gray-600 mt-2">The requested item does not exist.</p>
        <Link to="/collections" className="mt-4 inline-flex items-center gap-2 text-green-700 font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to collections
        </Link>
      </div>
    );
  }

  const Icon = item.mediaType === 'DOCUMENT' ? FileText
    : item.mediaType === 'IMAGE' ? Image
    : item.mediaType === 'AUDIO' ? Music
    : Video;

  return (
    <div className="container mx-auto px-4 py-8">
      {item.collection && (
        <Link
          to={`/collections/${item.collectionId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {item.collection.title}
        </Link>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              {item.mediaType === 'IMAGE' && item.fileUrl ? (
                <img
                  src={item.fileUrl}
                  alt={item.title}
                  className="max-w-full max-h-full object-contain"
                />
              ) : item.mediaType === 'VIDEO' && item.fileUrl ? (
                <ReactPlayer
                  url={item.fileUrl}
                  controls
                  width="100%"
                  height="100%"
                />
              ) : item.mediaType === 'AUDIO' && item.fileUrl ? (
                <div className="w-full p-8">
                  <div className="flex flex-col items-center gap-4">
                    <Music className="h-24 w-24 text-gray-300" />
                    <audio controls className="w-full max-w-md">
                      <source src={item.fileUrl} />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              ) : item.mediaType === 'DOCUMENT' && item.fileUrl ? (
                <div className="flex flex-col items-center gap-4 p-8">
                  <FileText className="h-24 w-24 text-gray-300" />
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800"
                  >
                    View Document
                  </a>
                </div>
              ) : (
                <Icon className="h-24 w-24 text-gray-300" />
              )}
            </div>
          </div>

          {item.extractedText && (
            <div className="mt-6 bg-white rounded-lg border p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Extracted Text</h2>
              <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                {item.extractedText}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-2 rounded ${
                item.mediaType === 'DOCUMENT' ? 'bg-blue-100 text-blue-600'
                  : item.mediaType === 'IMAGE' ? 'bg-purple-100 text-purple-600'
                  : item.mediaType === 'AUDIO' ? 'bg-orange-100 text-orange-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                {formatMediaType(item.mediaType)}
              </span>
            </div>

            <h1 className="font-display text-xl font-bold text-gray-900">{item.title}</h1>

            {item.description && (
              <p className="text-gray-600 mt-3 text-sm">{item.description}</p>
            )}

            {item.fileUrl && (
              <a
                href={item.fileUrl}
                download
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            )}
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              {item.collection && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 flex-shrink-0">Collection</span>
                  <Link
                    to={`/collections/${item.collectionId}`}
                    className="text-green-700 hover:underline"
                  >
                    {item.collection.title}
                  </Link>
                </div>
              )}
              {item.recordDate && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 flex-shrink-0">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date
                  </span>
                  <span className="text-gray-900">{formatDate(item.recordDate)}</span>
                </div>
              )}
              {item.language && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 flex-shrink-0">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Language
                  </span>
                  <span className="text-gray-900">{item.language}</span>
                </div>
              )}
              {item.fileSizeBytes && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 flex-shrink-0">File Size</span>
                  <span className="text-gray-900">{formatFileSize(item.fileSizeBytes)}</span>
                </div>
              )}
              {item.mimeType && (
                <div className="flex items-start gap-3">
                  <span className="text-gray-500 w-24 flex-shrink-0">Format</span>
                  <span className="text-gray-900">{item.mimeType}</span>
                </div>
              )}
            </div>
          </div>

          {item.tags.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
