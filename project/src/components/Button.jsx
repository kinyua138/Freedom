import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick, 
  className = '',
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border-2 border-blue-600 hover:border-blue-700 focus:ring-blue-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-300'
  }
  
  const sizes = {
    sm: 'py-2 px-6 text-sm',
    md: 'py-3 px-8 text-base',
    lg: 'py-4 px-10 text-lg'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button