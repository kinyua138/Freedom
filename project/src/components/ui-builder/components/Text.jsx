import React from 'react';

const Text = ({ 
  text = 'Sample Text',
  tag = 'p',
  className = '',
  style = {}
}) => {
  const Component = tag;
  
  return (
    <Component
      className={`transition-all duration-200 ${className}`}
      style={style}
    >
      {text}
    </Component>
  );
};

export default Text;