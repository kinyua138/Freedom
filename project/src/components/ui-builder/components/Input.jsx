import React from 'react';

const Input = ({ 
  type = 'text',
  placeholder = 'Enter text...',
  label = '',
  value = '',
  required = false,
  disabled = false,
  className = '',
  style = {}
}) => {
  return (
    <div className={`w-full ${className}`} style={style}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default Input;