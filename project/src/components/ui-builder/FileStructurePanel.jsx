import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  ChevronDown,
  Plus,
  Copy,
  Move,
  Layers,
  Square,
  Type,
  Image,
  Circle,
  Layout,
  Minus,
  Star,
  BarChart3,
  User,
  ShoppingCart,
  FileText,
  Mail
} from 'lucide-react';

const FileStructurePanel = ({ 
  components, 
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent 
}) => {
  const [expandedFolders, setExpandedFolders] = useState({
    'ui-components': true,
    'templates': true,
    'shapes': true
  });
  const [editingComponent, setEditingComponent] = useState(null);
  const [editingName, setEditingName] = useState('');

  const getComponentIcon = (type) => {
    const iconMap = {
      Button: Square,
      Text: Type,
      Image: Image,
      Card: Square,
      Container: Layout,
      Shape: Circle,
      Input: Square,
      Divider: Minus,
      Icon: Star,
      LandingPage: Layout,
      Dashboard: BarChart3,
      Portfolio: User,
      ECommerce: ShoppingCart,
      Blog: FileText,
      Auth: User,
      EmailTemplate: Mail
    };
    return iconMap[type] || File;
  };

  const getComponentCategory = (type) => {
    const templates = ['LandingPage', 'Dashboard', 'Portfolio', 'ECommerce', 'Blog', 'Auth', 'EmailTemplate'];
    const shapes = ['Shape', 'Divider', 'Icon'];
    
    if (templates.includes(type)) return 'templates';
    if (shapes.includes(type)) return 'shapes';
    return 'ui-components';
  };

  const categorizeComponents = () => {
    const categories = {
      'ui-components': { name: 'UI Components', components: [] },
      'templates': { name: 'Page Templates', components: [] },
      'shapes': { name: 'Shapes & Elements', components: [] }
    };

    components.forEach(component => {
      const category = getComponentCategory(component.type);
      categories[category].components.push(component);
    });

    return categories;
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleStartEdit = (component) => {
    setEditingComponent(component.id);
    setEditingName(component.props.text || component.props.title || component.props.name || component.type);
  };

  const handleSaveEdit = () => {
    if (editingName.trim() && editingComponent) {
      const component = components.find(c => c.id === editingComponent);
      if (component) {
        // Update the appropriate property based on component type
        if (component.props.text !== undefined) {
          onUpdateComponent(editingComponent, { props: { ...component.props, text: editingName.trim() } });
        } else if (component.props.title !== undefined) {
          onUpdateComponent(editingComponent, { props: { ...component.props, title: editingName.trim() } });
        } else if (component.props.name !== undefined) {
          onUpdateComponent(editingComponent, { props: { ...component.props, name: editingName.trim() } });
        }
      }
    }
    setEditingComponent(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingComponent(null);
    setEditingName('');
  };

  const handleToggleVisibility = (componentId) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      onUpdateComponent(componentId, { 
        props: { ...component.props, visible: !component.props.visible } 
      });
    }
  };

  const handleToggleLock = (componentId) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      onUpdateComponent(componentId, { locked: !component.locked });
    }
  };

  const handleDuplicate = (componentId) => {
    const component = components.find(c => c.id === componentId);
    if (component && onDuplicateComponent) {
      onDuplicateComponent(component);
    }
  };

  const getComponentDisplayName = (component) => {
    return component.props.text || 
           component.props.title || 
           component.props.name || 
           component.type;
  };

  const categorizedComponents = categorizeComponents();

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">File Structure</h2>
        </div>
        <p className="text-sm text-gray-600">Manage your components and layers</p>
      </div>

      {/* Component Count */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-800">Total Components</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">{components.length}</span>
        </div>
      </div>

      {/* File Structure */}
      <div className="space-y-2">
        {Object.entries(categorizedComponents).map(([categoryId, category]) => {
          const isExpanded = expandedFolders[categoryId];
          const hasComponents = category.components.length > 0;
          
          return (
            <div key={categoryId} className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl overflow-hidden">
              {/* Folder Header */}
              <button
                onClick={() => toggleFolder(categoryId)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  {isExpanded ? (
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Folder className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="font-medium text-gray-800">{category.name}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {category.components.length}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Folder Contents */}
              {isExpanded && (
                <div className="border-t border-gray-200/50">
                  {hasComponents ? (
                    <div className="p-2 space-y-1">
                      {category.components.map((component) => {
                        const Icon = getComponentIcon(component.type);
                        const isSelected = selectedComponentId === component.id;
                        const isEditing = editingComponent === component.id;
                        const isVisible = component.props.visible !== false;
                        const isLocked = component.locked;
                        
                        return (
                          <div
                            key={component.id}
                            className={`group relative flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 ${
                              isSelected 
                                ? 'bg-purple-100 border border-purple-300 shadow-sm' 
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            {/* Component Icon */}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                              isSelected 
                                ? 'bg-purple-200' 
                                : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                              <Icon className={`w-4 h-4 ${
                                isSelected ? 'text-purple-600' : 'text-gray-600'
                              }`} />
                            </div>

                            {/* Component Name */}
                            <div className="flex-1 min-w-0">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit();
                                    if (e.key === 'Escape') handleCancelEdit();
                                  }}
                                  onBlur={handleSaveEdit}
                                  className="w-full px-2 py-1 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  autoFocus
                                />
                              ) : (
                                <div
                                  onClick={() => onSelectComponent(component.id)}
                                  className="cursor-pointer"
                                >
                                  <p className={`text-sm font-medium truncate ${
                                    isSelected ? 'text-purple-700' : 'text-gray-800'
                                  }`}>
                                    {getComponentDisplayName(component)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {component.type} • {Math.round(component.position.x)}, {Math.round(component.position.y)}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Component Actions */}
                            <div className="flex items-center space-x-1">
                              {/* Visibility Toggle */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleVisibility(component.id);
                                }}
                                className={`p-1.5 rounded transition-all duration-200 ${
                                  isVisible 
                                    ? 'text-green-600 hover:bg-green-50' 
                                    : 'text-gray-400 hover:bg-gray-100'
                                }`}
                                title={isVisible ? 'Hide Component' : 'Show Component'}
                              >
                                {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>

                              {/* Lock Toggle */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleLock(component.id);
                                }}
                                className={`p-1.5 rounded transition-all duration-200 ${
                                  isLocked 
                                    ? 'text-red-600 hover:bg-red-50' 
                                    : 'text-gray-400 hover:bg-gray-100'
                                }`}
                                title={isLocked ? 'Unlock Component' : 'Lock Component'}
                              >
                                {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>

                              {/* More Actions (visible on hover) */}
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {/* Edit Name */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartEdit(component);
                                  }}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                                  title="Rename Component"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {/* Duplicate */}
                                {onDuplicateComponent && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDuplicate(component.id);
                                    }}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-all duration-200"
                                    title="Duplicate Component"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {/* Delete */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteComponent(component.id);
                                  }}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                                  title="Delete Component"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Selection Indicator */}
                            {isSelected && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r-full"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Plus className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No {category.name.toLowerCase()} yet</p>
                      <p className="text-xs text-gray-400 mt-1">Drag from templates to add</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {components.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/50 rounded-xl">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-emerald-800">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                components.forEach(comp => {
                  onUpdateComponent(comp.id, { props: { ...comp.props, visible: true } });
                });
              }}
              className="flex items-center justify-center space-x-1 p-2 bg-white/60 hover:bg-white/80 border border-emerald-200 rounded-lg transition-all duration-200 text-xs"
            >
              <Eye className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">Show All</span>
            </button>
            
            <button
              onClick={() => {
                components.forEach(comp => {
                  onUpdateComponent(comp.id, { props: { ...comp.props, visible: false } });
                });
              }}
              className="flex items-center justify-center space-x-1 p-2 bg-white/60 hover:bg-white/80 border border-emerald-200 rounded-lg transition-all duration-200 text-xs"
            >
              <EyeOff className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">Hide All</span>
            </button>
            
            <button
              onClick={() => {
                components.forEach(comp => {
                  onUpdateComponent(comp.id, { locked: false });
                });
              }}
              className="flex items-center justify-center space-x-1 p-2 bg-white/60 hover:bg-white/80 border border-emerald-200 rounded-lg transition-all duration-200 text-xs"
            >
              <Unlock className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">Unlock All</span>
            </button>
            
            <button
              onClick={() => {
                components.forEach(comp => {
                  onUpdateComponent(comp.id, { locked: true });
                });
              }}
              className="flex items-center justify-center space-x-1 p-2 bg-white/60 hover:bg-white/80 border border-emerald-200 rounded-lg transition-all duration-200 text-xs"
            >
              <Lock className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">Lock All</span>
            </button>
          </div>
        </div>
      )}

      {/* File Structure Tips */}
      <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 rounded-xl">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
          <File className="w-4 h-4" />
          <span>Tips</span>
        </h3>
        <ul className="space-y-2 text-xs text-gray-600">
          <li className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Click component names to select them on canvas</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Use eye icon to show/hide components</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Lock icon prevents accidental movement</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>Hover for edit, duplicate, and delete options</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FileStructurePanel;