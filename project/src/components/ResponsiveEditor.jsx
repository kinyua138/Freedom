import React, { useState, useEffect } from 'react';
import { MonitorIcon, TabletIcon, SmartphoneIcon, EyeIcon, CodeIcon, SettingsIcon } from 'lucide-react';

const ResponsiveEditor = ({ isOpen, onClose, onBreakpointChange }) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState('desktop');
  const [customBreakpoints, setCustomBreakpoints] = useState({
    mobile: { min: 0, max: 767, name: 'Mobile' },
    tablet: { min: 768, max: 1023, name: 'Tablet' },
    desktop: { min: 1024, max: 1439, name: 'Desktop' },
    wide: { min: 1440, max: 9999, name: 'Wide Screen' }
  });
  
  const [previewWidth, setPreviewWidth] = useState(1200);
  const [showGrid, setShowGrid] = useState(true);
  const [showRuler, setShowRuler] = useState(true);
  const [selectedElement, setSelectedElement] = useState(null);

  // CSS properties that can be responsive
  const responsiveProperties = [
    { name: 'width', unit: 'px', type: 'number' },
    { name: 'height', unit: 'px', type: 'number' },
    { name: 'margin', unit: 'px', type: 'spacing' },
    { name: 'padding', unit: 'px', type: 'spacing' },
    { name: 'font-size', unit: 'px', type: 'number' },
    { name: 'line-height', unit: '', type: 'number' },
    { name: 'display', unit: '', type: 'select', options: ['block', 'inline', 'flex', 'grid', 'none'] },
    { name: 'flex-direction', unit: '', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
    { name: 'justify-content', unit: '', type: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] },
    { name: 'align-items', unit: '', type: 'select', options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] }
  ];

  // Element styles for different breakpoints
  const [elementStyles, setElementStyles] = useState({
    mobile: {},
    tablet: {},
    desktop: {},
    wide: {}
  });

  // Update preview width based on breakpoint
  useEffect(() => {
    const breakpoint = customBreakpoints[activeBreakpoint];
    if (breakpoint) {
      const midPoint = Math.floor((breakpoint.min + breakpoint.max) / 2);
      setPreviewWidth(midPoint);
    }
  }, [activeBreakpoint, customBreakpoints]);

  // Generate CSS media queries
  const generateCSS = () => {
    let css = '';
    
    Object.entries(customBreakpoints).forEach(([breakpoint, config]) => {
      const styles = elementStyles[breakpoint];
      if (Object.keys(styles).length > 0) {
        css += `@media (min-width: ${config.min}px)`;
        if (config.max < 9999) {
          css += ` and (max-width: ${config.max}px)`;
        }
        css += ' {\n';
        
        Object.entries(styles).forEach(([selector, properties]) => {
          css += `  ${selector} {\n`;
          Object.entries(properties).forEach(([property, value]) => {
            css += `    ${property}: ${value};\n`;
          });
          css += '  }\n';
        });
        
        css += '}\n\n';
      }
    });
    
    return css;
  };

  // Update element style
  const updateElementStyle = (selector, property, value) => {
    setElementStyles(prev => ({
      ...prev,
      [activeBreakpoint]: {
        ...prev[activeBreakpoint],
        [selector]: {
          ...prev[activeBreakpoint][selector],
          [property]: value
        }
      }
    }));
  };

  // Update breakpoint configuration
  const updateBreakpoint = (breakpoint, field, value) => {
    setCustomBreakpoints(prev => ({
      ...prev,
      [breakpoint]: {
        ...prev[breakpoint],
        [field]: parseInt(value) || 0
      }
    }));
  };

  // Copy CSS to clipboard
  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS());
      // Add toast notification here
    } catch (err) {
      console.error('Failed to copy CSS:', err);
    }
  };

  // Render property editor
  const renderPropertyEditor = (property) => {
    const currentValue = elementStyles[activeBreakpoint]?.[selectedElement]?.[property.name] || '';

    switch (property.type) {
      case 'number':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={currentValue.replace(property.unit, '')}
              onChange={(e) => updateElementStyle(selectedElement, property.name, e.target.value + property.unit)}
              className="flex-1 px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-sm"
              placeholder="0"
            />
            {property.unit && (
              <span className="text-xs text-gray-500 dark:text-slate-400">{property.unit}</span>
            )}
          </div>
        );

      case 'select':
        return (
          <select
            value={currentValue}
            onChange={(e) => updateElementStyle(selectedElement, property.name, e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-800"
          >
            <option value="">Default</option>
            {property.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'spacing':
        return (
          <div className="grid grid-cols-2 gap-1">
            {['top', 'right', 'bottom', 'left'].map(side => (
              <input
                key={side}
                type="number"
                placeholder={side}
                className="px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-xs"
                onChange={(e) => {
                  const value = e.target.value;
                  updateElementStyle(selectedElement, `${property.name}-${side}`, value + property.unit);
                }}
              />
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => updateElementStyle(selectedElement, property.name, e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-sm"
            placeholder="Enter value"
          />
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <MonitorIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Responsive Editor</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">Design for all screen sizes</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyCSS}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <CodeIcon className="w-4 h-4" />
              <span>Copy CSS</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <span className="text-xl text-gray-500 dark:text-slate-400">×</span>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
            {/* Breakpoint Selector */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Breakpoints</h3>
              <div className="space-y-2">
                {Object.entries(customBreakpoints).map(([key, config]) => {
                  const Icon = key === 'mobile' ? SmartphoneIcon : key === 'tablet' ? TabletIcon : MonitorIcon;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveBreakpoint(key)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        activeBreakpoint === key
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                          : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${activeBreakpoint === key ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`} />
                      <div className="flex-1 text-left">
                        <div className={`text-sm font-medium ${activeBreakpoint === key ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                          {config.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">
                          {config.min}px - {config.max === 9999 ? '∞' : config.max + 'px'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Breakpoint Configuration */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Configure {customBreakpoints[activeBreakpoint]?.name}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-slate-400 mb-1">Min Width (px)</label>
                  <input
                    type="number"
                    value={customBreakpoints[activeBreakpoint]?.min || 0}
                    onChange={(e) => updateBreakpoint(activeBreakpoint, 'min', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-slate-400 mb-1">Max Width (px)</label>
                  <input
                    type="number"
                    value={customBreakpoints[activeBreakpoint]?.max === 9999 ? '' : customBreakpoints[activeBreakpoint]?.max}
                    onChange={(e) => updateBreakpoint(activeBreakpoint, 'max', e.target.value || 9999)}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-sm"
                    placeholder="No limit"
                  />
                </div>
              </div>
            </div>

            {/* Element Selector */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Select Element</h3>
              <select
                value={selectedElement || ''}
                onChange={(e) => setSelectedElement(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-800"
              >
                <option value="">Choose element...</option>
                <option value=".container">Container</option>
                <option value=".header">Header</option>
                <option value=".navigation">Navigation</option>
                <option value=".content">Content</option>
                <option value=".sidebar">Sidebar</option>
                <option value=".footer">Footer</option>
                <option value=".button">Button</option>
                <option value=".card">Card</option>
              </select>
            </div>

            {/* Style Properties */}
            {selectedElement && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Styles for {selectedElement}
                </h3>
                <div className="space-y-3">
                  {responsiveProperties.map(property => (
                    <div key={property.name}>
                      <label className="block text-xs text-gray-600 dark:text-slate-400 mb-1 capitalize">
                        {property.name.replace('-', ' ')}
                      </label>
                      {renderPropertyEditor(property)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Area */}
          <div className="flex-1 flex flex-col">
            {/* Preview Controls */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600 dark:text-slate-400">Width:</label>
                    <input
                      type="range"
                      min="320"
                      max="1920"
                      value={previewWidth}
                      onChange={(e) => setPreviewWidth(parseInt(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-900 dark:text-white w-12">{previewWidth}px</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      showGrid ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setShowRuler(!showRuler)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      showRuler ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Ruler
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="flex-1 p-8 bg-gray-100 dark:bg-slate-800 overflow-auto">
              <div className="flex justify-center">
                <div
                  className="bg-white dark:bg-slate-900 shadow-lg relative"
                  style={{ width: `${previewWidth}px`, minHeight: '600px' }}
                >
                  {/* Ruler */}
                  {showRuler && (
                    <div className="absolute -top-6 left-0 right-0 h-6 bg-gray-200 dark:bg-slate-700 flex items-end text-xs text-gray-600 dark:text-slate-400">
                      {Array.from({ length: Math.ceil(previewWidth / 100) }, (_, i) => (
                        <div key={i} className="relative" style={{ width: '100px' }}>
                          <div className="absolute bottom-0 left-0 w-px h-3 bg-gray-400"></div>
                          <div className="absolute bottom-0 left-1 text-xs">{i * 100}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Grid */}
                  {showGrid && (
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }}
                    />
                  )}

                  {/* Sample Content */}
                  <div className="p-6">
                    <div className="container space-y-6">
                      <header className="header p-4 bg-blue-500 text-white rounded">
                        <h1 className="text-2xl font-bold">Responsive Header</h1>
                      </header>

                      <nav className="navigation p-4 bg-gray-200 dark:bg-slate-700 rounded">
                        <div className="flex space-x-4">
                          <a href="#" className="text-blue-600 dark:text-blue-400">Home</a>
                          <a href="#" className="text-gray-600 dark:text-slate-300">About</a>
                          <a href="#" className="text-gray-600 dark:text-slate-300">Contact</a>
                        </div>
                      </nav>

                      <div className="flex flex-col lg:flex-row gap-6">
                        <main className="content flex-1 p-4 bg-gray-50 dark:bg-slate-800 rounded">
                          <h2 className="text-xl font-semibold mb-4">Main Content</h2>
                          <p className="text-gray-600 dark:text-slate-400">
                            This content adapts to different screen sizes using responsive design principles.
                          </p>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="card p-4 bg-white dark:bg-slate-900 rounded shadow">
                              <h3 className="font-medium mb-2">Card 1</h3>
                              <p className="text-sm text-gray-600 dark:text-slate-400">Sample card content</p>
                            </div>
                            <div className="card p-4 bg-white dark:bg-slate-900 rounded shadow">
                              <h3 className="font-medium mb-2">Card 2</h3>
                              <p className="text-sm text-gray-600 dark:text-slate-400">Sample card content</p>
                            </div>
                          </div>
                        </main>

                        <aside className="sidebar w-full lg:w-64 p-4 bg-gray-50 dark:bg-slate-800 rounded">
                          <h3 className="font-semibold mb-4">Sidebar</h3>
                          <div className="space-y-2">
                            <div className="p-2 bg-white dark:bg-slate-900 rounded text-sm">Widget 1</div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded text-sm">Widget 2</div>
                          </div>
                        </aside>
                      </div>

                      <footer className="footer p-4 bg-gray-800 text-white rounded text-center">
                        <p>&copy; 2024 Responsive Design Demo</p>
                      </footer>
                    </div>
                  </div>

                  {/* Breakpoint Indicator */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                    {customBreakpoints[activeBreakpoint]?.name} ({previewWidth}px)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Output */}
        <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Generated CSS</h3>
            <button
              onClick={copyCSS}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Copy to clipboard
            </button>
          </div>
          <pre className="text-xs bg-white dark:bg-slate-900 p-3 rounded border overflow-x-auto max-h-32">
            <code>{generateCSS() || '/* No responsive styles defined yet */'}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveEditor;
