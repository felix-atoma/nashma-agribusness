// components/Toast.jsx
import React from 'react';

const Toast = ({ message, type }) => {
  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : type === 'info'
      ? 'bg-blue-500'
      : 'bg-yellow-500';

  return (
    <div
      className={`px-4 py-2 rounded shadow text-white font-medium ${bgColor}`}
    >
      {message}
    </div>
  );
};

export default Toast;
