import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return null;
      }
      
      const response = await apiClient.get('/api/auth/me');
      setUser(response.data?.user || response.user || response);
      return response.data?.user || response.user || response;
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem("token");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      
      // Handle different response structures
      const token = response.token || response.data?.token;
      const userData = response.user || response.data?.user || response.data;
      
      if (token) {
        localStorage.setItem("token", token);
      }
      
      setUser(userData);
      // Don't call checkAuth again since we already have the user data
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem("token");
      return { 
        success: false, 
        message: error.data?.message || error.message || 'Login failed'
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await apiClient.post('/api/auth/signup', userData);
      
      // Handle different response structures
      const token = response.token || response.data?.token;
      const user = response.user || response.data?.user || response.data;
      
      if (token) {
        localStorage.setItem("token", token);
      }
      
      setUser(user);
      return { success: true, user };
    } catch (error) {
      console.error('Signup failed:', error);
      return { 
        success: false, 
        message: error.data?.message || error.message || 'Signup failed'
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
      localStorage.removeItem("token");
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove token and user even if API call fails
      localStorage.removeItem("token");
      setUser(null);
      return { success: false, message: error.message };
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAdmin,
        isAuthenticated,
        checkAuth
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};