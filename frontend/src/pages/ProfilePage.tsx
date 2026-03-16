import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Loader2, LogOut, Key } from 'lucide-react';
import { useUIStore } from '@/store';
import { logout, getProfile } from '@/services/auth';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { formatDate } from '@/utils/formatters';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useUIStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const displayUser = profile || user;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await api.patch('/auth/profile', { name });
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setIsSaving(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (error) {
      setPasswordError('Failed to change password. Check your current password.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!displayUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {(displayUser.name || displayUser.email).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-white">
              <h2 className="text-xl font-semibold">{displayUser.name || 'Unnamed User'}</h2>
              <p className="text-green-100">{displayUser.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Account Information</h3>

            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{displayUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">
                      {displayUser.name || 'Not set'}
                    </p>
                  )}
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm font-medium text-gray-900">
                    {displayUser.role === 'ARCHIVIST' ? 'Archivist (Admin)' : 'Public User'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(displayUser.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Security</h3>

            {showPasswordForm ? (
              <form onSubmit={handleChangePassword} className="space-y-3">
                {passwordError && (
                  <p className="text-sm text-red-600">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-sm text-green-600">{passwordSuccess}</p>
                )}
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="px-4 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Change Password
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <Key className="h-4 w-4" />
                Change Password
              </button>
            )}
          </div>

          <hr />

          <div className="flex justify-between items-center">
            {displayUser.role === 'ARCHIVIST' && (
              <a
                href="/admin"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Go to Admin Panel
              </a>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-md text-sm hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
