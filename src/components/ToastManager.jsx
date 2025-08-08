// components/ToastManager.jsx
import React, { useState, useEffect } from 'react';
import Toast from './Toast'; // ✅ Proper toast UI component

const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const { message, type } = e.detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('show-toast', handler);
    return () => window.removeEventListener('show-toast', handler);
  }, []);

  return (
    <div className="fixed top-5 right-5 space-y-2 z-50">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} />
      ))}
    </div>
  );
};

export default ToastManager;
