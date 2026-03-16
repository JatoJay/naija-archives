import { useState } from 'react';
import { useBranches } from '@/hooks/useBranches';
import { BranchList } from '@/components/branches/BranchList';

const REGIONS = [
  'All Regions',
  'North-Central',
  'North-East',
  'North-West',
  'South-East',
  'South-South',
  'South-West',
];

export function BranchesPage() {
  const { branches, isLoading } = useBranches();
  const [selectedRegion, setSelectedRegion] = useState('All Regions');

  const filteredBranches = selectedRegion === 'All Regions'
    ? branches
    : branches.filter((b) => b.region === selectedRegion);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Regional Branches</h1>
        <p className="text-gray-600 mt-2">
          The National Archives of Nigeria maintains branches across all geopolitical zones,
          preserving regional and national documentary heritage.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedRegion === region
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <BranchList branches={filteredBranches} isLoading={isLoading} />
    </div>
  );
}
