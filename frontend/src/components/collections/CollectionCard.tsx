import { Link } from 'react-router-dom';
import { FileText, Calendar, MapPin } from 'lucide-react';
import type { Collection } from '@/types';
import { formatCategory } from '@/utils/formatters';

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const yearRange = collection.startYear
    ? collection.endYear && collection.endYear !== collection.startYear
      ? `${collection.startYear} - ${collection.endYear}`
      : `${collection.startYear}`
    : null;

  return (
    <Link
      to={`/collections/${collection.id}`}
      className="group block bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {collection.thumbnailUrl ? (
          <img
            src={collection.thumbnailUrl}
            alt={collection.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
            <FileText className="h-12 w-12 text-amber-600/60" />
          </div>
        )}
        <div className="absolute top-2 left-2 px-2 py-1 bg-green-700/90 text-white rounded text-xs font-medium">
          {formatCategory(collection.category)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1">
          {collection.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{collection.description}</p>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{collection.branch.name}</span>
          </div>
          {yearRange && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{yearRange}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span>{collection.itemCount} items</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
