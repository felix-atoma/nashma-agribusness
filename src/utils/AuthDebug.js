// AuthDebug.js - Component to debug authentication state
import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDebug = () => {
  const { user, loading, initialized, error, isAuthenticated } = useAuth();

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: '#f0f0f0',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px'
      }}>
        <strong>Auth Debug:</strong>
        <div>Initialized: {initialized ? '✅' : '❌'}</div>
        <div>Loading: {loading ? '⏳' : '✅'}</div>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>User: {user ? `${user.firstName || 'N/A'} (${user.email})` : 'None'}</div>
        <div>Token: {localStorage.getItem('token') ? '✅' : '❌'}</div>
        {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      </div>
    );
  }

  return null;
};

export default AuthDebug;