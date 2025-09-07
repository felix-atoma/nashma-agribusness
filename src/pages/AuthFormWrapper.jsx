import React from 'react';
import { motion } from 'framer-motion';

const AuthFormWrapper = ({ children, title, subtitle, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100"
    >
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
};

export default AuthFormWrapper;