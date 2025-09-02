import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, user, trackEvent } = useAuth();

  // Load projects when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [isAuthenticated]);

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Load all projects for the current user
  const loadProjects = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/projects', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new project
  const createProject = async (projectData) => {
    if (!isAuthenticated) {
      setError('You must be logged in to create projects');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newProjectData = {
        name: projectData.name || 'Untitled Project',
        description: projectData.description || '',
        components: projectData.components || [],
        pages: projectData.pages || [
          {
            id: 'page-1',
            name: 'Home',
            components: [],
            isActive: true
          }
        ],
        settings: {
          theme: 'light',
          responsive: true,
          animations: true,
          framework: 'react',
          ...projectData.settings
        }
      };

      const response = await fetch('/.netlify/functions/projects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newProjectData)
      });

      const data = await response.json();

      if (data.success) {
        const newProject = data.project;
        setProjects(prev => [...prev, newProject]);
        setCurrentProject(newProject);
        
        // Track analytics
        await trackEvent('project_created', {
          projectId: newProject._id,
          projectName: newProject.name
        });

        return newProject;
      } else {
        setError(data.error);
        return null;
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Save/update an existing project
  const saveProject = async (projectId, projectData) => {
    if (!isAuthenticated) {
      setError('You must be logged in to save projects');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/.netlify/functions/projects?projectId=${projectId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData)
      });

      const data = await response.json();

      if (data.success) {
        const updatedProject = data.project;
        setProjects(prev => 
          prev.map(p => p._id === projectId ? updatedProject : p)
        );

        if (currentProject?._id === projectId) {
          setCurrentProject(updatedProject);
        }

        // Track analytics
        await trackEvent('project_saved', {
          projectId: updatedProject._id,
          projectName: updatedProject.name
        });

        return true;
      } else {
        setError(data.error);
        return false;
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load a specific project
  const loadProject = async (projectId) => {
    if (!isAuthenticated) {
      setError('You must be logged in to load projects');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/.netlify/functions/projects?projectId=${projectId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setCurrentProject(data.project);
        
        // Track analytics
        await trackEvent('project_opened', {
          projectId: data.project._id,
          projectName: data.project.name
        });

        return data.project;
      } else {
        setError(data.error);
        return null;
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Failed to load project');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    if (!isAuthenticated) {
      setError('You must be logged in to delete projects');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/.netlify/functions/projects?projectId=${projectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setProjects(prev => prev.filter(p => p._id !== projectId));

        if (currentProject?._id === projectId) {
          setCurrentProject(null);
        }

        // Track analytics
        await trackEvent('project_deleted', {
          projectId
        });

        return true;
      } else {
        setError(data.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Duplicate a project
  const duplicateProject = async (projectId) => {
    const originalProject = projects.find(p => p._id === projectId);
    if (!originalProject) {
      setError('Project not found');
      return null;
    }

    const duplicatedProjectData = {
      name: `${originalProject.name} (Copy)`,
      description: originalProject.description,
      components: originalProject.components,
      pages: originalProject.pages,
      settings: originalProject.settings
    };

    return await createProject(duplicatedProjectData);
  };

  // Export project in various formats
  const exportProject = (projectId, format = 'json') => {
    const project = projects.find(p => p._id === projectId);
    if (!project) {
      setError('Project not found');
      return null;
    }

    try {
      switch (format) {
        case 'json':
          return {
            data: JSON.stringify(project, null, 2),
            filename: `${project.name.replace(/\s+/g, '-').toLowerCase()}.json`,
            mimeType: 'application/json'
          };
        
        case 'html':
          const htmlContent = generateHTMLFromProject(project);
          return {
            data: htmlContent,
            filename: `${project.name.replace(/\s+/g, '-').toLowerCase()}.html`,
            mimeType: 'text/html'
          };

        case 'react':
          const reactContent = generateReactFromProject(project);
          return {
            data: reactContent,
            filename: `${project.name.replace(/\s+/g, '-').toLowerCase()}.jsx`,
            mimeType: 'text/javascript'
          };
        
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Error exporting project:', error);
      setError('Failed to export project');
      return null;
    }
  };

  // Import project from file
  const importProject = async (projectData) => {
    try {
      let parsedProject;
      
      if (typeof projectData === 'string') {
        parsedProject = JSON.parse(projectData);
      } else {
        parsedProject = projectData;
      }

      // Validate project structure
      if (!parsedProject.name) {
        throw new Error('Invalid project format: missing name');
      }

      // Create imported project
      const importedProjectData = {
        name: `${parsedProject.name} (Imported)`,
        description: parsedProject.description || '',
        components: parsedProject.components || [],
        pages: parsedProject.pages || [
          {
            id: 'page-1',
            name: 'Home',
            components: [],
            isActive: true
          }
        ],
        settings: parsedProject.settings || {
          theme: 'light',
          responsive: true,
          animations: true,
          framework: 'react'
        }
      };

      return await createProject(importedProjectData);
    } catch (error) {
      console.error('Error importing project:', error);
      setError('Failed to import project. Please check the file format.');
      return null;
    }
  };

  // Generate HTML from project
  const generateHTMLFromProject = (project) => {
    const activePage = project.pages.find(page => page.isActive) || project.pages[0];
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom styles */
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    </style>
</head>
<body class="${project.settings.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}">
    <div id="app" class="container">
        <header>
            <h1 class="text-3xl font-bold mb-6">${project.name}</h1>
            ${project.description ? `<p class="text-lg mb-8">${project.description}</p>` : ''}
        </header>
        
        <main>
            <div class="grid gap-6">
                ${activePage.components.map(component => `
                    <div class="component-${component.type} p-4 border rounded-lg">
                        <h3 class="font-semibold">${component.type}</h3>
                        <p>Component content would be rendered here</p>
                    </div>
                `).join('')}
            </div>
        </main>
        
        <footer class="mt-12 pt-6 border-t">
            <p class="text-sm text-gray-500">Generated from ${project.name} • ${activePage.components.length} components</p>
        </footer>
    </div>
</body>
</html>`;
  };

  // Generate React code from project
  const generateReactFromProject = (project) => {
    const activePage = project.pages.find(page => page.isActive) || project.pages[0];
    
    return `import React from 'react';

const ${project.name.replace(/\s+/g, '')} = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">${project.name}</h1>
        ${project.description ? `<p className="text-lg text-gray-600">${project.description}</p>` : ''}
      </header>
      
      <main>
        <div className="grid gap-6">
          ${activePage.components.map((component, index) => `
          <div key={${index}} className="component-${component.type} p-4 border rounded-lg">
            <h3 className="font-semibold">${component.type}</h3>
            <p>Component content would be rendered here</p>
          </div>`).join('')}
        </div>
      </main>
      
      <footer className="mt-12 pt-6 border-t">
        <p className="text-sm text-gray-500">
          Generated from ${project.name} • ${activePage.components.length} components
        </p>
      </footer>
    </div>
  );
};

export default ${project.name.replace(/\s+/g, '')};`;
  };

  // Get project statistics
  const getProjectStats = () => {
    const totalProjects = projects.length;
    const totalComponents = projects.reduce((total, project) => {
      return total + project.pages.reduce((pageTotal, page) => {
        return pageTotal + (page.components?.length || 0);
      }, 0);
    }, 0);

    const recentProjects = projects
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    return {
      totalProjects,
      totalComponents,
      recentProjects,
      storageUsed: JSON.stringify(projects).length
    };
  };

  // Search projects
  const searchProjects = (query) => {
    if (!query.trim()) return projects;

    const lowercaseQuery = query.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );
  };

  // Clear error state
  const clearError = () => setError(null);

  const value = {
    projects,
    currentProject,
    isLoading,
    error,
    createProject,
    saveProject,
    loadProject,
    deleteProject,
    duplicateProject,
    exportProject,
    importProject,
    getProjectStats,
    searchProjects,
    clearError,
    setCurrentProject,
    loadProjects
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
