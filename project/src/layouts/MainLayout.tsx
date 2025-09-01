import React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAppSelector } from '@/hooks/useRedux';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { APP_NAME } from '@/utils/constants';

const MainLayout: React.FC = () => {
  const theme = useAppSelector(state => state.theme);

  return (
    <div className={`min-h-screen flex flex-col ${theme.mode === 'dark' ? 'dark' : ''}`}>
      <Helmet>
        <title>{APP_NAME} - Modern Web Development Platform</title>
        <meta name="description" content="Build stunning web experiences with our modern, responsive, and beautifully designed platform" />
        <meta name="keywords" content="web development, UI builder, React, TypeScript, modern design" />
        <meta property="og:title" content={`${APP_NAME} - Modern Web Development Platform`} />
        <meta property="og:description" content="Build stunning web experiences with our modern, responsive, and beautifully designed platform" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${APP_NAME} - Modern Web Development Platform`} />
        <meta name="twitter:description" content="Build stunning web experiences with our modern, responsive, and beautifully designed platform" />
      </Helmet>
      
      <Navbar />
      <main className="flex-1 bg-gradient-primary">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
