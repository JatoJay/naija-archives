import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, FolderOpen } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { formatNumber, formatCategory } from '@/utils/formatters';

export function AdminCollections() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { collections, pagination, isLoading } = useCollections({ search, page, limit: 20 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search collections..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <Link
          to="/admin/collections/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Add Collection
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collection
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
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
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20 ml-auto" /></td>
                </tr>
              ))
            ) : collections.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  No collections found
                </td>
              </tr>
            ) : (
              collections.map((collection) => (
                <tr key={collection.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{collection.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">
                          {collection.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {collection.branch.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      {formatCategory(collection.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatNumber(collection.itemCount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/collections/${collection.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this collection?')) {
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

        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, pagination.total)} of{' '}
              {pagination.total} collections
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
