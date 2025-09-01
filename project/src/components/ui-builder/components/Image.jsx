import React from 'react';
import { ImageIcon } from 'lucide-react';

const Image = ({ 
  src = '',
  alt = 'Image',
  placeholder = true,
  className = '',
  style = {}
}) => {
  if (!src && placeholder) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center transition-all duration-200 ${className}`}
        style={{ minHeight: '200px', ...style }}
      >
        <div className="text-center text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">Image Placeholder</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`transition-all duration-200 ${className}`}
      style={style}
    />
  );
};

export default Image;