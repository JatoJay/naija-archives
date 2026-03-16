import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, FolderOpen, FileText, Image, Music, Video, ArrowLeft } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { useCollections } from '@/hooks/useCollections';
import { CollectionList } from '@/components/collections/CollectionList';
import { formatNumber } from '@/utils/formatters';

export function BranchDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { branch, isLoading: branchLoading } = useBranches(slug);
  const { collections, isLoading: collectionsLoading } = useCollections({ branch: slug });

  if (branchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-lg" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Branch not found</h1>
        <p className="text-gray-600 mt-2">The requested branch does not exist.</p>
        <Link to="/branches" className="mt-4 inline-flex items-center gap-2 text-green-700 font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to branches
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-green-700 to-green-900">
        {branch.imageUrl && (
          <img
            src={branch.imageUrl}
            alt={branch.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative">
          <Link
            to="/branches"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            All Branches
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            {branch.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-white/80">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{branch.city}, {branch.state}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Est. {branch.established}</span>
            </div>
            <span className="px-2 py-0.5 bg-white/20 rounded text-sm">
              {branch.region}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="text-gray-600 leading-relaxed">{branch.description}</p>

            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                Collections ({collections.length})
              </h2>
              <CollectionList collections={collections} isLoading={collectionsLoading} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FolderOpen className="h-4 w-4" />
                    <span>Collections</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(branch.collectionCount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>Total Items</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(branch.itemCount)}
                  </span>
                </div>
                {branch.itemsByType && (
                  <>
                    <hr />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-600">
                        <FileText className="h-4 w-4" />
                        <span>Documents</span>
                      </div>
                      <span className="font-medium text-gray-700">
                        {formatNumber(branch.itemsByType.DOCUMENT || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-600">
                        <Image className="h-4 w-4" />
                        <span>Images</span>
                      </div>
                      <span className="font-medium text-gray-700">
                        {formatNumber(branch.itemsByType.IMAGE || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-orange-600">
                        <Music className="h-4 w-4" />
                        <span>Audio</span>
                      </div>
                      <span className="font-medium text-gray-700">
                        {formatNumber(branch.itemsByType.AUDIO || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-red-600">
                        <Video className="h-4 w-4" />
                        <span>Videos</span>
                      </div>
                      <span className="font-medium text-gray-700">
                        {formatNumber(branch.itemsByType.VIDEO || 0)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
