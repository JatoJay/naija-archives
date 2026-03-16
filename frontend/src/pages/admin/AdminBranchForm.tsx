import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import api from '@/services/api';

const REGIONS = [
  'North-Central',
  'North-East',
  'North-West',
  'South-East',
  'South-South',
  'South-West',
];

interface BranchFormData {
  name: string;
  slug: string;
  region: string;
  city: string;
  state: string;
  established: string;
  description: string;
  imageUrl: string;
}

export function AdminBranchForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { branch, isLoading: loadingBranch } = useBranches(id);

  const [formData, setFormData] = useState<BranchFormData>({
    name: '',
    slug: '',
    region: '',
    city: '',
    state: '',
    established: '',
    description: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (branch && isEditing) {
      setFormData({
        name: branch.name,
        slug: branch.slug,
        region: branch.region,
        city: branch.city,
        state: branch.state,
        established: branch.established.toString(),
        description: branch.description,
        imageUrl: branch.imageUrl || '',
      });
    }
  }, [branch, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && !isEditing
        ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
        : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        established: parseInt(formData.established, 10),
      };

      if (isEditing) {
        await api.patch(`/branches/${id}`, payload);
      } else {
        await api.post('/branches', payload);
      }

      navigate('/admin/branches');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && loadingBranch) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate('/admin/branches')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Branches
      </button>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {isEditing ? 'Edit Branch' : 'Add New Branch'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., National Archives Ibadan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., ibadan"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region *
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select region</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Established *
              </label>
              <input
                type="number"
                name="established"
                value={formData.established}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 1954"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Ibadan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Oyo State"
              />
            </div>
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
              placeholder="Describe the branch and its historical significance..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/branches')}
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
              {isEditing ? 'Save Changes' : 'Create Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
