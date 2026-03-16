import { Link } from 'react-router-dom';
import { MapPin, FolderOpen, FileText } from 'lucide-react';
import type { Branch } from '@/types';

const branchImages: Record<string, string> = {
  ibadan: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
  enugu: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop',
  kaduna: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop',
};

function getBranchImage(slug: string): string {
  return branchImages[slug] || `https://picsum.photos/seed/${slug}/600/400`;
}

interface BranchCardProps {
  branch: Branch;
}

export function BranchCard({ branch }: BranchCardProps) {
  return (
    <Link
      to={`/branches/${branch.slug}`}
      className="group block bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={branch.imageUrl || getBranchImage(branch.slug)}
          alt={branch.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getBranchImage(branch.slug);
          }}
        />
        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded text-xs font-medium text-gray-700">
          {branch.region}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
          {branch.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <MapPin className="h-3.5 w-3.5" />
          <span>{branch.city}, {branch.state}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{branch.description}</p>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <FolderOpen className="h-3.5 w-3.5" />
            <span>{branch.collectionCount} collections</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span>{branch.itemCount.toLocaleString()} items</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
