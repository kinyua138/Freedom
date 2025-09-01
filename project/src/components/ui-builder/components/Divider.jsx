import React from 'react';

const Divider = ({ 
  orientation = 'horizontal',
  thickness = 'thin',
  color = '#E5E7EB',
  style = 'solid',
  className = '',
  style: customStyle = {}
}) => {
  const thicknessClasses = {
    thin: orientation === 'horizontal' ? 'h-px' : 'w-px',
    medium: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    thick: orientation === 'horizontal' ? 'h-1' : 'w-1'
  };

  const orientationClasses = {
    horizontal: 'w-full',
    vertical: 'h-full'
  };

  const styleClasses = {
    solid: '',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  };

  if (style === 'solid') {
    return (
      <div 
        className={`${thicknessClasses[thickness]} ${orientationClasses[orientation]} transition-all duration-200 ${className}`}
        style={{ backgroundColor: color, ...customStyle }}
      />
    );
  }

  return (
    <div 
      className={`${orientationClasses[orientation]} ${styleClasses[style]} transition-all duration-200 ${className}`}
      style={{ 
        borderColor: color,
        borderWidth: orientation === 'horizontal' ? `${thickness === 'thin' ? 1 : thickness === 'medium' ? 2 : 4}px 0 0 0` : `0 0 0 ${thickness === 'thin' ? 1 : thickness === 'medium' ? 2 : 4}px`,
        ...customStyle 
      }}
    />
  );
};

export default Divider;