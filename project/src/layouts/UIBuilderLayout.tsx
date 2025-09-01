import React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '@/utils/constants';

const UIBuilderLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-gray-50 overflow-hidden">
      <Helmet>
        <title>{APP_NAME} - UI Builder</title>
        <meta name="description" content="Interactive UI Builder - Create stunning web interfaces" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Outlet />
    </div>
  );
};

export default UIBuilderLayout;
