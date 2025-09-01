import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  GripVertical,
  FileText,
  Home,
  Settings,
  ArrowLeft
} from 'lucide-react';

const PageManager = ({ pages, onPagesChange, onBack }) => {
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [draggedPage, setDraggedPage] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleAddPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      name: `Page ${pages.length + 1}`,
      components: [],
      isActive: false
    };
    onPagesChange([...pages, newPage]);
  };

  const handleDeletePage = (pageId) => {
    if (pages.length <= 1) {
      alert('You must have at least one page');
      return;
    }
    
    const updatedPages = pages.filter(page => page.id !== pageId);
    // If we deleted the active page, make the first page active
    if (pages.find(p => p.id === pageId)?.isActive && updatedPages.length > 0) {
      updatedPages[0].isActive = true;
    }
    onPagesChange(updatedPages);
  };

  const handleStartEdit = (page) => {
    setEditingPageId(page.id);
    setEditingName(page.name);
  };

  const handleSaveEdit = () => {
    if (editingName.trim()) {
      const updatedPages = pages.map(page =>
        page.id === editingPageId
          ? { ...page, name: editingName.trim() }
          : page
      );
      onPagesChange(updatedPages);
    }
    setEditingPageId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditingName('');
  };

  const handleSetActivePage = (pageId) => {
    // Only update if it's a different page
    const currentActivePage = pages.find(p => p.isActive);
    if (currentActivePage?.id !== pageId) {
      const updatedPages = pages.map(page => ({
        ...page,
        isActive: page.id === pageId
      }));
      onPagesChange(updatedPages);
    }
  };

  const handleDragStart = (e, page, index) => {
    setDraggedPage({ page, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (!draggedPage || draggedPage.index === dropIndex) {
      setDraggedPage(null);
      setDragOverIndex(null);
      return;
    }

    const newPages = [...pages];
    const [movedPage] = newPages.splice(draggedPage.index, 1);
    newPages.splice(dropIndex, 0, movedPage);
    
    onPagesChange(newPages);
    setDraggedPage(null);
    setDragOverIndex(null);
  };

  const getPageIcon = (page, index) => {
    if (index === 0) return Home;
    return FileText;
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Builder</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Page Manager</h2>
        </div>
        <p className="text-sm text-gray-600">Manage your pages and their order</p>
      </div>

      {/* Add Page Button */}
      <button
        onClick={handleAddPage}
        className="w-full flex items-center justify-center space-x-2 p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl hover:from-blue-100 hover:to-purple-100 hover:border-blue-400 transition-all duration-300 group"
      >
        <Plus className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium text-blue-700">Add New Page</span>
      </button>

      {/* Pages List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Pages ({pages.length})</h3>
        
        {pages.map((page, index) => {
          const PageIcon = getPageIcon(page, index);
          const isEditing = editingPageId === page.id;
          const isDraggedOver = dragOverIndex === index;
          const isBeingDragged = draggedPage?.page.id === page.id;
          
          return (
            <div
              key={page.id}
              className={`relative transition-all duration-200 ${
                isDraggedOver ? 'transform translate-y-1' : ''
              } ${isBeingDragged ? 'opacity-50 scale-95' : ''}`}
            >
              {/* Drop indicator */}
              {isDraggedOver && (
                <div className="absolute -top-1 left-0 right-0 h-0.5 bg-purple-500 rounded-full"></div>
              )}
              
              <div
                draggable={!isEditing}
                onDragStart={(e) => handleDragStart(e, page, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`group relative bg-white border rounded-xl p-4 transition-all duration-300 hover:shadow-lg ${
                  page.isActive 
                    ? 'border-purple-500 bg-purple-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${!isEditing ? 'cursor-move' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  {/* Drag Handle */}
                  {!isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Page Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    page.isActive 
                      ? 'bg-purple-100' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  } transition-colors duration-200`}>
                    <PageIcon className={`w-4 h-4 ${
                      page.isActive ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  {/* Page Name */}
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
                        className="w-full px-2 py-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => handleSetActivePage(page.id)}
                        className="cursor-pointer"
                      >
                        <h4 className={`font-medium truncate ${
                          page.isActive ? 'text-purple-700' : 'text-gray-800'
                        }`}>
                          {page.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {page.components?.length || 0} components
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(page)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {pages.length > 1 && (
                          <button
                            onClick={() => handleDeletePage(page.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Active Page Indicator */}
                {page.isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r-full"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/50 rounded-xl">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-emerald-800">Page Tips</h3>
        </div>
        <ul className="space-y-2 text-xs text-emerald-700">
          <li className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Click a page name to make it active</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Drag pages to reorder them</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Use edit button to rename pages</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>First page cannot be deleted</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PageManager;