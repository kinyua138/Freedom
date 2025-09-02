import React, { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { 
  FolderIcon,
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  TagIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import Button from './Button';
import Modal from './Modal';

const ProjectManager = ({ isOpen, onClose, onProjectSelect }) => {
  const {
    projects,
    currentProject,
    createProject,
    deleteProject,
    duplicateProject,
    exportProject,
    importProject,
    getProjectStats,
    searchProjects,
    error,
    clearError
  } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    author: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const stats = getProjectStats();
  const filteredProjects = searchProjects(searchQuery);

  const handleCreateProject = () => {
    if (!newProjectData.name.trim()) return;

    const project = createProject(newProjectData);
    if (project) {
      onProjectSelect(project);
      setShowCreateModal(false);
      setNewProjectData({ name: '', description: '', author: '', tags: [] });
      onClose();
    }
  };

  const handleDeleteProject = (projectId) => {
    deleteProject(projectId);
    setShowDeleteConfirm(null);
  };

  const handleDuplicateProject = (projectId) => {
    const duplicated = duplicateProject(projectId);
    if (duplicated && onProjectSelect) {
      onProjectSelect(duplicated);
      onClose();
    }
  };

  const handleExportProject = (projectId, format = 'json') => {
    const exported = exportProject(projectId, format);
    if (exported) {
      const blob = new Blob([exported.data], { type: exported.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exported.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imported = importProject(e.target.result);
      if (imported && onProjectSelect) {
        onProjectSelect(imported);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newProjectData.tags.includes(tagInput.trim())) {
      setNewProjectData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewProjectData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FolderIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Project Manager
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Manage your UI Builder projects
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalProjects}
                </div>
                <div className="text-sm text-blue-600/80 dark:text-blue-400/80">
                  Total Projects
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.totalComponents}
                </div>
                <div className="text-sm text-green-600/80 dark:text-green-400/80">
                  Components Created
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(stats.storageUsed / 1024)}KB
                </div>
                <div className="text-sm text-purple-600/80 dark:text-purple-400/80">
                  Storage Used
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Project
                </Button>
                
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportProject}
                    className="hidden"
                  />
                  <Button variant="secondary" size="sm" as="span">
                    <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </label>
              </div>

              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <p className="text-red-700 dark:text-red-400">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Projects List */}
          <div className="p-6 overflow-y-auto max-h-96">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <FolderIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No projects found' : 'No projects yet'}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 mb-4">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Create your first project to get started'
                  }
                </p>
                {!searchQuery && (
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 border rounded-xl transition-all duration-200 hover:shadow-lg cursor-pointer ${
                      currentProject?.id === project.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                    }`}
                    onClick={() => {
                      onProjectSelect(project);
                      onClose();
                    }}
                  >
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {project.description || 'No description'}
                        </p>
                      </div>
                      
                      {currentProject?.id === project.id && (
                        <div className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          Active
                        </div>
                      )}
                    </div>

                    {/* Project Stats */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-slate-400 mb-3">
                      <span>{project.pages.length} pages</span>
                      <span>
                        {project.pages.reduce((total, page) => total + page.components.length, 0)} components
                      </span>
                    </div>

                    {/* Tags */}
                    {project.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.metadata.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.metadata.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs rounded-full">
                            +{project.metadata.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>{formatDate(project.metadata.updatedAt)}</span>
                      </div>
                      <span>v{project.metadata.version}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateProject(project.id);
                        }}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors"
                        title="Duplicate"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportProject(project.id);
                        }}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors"
                        title="Export"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(project.id);
                        }}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={newProjectData.name}
              onChange={(e) => setNewProjectData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={newProjectData.description}
              onChange={(e) => setNewProjectData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe your project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Author
            </label>
            <input
              type="text"
              value={newProjectData.author}
              onChange={(e) => setNewProjectData(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag"
              />
              <Button variant="secondary" size="sm" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {newProjectData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newProjectData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="primary"
              onClick={handleCreateProject}
              disabled={!newProjectData.name.trim()}
              className="flex-1"
            >
              Create Project
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeleteConfirm(null)}
          title="Delete Project"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-slate-400">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="primary"
                onClick={() => handleDeleteProject(showDeleteConfirm)}
                className="bg-red-600 hover:bg-red-700 flex-1"
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProjectManager;
