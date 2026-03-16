import { Link, useLocation } from 'react-router-dom';
import { X, Home, Building2, FolderOpen, Search, Upload, Settings } from 'lucide-react';
import { useUIStore } from '@/store';
import { isAuthenticated } from '@/services/auth';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/branches', icon: Building2, label: 'Branches' },
  { to: '/collections', icon: FolderOpen, label: 'Collections' },
  { to: '/search', icon: Search, label: 'Search' },
];

const archivistItems = [
  { to: '/upload', icon: Upload, label: 'Upload' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { isSidebarOpen, setSidebarOpen, user } = useUIStore();

  if (!isSidebarOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg lg:hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-display text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}

          {isAuthenticated() && user?.role === 'ARCHIVIST' && (
            <>
              <div className="pt-4 pb-2">
                <span className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Archivist
                </span>
              </div>
              {archivistItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
