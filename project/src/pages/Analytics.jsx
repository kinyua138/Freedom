import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default Analytics;
