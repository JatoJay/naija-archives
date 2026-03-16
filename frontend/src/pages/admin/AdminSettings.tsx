import { useState } from 'react';
import { Save, Database, Cloud, Shield, Bell } from 'lucide-react';

export function AdminSettings() {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Database Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Database Provider
            </label>
            <select className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Supabase (PostgreSQL)</option>
              <option>SQLite (Local)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Connection Status
            </label>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Cloud className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Storage Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Storage Provider
            </label>
            <select className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Supabase Storage</option>
              <option>Google Cloud Storage</option>
              <option>Local Storage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Upload Size
            </label>
            <select className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>50 MB</option>
              <option>100 MB</option>
              <option>250 MB</option>
              <option>500 MB</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">Require 2FA for admin users</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Session Timeout</p>
              <p className="text-xs text-gray-500">Automatically log out inactive users</p>
            </div>
            <select className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>4 hours</option>
              <option>24 hours</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive email for new uploads</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Processing Alerts</p>
              <p className="text-xs text-gray-500">Get notified when indexing completes</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
