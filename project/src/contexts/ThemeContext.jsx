import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  light: {
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    gradients: {
      primary: 'from-blue-500 to-purple-600',
      secondary: 'from-purple-500 to-pink-500',
      accent: 'from-indigo-500 to-blue-500',
      background: 'from-slate-100 via-blue-50 to-purple-50'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#818cf8',
      accent: '#a78bfa',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    },
    gradients: {
      primary: 'from-blue-400 to-purple-500',
      secondary: 'from-purple-400 to-pink-400',
      accent: 'from-indigo-400 to-blue-400',
      background: 'from-slate-900 via-blue-900 to-purple-900'
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#14b8a6',
      background: '#f0f9ff',
      surface: '#e0f2fe',
      text: '#0c4a6e',
      textSecondary: '#0369a1',
      border: '#bae6fd',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0284c7'
    },
    gradients: {
      primary: 'from-sky-400 to-cyan-500',
      secondary: 'from-cyan-400 to-teal-500',
      accent: 'from-blue-400 to-cyan-400',
      background: 'from-sky-50 via-cyan-50 to-teal-50'
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      secondary: '#ef4444',
      accent: '#ec4899',
      background: '#fffbeb',
      surface: '#fef3c7',
      text: '#92400e',
      textSecondary: '#d97706',
      border: '#fed7aa',
      success: '#65a30d',
      warning: '#ca8a04',
      error: '#dc2626',
      info: '#2563eb'
    },
    gradients: {
      primary: 'from-orange-400 to-red-500',
      secondary: 'from-red-400 to-pink-500',
      accent: 'from-yellow-400 to-orange-500',
      background: 'from-amber-50 via-orange-50 to-red-50'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [systemPreference, setSystemPreference] = useState('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else {
      setCurrentTheme(systemPreference);
    }
  }, [systemPreference]);

  // Apply theme to document
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply theme class to body
    document.body.className = `theme-${currentTheme}`;
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.colors.primary);
    }
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('theme', themeName);
    }
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
  };

  const getThemeColors = (themeName = currentTheme) => {
    return themes[themeName]?.colors || themes.light.colors;
  };

  const getThemeGradients = (themeName = currentTheme) => {
    return themes[themeName]?.gradients || themes.light.gradients;
  };

  const value = {
    currentTheme,
    themes: Object.keys(themes),
    themeData: themes[currentTheme],
    systemPreference,
    changeTheme,
    toggleTheme,
    getThemeColors,
    getThemeGradients,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
