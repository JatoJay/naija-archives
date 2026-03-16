import { useState } from 'react';
import { Search, FileText, Image, Music, Video, SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { ItemCard } from '@/components/collections/ItemCard';
import { formatCategory } from '@/utils/formatters';
import type { ArchiveItem, MediaType, CollectionCategory, PaginatedResponse } from '@/types';

interface SearchParams {
  q: string;
  mediaType?: MediaType;
  category?: CollectionCategory;
  page: number;
  limit: number;
}

async function searchItems(params: SearchParams): Promise<PaginatedResponse<ArchiveItem>> {
  const response = await api.get<PaginatedResponse<ArchiveItem>>('/collections/search', { params });
  return response.data;
}

const MEDIA_TYPES: { value: MediaType | ''; label: string; icon: typeof FileText }[] = [
  { value: '', label: 'All Types', icon: FileText },
  { value: 'DOCUMENT', label: 'Documents', icon: FileText },
  { value: 'IMAGE', label: 'Images', icon: Image },
  { value: 'AUDIO', label: 'Audio', icon: Music },
  { value: 'VIDEO', label: 'Videos', icon: Video },
];

const CATEGORIES: CollectionCategory[] = [
  'COLONIAL_ERA',
  'INDEPENDENCE_ERA',
  'MILITARY_ERA',
  'DEMOCRATIC_ERA',
  'CULTURAL_HERITAGE',
  'LAND_RECORDS',
  'JUDICIAL',
  'MILITARY_RECORDS',
  'DIPLOMATIC',
  'PHOTOGRAPHS',
  'ORAL_HISTORY',
];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaType, setMediaType] = useState<MediaType | ''>('');
  const [category, setCategory] = useState<CollectionCategory | ''>('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', searchQuery, mediaType, category, page],
    queryFn: () =>
      searchItems({
        q: searchQuery,
        mediaType: mediaType || undefined,
        category: category || undefined,
        page,
        limit: 20,
      }),
    enabled: searchQuery.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
    setPage(1);
  };

  const items = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 text-center mb-6">
          Search the Archives
        </h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents, images, audio, and videos..."
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800"
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {pagination && (
            <p className="text-sm text-gray-500">
              {pagination.total} results found
            </p>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
              <div className="flex flex-wrap gap-2">
                {MEDIA_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setMediaType(type.value);
                        if (searchQuery) setPage(1);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        mediaType === type.value
                          ? 'bg-green-700 text-white'
                          : 'bg-white border text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as CollectionCategory | '');
                  if (searchQuery) setPage(1);
                }}
                className="w-full max-w-xs px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategory(cat)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {!searchQuery ? (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Enter a search term to find archive items</p>
          <p className="text-sm text-gray-400 mt-2">
            Search across documents, photographs, audio recordings, and videos
          </p>
        </div>
      ) : isLoading || isFetching ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
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
        <div className="text-center py-16">
          <p className="text-gray-500">No results found for "{searchQuery}"</p>
          <p className="text-sm text-gray-400 mt-2">
            Try different keywords or adjust your filters
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

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
        </>
      )}
    </div>
  );
}
