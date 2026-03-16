import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, MapPin, Search } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { formatNumber } from '@/utils/formatters';

export function AdminBranches() {
  const { branches, isLoading } = useBranches();
  const [search, setSearch] = useState('');

  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.region.toLowerCase().includes(search.toLowerCase()) ||
      b.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search branches..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <Link
          to="/admin/branches/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Add Branch
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collections
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20 ml-auto" /></td>
                </tr>
              ))
            ) : filteredBranches.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No branches found
                </td>
              </tr>
            ) : (
              filteredBranches.map((branch) => (
                <tr key={branch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-700">
                          {branch.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{branch.name}</p>
                        <p className="text-xs text-gray-500">Est. {branch.established}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {branch.region}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3.5 w-3.5" />
                      {branch.city}, {branch.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatNumber(branch.collectionCount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatNumber(branch.itemCount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/branches/${branch.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this branch?')) {
                            // TODO: Implement delete
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
