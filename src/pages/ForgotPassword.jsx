import React, { useState } from 'react';
import { Lock, Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext'
import AuthFormWrapper from './AuthFormWrapper'

const ForgotPassword = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { forgotPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setEmailSent(true);
    } catch (error) {
      // Error handled in auth provider
    }
  };

  if (emailSent) {
    return (
      <AuthFormWrapper 
        title="Check Your Email" 
        subtitle={`We've sent password reset instructions to ${email}`}
        icon={Mail}
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-green-500" />
          </div>
          <button
            onClick={onSwitchToLogin}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sign In
          </button>
        </div>
      </AuthFormWrapper>
    );
  }

  return (
    <AuthFormWrapper 
      title="Reset Password" 
      subtitle="Enter your email to receive reset instructions"
      icon={Lock}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Sign In
        </button>
      </div>
    </AuthFormWrapper>
  );
};

export default ForgotPassword;