import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import type { User } from '@/types';

interface UserFormData {
  email: string;
  name: string;
  password: string;
  role: 'PUBLIC' | 'ARCHIVIST';
}

export function AdminUserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await api.get<User>(`/auth/users/${id}`);
      return response.data;
    },
    enabled: isEditing,
  });

  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    password: '',
    role: 'PUBLIC',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        email: user.email,
        name: user.name || '',
        password: '',
        role: user.role,
      });
    }
  }, [user, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        email: formData.email,
        name: formData.name || null,
        role: formData.role,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditing) {
        await api.patch(`/auth/users/${id}`, payload);
      } else {
        if (!formData.password) {
          setError('Password is required for new users');
          setIsSubmitting(false);
          return;
        }
        await api.post('/auth/users', payload);
      }

      navigate('/admin/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && loadingUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </button>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {isEditing ? 'Edit User' : 'Add New User'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {isEditing ? '(leave blank to keep current)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing}
              minLength={8}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="PUBLIC">Public User</option>
              <option value="ARCHIVIST">Archivist (Admin)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Archivists can upload files and manage content
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
