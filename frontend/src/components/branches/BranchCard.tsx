import { Link } from 'react-router-dom';
import { MapPin, FolderOpen, FileText } from 'lucide-react';
import type { Branch } from '@/types';

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
        {branch.imageUrl ? (
          <img
            src={branch.imageUrl}
            alt={branch.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-600 to-green-800">
            <span className="text-4xl font-display font-bold text-white/80">
              {branch.name.charAt(0)}
            </span>
          </div>
        )}
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
