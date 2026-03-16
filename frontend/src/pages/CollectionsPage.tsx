import { useState } from 'react';
import { Search } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { CollectionList } from '@/components/collections/CollectionList';
import type { CollectionCategory } from '@/types';
import { formatCategory } from '@/utils/formatters';

const CATEGORIES: (CollectionCategory | 'ALL')[] = [
  'ALL',
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

export function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CollectionCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { collections, pagination, isLoading } = useCollections({
    category: selectedCategory === 'ALL' ? undefined : selectedCategory,
    search: searchQuery || undefined,
    page,
    limit: 12,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Collections</h1>
        <p className="text-gray-600 mt-2">
          Browse curated collections of historical documents, photographs, and recordings.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'ALL' ? 'All Categories' : formatCategory(category)}
            </button>
          ))}
        </div>
      </div>

      <CollectionList collections={collections} isLoading={isLoading} />

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
  );
}
