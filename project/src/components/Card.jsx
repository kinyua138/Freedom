import React from 'react'

const Card = ({ 
  image, 
  title, 
  description, 
  className = '',
  children,
  onClick 
}) => {
  return (
    <div 
      className={`card p-6 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {image && (
        <div className="mb-4 overflow-hidden rounded-xl">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      )}
      
      {description && (
        <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
      )}
      
      {children}
    </div>
  )
}

export default Card