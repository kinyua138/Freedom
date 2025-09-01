import React from 'react';

const Button = ({ 
  text = 'Click me', 
  disabled = false,
  onClick,
  className = '',
  style = {}
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      style={style}
    >
      {text}
    </button>
  );
};

export default Button;