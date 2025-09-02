import React, { useState } from 'react';
import { UserIcon, MailIcon, BuildingIcon, GlobeIcon, MapPinIcon, EditIcon, SaveIcon, XIcon, CameraIcon, SettingsIcon, BarChart3Icon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, updateProfile, updatePreferences, changePassword, deleteAccount, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.profile?.bio || '',
    company: user?.profile?.company || '',
    website: user?.profile?.website || '',
    location: user?.profile?.location || '',
    skills: user?.profile?.skills || []
  });

  const [preferences, setPreferences] = useState({
    theme: user?.preferences?.theme || 'light',
    notifications: user?.preferences?.notifications || true,
    autoSave: user?.preferences?.autoSave || true,
    language: user?.preferences?.language || 'en'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [newSkill, setNewSkill] = useState('');

  // Handle profile update
  const handleProfileUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile({
        name: profileData.name,
        profile: {
          bio: profileData.bio,
          company: profileData.company,
          website: profileData.website,
          location: profileData.location,
          skills: profileData.skills
        }
      });

      if (result.success) {
        setSuccess('Profile updated successfully');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle preferences update
  const handlePreferencesUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updatePreferences(preferences);

      if (result.success) {
        setSuccess('Preferences updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);

      if (result.success) {
        setSuccess('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const password = prompt('Enter your password to confirm account deletion:');
    if (!password) return;

    setLoading(true);
    setError('');

    try {
      const result = await deleteAccount(password);

      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  // Add skill
  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Generate avatar
  const renderAvatar = () => {
    if (user?.avatar?.type === 'initials') {
      return (
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
          style={{ backgroundColor: user.avatar.backgroundColor }}
        >
          {user.avatar.initials}
        </div>
      );
    }

    return (
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
        <UserIcon className="w-10 h-10 text-white" />
      </div>
    );
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            {renderAvatar()}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">{user.email}</p>
              <p className="text-xs text-gray-500 dark:text-slate-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <XIcon className="w-6 h-6 text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          {[
            { id: 'profile', label: 'Profile', icon: UserIcon },
            { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
            { id: 'security', label: 'Security', icon: MailIcon },
            { id: 'stats', label: 'Statistics', icon: BarChart3Icon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h3>
                <button
                  onClick={() => editing ? handleProfileUpdate() : setEditing(true)}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {editing ? <SaveIcon className="w-4 h-4" /> : <EditIcon className="w-4 h-4" />}
                  <span>{editing ? 'Save' : 'Edit'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!editing}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:text-gray-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                    >
                      {skill}
                      {editing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {editing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                      placeholder="Add a skill..."
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h3>
                <button
                  onClick={handlePreferencesUpdate}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <SaveIcon className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                        Email Notifications
                      </label>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        Receive email notifications about your account
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                        Auto Save
                      </label>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        Automatically save your work
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.autoSave}
                      onChange={(e) => setPreferences(prev => ({ ...prev, autoSave: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h3>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Change Password</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Change Password
                </button>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Danger Zone</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Statistics</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {user.stats?.projectsCreated || 0}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Projects Created</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {user.stats?.componentsUsed || 0}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Components Used</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round((user.stats?.timeSpent || 0) / 60)}h
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Time Spent</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">Days Active</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Last Login
                  </label>
                  <div className="text-gray-900 dark:text-white">
                    {new Date(user.lastLogin).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Account Created
                  </label>
                  <div className="text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
