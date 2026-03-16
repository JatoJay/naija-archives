import { Link } from 'react-router-dom';
import { FileText, Image, Music, Video, Clock, Tag } from 'lucide-react';
import type { ArchiveItem, MediaType } from '@/types';
import { formatFileSize, formatDate } from '@/utils/formatters';

interface ItemCardProps {
  item: ArchiveItem;
}

const ICON_MAP: Record<MediaType, typeof FileText> = {
  DOCUMENT: FileText,
  IMAGE: Image,
  AUDIO: Music,
  VIDEO: Video,
};

const COLOR_MAP: Record<MediaType, string> = {
  DOCUMENT: 'bg-blue-100 text-blue-600',
  IMAGE: 'bg-purple-100 text-purple-600',
  AUDIO: 'bg-orange-100 text-orange-600',
  VIDEO: 'bg-red-100 text-red-600',
};

export function ItemCard({ item }: ItemCardProps) {
  const Icon = ICON_MAP[item.mediaType];
  const colorClass = COLOR_MAP[item.mediaType];

  return (
    <Link
      to={`/items/${item.id}`}
      className="group block bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {item.mediaType === 'IMAGE' && item.fileUrl ? (
          <img
            src={item.fileUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : item.mediaType === 'VIDEO' && item.fileUrl ? (
          <video
            src={item.fileUrl}
            className="w-full h-full object-cover"
            muted
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <Icon className="h-16 w-16 text-gray-300" />
          </div>
        )}
        <div className={`absolute top-2 left-2 p-1.5 rounded ${colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        {item.indexingStatus === 'PROCESSING' && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
            Processing...
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 group-hover:text-green-700 transition-colors text-sm line-clamp-2">
          {item.title}
        </h3>
        {item.collection && (
          <p className="text-xs text-gray-500 mt-1">
            {item.collection.title}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-400">
          {item.fileSizeBytes && (
            <span>{formatFileSize(item.fileSizeBytes)}</span>
          )}
          {item.recordDate && (
            <div className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              <span>{formatDate(item.recordDate)}</span>
            </div>
          )}
        </div>
        {item.tags.length > 0 && (
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            <Tag className="h-3 w-3 text-gray-400" />
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-gray-400">+{item.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
