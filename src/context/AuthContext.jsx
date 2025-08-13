import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  const [authState, setAuthState] = useState({
    user: null,
    loading: false,
    initialized: false,
    error: null
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Debug logging
  useEffect(() => {
    console.log('Auth state updated:', authState);
  }, [authState]);

  // Normalize user data from API responses
  const normalizeUserData = useCallback((response) => {
    // Handle multiple possible response structures
    return response?.data?.data?.user || 
           response?.data?.user || 
           response?.user || 
           response?.data;
  }, []);

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    console.log('Initializing auth with token:', Boolean(token));
    
    if (!token) {
      setAuthState(prev => ({ ...prev, initialized: true }));
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      apiClient.setAuthToken(token);
      
      const response = await apiClient.getMe();
      console.log('Auth initialization response:', response);

      if (response.success) {
        const userData = normalizeUserData(response);
        console.log('Normalized user data:', userData);
        
        setAuthState({
          user: userData,
          loading: false,
          initialized: true,
          error: null
        });
      } else {
        console.warn('Failed to authenticate with stored token');
        localStorage.removeItem('token');
        apiClient.setAuthToken(null);
        setAuthState({
          user: null,
          loading: false,
          initialized: true,
          error: response.message
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('token');
      apiClient.setAuthToken(null);
      setAuthState({
        user: null,
        loading: false,
        initialized: true,
        error: error.message
      });
    }
  }, [normalizeUserData]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Handle successful authentication
  const handleAuthSuccess = useCallback(async (response, successMessage) => {
    const userData = normalizeUserData(response);
    const token = response.data?.token;

    if (token) {
      localStorage.setItem('token', token);
      apiClient.setAuthToken(token);
    }

    setAuthState({
      user: userData,
      loading: false,
      initialized: true,
      error: null
    });

    if (successMessage) {
      toast.success(successMessage);
    }

    return userData;
  }, [normalizeUserData]);

  // Authentication methods
  const signup = async (userData) => {
    if (authState.loading) return;
    
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.signup(userData);
      
      if (response.success) {
        const userData = await handleAuthSuccess(response, 'Account created successfully!');
        navigate('/cart', { replace: true });
        return userData;
      }
      
      throw new Error(response.message || 'Signup failed');
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      toast.error(error.message || 'Signup failed');
      throw error;
    }
  };

  const login = async (credentials) => {
    if (authState.loading) return;
    
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.login(credentials);
      
      if (response.success) {
        const userData = await handleAuthSuccess(response, 'Login successful!');
        
        const redirectTo = location.state?.from?.pathname || '/cart';
        navigate(redirectTo, { replace: true });
        return userData;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      await apiClient.logout();
      
      setAuthState({
        user: null,
        loading: false,
        initialized: true,
        error: null
      });
      
      localStorage.removeItem('token');
      apiClient.setAuthToken(null);
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        initialized: true,
        error: error.message
      });
      localStorage.removeItem('token');
      apiClient.setAuthToken(null);
      toast.error('Logout failed');
      navigate('/login', { replace: true });
    }
  };

  const forgotPassword = async (email) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.forgotPassword(email);
      
      if (response.success) {
        setAuthState(prev => ({ ...prev, loading: false }));
        toast.success(response.data?.message || 'Password reset email sent');
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to send reset email');
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  const resetPassword = async (token, passwords) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.resetPassword(token, passwords);
      
      if (response.success) {
        const userData = await handleAuthSuccess(response, 'Password reset successfully!');
        navigate('/cart', { replace: true });
        return userData;
      }
      
      throw new Error(response.message || 'Password reset failed');
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      toast.error(error.message || 'Password reset failed');
      throw error;
    }
  };

  const updatePassword = async (passwords) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await apiClient.updatePassword(passwords);
      
      if (response.success) {
        setAuthState(prev => ({ ...prev, loading: false }));
        toast.success('Password updated successfully!');
        return response.data;
      }
      
      throw new Error(response.message || 'Password update failed');
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      toast.error(error.message || 'Password update failed');
      throw error;
    }
  };

  // Memoized context value
  const contextValue = useMemo(() => ({
    user: authState.user,
    loading: authState.loading,
    initialized: authState.initialized,
    error: authState.error,
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    isAuthenticated: !!authState.user
  }), [authState]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};