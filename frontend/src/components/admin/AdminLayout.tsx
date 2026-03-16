import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FolderOpen,
  Users,
  Upload,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { useUIStore } from '@/store';
import { isAuthenticated } from '@/services/auth';

const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/branches', icon: Building2, label: 'Branches' },
  { to: '/admin/collections', icon: FolderOpen, label: 'Collections' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/uploads', icon: Upload, label: 'Uploads' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout() {
  const location = useLocation();
  const { user } = useUIStore();

  if (!isAuthenticated() || user?.role !== 'ARCHIVIST') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-gray-900 min-h-screen fixed left-0 top-0">
          <div className="p-4 border-b border-gray-800">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
                <span className="font-bold text-sm">NA</span>
              </div>
              <span className="font-display font-semibold">Admin Panel</span>
            </Link>
          </div>

          <nav className="p-4 space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Site
            </Link>
          </div>
        </aside>

        <main className="flex-1 ml-64">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">
                {adminNavItems.find((item) =>
                  item.exact
                    ? location.pathname === item.to
                    : location.pathname.startsWith(item.to)
                )?.label || 'Admin'}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-green-700">
                    {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
