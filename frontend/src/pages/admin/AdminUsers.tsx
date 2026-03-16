import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Users, Shield, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { formatDate } from '@/utils/formatters';
import type { User as UserType } from '@/types';

async function getUsers(): Promise<UserType[]> {
  const response = await api.get<UserType[]>('/auth/users');
  return response.data;
}

export function AdminUsers() {
  const [search, setSearch] = useState('');
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getUsers,
  });

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase())
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
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <Link
          to="/admin/users/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
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
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20 ml-auto" /></td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-700">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name || 'Unnamed'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'ARCHIVIST'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.role === 'ARCHIVIST' ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {user.role === 'ARCHIVIST' ? 'Archivist' : 'Public'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/users/${user.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this user?')) {
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
