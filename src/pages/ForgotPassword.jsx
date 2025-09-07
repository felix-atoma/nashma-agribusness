import React, { useState } from 'react';
import { Lock, Mail, RefreshCw, ArrowLeft, CheckCircle, AlertCircle, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Mock email inbox component to show the actual email
const EmailInbox = ({ email, resetURL, onBackToReset }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl">
      {/* Email header */}
      <div className="bg-green-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Inbox className="w-6 h-6" />
            <span className="font-semibold">Email Inbox</span>
          </div>
          <button 
            onClick={onBackToReset}
            className="text-blue-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Email content */}
      <div className="p-6">
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <div className="text-sm text-gray-600 mb-2">
            <strong>From:</strong> noreply@Nashma.com
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <strong>To:</strong> {email}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            <strong>Subject:</strong> Reset Your Password
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Reset Your Password</h2>
          
          <p className="text-gray-700 mb-4">Hello,</p>
          
          <p className="text-gray-700 mb-4">
            We received a request to reset the password for your account associated with {email}.
          </p>
          
          <p className="text-gray-700 mb-6">
            Click the button below to reset your password. This link will expire in 10 minutes for security reasons.
          </p>
          
          <div className="text-center mb-6">
            <a 
              href={resetURL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center no-underline"
            >
              Reset Password
            </a>
          </div>
          
          <p className="text-gray-600 text-xs mb-4">
            If the button doesn't work, copy and paste this link into your browser:
            <br />
            <span className="text-blue-600 break-all">
              {resetURL}
            </span>
          </p>
          
          <hr className="my-4 border-gray-300" />
          
          <p className="text-gray-600 text-xs mb-2">
            If you didn't request this password reset, you can safely ignore this email. 
            Your password will remain unchanged.
          </p>
          
          <p className="text-gray-600 text-xs">
            For security reasons, this link will expire in 10 minutes.
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="text-gray-500 text-xs">
              Best regards,<br />
              The YourApp Team
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">This is a demonstration of the email content</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            In production, this email is sent to the user's actual email address by your backend.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// AuthFormWrapper component
const AuthFormWrapper = ({ title, subtitle, icon: Icon, children }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

const ForgotPassword = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [currentView, setCurrentView] = useState('forgot'); // 'forgot', 'login', 'email'
  const [sentEmail, setSentEmail] = useState('');
  const [backendMessage, setBackendMessage] = useState('');
  const [localError, setLocalError] = useState('');

  // Use the AuthContext which already has forgotPassword method
  const { forgotPassword, loading, error } = useAuth();

  const handleSubmit = async () => {
    setLocalError('');
    setBackendMessage('');
    
    try {
      // Use the forgotPassword method from AuthContext
      const response = await forgotPassword(email);
      
      // Success - forgotPassword handles the success toast
      setEmailSent(true);
      setSentEmail(email);
      setBackendMessage(response?.message || 'Password reset email sent successfully!');
      
    } catch (error) {
      // Error handling - forgotPassword already shows error toast
      // Just set local error for additional UI feedback if needed
      setLocalError(error.message);
    }
  };

  const handleBackToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      setCurrentView('login');
    }
    // Reset form state when going back
    setEmailSent(false);
    setEmail('');
    setLocalError('');
    setBackendMessage('');
  };

  const handleViewEmail = () => {
    // Generate the reset URL that matches your backend structure
    const resetURL = `${window.location.protocol}//${window.location.host}/api/v1/auth/reset-password/sample-reset-token`;
    setCurrentView('email');
  };

  const handleBackToReset = () => {
    setCurrentView('forgot');
  };

  const handleResendEmail = async () => {
    setLocalError('');
    
    try {
      const response = await forgotPassword(sentEmail);
      setBackendMessage(response?.message || 'Reset email sent again!');
    } catch (error) {
      setLocalError(error.message || 'Failed to resend email. Please try again.');
    }
  };

  // Show actual email content
  if (currentView === 'email') {
    const resetURL = `${window.location.protocol}//${window.location.host}/reset-password/sample-reset-token`;
    return <EmailInbox email={sentEmail} resetURL={resetURL} onBackToReset={handleBackToReset} />;
  }

  // Login form for demonstration (if no onSwitchToLogin prop provided)
  const LoginForm = () => (
    <AuthFormWrapper 
      title="Welcome Back" 
      subtitle="Sign in to your account"
      icon={Lock}
    >
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="button"
          className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
        >
          Sign In
        </button>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => setCurrentView('forgot')}
          className="text-sm text-green-600 hover:text-green-700 transition-colors"
        >
          Forgot your password?
        </button>
      </div>
    </AuthFormWrapper>
  );

  // Show login form if user navigated back (and no onSwitchToLogin prop)
  if (currentView === 'login' && !onSwitchToLogin) {
    return <LoginForm />;
  }

  // Success state after email is sent
  if (emailSent) {
    return (
      <AuthFormWrapper 
        title="Email Sent Successfully!" 
        subtitle="Check your inbox for password reset instructions"
        icon={CheckCircle}
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-green-500" />
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm font-medium mb-2">
              Password reset email sent to:
            </p>
            <p className="text-green-900 font-semibold">{sentEmail}</p>
            {backendMessage && (
              <p className="text-green-700 text-sm mt-2">
                {backendMessage}
              </p>
            )}
            <p className="text-green-700 text-sm mt-2">
              The email contains a secure link to reset your password. This link will expire in 10 minutes for security.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleViewEmail}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
            >
              <Inbox className="w-4 h-4" />
              View Email Content (Demo)
            </button>
            
            <button
              onClick={handleBackToLogin}
              className="w-full inline-flex items-center justify-center text-green-600 hover:text-green-700 font-medium transition-colors py-2 px-4 border border-green-600 rounded-lg hover:bg-green-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-3">Didn't receive the email?</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-500">• Check your spam/junk folder</p>
              <p className="text-gray-500">• Make sure {sentEmail} is correct</p>
              <p className="text-gray-500">• The link expires in 10 minutes</p>
              <button
                onClick={handleResendEmail}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Resending...
                  </span>
                ) : (
                  'Resend Email'
                )}
              </button>
            </div>
          </div>
        </div>
      </AuthFormWrapper>
    );
  }

  // Main forgot password form
  return (
    <AuthFormWrapper 
      title="Reset Password" 
      subtitle="Enter your email to receive reset instructions"
      icon={Lock}
    >
      <div className="space-y-5">
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
              onKeyDown={(e) => e.key === 'Enter' && !loading && email.trim() && handleSubmit()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Show AuthContext error or local error */}
        {(error || localError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error || localError}</p>
          </div>
        )}

        {/* Show success message if available */}
        {backendMessage && !error && !localError && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-blue-700 text-sm">{backendMessage}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !email.trim()}
          className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Sending Reset Email...</span>
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={handleBackToLogin}
          className="inline-flex items-center text-sm text-green-600 hover:text-green-700 transition-colors py-2 px-3 rounded-md hover:bg-green-50"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Sign In
        </button>
      </div>
    </AuthFormWrapper>
  );
};

export default ForgotPassword;