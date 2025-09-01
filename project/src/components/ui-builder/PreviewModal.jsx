import React, { useState } from 'react';
import { X, Monitor, Smartphone, Tablet, Eye, RotateCcw } from 'lucide-react';
import Button from './Button';
import Text from './components/Text';
import Image from './components/Image';
import Card from './components/Card';
import Container from './components/Container';
import Shape from './components/Shape';
import Input from './components/Input';
import Divider from './components/Divider';
import Icon from './components/Icon';
import LandingPage from './templates/LandingPage';
import Dashboard from './templates/Dashboard';
import Portfolio from './templates/Portfolio';
import ECommerce from './templates/ECommerce';
import Blog from './templates/Blog';
import Auth from './templates/Auth';
import EmailTemplate from './templates/EmailTemplate';

const PreviewModal = ({ isOpen, onClose, components }) => {
  const [viewMode, setViewMode] = useState('desktop');
  const [orientation, setOrientation] = useState('portrait');

  if (!isOpen) return null;

  const viewModes = {
    mobile: { width: 375, height: 667, name: 'Mobile' },
    tablet: { width: 768, height: 1024, name: 'Tablet' },
    desktop: { width: 1200, height: 800, name: 'Desktop' }
  };

  const currentView = viewModes[viewMode];
  const isLandscape = orientation === 'landscape';
  const previewWidth = isLandscape ? currentView.height : currentView.width;
  const previewHeight = isLandscape ? currentView.width : currentView.height;

  const getStyleClasses = (component) => {
    const { style } = component;
    const classes = [];

    if (style.fontSize) classes.push(`text-${style.fontSize}`);
    if (style.fontWeight) classes.push(`font-${style.fontWeight}`);
    if (style.textAlign) classes.push(`text-${style.textAlign}`);
    if (style.borderRadius) classes.push(`rounded-${style.borderRadius}`);
    if (style.boxShadow && style.boxShadow !== 'none') classes.push(`shadow-${style.boxShadow}`);

    if (component.interactions?.hoverAnimation) {
      switch (component.interactions.hoverAnimation) {
        case 'scale':
          classes.push('hover:scale-105');
          break;
        case 'bounce':
          classes.push('hover:animate-bounce');
          break;
        case 'pulse':
          classes.push('hover:animate-pulse');
          break;
        case 'glow':
          classes.push('hover:shadow-xl');
          break;
      }
    }

    return classes.join(' ');
  };

  const getInlineStyles = (component) => {
    const { style } = component;
    const styles = {};

    if (style.customWidth) styles.width = `${style.customWidth}px`;
    if (style.customHeight) styles.height = `${style.customHeight}px`;
    if (style.backgroundColor && style.backgroundColor !== 'transparent') {
      styles.backgroundColor = style.backgroundColor;
    }
    if (style.textColor) styles.color = style.textColor;
    if (style.borderColor && style.borderWidth > 0) {
      styles.borderColor = style.borderColor;
      styles.borderWidth = `${style.borderWidth}px`;
      styles.borderStyle = style.borderStyle;
    }
    if (style.opacity < 100) styles.opacity = style.opacity / 100;
    
    const transforms = [];
    if (style.rotate !== 0) transforms.push(`rotate(${style.rotate}deg)`);
    if (style.scale !== 100) transforms.push(`scale(${style.scale / 100})`);
    if (transforms.length > 0) styles.transform = transforms.join(' ');

    if (style.margin) {
      styles.marginTop = `${style.margin.top}px`;
      styles.marginRight = `${style.margin.right}px`;
      styles.marginBottom = `${style.margin.bottom}px`;
      styles.marginLeft = `${style.margin.left}px`;
    }
    if (style.padding) {
      styles.paddingTop = `${style.padding.top}px`;
      styles.paddingRight = `${style.padding.right}px`;
      styles.paddingBottom = `${style.padding.bottom}px`;
      styles.paddingLeft = `${style.padding.left}px`;
    }

    return styles;
  };

  const renderComponent = (component) => {
    const isVisible = component.props.visible !== false;
    
    if (!isVisible) return null;
    
    const commonProps = {
      key: component.id,
      className: `absolute ${getStyleClasses(component)}`,
      style: {
        left: component.position.x,
        top: component.position.y,
        ...getInlineStyles(component)
      }
    };
    
    switch (component.type) {
      case 'Button':
        return (
          <div {...commonProps}>
            <Button
              text={component.props.text}
              disabled={component.props.disabled}
              className={getStyleClasses(component)}
              style={getInlineStyles(component)}
            />
          </div>
        );
      case 'Text':
        return (
          <div {...commonProps}>
            <Text
              text={component.props.text}
              tag={component.props.tag}
              className={getStyleClasses(component)}
              style={getInlineStyles(component)}
            />
          </div>
        );
      case 'Image':
        return (
          <div {...commonProps}>
            <Image
              src={component.props.src}
              alt={component.props.alt}
              placeholder={component.props.placeholder}
              className={getStyleClasses(component)}
              style={getInlineStyles(component)}
            />
          </div>
        );
      case 'Card':
        return (
          <div {...commonProps}>
            <Card
              title={component.props.title}
              content={component.props.content}
              imageUrl={component.props.imageUrl}
              showImage={component.props.showImage}
              className={getStyleClasses(component)}
              style={getInlineStyles(component)}
            />
          </div>
        );
      case 'Container':
        return (
          <div {...commonProps}>
            <Container
              layout={component.props.layout}
              direction={component.props.direction}
              justify={component.props.justify}
              align={component.props.align}
              gap={component.props.gap}
              className={getStyleClasses(component)}
              style={getInlineStyles(component)}
            />
          </div>
        );
      case 'Shape':
        return (
          <div {...commonProps}>
            <Shape
              type={component.props.type}
              size={component.props.size}
              color={component.props.color}
              className={getStyleClasses(component)}
              style={getInlineStyles(component)}
            />
          </div>
        );
      case 'Input':
        return (
          <div {...commonProps}>
            <Input
              type={component.props.type}
              placeholder={component.props.placeholder}
              label={component.props.label}
              value={component.props.value}
              required={component.props.required}
              disabled={component.props.disabled}
              className={getStyleClasses(component)}
              style={getInlineStyles(component)}
            />
          </div>
        );
      case 'Divider':
        return (
          <div 
            {...commonProps}
            style={{
              ...commonProps.style,
              width: component.props.orientation === 'horizontal' ? '200px' : '2px',
              height: component.props.orientation === 'horizontal' ? '2px' : '100px'
            }}
          >
            <Divider
              orientation={component.props.orientation}
              thickness={component.props.thickness}
              color={component.props.color}
              className={getStyleClasses(component)}
              style={getInlineStyles(component)}
            />
          </div>
        );
      case 'Icon':
        return (
          <div {...commonProps}>
            <Icon
              name={component.props.name}
              size={component.props.size}
              color={component.props.color}
              className={getStyleClasses(component)}
              style={getInlineStyles(component)}
            />
          </div>
        );
      case 'LandingPage':
        return (
          <div 
            {...commonProps}
            style={{
              ...commonProps.style,
              transform: 'scale(1)',
              transformOrigin: 'top left'
            }}
          >
            <LandingPage {...component.props} />
          </div>
        );
      case 'Dashboard':
        return (
          <div 
            {...commonProps}
            style={{
              ...commonProps.style,
              transform: 'scale(1)',
              transformOrigin: 'top left'
            }}
          >
            <Dashboard {...component.props} />
          </div>
        );
      case 'Portfolio':
        return (
          <div 
            {...commonProps}
            style={{
              ...commonProps.style,
              transform: 'scale(1)',
              transformOrigin: 'top left'
            }}
          >
            <Portfolio {...component.props} />
          </div>
        );
      case 'ECommerce':
        return (
          <div 
            {...commonProps}
            style={{
              ...commonProps.style,
              transform: 'scale(1)',
              transformOrigin: 'top left'
            }}
          >
            <ECommerce {...component.props} />
          </div>
        );
      case 'Blog':
        return (
          <div 
            {...commonProps}
            style={{
              ...commonProps.style,
              transform: 'scale(1)',
              transformOrigin: 'top left'
            }}
          >
            <Blog {...component.props} />
          </div>
        );
      case 'Auth':
        return (
          <div 
            {...commonProps}
            style={{
              ...commonProps.style,
              transform: 'scale(1)',
              transformOrigin: 'top left'
            }}
          >
            <Auth {...component.props} />
          </div>
        );
      case 'EmailTemplate':
        return (
          <div 
            {...commonProps}
            style={{
              ...commonProps.style,
              transform: 'scale(1)',
              transformOrigin: 'top left'
            }}
          >
            <EmailTemplate {...component.props} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        {/* Preview Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Preview</h2>
              </div>

              {/* Device Controls */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    viewMode === 'mobile' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm font-medium">Mobile</span>
                </button>
                
                <button
                  onClick={() => setViewMode('tablet')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    viewMode === 'tablet' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                  <span className="text-sm font-medium">Tablet</span>
                </button>
                
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    viewMode === 'desktop' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm font-medium">Desktop</span>
                </button>
              </div>

              {/* Orientation Toggle (for mobile/tablet) */}
              {(viewMode === 'mobile' || viewMode === 'tablet') && (
                <button
                  onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  title="Rotate Device"
                >
                  <RotateCcw className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 capitalize">{orientation}</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Device Info */}
              <div className="text-sm text-gray-600">
                {previewWidth} × {previewHeight}px
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-8 overflow-auto">
          <div 
            className="bg-white rounded-2xl shadow-2xl overflow-hidden relative"
            style={{
              width: previewWidth,
              height: previewHeight,
              maxWidth: '90vw',
              maxHeight: '80vh'
            }}
          >
            {/* Device Frame (for mobile/tablet) */}
            {viewMode !== 'desktop' && (
              <>
                {/* Status Bar (mobile only) */}
                {viewMode === 'mobile' && (
                  <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 border border-white rounded-sm">
                        <div className="w-3 h-1 bg-white rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Home Indicator (mobile only) */}
                {viewMode === 'mobile' && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-30"></div>
                )}
              </>
            )}

            {/* Preview Viewport */}
            <div 
              className="relative overflow-auto bg-gradient-to-br from-gray-50 to-gray-100"
              style={{
                height: viewMode === 'mobile' ? 'calc(100% - 28px)' : '100%',
                width: '100%'
              }}
            >
              {/* Render Components */}
              <div className="relative w-full h-full min-h-full">
                {components.map(renderComponent)}
                
                {/* Empty State */}
                {components.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
                        <Eye className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No Components</h3>
                      <p className="text-gray-400 text-sm max-w-xs">
                        Add some components to see them in preview
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Footer */}
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/50 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Viewing: {currentView.name}</span>
              <span>•</span>
              <span>{components.length} components</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;