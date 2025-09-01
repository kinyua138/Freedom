import React from 'react';

const Container = ({ 
  children,
  layout = 'flex',
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = '4',
  className = '',
  style = {}
}) => {
  const layoutClasses = {
    flex: 'flex',
    grid: 'grid',
    block: 'block'
  };

  const directionClasses = {
    row: 'flex-row',
    column: 'flex-col'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  return (
    <div 
      className={`
        ${layoutClasses[layout]} 
        ${layout === 'flex' ? directionClasses[direction] : ''} 
        ${layout === 'flex' ? justifyClasses[justify] : ''} 
        ${layout === 'flex' ? alignClasses[align] : ''} 
        gap-${gap} 
        p-4 
        border-2 
        border-dashed 
        border-gray-200 
        rounded-lg 
        min-h-[100px] 
        transition-all 
        duration-200 
        ${className}
      `}
      style={style}
    >
      {children || (
        <div className="text-center text-gray-400 w-full">
          <p className="text-sm">Container - Drop components here</p>
        </div>
      )}
    </div>
  );
};

export default Container;