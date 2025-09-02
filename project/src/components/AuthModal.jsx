import React, { useState } from 'react';
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, UserPlusIcon, LogInIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register, resetPassword } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    website: '',
    location: ''
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Validate form
  const validateForm = () => {
    if (mode === 'register') {
      if (!formData.name.trim()) {
        setError('Name is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }

    if (mode !== 'forgot' && !formData.password.trim()) {
      setError('Password is required');
      return false;
    }

    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;

      switch (mode) {
        case 'login':
          result = await login(formData.email, formData.password);
          break;
        case 'register':
          result = await register(formData);
          break;
        case 'forgot':
          result = await resetPassword(formData.email);
          break;
      }

      if (result.success) {
        if (mode === 'forgot') {
          setSuccess(result.message);
          setTimeout(() => setMode('login'), 2000);
        } else {
          onClose();
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Reset form when mode changes
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      website: '',
      location: ''
    });
    setError('');
    setSuccess('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                {mode === 'register' ? (
                  <UserPlusIcon className="w-6 h-6 text-white" />
                ) : (
                  <LogInIcon className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {mode === 'login' && 'Welcome Back'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot' && 'Reset Password'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {mode === 'login' && 'Sign in to your account'}
                  {mode === 'register' && 'Join our community'}
                  {mode === 'forgot' && 'Enter your email to reset password'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <span className="text-xl text-gray-500 dark:text-slate-400">×</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* Name Field (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          {mode !== 'forgot' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password Field (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Optional Fields (Register only) */}
          {mode === 'register' && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Optional Information
              </h3>
              
              <div>
                <label className="block text-sm text-gray-600 dark:text-slate-400 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your company"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-slate-400 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-slate-400 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' && <LogInIcon className="w-4 h-4" />}
                {mode === 'register' && <UserPlusIcon className="w-4 h-4" />}
                {mode === 'forgot' && <MailIcon className="w-4 h-4" />}
                <span>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </span>
              </>
            )}
          </button>

          {/* Mode Switchers */}
          <div className="text-center space-y-2">
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => handleModeChange('forgot')}
                  className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
                >
                  Forgot your password?
                </button>
                <div className="text-sm text-gray-600 dark:text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('register')}
                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <div className="text-sm text-gray-600 dark:text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="text-sm text-gray-600 dark:text-slate-400">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
