import { Link } from 'react-router-dom';
import { Building2, FolderOpen, FileText, Users, TrendingUp, Clock } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { formatNumber } from '@/utils/formatters';

export function AdminDashboard() {
  const { stats, isLoading } = useBranches();

  const statCards = [
    {
      label: 'Total Branches',
      value: stats?.branches || 0,
      icon: Building2,
      color: 'bg-blue-500',
      link: '/admin/branches',
    },
    {
      label: 'Collections',
      value: stats?.collections || 0,
      icon: FolderOpen,
      color: 'bg-green-500',
      link: '/admin/collections',
    },
    {
      label: 'Archive Items',
      value: stats?.totalItems || 0,
      icon: FileText,
      color: 'bg-purple-500',
      link: '/admin/collections',
    },
    {
      label: 'Documents',
      value: stats?.documents || 0,
      icon: FileText,
      color: 'bg-amber-500',
      link: '/admin/collections',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {isLoading ? '...' : formatNumber(stat.value)}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/branches/new"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Add Branch</span>
            </Link>
            <Link
              to="/admin/collections/new"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderOpen className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Add Collection</span>
            </Link>
            <Link
              to="/admin/uploads"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Upload Files</span>
            </Link>
            <Link
              to="/admin/users/new"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Add User</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Media Breakdown</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Documents', value: stats?.documents || 0, color: 'bg-blue-500' },
              { label: 'Images', value: stats?.images || 0, color: 'bg-purple-500' },
              { label: 'Audio', value: stats?.audioRecordings || 0, color: 'bg-orange-500' },
              { label: 'Video', value: stats?.videoRecords || 0, color: 'bg-red-500' },
            ].map((item) => {
              const total = stats?.totalItems || 1;
              const percentage = Math.round((item.value / total) * 100) || 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-gray-900">
                      {formatNumber(item.value)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            Recent Activity
          </h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>Activity tracking will be available soon</p>
        </div>
      </div>
    </div>
  );
}
