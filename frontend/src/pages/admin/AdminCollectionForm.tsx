import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useBranches } from '@/hooks/useBranches';
import { getCollectionById } from '@/services/collections';
import api from '@/services/api';
import type { CollectionCategory } from '@/types';
import { formatCategory } from '@/utils/formatters';

const CATEGORIES: CollectionCategory[] = [
  'COLONIAL_ERA',
  'INDEPENDENCE_ERA',
  'MILITARY_ERA',
  'DEMOCRATIC_ERA',
  'CULTURAL_HERITAGE',
  'LAND_RECORDS',
  'JUDICIAL',
  'MILITARY_RECORDS',
  'DIPLOMATIC',
  'PHOTOGRAPHS',
  'ORAL_HISTORY',
];

interface CollectionFormData {
  branchId: string;
  title: string;
  description: string;
  category: CollectionCategory | '';
  startYear: string;
  endYear: string;
  thumbnailUrl: string;
}

export function AdminCollectionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { branches } = useBranches();

  const { data: collection, isLoading: loadingCollection } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => getCollectionById(id!),
    enabled: isEditing,
  });

  const [formData, setFormData] = useState<CollectionFormData>({
    branchId: '',
    title: '',
    description: '',
    category: '',
    startYear: '',
    endYear: '',
    thumbnailUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (collection && isEditing) {
      setFormData({
        branchId: collection.branchId,
        title: collection.title,
        description: collection.description,
        category: collection.category,
        startYear: collection.startYear?.toString() || '',
        endYear: collection.endYear?.toString() || '',
        thumbnailUrl: collection.thumbnailUrl || '',
      });
    }
  }, [collection, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        startYear: formData.startYear ? parseInt(formData.startYear, 10) : null,
        endYear: formData.endYear ? parseInt(formData.endYear, 10) : null,
      };

      if (isEditing) {
        await api.patch(`/collections/${id}`, payload);
      } else {
        await api.post('/collections', payload);
      }

      navigate('/admin/collections');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && loadingCollection) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate('/admin/collections')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Collections
      </button>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {isEditing ? 'Edit Collection' : 'Add New Collection'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch *
            </label>
            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Colonial Administrative Records"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {formatCategory(cat)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Describe the collection and its contents..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Year
              </label>
              <input
                type="number"
                name="startYear"
                value={formData.startYear}
                onChange={handleChange}
                min="1800"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 1900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Year
              </label>
              <input
                type="number"
                name="endYear"
                value={formData.endYear}
                onChange={handleChange}
                min="1800"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 1960"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/collections')}
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
              {isEditing ? 'Save Changes' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
