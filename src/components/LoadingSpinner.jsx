import React from 'react';
import './LoadingSpinner.css'; // We'll create this next

const LoadingSpinner = ({ size = 40, color = '#3b82f6' }) => {
  return (
    <div className="spinner-container">
      <div 
        className="loading-spinner"
        style={{
          width: size,
          height: size,
          borderColor: color,
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;