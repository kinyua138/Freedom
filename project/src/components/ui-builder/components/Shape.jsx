import React from 'react';

const Shape = ({ 
  type = 'rectangle',
  size = 'medium',
  color = '#3B82F6',
  className = '',
  style = {}
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
    xlarge: 'w-48 h-48',
    custom: 'w-full h-full'
  };

  const shapeClasses = {
    rectangle: 'rounded-lg',
    square: 'rounded-lg aspect-square',
    circle: 'rounded-full',
    triangle: 'clip-triangle'
  };

  const baseStyle = {
    backgroundColor: color,
    ...style
  };

  if (type === 'triangle') {
    return (
      <div 
        className={`${size !== 'custom' ? sizeClasses[size] : 'w-full h-full'} relative ${className}`}
        style={style}
      >
        <div 
          className="w-0 h-0 border-l-transparent border-r-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            borderBottomColor: color,
            borderLeftWidth: size === 'custom' ? '20px' : '24px',
            borderRightWidth: size === 'custom' ? '20px' : '24px',
            borderBottomWidth: size === 'custom' ? '30px' : '40px'
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} ${shapeClasses[type]} transition-all duration-200 ${className}`}
      style={baseStyle}
    />
  );
};

export default Shape;