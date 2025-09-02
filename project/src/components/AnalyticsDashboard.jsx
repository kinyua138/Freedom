import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  EyeIcon,
  ClockIcon,
  CubeIcon,
  UserIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const AnalyticsDashboard = ({ className = '' }) => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalViews: 0,
      uniqueVisitors: 0,
      avgSessionTime: 0,
      bounceRate: 0,
      componentsCreated: 0,
      projectsBuilt: 0
    },
    trends: {
      views: [],
      visitors: [],
      components: []
    },
    devices: {
      desktop: 0,
      mobile: 0,
      tablet: 0
    },
    pages: [],
    components: [],
    timeRange: '7d'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('views');

  // Simulate loading analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [analytics.timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock data based on time range
    const mockData = generateMockAnalytics(analytics.timeRange);
    setAnalytics(prev => ({ ...prev, ...mockData }));
    setIsLoading(false);
  };

  const generateMockAnalytics = (timeRange) => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const baseViews = Math.floor(Math.random() * 1000) + 500;
    const baseVisitors = Math.floor(baseViews * 0.7);
    
    // Generate trend data
    const views = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(baseViews + Math.random() * 200 - 100)
    }));

    const visitors = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(baseVisitors + Math.random() * 150 - 75)
    }));

    const components = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 50) + 10
    }));

    return {
      overview: {
        totalViews: views.reduce((sum, item) => sum + item.value, 0),
        uniqueVisitors: visitors.reduce((sum, item) => sum + item.value, 0),
        avgSessionTime: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
        bounceRate: Math.floor(Math.random() * 30) + 20, // 20-50%
        componentsCreated: components.reduce((sum, item) => sum + item.value, 0),
        projectsBuilt: Math.floor(Math.random() * 50) + 20
      },
      trends: {
        views,
        visitors,
        components
      },
      devices: {
        desktop: Math.floor(Math.random() * 60) + 40, // 40-100%
        mobile: Math.floor(Math.random() * 40) + 20,  // 20-60%
        tablet: Math.floor(Math.random() * 20) + 5    // 5-25%
      },
      pages: [
        { path: '/', views: Math.floor(Math.random() * 500) + 200, title: 'Home' },
        { path: '/ui-builder', views: Math.floor(Math.random() * 400) + 150, title: 'UI Builder' },
        { path: '/about', views: Math.floor(Math.random() * 200) + 50, title: 'About' },
        { path: '/contact', views: Math.floor(Math.random() * 150) + 30, title: 'Contact' }
      ].sort((a, b) => b.views - a.views),
      components: [
        { name: 'Button', usage: Math.floor(Math.random() * 100) + 50 },
        { name: 'Card', usage: Math.floor(Math.random() * 80) + 40 },
        { name: 'Text', usage: Math.floor(Math.random() * 120) + 60 },
        { name: 'Image', usage: Math.floor(Math.random() * 70) + 30 },
        { name: 'Container', usage: Math.floor(Math.random() * 90) + 45 }
      ].sort((a, b) => b.usage - a.usage)
    };
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculateTrend = (data) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, item) => sum + item.value, 0) / 3;
    const previous = data.slice(-6, -3).reduce((sum, item) => sum + item.value, 0) / 3;
    return previous > 0 ? ((recent - previous) / previous) * 100 : 0;
  };

  const MetricCard = ({ title, value, icon: Icon, trend, format = 'number' }) => {
    const formattedValue = format === 'time' ? formatTime(value) : 
                          format === 'percentage' ? `${value}%` : 
                          formatNumber(value);
    
    const trendColor = trend > 0 ? 'text-green-600 dark:text-green-400' : 
                      trend < 0 ? 'text-red-600 dark:text-red-400' : 
                      'text-gray-600 dark:text-slate-400';
    
    const TrendIcon = trend > 0 ? TrendingUpIcon : TrendingDownIcon;

    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formattedValue}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center mt-4 text-sm ${trendColor}`}>
            <TrendIcon className="w-4 h-4 mr-1" />
            <span>{Math.abs(trend).toFixed(1)}% vs last period</span>
          </div>
        )}
      </div>
    );
  };

  const SimpleChart = ({ data, color = 'blue' }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));
    const range = maxValue - minValue || 1;

    return (
      <div className="flex items-end space-x-1 h-20">
        {data.map((item, index) => {
          const height = ((item.value - minValue) / range) * 100;
          return (
            <div
              key={index}
              className={`flex-1 bg-gradient-to-t from-${color}-500 to-${color}-400 rounded-t opacity-80 hover:opacity-100 transition-opacity`}
              style={{ height: `${Math.max(height, 5)}%` }}
              title={`${item.date}: ${item.value}`}
            />
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-slate-700 h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Track your application performance and user engagement
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={analytics.timeRange}
            onChange={(e) => setAnalytics(prev => ({ ...prev, timeRange: e.target.value }))}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Views"
          value={analytics.overview.totalViews}
          icon={EyeIcon}
          trend={calculateTrend(analytics.trends.views)}
        />
        <MetricCard
          title="Unique Visitors"
          value={analytics.overview.uniqueVisitors}
          icon={UserIcon}
          trend={calculateTrend(analytics.trends.visitors)}
        />
        <MetricCard
          title="Avg. Session Time"
          value={analytics.overview.avgSessionTime}
          icon={ClockIcon}
          format="time"
        />
        <MetricCard
          title="Bounce Rate"
          value={analytics.overview.bounceRate}
          icon={TrendingDownIcon}
          format="percentage"
        />
        <MetricCard
          title="Components Created"
          value={analytics.overview.componentsCreated}
          icon={CubeIcon}
          trend={calculateTrend(analytics.trends.components)}
        />
        <MetricCard
          title="Projects Built"
          value={analytics.overview.projectsBuilt}
          icon={ChartBarIcon}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trend Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trends</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              <option value="views">Views</option>
              <option value="visitors">Visitors</option>
              <option value="components">Components</option>
            </select>
          </div>
          <SimpleChart data={analytics.trends[selectedMetric]} />
        </div>

        {/* Device Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ComputerDesktopIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-slate-300">Desktop</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${analytics.devices.desktop}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                  {analytics.devices.desktop}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DevicePhoneMobileIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-gray-700 dark:text-slate-300">Mobile</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${analytics.devices.mobile}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                  {analytics.devices.mobile}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-700 dark:text-slate-300">Tablet</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${analytics.devices.tablet}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                  {analytics.devices.tablet}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analytics.pages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-slate-400">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{page.title}</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{page.path}</p>
                  </div>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatNumber(page.views)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Components */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Components</h3>
          <div className="space-y-3">
            {analytics.components.map((component, index) => (
              <div key={component.name} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{component.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-16 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                      style={{ width: `${(component.usage / Math.max(...analytics.components.map(c => c.usage))) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white w-8">
                    {component.usage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
