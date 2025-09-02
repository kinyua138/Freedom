import React, { useState, useEffect } from 'react';
import { Layers, Code, Palette, Eye, FolderIcon, SaveIcon } from 'lucide-react';
import { Canvas } from '../components/ui-builder/Canvas';
import { TemplatesPanel } from '../components/ui-builder/TemplatesPanel';
import { PropertiesPanel } from '../components/ui-builder/PropertiesPanel';
import PreviewModal from '../components/ui-builder/PreviewModal';
import ProjectManager from '../components/ProjectManager';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';

const UIBuilder = () => {
  const { currentProject, saveProject, setCurrentProject } = useProject();
  const { currentTheme, isDark } = useTheme();
  
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showPageManager, setShowPageManager] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [pages, setPages] = useState(
    currentProject?.pages || [
      {
        id: 'page-1',
        name: 'Home',
        components: [],
        isActive: true
      }
    ]
  );

  const templates = [
    // Basic UI Components
    {
      type: 'Button',
      name: 'Button',
      description: 'Clickable button element',
      icon: 'square',
      defaultProps: { text: 'Click me', visible: true, disabled: false }
    },
    {
      type: 'Text',
      name: 'Text',
      description: 'Customizable text element',
      icon: 'type',
      defaultProps: { text: 'Sample Text', tag: 'p', visible: true }
    },
    {
      type: 'Image',
      name: 'Image',
      description: 'Image with placeholder support',
      icon: 'image',
      defaultProps: { src: '', alt: 'Image', placeholder: true, visible: true }
    },
    {
      type: 'Card',
      name: 'Card',
      description: 'Content card container',
      icon: 'square',
      defaultProps: { title: 'Card Title', content: 'Card content goes here', showImage: true, visible: true }
    },
    {
      type: 'Container',
      name: 'Container',
      description: 'Layout container for components',
      icon: 'layout',
      defaultProps: { layout: 'flex', direction: 'row', justify: 'start', align: 'start', visible: true }
    },
    {
      type: 'Shape',
      name: 'Shape',
      description: 'Geometric shapes (circle, square, etc.)',
      icon: 'circle',
      defaultProps: { type: 'rectangle', size: 'medium', color: '#3B82F6', visible: true }
    },
    {
      type: 'Input',
      name: 'Input',
      description: 'Form input field with label',
      icon: 'square',
      defaultProps: { type: 'text', placeholder: 'Enter text...', label: 'Input Label', visible: true }
    },
    {
      type: 'Divider',
      name: 'Divider',
      description: 'Separator line (horizontal/vertical)',
      icon: 'minus',
      defaultProps: { orientation: 'horizontal', thickness: 'thin', color: '#E5E7EB', visible: true }
    },
    {
      type: 'Icon',
      name: 'Icon',
      description: 'Lucide React icons',
      icon: 'star',
      defaultProps: { name: 'Home', size: 'medium', color: '#374151', visible: true }
    },
    // Page Templates
    {
      type: 'LandingPage',
      name: 'Landing Page',
      description: 'Full landing page layout',
      icon: 'layout',
      defaultProps: { heroTitle: 'Build Something Amazing', visible: true }
    },
    {
      type: 'Dashboard',
      name: 'Dashboard',
      description: 'Analytics dashboard layout',
      icon: 'bar-chart',
      defaultProps: { title: 'Dashboard Overview', visible: true }
    },
    {
      type: 'Portfolio',
      name: 'Portfolio',
      description: 'Personal portfolio layout',
      icon: 'user',
      defaultProps: { name: 'John Doe', visible: true }
    },
    {
      type: 'ECommerce',
      name: 'E-Commerce',
      description: 'Product page layout',
      icon: 'shopping-cart',
      defaultProps: { productName: 'Premium Product', visible: true }
    },
    {
      type: 'Blog',
      name: 'Blog',
      description: 'Blog page layout',
      icon: 'file-text',
      defaultProps: { featuredTitle: 'Latest Article', visible: true }
    },
    {
      type: 'Auth',
      name: 'Authentication',
      description: 'Login/signup form layout',
      icon: 'user',
      defaultProps: { title: 'Welcome Back', visible: true }
    },
    {
      type: 'EmailTemplate',
      name: 'Email Template',
      description: 'Email newsletter layout',
      icon: 'mail',
      defaultProps: { headerTitle: 'Weekly Newsletter', visible: true }
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    if (currentProject && hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        handleSaveProject();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [pages, hasUnsavedChanges, currentProject]);

  // Load project data when currentProject changes
  useEffect(() => {
    if (currentProject) {
      setPages(currentProject.pages);
      setLastSaved(new Date(currentProject.metadata.updatedAt));
      setHasUnsavedChanges(false);
    }
  }, [currentProject]);

  // Mark as having unsaved changes when pages change
  useEffect(() => {
    if (currentProject) {
      setHasUnsavedChanges(true);
    }
  }, [pages]);

  // Get current active page
  const activePage = pages.find(page => page.isActive) || pages[0];
  const components = activePage?.components || [];

  // Update components for the active page
  const updatePageComponents = (newComponents) => {
    setPages(prevPages => 
      prevPages.map(page => 
        page.isActive 
          ? { ...page, components: newComponents }
          : page
      )
    );
  };

  // Project management functions
  const handleSaveProject = async () => {
    if (!currentProject) return;

    const success = saveProject(currentProject.id, {
      pages: pages,
      settings: {
        theme: currentTheme,
        responsive: true,
        animations: true
      }
    });

    if (success) {
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    }
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    setPages(project.pages);
    setSelectedComponent(null);
    setLastSaved(new Date(project.metadata.updatedAt));
    setHasUnsavedChanges(false);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Never';
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return lastSaved.toLocaleDateString();
  };

  const handleAddComponent = (component) => {
    const newComponents = [...components, component];
    updatePageComponents(newComponents);
    // Auto-select the newly added component
    setSelectedComponent({
      id: component.id,
      type: component.type,
      props: component.props
    });
  };

  const handleSelectComponent = (id) => {
    if (id === '') {
      setSelectedComponent(null);
      return;
    }

    const component = components.find(c => c.id === id);
    if (component) {
      setSelectedComponent({
        id: component.id,
        type: component.type,
        props: component.props
      });
    }
  };

  const handleUpdateProperty = (property, value) => {
    if (!selectedComponent) return;

    // Update the component in the components array
    const updatedComponents = components.map(comp => 
        comp.id === selectedComponent.id
          ? { ...comp, props: { ...comp.props, [property]: value } }
          : comp
    );
    updatePageComponents(updatedComponents);

    // Update the selected component state
    setSelectedComponent(prev => 
      prev ? { ...prev, props: { ...prev.props, [property]: value } } : null
    );
  };

  const handleUpdateStyle = (property, value) => {
    if (!selectedComponent) return;

    const updatedComponents = components.map(comp => 
        comp.id === selectedComponent.id
          ? { ...comp, style: { ...comp.style, [property]: value } }
          : comp
    );
    updatePageComponents(updatedComponents);

    setSelectedComponent(prev => 
      prev ? { ...prev, style: { ...prev.style, [property]: value } } : null
    );
  };

  const handleUpdateInteraction = (property, value) => {
    if (!selectedComponent) return;

    const updatedComponents = components.map(comp => 
        comp.id === selectedComponent.id
          ? { ...comp, interactions: { ...comp.interactions, [property]: value } }
          : comp
    );
    updatePageComponents(updatedComponents);

    setSelectedComponent(prev => 
      prev ? { ...prev, interactions: { ...prev.interactions, [property]: value } } : null
    );
  };

  const handleUpdateAccessibility = (property, value) => {
    if (!selectedComponent) return;

    const updatedComponents = components.map(comp => 
        comp.id === selectedComponent.id
          ? { ...comp, accessibility: { ...comp.accessibility, [property]: value } }
          : comp
    );
    updatePageComponents(updatedComponents);

    setSelectedComponent(prev => 
      prev ? { ...prev, accessibility: { ...prev.accessibility, [property]: value } } : null
    );
  };

  const handleUpdateComponent = (id, updates) => {
    // Handle component deletion
    if (updates === null) {
      const updatedComponents = components.filter(comp => comp.id !== id);
      updatePageComponents(updatedComponents);
      if (selectedComponent?.id === id) {
        setSelectedComponent(null);
      }
      return;
    }

    const updatedComponents = components.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
    );
    updatePageComponents(updatedComponents);

    if (selectedComponent?.id === id) {
      setSelectedComponent(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleNavigateToPage = (pageId) => {
    setPages(prevPages => 
      prevPages.map(page => ({
        ...page,
        isActive: page.id === pageId
      }))
    );
    // Clear selection when navigating to a different page
    setSelectedComponent(null);
  };
  const handleDeleteComponent = (id) => {
    const updatedComponents = components.filter(comp => comp.id !== id);
    updatePageComponents(updatedComponents);
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const handleDuplicateComponent = (component) => {
    const newComponent = {
      ...component,
      id: `${component.type}-${Date.now()}`,
      position: {
        x: component.position.x + 20,
        y: component.position.y + 20
      }
    };
    const updatedComponents = [...components, newComponent];
    updatePageComponents(updatedComponents);
    setSelectedComponent({
      id: newComponent.id,
      type: newComponent.type,
      props: newComponent.props
    });
  };

  // Handle ESC key to close preview
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showPreview) {
        setShowPreview(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showPreview]);

  // Handle component selection from file structure
  React.useEffect(() => {
    const handleSelectComponent = (e) => {
      const { id } = e.detail;
      handleSelectComponent(id);
    };

    window.addEventListener('selectComponent', handleSelectComponent);
    return () => window.removeEventListener('selectComponent', handleSelectComponent);
  }, []);

  // Clear selection when switching pages
  React.useEffect(() => {
    setSelectedComponent(null);
  }, [activePage?.id]);

  // Panel resizing handlers
  const handleLeftResizeStart = (e) => {
    e.preventDefault();
    setIsResizingLeft(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleRightResizeStart = (e) => {
    e.preventDefault();
    setIsResizingRight(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = React.useCallback((e) => {
    if (isResizingLeft) {
      const newWidth = Math.max(250, Math.min(500, e.clientX));
      setLeftPanelWidth(newWidth);
    } else if (isResizingRight) {
      const newWidth = Math.max(250, Math.min(500, window.innerWidth - e.clientX));
      setRightPanelWidth(newWidth);
    }
  }, [isResizingLeft, isResizingRight]);

  const handleMouseUp = React.useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  React.useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizingLeft, isResizingRight, handleMouseMove, handleMouseUp]);

  return (
    <>
      <div className="h-screen w-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 overflow-hidden">
        {/* Header */}
        <header className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700/50 px-6 py-4 shadow-sm transition-colors duration-200`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    UI Builder
                  </h1>
                  {currentProject && (
                    <span className="text-sm text-gray-600 dark:text-slate-400">
                      - {currentProject.name}
                    </span>
                  )}
                  {hasUnsavedChanges && (
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" title="Unsaved changes" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {currentProject ? `Last saved: ${formatLastSaved()}` : 'Design beautiful interfaces with ease'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Project Management */}
              <button
                onClick={() => setShowProjectManager(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 border border-blue-200 dark:border-blue-700 rounded-lg transition-all duration-300 group"
              >
                <FolderIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Projects</span>
              </button>

              {/* Save Button */}
              {currentProject && (
                <button
                  onClick={handleSaveProject}
                  disabled={!hasUnsavedChanges}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group ${
                    hasUnsavedChanges
                      ? 'bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 hover:from-orange-200 hover:to-yellow-200 dark:hover:from-orange-800/40 dark:hover:to-yellow-800/40 border border-orange-200 dark:border-orange-700'
                      : 'bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <SaveIcon className={`w-4 h-4 ${hasUnsavedChanges ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'} group-hover:scale-110 transition-transform duration-200`} />
                  <span className={`text-sm font-medium ${hasUnsavedChanges ? 'text-orange-700 dark:text-orange-300' : 'text-gray-500'}`}>
                    {hasUnsavedChanges ? 'Save' : 'Saved'}
                  </span>
                </button>
              )}
              
              {/* Preview Button */}
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-800/40 dark:hover:to-emerald-800/40 border border-green-200 dark:border-green-700 rounded-lg transition-all duration-300 group"
              >
                <Eye className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Preview</span>
              </button>
              
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{components.length} Components</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50">
                <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {selectedComponent ? 'Editing' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex h-[calc(100vh-81px)] w-full">
          {/* Properties Panel */}
          <div 
            className="bg-white/80 backdrop-blur-sm border-r border-gray-200/50 overflow-y-auto flex-shrink-0"
            style={{ width: leftPanelWidth }}
          >
            <PropertiesPanel 
              selectedComponent={selectedComponent}
              showPageManager={showPageManager}
              pages={pages}
              onPagesChange={setPages}
              onTogglePageManager={() => setShowPageManager(!showPageManager)}
              components={components}
              onDeleteComponent={handleDeleteComponent}
              onDuplicateComponent={handleDuplicateComponent}
              onUpdateProperty={handleUpdateProperty}
              onUpdateStyle={handleUpdateStyle}
              onUpdateInteraction={handleUpdateInteraction}
              onUpdateAccessibility={handleUpdateAccessibility}
              onNavigateToPage={handleNavigateToPage}
            />
          </div>
          
          {/* Left Resize Handle */}
          <div
            className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors duration-200 flex-shrink-0 group relative"
            onMouseDown={handleLeftResizeStart}
          >
            <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-blue-500/20 transition-colors duration-200"></div>
          </div>
          
          {/* Canvas */}
          <Canvas 
            components={components}
            onAddComponent={handleAddComponent}
            onSelectComponent={handleSelectComponent}
            onUpdateComponent={handleUpdateComponent}
            selectedComponent={selectedComponent}
            selectedComponentId={selectedComponent?.id || null}
            onNavigateToPage={handleNavigateToPage}
          />
          
          {/* Right Resize Handle */}
          <div
            className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors duration-200 flex-shrink-0 group relative"
            onMouseDown={handleRightResizeStart}
          >
            <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-blue-500/20 transition-colors duration-200"></div>
          </div>
          
          {/* Templates Panel */}
          <div 
            className="bg-white/80 backdrop-blur-sm border-l border-gray-200/50 overflow-y-auto flex-shrink-0"
            style={{ width: rightPanelWidth }}
          >
            <TemplatesPanel templates={templates} />
          </div>
        </div>
      </div>

      {/* Resize Overlay */}
      {(isResizingLeft || isResizingRight) && (
        <div className="fixed inset-0 z-50 cursor-col-resize" style={{ pointerEvents: 'none' }} />
      )}

      {/* Preview Modal */}
      <PreviewModal 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        components={components}
      />

      {/* Project Manager Modal */}
      <ProjectManager
        isOpen={showProjectManager}
        onClose={() => setShowProjectManager(false)}
        onProjectSelect={handleProjectSelect}
      />
    </>
  );
};

export default UIBuilder;