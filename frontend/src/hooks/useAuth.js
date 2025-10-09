import { useState, useEffect, createContext, useContext } from 'react';
import { apiService } from '../utils/api';

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

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('healthnest_token');
      const savedUser = localStorage.getItem('healthnest_user');

      if (token && savedUser) {
        try {
          // Verify token is still valid
          const response = await apiService.auth.getProfile();
          setUser(response.data.user);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('healthnest_token');
          localStorage.removeItem('healthnest_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.auth.login(credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('healthnest_token', token);
      localStorage.setItem('healthnest_user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.auth.register(userData);
      const { user, token } = response.data;
      
      localStorage.setItem('healthnest_token', token);
      localStorage.setItem('healthnest_user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('healthnest_token');
    localStorage.removeItem('healthnest_user');
    setUser(null);
  };

  const updateUser = async (userData) => {
    try {
      const response = await apiService.auth.updateProfile(userData);
      const updatedUser = response.data.user;
      
      localStorage.setItem('healthnest_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for components outside of context
export default function useAuthHook() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('healthnest_token');
      const savedUser = localStorage.getItem('healthnest_user');

      if (token && savedUser) {
        try {
          const response = await apiService.auth.getProfile();
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('healthnest_token');
          localStorage.removeItem('healthnest_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  return { user, loading };
}