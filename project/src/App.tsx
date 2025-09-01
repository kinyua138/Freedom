import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import UIBuilderLayout from '@/layouts/UIBuilderLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorFallback from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load pages for better performance
const Home = React.lazy(() => import('@/pages/Home'));
const About = React.lazy(() => import('@/pages/About'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const UIBuilder = React.lazy(() => import('@/pages/UIBuilder'));

const App: React.FC = () => {
  return (
    <Routes>
      {/* Main website routes with navbar and footer */}
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSpinner />}>
                <Home />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="about"
          element={
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSpinner />}>
                <About />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="contact"
          element={
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSpinner />}>
                <Contact />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="*"
          element={
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSpinner />}>
                <NotFound />
              </Suspense>
            </ErrorBoundary>
          }
        />
      </Route>

      {/* UI Builder routes with independent layout */}
      <Route path="/ui-builder" element={<UIBuilderLayout />}>
        <Route
          index
          element={
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSpinner />}>
                <UIBuilder />
              </Suspense>
            </ErrorBoundary>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
