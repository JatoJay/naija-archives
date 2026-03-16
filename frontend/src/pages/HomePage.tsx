import { Link } from 'react-router-dom';
import { Search, Building2, FolderOpen, FileText, Image, Music, Video, ArrowRight } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { useCollections } from '@/hooks/useCollections';
import { BranchCard } from '@/components/branches/BranchCard';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { formatNumber } from '@/utils/formatters';

export function HomePage() {
  const { branches, stats, isLoading: branchesLoading } = useBranches();
  const { collections, isLoading: collectionsLoading } = useCollections({ limit: 4 });

  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect x='5' y='5' width='40' height='55' fill='none' stroke='white' stroke-width='2'/%3E%3Cline x1='10' y1='15' x2='40' y2='15' stroke='white' stroke-width='1'/%3E%3Cline x1='10' y1='25' x2='35' y2='25' stroke='white'/%3E%3Cline x1='10' y1='32' x2='40' y2='32' stroke='white'/%3E%3Cline x1='10' y1='39' x2='30' y2='39' stroke='white'/%3E%3Ccircle cx='25' cy='52' r='5' fill='none' stroke='white'/%3E%3Crect x='55' y='20' width='40' height='55' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='60' y='25' width='30' height='22' fill='none' stroke='white'/%3E%3Cline x1='60' y1='55' x2='90' y2='55' stroke='white'/%3E%3Cline x1='60' y1='62' x2='85' y2='62' stroke='white'/%3E%3Cline x1='60' y1='69' x2='88' y2='69' stroke='white'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
            opacity: 0.07
          }}
        />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Nigeria National Digital Archives
            </h1>
            <p className="mt-6 text-lg md:text-xl text-green-100 leading-relaxed">
              Preserving Nigeria's memory through digitization. Access historical documents,
              photographs, audio recordings, and videos from across the nation's regional archives.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-800 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                <Search className="h-5 w-5" />
                Search Archives
              </Link>
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {stats && (
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="text-center p-4">
                <div className="flex justify-center mb-2">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.branches)}</p>
                <p className="text-sm text-gray-500">Branches</p>
              </div>
              <div className="text-center p-4">
                <div className="flex justify-center mb-2">
                  <FolderOpen className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.collections)}</p>
                <p className="text-sm text-gray-500">Collections</p>
              </div>
              <div className="text-center p-4">
                <div className="flex justify-center mb-2">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalItems)}</p>
                <p className="text-sm text-gray-500">Total Items</p>
              </div>
              <div className="text-center p-4 border-l hidden lg:block">
                <div className="flex justify-center mb-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.documents)}</p>
                <p className="text-sm text-gray-500">Documents</p>
              </div>
              <div className="text-center p-4 hidden lg:block">
                <div className="flex justify-center mb-2">
                  <Image className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.images)}</p>
                <p className="text-sm text-gray-500">Images</p>
              </div>
              <div className="text-center p-4 hidden lg:block">
                <div className="flex justify-center mb-2">
                  <Music className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.audioRecordings)}</p>
                <p className="text-sm text-gray-500">Audio</p>
              </div>
              <div className="text-center p-4 hidden lg:block">
                <div className="flex justify-center mb-2">
                  <Video className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.videoRecords)}</p>
                <p className="text-sm text-gray-500">Videos</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
              Regional Branches
            </h2>
            <p className="text-gray-600 mt-1">
              Explore archives from across Nigeria's geopolitical zones
            </p>
          </div>
          <Link
            to="/branches"
            className="hidden md:inline-flex items-center gap-2 text-green-700 font-medium hover:text-green-800"
          >
            View all branches
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {branchesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.slice(0, 3).map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        )}
        <div className="mt-6 text-center md:hidden">
          <Link
            to="/branches"
            className="inline-flex items-center gap-2 text-green-700 font-medium hover:text-green-800"
          >
            View all branches
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
                Featured Collections
              </h2>
              <p className="text-gray-600 mt-1">
                Discover curated collections of historical significance
              </p>
            </div>
            <Link
              to="/collections"
              className="hidden md:inline-flex items-center gap-2 text-green-700 font-medium hover:text-green-800"
            >
              Browse all collections
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {collectionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}
          <div className="mt-6 text-center md:hidden">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-green-700 font-medium hover:text-green-800"
            >
              Browse all collections
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Ask Our AI Archive Assistant
          </h2>
          <p className="mt-4 text-green-100 max-w-2xl mx-auto">
            Have questions about Nigerian history? Our AI-powered assistant can help you
            find relevant documents, understand historical events, and explore the archives.
          </p>
          <button
            onClick={() => {
              const event = new CustomEvent('openChat');
              window.dispatchEvent(event);
            }}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-green-800 rounded-lg font-medium hover:bg-green-50 transition-colors"
          >
            Start a Conversation
          </button>
        </div>
      </section>
    </div>
  );
}
