import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
};

export default Loader;