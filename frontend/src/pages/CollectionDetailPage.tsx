import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, FileText, Image, Music, Video } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCollectionById, getCollectionItems } from '@/services/collections';
import { ItemCard } from '@/components/collections/ItemCard';
import { formatCategory, formatYearRange, formatNumber } from '@/utils/formatters';
import type { MediaType } from '@/types';

const MEDIA_TABS: { type: MediaType | 'ALL'; label: string; icon: typeof FileText }[] = [
  { type: 'ALL', label: 'All', icon: FileText },
  { type: 'DOCUMENT', label: 'Documents', icon: FileText },
  { type: 'IMAGE', label: 'Images', icon: Image },
  { type: 'AUDIO', label: 'Audio', icon: Music },
  { type: 'VIDEO', label: 'Videos', icon: Video },
];

export function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<MediaType | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const { data: collection, isLoading: collectionLoading } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => getCollectionById(id!),
    enabled: !!id,
  });

  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ['collectionItems', id, activeTab, page],
    queryFn: () =>
      getCollectionItems(id!, {
        mediaType: activeTab === 'ALL' ? undefined : activeTab,
        page,
        limit: 12,
      }),
    enabled: !!id,
  });

  if (collectionLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Collection not found</h1>
        <p className="text-gray-600 mt-2">The requested collection does not exist.</p>
        <Link to="/collections" className="mt-4 inline-flex items-center gap-2 text-green-700 font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to collections
        </Link>
      </div>
    );
  }

  const items = itemsData?.data || [];
  const pagination = itemsData?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/collections"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        All Collections
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="mb-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
              {formatCategory(collection.category)}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900">{collection.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{collection.branch.name}, {collection.branch.region}</span>
            </div>
            {(collection.startYear || collection.endYear) && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatYearRange(collection.startYear, collection.endYear)}</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 mt-4 leading-relaxed">{collection.description}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">Items by Type</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Items</span>
              <span className="font-semibold text-gray-900">{formatNumber(collection.itemCount)}</span>
            </div>
            {collection.itemsByType && (
              <>
                <hr />
                {Object.entries(collection.itemsByType).map(([type, count]) => {
                  const Icon =
                    type === 'DOCUMENT'
                      ? FileText
                      : type === 'IMAGE'
                      ? Image
                      : type === 'AUDIO'
                      ? Music
                      : Video;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Icon className="h-4 w-4" />
                        <span>{type.charAt(0) + type.slice(1).toLowerCase()}s</span>
                      </div>
                      <span className="font-medium text-gray-700">{formatNumber(count)}</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="border-b mb-6">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {MEDIA_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.type}
                  onClick={() => {
                    setActiveTab(tab.type);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.type
                      ? 'border-green-700 text-green-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {itemsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
