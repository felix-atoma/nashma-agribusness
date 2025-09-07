// services/authService.js
import apiClient from './apiClient';

export const authService = {
  // Email/password authentication
  signup: (userData) => apiClient.signup(userData),
  login: (credentials) => apiClient.login(credentials),
  logout: () => apiClient.logout(),
  
  // Password management
  async forgotPassword(email) {
    try {
      const response = await apiClient.request('/auth/forgot-password', {
        method: 'POST',
        body: { email }
      });
      return {
        success: true,
        message: response.data?.message || 'Password reset email sent successfully',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to send password reset email'
      };
    }
  },

  async resetPassword(token, passwords) {
    try {
      const response = await apiClient.request(`/auth/reset-password/${token}`, {
        method: 'POST',
        body: passwords
      });
      return {
        success: true,
        message: response.data?.message || 'Password reset successfully',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to reset password'
      };
    }
  },

  async updatePassword(passwords) {
    try {
      const response = await apiClient.request('/auth/update-password', {
        method: 'PATCH',
        body: passwords
      });
      return {
        success: true,
        message: response.data?.message || 'Password updated successfully',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update password'
      };
    }
  },
  
  // Google authentication with development fallback
  async googleLogin(accessToken) {
    // Development fallback
    if (import.meta.env.DEV) {
      console.warn('Using development fallback for Google login');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: {
          token: 'dev-google-token-' + Date.now(),
          user: {
            id: 'google-user-' + Date.now(),
            email: 'google.user@example.com',
            firstName: 'Google',
            lastName: 'User',
            avatar: null,
            role: 'user',
            isGoogleAuth: true
          }
        }
      };
    }
    
    // Production call
    return apiClient.request('/auth/google', {
      method: 'POST',
      body: { token: accessToken }
    });
  },
  
  // Get current user
  getMe: () => apiClient.getMe(),
  
  // Update user profile
  updateProfile: (userData) => 
    apiClient.request('/auth/profile', {
      method: 'PATCH',
      body: userData
    })
};