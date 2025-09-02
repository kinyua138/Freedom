import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    const savedToken = localStorage.getItem('auth_token');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }
    }
    
    setLoading(false);
  }, []);

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Register new user
  const register = async (userData) => {
    try {
      const response = await fetch('/.netlify/functions/auth-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        localStorage.setItem('auth_token', data.token);
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await fetch('/.netlify/functions/auth-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        localStorage.setItem('auth_token', data.token);
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const response = await fetch('/.netlify/functions/user-profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'profile',
          ...updates
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences) => {
    try {
      const response = await fetch('/.netlify/functions/user-profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'preferences',
          preferences
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Preferences update error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Update user stats
  const updateStats = async (stats) => {
    try {
      const response = await fetch('/.netlify/functions/user-profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'stats',
          stats
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Stats update error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch('/.netlify/functions/user-profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: 'password',
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Reset password (placeholder - would integrate with email service)
  const resetPassword = async (email) => {
    try {
      // In a real implementation, this would call a password reset endpoint
      // For now, return a mock success response
      return { 
        success: true, 
        message: 'Password reset instructions sent to your email' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Delete account
  const deleteAccount = async (password) => {
    try {
      const response = await fetch('/.netlify/functions/user-profile', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        logout();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Track analytics event
  const trackEvent = async (eventType, eventData = {}) => {
    try {
      if (!isAuthenticated) return;

      await fetch('/.netlify/functions/analytics', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          eventType,
          data: eventData,
          metadata: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        })
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  // Get user analytics
  const getAnalytics = async (type = 'overview', period = 'month') => {
    try {
      const response = await fetch(`/.netlify/functions/analytics?type=${type}&period=${period}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, analytics: data.analytics || data.events };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Analytics fetch error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await fetch('/.netlify/functions/user-profile', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        // Token might be expired, logout user
        logout();
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('User refresh error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    updatePreferences,
    updateStats,
    changePassword,
    resetPassword,
    deleteAccount,
    trackEvent,
    getAnalytics,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
