// components/GoogleLoginButton.jsx
import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = ({ onSuccess, onError, text = "Continue with Google", loading = false }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setIsGoogleLoading(true);
      onSuccess(tokenResponse);
    },
    onError: (error) => {
      setIsGoogleLoading(false);
      onError(error);
    },
    onNonOAuthError: () => {
      setIsGoogleLoading(false);
    },
    flow: 'implicit',
  });

  const totalLoading = loading || isGoogleLoading;

  if (!googleClientId) {
    return (
      <button
        disabled
        className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-500 py-2.5 px-4 rounded-lg border border-gray-300 cursor-not-allowed transition-all"
        title="Google authentication is not configured"
      >
        <FcGoogle className="w-5 h-5" />
        <span className="text-sm font-medium">
          Google authentication not configured
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        setIsGoogleLoading(true);
        login();
      }}
      disabled={totalLoading}
      className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      <FcGoogle className="w-5 h-5" />
      <span className="text-sm font-medium">
        {totalLoading ? 'Connecting to Google...' : text}
      </span>
    </button>
  );
};

export default GoogleLoginButton;