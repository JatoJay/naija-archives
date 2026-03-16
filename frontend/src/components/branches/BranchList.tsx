import { BranchCard } from './BranchCard';
import type { Branch } from '@/types';

interface BranchListProps {
  branches: Branch[];
  isLoading?: boolean;
}

export function BranchList({ branches, isLoading }: BranchListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!branches.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No branches found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {branches.map((branch) => (
        <BranchCard key={branch.id} branch={branch} />
      ))}
    </div>
  );
}
