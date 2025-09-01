import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

const UIBuilderHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Main Site</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <HomeIcon className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-gray-900">UI Builder</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => window.open('/', '_blank')}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Main Site
        </button>
      </div>
    </header>
  );
};

export default UIBuilderHeader;
