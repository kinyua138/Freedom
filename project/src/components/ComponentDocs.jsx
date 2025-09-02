import React, { useState, useEffect } from 'react';
import { BookOpenIcon, FileTextIcon, CopyIcon, DownloadIcon, SearchIcon, TagIcon } from 'lucide-react';

const ComponentDocs = ({ isOpen, onClose, components = [] }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [docFormat, setDocFormat] = useState('markdown');

  // Component categories
  const categories = ['all', 'layout', 'form', 'navigation', 'display', 'feedback', 'data'];

  // Filter components
  const filteredComponents = components.filter(component => {
    const matchesSearch = !searchTerm || 
      component.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      component.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Generate documentation
  const generateDocumentation = (component) => {
    if (!component) return '';

    const props = component.props || {};
    const examples = component.examples || [];
    const methods = component.methods || [];

    switch (docFormat) {
      case 'markdown':
        return `# ${component.name}

${component.description || 'No description available.'}

## Installation

\`\`\`bash
npm install ${component.name?.toLowerCase() || 'component'}
\`\`\`

## Usage

\`\`\`jsx
import { ${component.name} } from '${component.package || '@your-org/components'}';

function App() {
  return (
    <${component.name}${Object.keys(props).length > 0 ? ' ' + Object.keys(props).slice(0, 2).map(key => `${key}="${props[key].default || 'value'}"`).join(' ') : ''} />
  );
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
${Object.entries(props).map(([key, prop]) => 
  `| \`${key}\` | \`${prop.type || 'any'}\` | \`${prop.default || 'undefined'}\` | ${prop.description || 'No description'} |`
).join('\n')}

${methods.length > 0 ? `## Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
${methods.map(method => 
  `| \`${method.name}\` | \`${method.params || 'none'}\` | \`${method.returns || 'void'}\` | ${method.description || 'No description'} |`
).join('\n')}
` : ''}

${examples.length > 0 ? `## Examples

${examples.map((example, index) => `
### Example ${index + 1}: ${example.title || 'Basic Usage'}

${example.description || ''}

\`\`\`jsx
${example.code || '// No code example available'}
\`\`\`
`).join('\n')}
` : ''}

## Accessibility

- Supports keyboard navigation
- ARIA labels and roles included
- Screen reader compatible
- High contrast mode support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License
`;

      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${component.name} Documentation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    .prop-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .prop-table th, .prop-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .prop-table th { background-color: #f5f5f5; }
    .code { background-color: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    .badge { background-color: #007bff; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>${component.name}</h1>
  <p>${component.description || 'No description available.'}</p>
  
  <h2>Installation</h2>
  <div class="code">npm install ${component.name?.toLowerCase() || 'component'}</div>
  
  <h2>Props</h2>
  <table class="prop-table">
    <thead>
      <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      ${Object.entries(props).map(([key, prop]) => 
        `<tr><td><code>${key}</code></td><td><span class="badge">${prop.type || 'any'}</span></td><td><code>${prop.default || 'undefined'}</code></td><td>${prop.description || 'No description'}</td></tr>`
      ).join('')}
    </tbody>
  </table>
  
  ${examples.length > 0 ? `
  <h2>Examples</h2>
  ${examples.map((example, index) => `
    <h3>Example ${index + 1}: ${example.title || 'Basic Usage'}</h3>
    <p>${example.description || ''}</p>
    <div class="code">${example.code || '// No code example available'}</div>
  `).join('')}
  ` : ''}
</body>
</html>`;

      case 'json':
        return JSON.stringify({
          name: component.name,
          description: component.description,
          version: component.version || '1.0.0',
          props: Object.entries(props).map(([key, prop]) => ({
            name: key,
            type: prop.type || 'any',
            default: prop.default,
            required: prop.required || false,
            description: prop.description || ''
          })),
          methods: methods,
          examples: examples,
          category: component.category,
          tags: component.tags || [],
          accessibility: {
            keyboardNavigation: true,
            ariaSupport: true,
            screenReaderCompatible: true
          },
          browserSupport: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+']
        }, null, 2);

      default:
        return 'Unsupported documentation format';
    }
  };

  // Copy documentation
  const copyDocs = async () => {
    if (!selectedComponent) return;
    
    try {
      const docs = generateDocumentation(selectedComponent);
      await navigator.clipboard.writeText(docs);
      // Add toast notification here
    } catch (err) {
      console.error('Failed to copy documentation:', err);
    }
  };

  // Download documentation
  const downloadDocs = () => {
    if (!selectedComponent) return;

    const docs = generateDocumentation(selectedComponent);
    const extensions = { markdown: 'md', html: 'html', json: 'json' };
    const extension = extensions[docFormat] || 'txt';
    const filename = `${selectedComponent.name || 'component'}-docs.${extension}`;
    
    const blob = new Blob([docs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate all documentation
  const generateAllDocs = () => {
    const allDocs = filteredComponents.map(component => ({
      component: component.name,
      documentation: generateDocumentation(component)
    }));

    const combinedDocs = allDocs.map(doc => doc.documentation).join('\n\n---\n\n');
    
    const blob = new Blob([combinedDocs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-components-docs.${docFormat === 'markdown' ? 'md' : docFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Auto-select first component
  useEffect(() => {
    if (filteredComponents.length > 0 && !selectedComponent) {
      setSelectedComponent(filteredComponents[0]);
    }
  }, [filteredComponents]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Component Documentation</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">Generate comprehensive component docs</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={docFormat}
              onChange={(e) => setDocFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="markdown">Markdown</option>
              <option value="html">HTML</option>
              <option value="json">JSON</option>
            </select>
            
            <button
              onClick={generateAllDocs}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>All Docs</span>
            </button>
            
            <button
              onClick={copyDocs}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              <CopyIcon className="w-4 h-4" />
              <span>Copy</span>
            </button>
            
            <button
              onClick={downloadDocs}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Download</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <span className="text-2xl text-gray-500 dark:text-slate-400">×</span>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-100px)]">
          {/* Component List */}
          <div className="w-80 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Component List */}
            <div className="p-4">
              <div className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
              </div>
              
              <div className="space-y-2">
                {filteredComponents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileTextIcon className="w-12 h-12 text-gray-400 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-slate-400">No components found</p>
                  </div>
                ) : (
                  filteredComponents.map((component, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedComponent(component)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedComponent === component
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {component.name || `Component ${index + 1}`}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {component.description || 'No description available'}
                          </div>
                          {component.category && (
                            <div className="flex items-center mt-2">
                              <TagIcon className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500 dark:text-slate-400 capitalize">
                                {component.category}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Documentation Preview */}
          <div className="flex-1 flex flex-col">
            {selectedComponent ? (
              <>
                {/* Component Header */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedComponent.name}
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400 mt-1">
                        {selectedComponent.description || 'No description available'}
                      </p>
                      {selectedComponent.version && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded">
                            v{selectedComponent.version}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documentation Content */}
                <div className="flex-1 p-6 overflow-auto">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {docFormat === 'html' ? (
                      <div dangerouslySetInnerHTML={{ __html: generateDocumentation(selectedComponent) }} />
                    ) : (
                      <pre className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap">
                        {generateDocumentation(selectedComponent)}
                      </pre>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <BookOpenIcon className="w-16 h-16 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Select a Component
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400">
                    Choose a component from the list to view its documentation
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDocs;
