import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await api.getCurrentUser();
          if (response.user) {
            setUser(response.user);
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (credentials) => {
    try {
      const response = await api.signIn(credentials);
      if (response.user && response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid response' };
    } catch (error) {
      return { success: false, error: error.message || 'Sign in failed' };
    }
  };

  const signOut = async () => {
    try {
      await api.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

