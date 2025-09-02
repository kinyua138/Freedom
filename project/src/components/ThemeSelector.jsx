import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  PaintBrushIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const ThemeSelector = ({ className = '' }) => {
  const { 
    currentTheme, 
    themes, 
    themeData, 
    changeTheme, 
    toggleTheme, 
    systemPreference,
    isDark 
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);

  const themeIcons = {
    light: SunIcon,
    dark: MoonIcon,
    ocean: '🌊',
    sunset: '🌅'
  };

  const themeDescriptions = {
    light: 'Clean and bright interface',
    dark: 'Easy on the eyes in low light',
    ocean: 'Cool blues and teals',
    sunset: 'Warm oranges and reds'
  };

  const handleThemeSelect = (themeName) => {
    changeTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Quick Toggle Button */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 group"
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? (
            <SunIcon className="w-5 h-5 text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <MoonIcon className="w-5 h-5 text-slate-600 group-hover:rotate-12 transition-transform duration-300" />
          )}
        </button>

        {/* Theme Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 group"
            title="Choose theme"
          >
            <PaintBrushIcon className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsOpen(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Choose Theme
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Customize your visual experience
                  </p>
                </div>

                <div className="p-2 max-h-96 overflow-y-auto">
                  {/* System Preference Option */}
                  <div className="mb-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <ComputerDesktopIcon className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          System Preference
                        </div>
                        <div className="text-xs text-gray-600 dark:text-slate-400">
                          Currently: {systemPreference}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Theme Options */}
                  <div className="space-y-1">
                    {themes.map((themeName) => {
                      const Icon = themeIcons[themeName];
                      const isSelected = currentTheme === themeName;
                      
                      return (
                        <button
                          key={themeName}
                          onClick={() => handleThemeSelect(themeName)}
                          className={`w-full p-3 rounded-lg text-left transition-all duration-200 group ${
                            isSelected 
                              ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700' 
                              : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {typeof Icon === 'string' ? (
                                <span className="text-xl">{Icon}</span>
                              ) : (
                                <Icon className={`w-5 h-5 ${
                                  themeName === 'light' ? 'text-yellow-500' :
                                  themeName === 'dark' ? 'text-slate-400' :
                                  themeName === 'ocean' ? 'text-cyan-500' :
                                  'text-orange-500'
                                }`} />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                  {themeName}
                                </span>
                                {isSelected && (
                                  <CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                )}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
                                {themeDescriptions[themeName]}
                              </p>
                            </div>

                            {/* Theme Preview */}
                            <div className="flex-shrink-0">
                              <div className="flex space-x-1">
                                <div 
                                  className="w-3 h-3 rounded-full border border-gray-300 dark:border-slate-600"
                                  style={{ 
                                    backgroundColor: themeName === 'light' ? '#3b82f6' :
                                                   themeName === 'dark' ? '#60a5fa' :
                                                   themeName === 'ocean' ? '#0ea5e9' :
                                                   '#f97316'
                                  }}
                                />
                                <div 
                                  className="w-3 h-3 rounded-full border border-gray-300 dark:border-slate-600"
                                  style={{ 
                                    backgroundColor: themeName === 'light' ? '#6366f1' :
                                                   themeName === 'dark' ? '#818cf8' :
                                                   themeName === 'ocean' ? '#06b6d4' :
                                                   '#ef4444'
                                  }}
                                />
                                <div 
                                  className="w-3 h-3 rounded-full border border-gray-300 dark:border-slate-600"
                                  style={{ 
                                    backgroundColor: themeName === 'light' ? '#8b5cf6' :
                                                   themeName === 'dark' ? '#a78bfa' :
                                                   themeName === 'ocean' ? '#14b8a6' :
                                                   '#ec4899'
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
                  <p className="text-xs text-gray-600 dark:text-slate-400 text-center">
                    Theme preference is saved automatically
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
