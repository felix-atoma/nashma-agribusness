// pages/Login.js
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthFormWrapper from './AuthFormWrapper';
import GoogleLoginButton from '../components/GoogleLoginButton';
import toast from '../utils/toast';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, handleGoogleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (error) {
      // Error handled in auth provider
    }
  };

  const handleGoogleSuccess = async (googleData) => {
    try {
      await handleGoogleLogin(googleData);
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failed:', error);
    toast.error('Google login failed. Please try again.');
  };

  const handleSwitchToSignup = () => {
    navigate('/signup');
  };

  const handleSwitchToForgot = () => {
    navigate('/forgot-password');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AuthFormWrapper 
          title="Welcome Back" 
          subtitle="Sign in to your account"
          icon={LogIn}
        >
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            text="Continue with Google"
            loading={loading}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <button
              onClick={handleSwitchToForgot}
              className="text-sm text-green-600 hover:text-green-700 transition-colors"
            >
              Forgot your password?
            </button>
            <div className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                onClick={handleSwitchToSignup}
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </AuthFormWrapper>
      </div>
    </div>
  );
};

export default Login;