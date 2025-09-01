import React from 'react';

const Card = ({ 
  title = 'Card Title',
  content = 'This is a sample card with some content. You can customize this text and styling.',
  imageUrl = '',
  showImage = true,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
      style={style}
    >
      {showImage && (
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <p className="text-sm">Image</p>
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default Card;