import React, { useState, useEffect } from 'react';
import { SmartphoneIcon, TabletIcon, MonitorIcon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon, RefreshCwIcon } from 'lucide-react';

const MobilePreview = ({ isOpen, onClose, content, title = 'Mobile Preview' }) => {
  const [device, setDevice] = useState('mobile');
  const [orientation, setOrientation] = useState('portrait');
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  // Device configurations
  const devices = {
    mobile: {
      name: 'iPhone 14',
      width: 390,
      height: 844,
      icon: SmartphoneIcon,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    tablet: {
      name: 'iPad Air',
      width: 820,
      height: 1180,
      icon: TabletIcon,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    desktop: {
      name: 'Desktop',
      width: 1200,
      height: 800,
      icon: MonitorIcon,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  };

  // Get current device config
  const currentDevice = devices[device];
  const deviceWidth = orientation === 'portrait' ? currentDevice.width : currentDevice.height;
  const deviceHeight = orientation === 'portrait' ? currentDevice.height : currentDevice.width;

  // Handle device rotation
  const handleRotate = () => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  };

  // Handle zoom
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.3));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  // Refresh preview
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  // Touch gesture simulation
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    });
  };

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const deltaTime = touchEnd.time - touchStart.time;

    // Detect swipe gestures
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 50 && deltaTime < 300) {
        if (deltaX > 0) {
          console.log('Swipe left detected');
        } else {
          console.log('Swipe right detected');
        }
      }
    } else {
      if (Math.abs(deltaY) > 50 && deltaTime < 300) {
        if (deltaY > 0) {
          console.log('Swipe up detected');
        } else {
          console.log('Swipe down detected');
        }
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SmartphoneIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {currentDevice.name} • {deviceWidth} × {deviceHeight}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Device Selection */}
            <div className="flex border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
              {Object.entries(devices).map(([key, deviceConfig]) => {
                const Icon = deviceConfig.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setDevice(key)}
                    className={`p-2 ${
                      device === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                    title={deviceConfig.name}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            {/* Rotation */}
            <button
              onClick={handleRotate}
              className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              title="Rotate device"
            >
              <RotateCcwIcon className="w-4 h-4 text-gray-600 dark:text-slate-400" />
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 border border-gray-300 dark:border-slate-600 rounded-lg">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                title="Zoom out"
              >
                <ZoomOutIcon className="w-4 h-4 text-gray-600 dark:text-slate-400" />
              </button>
              <span className="px-2 text-sm text-gray-600 dark:text-slate-400 min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                title="Zoom in"
              >
                <ZoomInIcon className="w-4 h-4 text-gray-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              title="Refresh"
            >
              <RefreshCwIcon className={`w-4 h-4 text-gray-600 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <span className="text-xl text-gray-500 dark:text-slate-400">×</span>
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-8 bg-gray-100 dark:bg-slate-800 flex items-center justify-center min-h-[600px]">
          {/* Device Frame */}
          <div
            className="relative bg-black rounded-[2rem] p-2 shadow-2xl"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center'
            }}
          >
            {/* Screen */}
            <div
              className="bg-white dark:bg-slate-900 rounded-[1.5rem] overflow-hidden relative"
              style={{
                width: `${deviceWidth}px`,
                height: `${deviceHeight}px`
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Status Bar (Mobile only) */}
              {device === 'mobile' && (
                <div className="h-6 bg-black flex items-center justify-between px-4 text-white text-xs">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-2 border border-white rounded-sm">
                      <div className="w-3 h-1 bg-white rounded-sm"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Area */}
              <div className="h-full overflow-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : content ? (
                  <div className="h-full">
                    {typeof content === 'string' ? (
                      <iframe
                        src={content}
                        className="w-full h-full border-0"
                        title="Mobile Preview"
                      />
                    ) : (
                      content
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400">
                    <div className="text-center">
                      <SmartphoneIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No content to preview</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Home Indicator (Mobile only) */}
              {device === 'mobile' && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-1 bg-black rounded-full opacity-30"></div>
                </div>
              )}
            </div>

            {/* Device Details */}
            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <div className="text-sm text-gray-600 dark:text-slate-400">
                {currentDevice.name} • {orientation}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-400">
            <div>
              Touch gestures: Swipe to navigate • Pinch to zoom • Tap to interact
            </div>
            <div>
              Zoom: {Math.round(zoom * 100)}% • {orientation} orientation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;
