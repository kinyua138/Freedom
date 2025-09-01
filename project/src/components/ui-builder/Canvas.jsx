import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Square, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Hand, 
  Grid3X3,
  Move,
  MousePointer,
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2
} from 'lucide-react';
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

const Canvas = ({
  components,
  onAddComponent,
  onSelectComponent,
  onUpdateComponent,
  selectedComponentId,
  onNavigateToPage,
}) => {
  // Canvas state
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState('select'); // 'select', 'pan', 'zoom'
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(20);
  
  // Dragging state
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  
  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  // Resizing state
  const [resizingComponent, setResizingComponent] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // Snap guides
  const [snapGuides, setSnapGuides] = useState({ vertical: [], horizontal: [] });
  const [showSnapGuides, setShowSnapGuides] = useState(false);
  
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Snap to grid function
  const snapToGridValue = (value) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Calculate snap guides
  const calculateSnapGuides = useCallback((draggedComponentId, newX, newY) => {
    if (!snapToGrid) return { x: newX, y: newY };
    
    const otherComponents = components.filter(c => c.id !== draggedComponentId);
    const snapThreshold = 5 / (zoom / 100); // Adjust threshold based on zoom
    
    const verticalGuides = [];
    const horizontalGuides = [];
    
    // Add guides for other components
    otherComponents.forEach(comp => {
      // Vertical guides (left, center, right edges)
      verticalGuides.push(comp.position.x); // left edge
      verticalGuides.push(comp.position.x + (comp.style?.customWidth || 100) / 2); // center
      verticalGuides.push(comp.position.x + (comp.style?.customWidth || 100)); // right edge
      
      // Horizontal guides (top, center, bottom edges)
      horizontalGuides.push(comp.position.y); // top edge
      horizontalGuides.push(comp.position.y + (comp.style?.customHeight || 50) / 2); // center
      horizontalGuides.push(comp.position.y + (comp.style?.customHeight || 50)); // bottom edge
    });
    
    // Find closest snap points
    let snappedX = newX;
    let snappedY = newY;
    const activeVerticalGuides = [];
    const activeHorizontalGuides = [];
    
    // Check vertical snapping
    for (const guide of verticalGuides) {
      if (Math.abs(newX - guide) < snapThreshold) {
        snappedX = guide;
        activeVerticalGuides.push(guide);
        break;
      }
    }
    
    // Check horizontal snapping
    for (const guide of horizontalGuides) {
      if (Math.abs(newY - guide) < snapThreshold) {
        snappedY = guide;
        activeHorizontalGuides.push(guide);
        break;
      }
    }
    
    setSnapGuides({ vertical: activeVerticalGuides, horizontal: activeHorizontalGuides });
    setShowSnapGuides(activeVerticalGuides.length > 0 || activeHorizontalGuides.length > 0);
    
    return { x: snappedX, y: snappedY };
  }, [components, snapToGrid, zoom, gridSize]);

  // Zoom controls
  const handleZoom = useCallback((delta, centerPoint) => {
    const newZoom = Math.max(25, Math.min(500, zoom + delta));
    
    if (centerPoint) {
      // Zoom towards the center point
      const zoomFactor = newZoom / zoom;
      setPan(prev => ({
        x: centerPoint.x - (centerPoint.x - prev.x) * zoomFactor,
        y: centerPoint.y - (centerPoint.y - prev.y) * zoomFactor
      }));
    }
    
    setZoom(newZoom);
  }, [zoom]);

  const handleZoomIn = () => handleZoom(25);
  const handleZoomOut = () => handleZoom(-25);
  const handleResetView = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel handling
  useEffect(() => {
    const handleWheel = (e) => {
      if (!canvasContainerRef.current?.contains(e.target)) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      if (e.ctrlKey || e.metaKey) {
        // Zoom with Ctrl/Cmd + scroll
        const rect = canvasContainerRef.current.getBoundingClientRect();
        const centerPoint = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        const delta = e.deltaY > 0 ? -25 : 25;
        handleZoom(delta, centerPoint);
      } else {
        // Pan with scroll
        setPan(prev => ({
          x: prev.x - e.deltaX * 0.5,
          y: prev.y - e.deltaY * 0.5
        }));
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [handleZoom]);

  // Template drop handling
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (dragData.type === 'template') {
        const rect = canvasRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left - pan.x) / (zoom / 100);
        const canvasY = (e.clientY - rect.top - pan.y) / (zoom / 100);

        const snappedPos = snapToGridValue ? {
          x: snapToGridValue(Math.max(0, canvasX - 50)),
          y: snapToGridValue(Math.max(0, canvasY - 25))
        } : {
          x: Math.max(0, canvasX - 50),
          y: Math.max(0, canvasY - 25)
        };

        const newComponent = {
          id: `${dragData.componentType}-${Date.now()}`,
          type: dragData.componentType,
          props: getDefaultProps(dragData.componentType),
          position: snappedPos,
          style: getDefaultStyle(dragData.componentType),
          interactions: getDefaultInteractions(),
          accessibility: getDefaultAccessibility(),
          locked: false
        };

        onAddComponent(newComponent);
      }
    } catch (error) {
      console.error('Failed to parse drag data:', error);
    }
  };

  // Component dragging
  const handleComponentMouseDown = (e, component) => {
    if (e.button !== 0 || tool !== 'select' || component.locked || resizingComponent) return;
    
    // Don't start dragging if clicking on a resize handle
    if (e.target.classList.contains('resize-handle')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    onSelectComponent(component.id);
    setDraggingComponent(component.id);
    
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left - pan.x) / (zoom / 100);
    const canvasY = (e.clientY - rect.top - pan.y) / (zoom / 100);
    
    setDragOffset({
      x: canvasX - component.position.x,
      y: canvasY - component.position.y
    });
    
    setDragStartPos({ x: component.position.x, y: component.position.y });
    
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  const handleComponentMouseMove = useCallback((e) => {
    if (!draggingComponent || !canvasRef.current) return;
    
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left - pan.x) / (zoom / 100);
    const canvasY = (e.clientY - rect.top - pan.y) / (zoom / 100);
    
    const rawX = canvasX - dragOffset.x;
    const rawY = canvasY - dragOffset.y;
    
    const snappedPos = calculateSnapGuides(draggingComponent, rawX, rawY);
    
    onUpdateComponent(draggingComponent, {
      position: { x: Math.max(0, snappedPos.x), y: Math.max(0, snappedPos.y) }
    });
  }, [draggingComponent, dragOffset, pan, zoom, onUpdateComponent, calculateSnapGuides]);

  const handleComponentMouseUp = useCallback(() => {
    if (!draggingComponent) return;
    
    setDraggingComponent(null);
    setDragOffset({ x: 0, y: 0 });
    setSnapGuides({ vertical: [], horizontal: [] });
    setShowSnapGuides(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, [draggingComponent]);

  // Canvas panning
  const handleCanvasMouseDown = (e) => {
    if (e.button === 1 || tool === 'pan') { // Middle mouse or pan tool
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleCanvasMouseMove = useCallback((e) => {
    if (isPanning) {
      e.preventDefault();
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [isPanning, panStart]);

  const handleCanvasMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = tool === 'pan' ? 'grab' : '';
    }
  }, [isPanning, tool]);

  // Event listeners
  useEffect(() => {
    if (draggingComponent) {
      document.addEventListener('mousemove', handleComponentMouseMove);
      document.addEventListener('mouseup', handleComponentMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleComponentMouseMove);
        document.removeEventListener('mouseup', handleComponentMouseUp);
      };
    }
  }, [draggingComponent, handleComponentMouseMove, handleComponentMouseUp]);

  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleCanvasMouseMove);
      document.addEventListener('mouseup', handleCanvasMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleCanvasMouseMove);
        document.removeEventListener('mouseup', handleCanvasMouseUp);
      };
    }
  }, [isPanning, handleCanvasMouseMove, handleCanvasMouseUp]);

  // Component resize handles
  const ResizeHandles = ({ component }) => {
    if (selectedComponentId !== component.id || component.locked) return null;
    
    const componentWidth = component.style?.customWidth || 100;
    const componentHeight = component.style?.customHeight || 50;
    
    const handles = [
      { position: 'nw', cursor: 'nw-resize', x: -6, y: -6 },
      { position: 'ne', cursor: 'ne-resize', x: componentWidth - 6, y: -6 },
      { position: 'sw', cursor: 'sw-resize', x: -6, y: componentHeight - 6 },
      { position: 'se', cursor: 'se-resize', x: componentWidth - 6, y: componentHeight - 6 },
      { position: 'n', cursor: 'n-resize', x: componentWidth / 2 - 6, y: -6 },
      { position: 's', cursor: 's-resize', x: componentWidth / 2 - 6, y: componentHeight - 6 },
      { position: 'w', cursor: 'w-resize', x: -6, y: componentHeight / 2 - 6 },
      { position: 'e', cursor: 'e-resize', x: componentWidth - 6, y: componentHeight / 2 - 6 }
    ];
    
    return (
      <>
        {/* Selection Border */}
        <div 
          className="absolute border-2 border-blue-500 pointer-events-none rounded"
          style={{
            left: -2,
            top: -2,
            width: componentWidth + 4,
            height: componentHeight + 4,
            boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)'
          }}
        />
        
        {/* Resize Handles */}
        {handles.map(handle => (
          <div
            key={handle.position}
            className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm shadow-lg hover:bg-blue-50 hover:border-blue-600 transition-all duration-200 hover:scale-125"
            style={{
              left: handle.x,
              top: handle.y,
              cursor: handle.cursor,
              zIndex: 1001
            }}
            onMouseDown={(e) => handleResizeStart(e, component, handle.position)}
          />
        ))}
      </>
    );
  };

  const handleResizeStart = (e, component, handle) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent component dragging when resizing
    e.nativeEvent.stopImmediatePropagation();
    
    setResizingComponent(component.id);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: component.style?.customWidth || 100,
      height: component.style?.customHeight || 50
    });
    
    document.body.style.cursor = `${handle}-resize`;
    document.body.style.userSelect = 'none';
    
    // Add visual feedback
    document.body.classList.add('resizing');
  };

  const handleResizeMove = useCallback((e) => {
    if (!resizingComponent || !resizeHandle) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    // Apply scaling factor for more precise control
    const scaleFactor = 1;
    const adjustedDeltaX = deltaX * scaleFactor;
    const adjustedDeltaY = deltaY * scaleFactor;
    
    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    let newX = undefined;
    let newY = undefined;
    
    const component = components.find(c => c.id === resizingComponent);
    if (!component) return;
    
    // Minimum size constraints
    const minWidth = 30;
    const minHeight = 20;
    
    // Calculate new dimensions based on handle
    switch (resizeHandle) {
      case 'se': // Southeast
        newWidth = Math.max(minWidth, resizeStart.width + adjustedDeltaX);
        newHeight = Math.max(minHeight, resizeStart.height + adjustedDeltaY);
        break;
      case 'sw': // Southwest
        newWidth = Math.max(minWidth, resizeStart.width - adjustedDeltaX);
        newHeight = Math.max(minHeight, resizeStart.height + adjustedDeltaY);
        newX = component.position.x + (resizeStart.width - newWidth);
        break;
      case 'ne': // Northeast
        newWidth = Math.max(minWidth, resizeStart.width + adjustedDeltaX);
        newHeight = Math.max(minHeight, resizeStart.height - adjustedDeltaY);
        newY = component.position.y + (resizeStart.height - newHeight);
        break;
      case 'nw': // Northwest
        newWidth = Math.max(minWidth, resizeStart.width - adjustedDeltaX);
        newHeight = Math.max(minHeight, resizeStart.height - adjustedDeltaY);
        newX = component.position.x + (resizeStart.width - newWidth);
        newY = component.position.y + (resizeStart.height - newHeight);
        break;
      case 'n': // North
        newHeight = Math.max(minHeight, resizeStart.height - adjustedDeltaY);
        newY = component.position.y + (resizeStart.height - newHeight);
        break;
      case 's': // South
        newHeight = Math.max(minHeight, resizeStart.height + adjustedDeltaY);
        break;
      case 'w': // West
        newWidth = Math.max(minWidth, resizeStart.width - adjustedDeltaX);
        newX = component.position.x + (resizeStart.width - newWidth);
        break;
      case 'e': // East
        newWidth = Math.max(minWidth, resizeStart.width + adjustedDeltaX);
        break;
    }
    
    // Apply snap to grid
    if (snapToGrid) {
      newWidth = snapToGridValue(newWidth);
      newHeight = snapToGridValue(newHeight);
      if (newX !== undefined) newX = snapToGridValue(newX);
      if (newY !== undefined) newY = snapToGridValue(newY);
    }
    
    const updates = {
      style: {
        ...component.style,
        customWidth: newWidth,
        customHeight: newHeight
      }
    };
    
    if (newX !== undefined || newY !== undefined) {
      updates.position = {
        x: newX !== undefined ? newX : component.position.x,
        y: newY !== undefined ? newY : component.position.y
      };
    }
    
    onUpdateComponent(resizingComponent, updates);
  }, [resizingComponent, resizeHandle, resizeStart, components, onUpdateComponent, snapToGrid, snapToGridValue]);

  const handleResizeEnd = useCallback(() => {
    setResizingComponent(null);
    setResizeHandle(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.body.classList.remove('resizing');
  }, []);

  useEffect(() => {
    if (resizingComponent) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingComponent, handleResizeMove, handleResizeEnd]);

  // Default props and styles
  const getDefaultProps = (componentType) => {
    switch (componentType) {
      case 'Button':
        return { text: 'New Button', visible: true, disabled: false };
      case 'Text':
        return { text: 'Sample Text', tag: 'p', visible: true };
      case 'Image':
        return { src: '', alt: 'Image', placeholder: true, visible: true };
      case 'Card':
        return { title: 'Card Title', content: 'Card content goes here', showImage: true, visible: true };
      case 'Container':
        return { layout: 'flex', direction: 'row', justify: 'start', align: 'start', visible: true };
      case 'Shape':
        return { type: 'rectangle', size: 'medium', color: 'transparent', visible: true };
      case 'Input':
        return { type: 'text', placeholder: 'Enter text...', label: 'Input Label', visible: true };
      case 'Divider':
        return { orientation: 'horizontal', thickness: 'thin', color: '#E5E7EB', visible: true };
      case 'Icon':
        return { name: 'Home', size: 'medium', color: '#374151', visible: true };
      case 'LandingPage':
        return { heroTitle: 'Build Something Amazing', visible: true };
      case 'Dashboard':
        return { title: 'Dashboard Overview', visible: true };
      case 'Portfolio':
        return { name: 'John Doe', visible: true };
      case 'ECommerce':
        return { productName: 'Premium Product', visible: true };
      case 'Blog':
        return { featuredTitle: 'Latest Article', visible: true };
      case 'Auth':
        return { title: 'Welcome Back', visible: true };
      case 'EmailTemplate':
        return { headerTitle: 'Weekly Newsletter', visible: true };
      default:
        return { visible: true };
    }
  };

  const getDefaultStyle = (componentType) => {
    const baseStyle = {
      backgroundColor: componentType === 'Shape' ? 'transparent' : '#3B82F6',
      textColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      fontFamily: 'Inter',
      fontSize: 'base',
      fontWeight: 'medium',
      textAlign: 'center',
      borderWidth: componentType === 'Shape' ? 2 : 0,
      borderStyle: 'solid',
      borderRadius: 'lg',
      boxShadow: 'md',
      opacity: 100,
      customWidth: componentType === 'Shape' ? 100 : null,
      customHeight: componentType === 'Shape' ? 100 : null,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      padding: { top: 12, right: 24, bottom: 12, left: 24 },
      rotate: 0,
      scale: 100
    };

    switch (componentType) {
      case 'Text':
        return { ...baseStyle, backgroundColor: 'transparent', textColor: '#374151' };
      case 'Image':
        return { ...baseStyle, backgroundColor: 'transparent', padding: { top: 0, right: 0, bottom: 0, left: 0 }, customWidth: 200, customHeight: 150 };
      case 'Card':
        return { ...baseStyle, backgroundColor: '#FFFFFF', textColor: '#374151', customWidth: 300, customHeight: 200 };
      case 'Container':
        return { ...baseStyle, backgroundColor: 'transparent', borderWidth: 2, borderColor: '#D1D5DB', customWidth: 400, customHeight: 200 };
      case 'Shape':
        return { ...baseStyle, backgroundColor: 'transparent', borderColor: '#9CA3AF', customWidth: 100, customHeight: 100 };
      case 'Input':
        return { ...baseStyle, backgroundColor: '#FFFFFF', textColor: '#374151', customWidth: 250, customHeight: 50 };
      case 'Divider':
        return { ...baseStyle, backgroundColor: '#E5E7EB', padding: { top: 0, right: 0, bottom: 0, left: 0 }, customWidth: 200, customHeight: 2 };
      case 'Icon':
        return { ...baseStyle, backgroundColor: 'transparent', padding: { top: 8, right: 8, bottom: 8, left: 8 }, customWidth: 40, customHeight: 40 };
      default:
        return baseStyle;
    }
  };

  const getDefaultInteractions = () => ({
    onClick: { action: 'none', value: '' },
    hoverAnimation: 'scale'
  });

  const getDefaultAccessibility = () => ({
    ariaLabel: '',
    tabIndex: 0
  });

  const getStyleClasses = (component) => {
    const { style } = component;
    const classes = [];

    if (style.fontSize) classes.push(`text-${style.fontSize}`);
    if (style.fontWeight) classes.push(`font-${style.fontWeight}`);
    if (style.textAlign) classes.push(`text-${style.textAlign}`);
    if (style.borderRadius) classes.push(`rounded-${style.borderRadius}`);
    if (style.boxShadow && style.boxShadow !== 'none') classes.push(`shadow-${style.boxShadow}`);

    if (component.interactions?.hoverAnimation && !draggingComponent) {
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

  const handleComponentClick = (component) => {
    if (component.interactions?.onClick?.action === 'alert' && component.interactions.onClick.value) {
      alert(component.interactions.onClick.value);
    } else if (component.interactions?.onClick?.action === 'navigate' && component.interactions.onClick.value) {
      // Find the target page and switch to it
      const targetPageId = component.interactions.onClick.value;
      onNavigateToPage(targetPageId);
    }
  };

  const toggleComponentLock = (componentId) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      onUpdateComponent(componentId, { locked: !component.locked });
    }
  };

  const handleDeleteComponent = (componentId) => {
    // Remove the component from the components array
    const updatedComponents = components.filter(c => c.id !== componentId);
    
    // Update the components list
    onUpdateComponent(componentId, null); // This will trigger removal in parent
    
    // Clear selection if the deleted component was selected
    if (selectedComponentId === componentId) {
      onSelectComponent('');
    }
  };

  const renderComponent = (component) => {
    const isSelected = selectedComponentId === component.id;
    const isVisible = component.props.visible !== false;
    const isDragging = draggingComponent === component.id;
    
    if (!isVisible) return null;
    
    return (
      <div
        key={component.id}
        className={`absolute select-none transition-all duration-200 ${
          isSelected 
            ? 'z-20' 
            : 'hover:ring-1 hover:ring-blue-400 hover:ring-offset-1 z-10'
        } ${
          tool === 'select' && !component.locked 
            ? 'cursor-move hover:cursor-move' 
            : tool === 'pan' 
              ? 'cursor-grab' 
              : 'cursor-default'
        }`}
        style={{
          left: component.position.x,
          top: component.position.y,
          opacity: isDragging ? 0.7 : 1,
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          userSelect: 'none',
          pointerEvents: tool === 'pan' ? 'none' : 'auto',
          ...getInlineStyles(component)
        }}
        onMouseDown={tool === 'select' && !component.locked && !resizingComponent ? (e) => handleComponentMouseDown(e, component) : undefined}
        onClick={tool === 'select' ? (e) => {
          e.stopPropagation();
          if (!draggingComponent && !isPanning && !resizingComponent) {
            onSelectComponent(component.id);
            handleComponentClick(component);
          }
        } : undefined}
        aria-label={component.accessibility?.ariaLabel}
        tabIndex={component.accessibility?.tabIndex}
      >
        {/* Component Content */}
        <div className="w-full h-full overflow-hidden">
          {(() => {
            switch (component.type) {
              case 'Button':
                return (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-medium text-center px-4 py-2">
                      {component.props.text}
                    </span>
                  </div>
                );
              case 'Text':
                return (
                  <div className="w-full h-full flex items-center">
                    <span className="w-full">
                      {component.props.text}
                    </span>
                  </div>
                );
              case 'Image':
                return (
                  <Image
                    src={component.props.src}
                    alt={component.props.alt}
                    placeholder={component.props.placeholder}
                    className="w-full h-full object-cover"
                  />
                );
              case 'Card':
                return (
                  <Card
                    title={component.props.title}
                    content={component.props.content}
                    imageUrl={component.props.imageUrl}
                    showImage={component.props.showImage}
                    className="w-full h-full"
                  />
                );
              case 'Container':
                return (
                  <Container
                    layout={component.props.layout}
                    direction={component.props.direction}
                    justify={component.props.justify}
                    align={component.props.align}
                    gap={component.props.gap}
                    className="w-full h-full"
                  />
                );
              case 'Shape':
                return (
                  <div className="w-full h-full">
                    <Shape
                      type={component.props.type}
                      size="custom"
                      color={component.props.color}
                      className="w-full h-full"
                    />
                  </div>
                );
              case 'Input':
                return (
                  <Input
                    type={component.props.type}
                    placeholder={component.props.placeholder}
                    label={component.props.label}
                    value={component.props.value}
                    required={component.props.required}
                    disabled={component.props.disabled}
                    className="w-full h-full"
                  />
                );
              case 'Divider':
                return (
                  <Divider
                    orientation={component.props.orientation}
                    thickness={component.props.thickness}
                    color={component.props.color}
                    style={component.props.dividerStyle}
                    className="w-full h-full"
                  />
                );
              case 'Icon':
                return (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      name={component.props.name}
                      size="custom"
                      color={component.props.color}
                      className="w-8 h-8"
                    />
                  </div>
                );
              case 'LandingPage':
                return <LandingPage {...component.props} className="w-full h-full scale-50 origin-top-left" />;
              case 'Dashboard':
                return <Dashboard {...component.props} className="w-full h-full scale-50 origin-top-left" />;
              case 'Portfolio':
                return <Portfolio {...component.props} className="w-full h-full scale-50 origin-top-left" />;
              case 'ECommerce':
                return <ECommerce {...component.props} className="w-full h-full scale-50 origin-top-left" />;
              case 'Blog':
                return <Blog {...component.props} className="w-full h-full scale-50 origin-top-left" />;
              case 'Auth':
                return <Auth {...component.props} className="w-full h-full scale-50 origin-top-left" />;
              case 'EmailTemplate':
                return <EmailTemplate {...component.props} className="w-full h-full scale-50 origin-top-left" />;
              default:
                return null;
            }
          })()}
        </div>
        
        {/* Lock indicator */}
        {component.locked && (
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-50">
            <Lock className="w-3 h-3 text-white" />
          </div>
        )}
        
        {/* Resize handles */}
        <ResizeHandles component={component} />
      </div>
    );
  };

  return (
    <div 
      ref={canvasContainerRef}
      className="flex-1 relative overflow-hidden bg-gray-900 canvas-container"
    >
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-50 flex flex-col space-y-2">
        {/* Tool Selection */}
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl p-2 shadow-lg">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setTool('select')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                tool === 'select' 
                  ? 'bg-purple-100 text-purple-600 shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Select Tool"
            >
              <MousePointer className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setTool('pan')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                tool === 'pan' 
                  ? 'bg-blue-100 text-blue-600 shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Pan Tool"
            >
              <Hand className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl p-2 shadow-lg">
          <div className="flex items-center space-x-1">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-gray-600" />
            </button>
            
            <div className="px-3 py-1 text-sm font-medium text-gray-700 min-w-[60px] text-center">
              {zoom}%
            </div>
            
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-gray-600" />
            </button>
            
            <button
              onClick={handleResetView}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Canvas Options */}
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl p-2 shadow-lg">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                showGrid 
                  ? 'bg-green-100 text-green-600 shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Toggle Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                snapToGrid 
                  ? 'bg-orange-100 text-orange-600 shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Toggle Snap to Grid"
            >
              <Move className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div 
        ref={canvasRef}
        className={`w-full h-full relative transition-none ${
          isDragOver 
            ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20' 
            : 'bg-gray-800'
        } ${
          tool === 'pan' ? 'cursor-grab' : tool === 'select' ? 'cursor-default' : 'cursor-crosshair'
        } ${isPanning ? 'cursor-grabbing' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseDown={handleCanvasMouseDown}
        onClick={(e) => {
          if (!isPanning && !draggingComponent && !resizingComponent && tool === 'select') {
            onSelectComponent('');
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault();
            handleDeleteComponent(component.id);
          }
        }}
        style={{
          transform: `scale(${zoom / 100}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {/* Infinite Grid Background */}
        {showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${gridSize}px ${gridSize}px`,
              backgroundPosition: `${pan.x % gridSize}px ${pan.y % gridSize}px`
            }}
          />
        )}
        
        {/* Canvas Work Area */}
        <div className="absolute bg-white shadow-2xl rounded-lg" style={{
          left: 100,
          top: 100,
          width: 1200,
          height: 800,
          minWidth: 800,
          minHeight: 600
        }}>
          {/* Work Area Grid */}
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: `${gridSize}px ${gridSize}px`
              }}
            />
          )}
          
          {/* Drop Zone Indicator */}
          {isDragOver && (
            <div className="absolute inset-4 border-2 border-dashed border-purple-400 bg-purple-50/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Square className="w-12 h-12 text-purple-600 mx-auto mb-2 animate-bounce" />
                <p className="text-purple-700 font-medium">Drop Component Here</p>
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {components.length === 0 && !isDragOver && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <Square className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Start Building</h3>
                <p className="text-gray-500 max-w-md leading-relaxed">
                  Drag components from the Templates panel to begin creating your interface
                </p>
              </div>
            </div>
          )}

          {/* Components Layer */}
          <div className="relative w-full h-full">
            {components.map(renderComponent)}
          </div>
        </div>

        {/* Snap Guides */}
        {showSnapGuides && (
          <>
            {snapGuides.vertical.map((x, index) => (
              <div
                key={`v-${index}`}
                className="absolute bg-purple-500 pointer-events-none z-30"
                style={{
                  left: x + 100,
                  top: 0,
                  width: 1,
                  height: '100%',
                  opacity: 0.8
                }}
              />
            ))}
            {snapGuides.horizontal.map((y, index) => (
              <div
                key={`h-${index}`}
                className="absolute bg-purple-500 pointer-events-none z-30"
                style={{
                  left: 0,
                  top: y + 100,
                  width: '100%',
                  height: 1,
                  opacity: 0.8
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Canvas Info Panel */}
      <div className="absolute bottom-4 left-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-2 shadow-lg">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Zoom: {zoom}%</span>
            <span>Pan: {Math.round(pan.x)}, {Math.round(pan.y)}</span>
            <span>Components: {components.length}</span>
            <span className="flex items-center space-x-1">
              <span>Tool:</span>
              <span className={`font-medium ${
                tool === 'select' ? 'text-purple-600' : 
                tool === 'pan' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {tool === 'select' ? 'Select' : tool === 'pan' ? 'Pan' : 'Zoom'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Component Actions (for selected component) */}
      {selectedComponentId && (
        <div className="absolute bottom-4 right-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl p-2 shadow-lg">
            <div className="flex items-center space-x-1">
              {(() => {
                const component = components.find(c => c.id === selectedComponentId);
                return component ? (
                  <>
                    <button
                      onClick={() => toggleComponentLock(selectedComponentId)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        component.locked 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600'
                      }`}
                      title={component.locked ? 'Unlock Component' : 'Lock Component'}
                    >
                      {component.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteComponent(selectedComponentId)}
                      className="p-2 rounded-lg transition-all duration-200 bg-red-100 text-red-600 hover:bg-red-200"
                      title="Delete Component"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
export { Canvas };