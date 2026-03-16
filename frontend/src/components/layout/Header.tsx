import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Upload, MessageSquare, User, LogOut, Settings } from 'lucide-react';
import { useUIStore } from '@/store';
import { isAuthenticated, logout } from '@/services/auth';

export function Header() {
  const { toggleSidebar, toggleChat, toggleUploadModal, user } = useUIStore();
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-green-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">NA</span>
            </div>
            <span className="hidden sm:block font-display text-lg font-semibold text-gray-900">
              Nigeria Archives
            </span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/branches" className="text-sm font-medium text-gray-700 hover:text-green-700">
            Branches
          </Link>
          <Link to="/collections" className="text-sm font-medium text-gray-700 hover:text-green-700">
            Collections
          </Link>
          <Link to="/search" className="text-sm font-medium text-gray-700 hover:text-green-700">
            Search
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            className="p-2 hover:bg-gray-100 rounded-md"
            aria-label="Search archives"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </Link>

          <button
            onClick={toggleChat}
            className="p-2 hover:bg-gray-100 rounded-md"
            aria-label="Open AI assistant"
          >
            <MessageSquare className="h-5 w-5 text-gray-600" />
          </button>

          {isAuthenticated() && user?.role === 'ARCHIVIST' && (
            <>
              <button
                onClick={toggleUploadModal}
                className="p-2 hover:bg-gray-100 rounded-md"
                aria-label="Upload files"
              >
                <Upload className="h-5 w-5 text-gray-600" />
              </button>
              <Link
                to="/admin"
                className="p-2 hover:bg-gray-100 rounded-md"
                aria-label="Admin panel"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </Link>
            </>
          )}

          {isAuthenticated() && isAdminArea && (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="p-2 hover:bg-gray-100 rounded-md"
                aria-label="Profile"
              >
                <User className="h-5 w-5 text-gray-600" />
              </Link>
              <button
                onClick={logout}
                className="p-2 hover:bg-gray-100 rounded-md"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
