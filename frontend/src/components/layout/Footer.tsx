import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-green-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">NA</span>
              </div>
              <span className="font-display text-lg font-semibold text-gray-900">
                Nigeria National Digital Archives
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              Preserving Nigeria's memory through digitization and accessibility.
              Our mission is to protect, preserve, and provide access to the nation's
              documentary heritage for current and future generations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/branches" className="text-sm text-gray-600 hover:text-green-700">
                  Regional Branches
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-sm text-gray-600 hover:text-green-700">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-gray-600 hover:text-green-700">
                  Search Archives
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-green-700">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-gray-600 hover:text-green-700">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="text-sm text-gray-600 hover:text-green-700">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-green-700">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-green-700">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} National Archives of Nigeria. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Powered by Google Cloud
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
