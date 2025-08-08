import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import toast from '../utils/toast';

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
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log user state changes
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  // Initialize authentication state
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('Checking auth with token:', token);
      
      if (token) {
        try {
          apiClient.setAuthToken(token);
          const response = await apiClient.getMe();
          console.log('getMe response:', response);
          console.log('getMe response.data:', response.data);
          console.log('Full response structure:', JSON.stringify(response, null, 2));
          
          if (response.success) {
            console.log('Setting user from getMe:', response.data.user);
            // Let's also try just response.data in case the structure is different
            console.log('Trying response.data directly:', response.data);
            setUser(response.data.user || response.data);
          } else {
            console.log('getMe failed, clearing token');
            localStorage.removeItem('token');
            apiClient.setAuthToken(null);
          }
        } catch (error) {
          console.log('getMe error:', error);
          localStorage.removeItem('token');
          apiClient.setAuthToken(null);
        }
      }
      setInitialLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (userData) => {
    if (loading) return;
    
    setLoading(true);
    try {
      console.log('Starting signup process...');
      const response = await apiClient.signup(userData);
      console.log('Signup response:', response);
      
      if (response.success) {
        console.log('Signup successful, setting user and navigating...');
        setUser(response.data.user);
        toast.success('Account created successfully!');
        
        // Navigate immediately - don't wait for state update
        window.location.href = '/cart';
        return response.data.user;
      } else {
        const errorMessage = response.message || 'Signup failed';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || 'Signup failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    if (loading) return;
    
    setLoading(true);
    try {
      console.log('Starting login process...');
      const response = await apiClient.login(credentials);
      console.log('Login response:', response);
      
      if (response.success) {
        console.log('Login successful, raw response data:', response.data);
        console.log('User data from response:', response.data.user);
        console.log('Full login response structure:', JSON.stringify(response, null, 2));
        
        setUser(response.data.user || response.data);
        
        // Log the user state immediately after setting it (it will be old state due to async nature)
        console.log('User state after setUser (will be old):', user);
        
        toast.success('Login successful!');
        
        // Navigate immediately using window.location to bypass React Router timing issues
        const from = location.state?.from?.pathname || '/cart';
        console.log('Navigating to:', from);
        window.location.href = from;
        return response.data.user || response.data;
      } else {
        const errorMessage = response.message || 'Login failed';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const response = await apiClient.logout();
      
      setUser(null);
      localStorage.removeItem('token');
      apiClient.setAuthToken(null);
      
      if (response.success) {
        toast.success('Logged out successfully');
      }
      
      navigate('/login', { replace: true });
    } catch (error) {
      setUser(null);
      localStorage.removeItem('token');
      apiClient.setAuthToken(null);
      toast.error('Logout failed');
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const response = await apiClient.forgotPassword(email);
      
      if (response.success) {
        toast.success(response.data.message || 'Reset email sent!');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to send reset email';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, passwords) => {
    setLoading(true);
    try {
      const response = await apiClient.resetPassword(token, passwords);
      
      if (response.success) {
        setUser(response.data.user);
        toast.success('Password reset successful!');
        
        window.location.href = '/cart';
        return response.data.user;
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (passwords) => {
    setLoading(true);
    try {
      const response = await apiClient.updatePassword(passwords);
      
      if (response.success) {
        toast.success('Password updated successfully!');
        return response.data;
      } else {
        throw new Error(response.message || 'Password update failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'Password update failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    initialLoading,
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};