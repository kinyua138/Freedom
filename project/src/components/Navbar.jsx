import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bars3Icon, XMarkIcon, SparklesIcon, ChartBarIcon, CubeIcon, UserIcon } from '@heroicons/react/24/outline'
import ThemeSelector from './ThemeSelector'
import LanguageSelector from './LanguageSelector'
import AuthModal from './AuthModal'
import UserProfile from './UserProfile'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useI18n } from '../contexts/I18nContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const location = useLocation()
  const { currentTheme, isDark } = useTheme()
  const { user, logout } = useAuth()
  const { t } = useI18n()

  const navigation = [
    { name: t('nav.home'), href: '/', icon: null },
    { name: t('nav.uiBuilder'), href: '/ui-builder', icon: CubeIcon },
    { name: t('nav.analytics'), href: '/analytics', icon: ChartBarIcon },
    { name: t('nav.about'), href: '/about', icon: null },
    { name: t('nav.contact'), href: '/contact', icon: null }
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const renderUserAvatar = () => {
    if (user?.avatar?.type === 'initials') {
      return (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ backgroundColor: user.avatar.backgroundColor }}
        >
          {user.avatar.initials}
        </div>
      )
    }

    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
        <UserIcon className="w-5 h-5 text-white" />
      </div>
    )
  }

  return (
    <>
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient dark:text-white">ModernApp</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-sm'
                        : 'text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Theme Selector */}
              <ThemeSelector />
              
              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserProfile(true)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    title={user.name}
                  >
                    {renderUserAvatar()}
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      {user.name}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{t('auth.login')}</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSelector />
              <ThemeSelector />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                {isOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden animate-fade-in">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg mt-2 shadow-lg border border-gray-200/50 dark:border-slate-700/50">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                          : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile User Section */}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-3">
                  {user ? (
                    <>
                      <button
                        onClick={() => {
                          setShowUserProfile(true)
                          setIsOpen(false)
                        }}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50 w-full transition-all duration-200"
                      >
                        {renderUserAvatar()}
                        <span>{user.name}</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all duration-200"
                      >
                        <span>{t('auth.logout')}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAuthModal(true)
                        setIsOpen(false)
                      }}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium bg-blue-600 hover:bg-blue-700 text-white w-full transition-all duration-200"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>{t('auth.login')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* User Profile Modal */}
      <UserProfile 
        isOpen={showUserProfile} 
        onClose={() => setShowUserProfile(false)} 
      />
    </>
  )
}

export default Navbar
