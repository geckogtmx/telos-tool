// Reusable Input component

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
          bg-gray-800 text-gray-100 placeholder-gray-500 caret-blue-400
          ${error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-400'
            : 'border-gray-600 focus:ring-blue-500 focus:border-blue-400'
          } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
