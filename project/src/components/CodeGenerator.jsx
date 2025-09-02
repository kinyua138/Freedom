import React, { useState, useEffect } from 'react';
import { CodeIcon, CopyIcon, DownloadIcon, SettingsIcon, FileTextIcon, BracesIcon } from 'lucide-react';

const CodeGenerator = ({ isOpen, onClose, components = [], projectData = {} }) => {
  const [outputFormat, setOutputFormat] = useState('react');
  const [includeStyles, setIncludeStyles] = useState(true);
  const [includeTypes, setIncludeTypes] = useState(true);
  const [minifyOutput, setMinifyOutput] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [activeTab, setActiveTab] = useState('component');

  // Code generation templates
  const templates = {
    react: {
      component: (name, props, children, styles) => `
import React from 'react';
${includeStyles ? `import './${name}.css';` : ''}
${includeTypes ? `
interface ${name}Props {
  ${Object.keys(props).map(key => `${key}?: ${typeof props[key] === 'string' ? 'string' : 'any'};`).join('\n  ')}
}
` : ''}

const ${name}${includeTypes ? `: React.FC<${name}Props>` : ''} = ({ ${Object.keys(props).join(', ')} }) => {
  return (
    <div className="${name.toLowerCase()}"${Object.keys(props).length > 0 ? ` {...props}` : ''}>
      ${children}
    </div>
  );
};

export default ${name};
`,
      styles: (name, styles) => `
.${name.toLowerCase()} {
  ${styles.map(style => `${style.property}: ${style.value};`).join('\n  ')}
}

.${name.toLowerCase()}:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.${name.toLowerCase()}:active {
  transform: translateY(0);
}
`,
      test: (name) => `
import React from 'react';
import { render, screen } from '@testing-library/react';
import ${name} from './${name}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
  });

  it('displays content correctly', () => {
    render(<${name} />);
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });
});
`
    },
    vue: {
      component: (name, props, children, styles) => `
<template>
  <div class="${name.toLowerCase()}" v-bind="$attrs">
    ${children}
  </div>
</template>

<script${includeTypes ? ' lang="ts"' : ''}>
${includeTypes ? `
interface Props {
  ${Object.keys(props).map(key => `${key}?: ${typeof props[key] === 'string' ? 'string' : 'any'}`).join('\n  ')}
}
` : ''}

export default {
  name: '${name}',
  ${includeTypes ? 'props: {} as Props,' : `props: [${Object.keys(props).map(k => `'${k}'`).join(', ')}],`}
  setup(props) {
    return {
      // Component logic here
    };
  }
};
</script>

${includeStyles ? `
<style scoped>
.${name.toLowerCase()} {
  ${styles.map(style => `${style.property}: ${style.value};`).join('\n  ')}
}
</style>
` : ''}
`,
    },
    html: {
      component: (name, props, children, styles) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  ${includeStyles ? `<link rel="stylesheet" href="${name.toLowerCase()}.css">` : ''}
</head>
<body>
  <div class="${name.toLowerCase()}" ${Object.entries(props).map(([key, value]) => `${key}="${value}"`).join(' ')}>
    ${children}
  </div>
  
  <script src="${name.toLowerCase()}.js"></script>
</body>
</html>
`,
      styles: (name, styles) => `
.${name.toLowerCase()} {
  ${styles.map(style => `${style.property}: ${style.value};`).join('\n  ')}
}
`,
      script: (name) => `
class ${name} {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    // Component initialization
    this.bindEvents();
  }

  bindEvents() {
    // Event listeners
  }
}

// Initialize component
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.${name.toLowerCase()}');
  elements.forEach(element => new ${name}(element));
});
`
    }
  };

  // Generate code based on components
  const generateCode = () => {
    if (!components.length) {
      setGeneratedCode('// No components to generate');
      return;
    }

    const template = templates[outputFormat];
    if (!template) {
      setGeneratedCode('// Unsupported output format');
      return;
    }

    let code = '';
    
    components.forEach((component, index) => {
      const name = component.name || `Component${index + 1}`;
      const props = component.props || {};
      const children = component.children || '';
      const styles = component.styles || [];

      switch (activeTab) {
        case 'component':
          code += template.component(name, props, children, styles);
          break;
        case 'styles':
          if (template.styles) {
            code += template.styles(name, styles);
          }
          break;
        case 'test':
          if (template.test) {
            code += template.test(name);
          }
          break;
        case 'script':
          if (template.script) {
            code += template.script(name);
          }
          break;
      }
      
      if (index < components.length - 1) {
        code += '\n\n';
      }
    });

    if (minifyOutput) {
      code = code.replace(/\s+/g, ' ').trim();
    }

    setGeneratedCode(code);
  };

  // Generate code when settings change
  useEffect(() => {
    generateCode();
  }, [components, outputFormat, includeStyles, includeTypes, minifyOutput, activeTab]);

  // Copy code to clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      // Add toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Download code as file
  const downloadCode = () => {
    const extensions = {
      react: activeTab === 'styles' ? 'css' : activeTab === 'test' ? 'test.tsx' : 'tsx',
      vue: 'vue',
      html: activeTab === 'styles' ? 'css' : activeTab === 'script' ? 'js' : 'html'
    };

    const extension = extensions[outputFormat] || 'txt';
    const filename = `generated-${activeTab}.${extension}`;
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate project structure
  const generateProjectStructure = () => {
    const structure = {
      'package.json': JSON.stringify({
        name: projectData.name || 'generated-project',
        version: '1.0.0',
        dependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0'
        },
        devDependencies: {
          '@types/react': '^18.0.0',
          typescript: '^4.0.0',
          vite: '^4.0.0'
        }
      }, null, 2),
      'src/': {
        'components/': components.reduce((acc, comp, index) => {
          const name = comp.name || `Component${index + 1}`;
          acc[`${name}.tsx`] = templates[outputFormat].component(name, comp.props || {}, comp.children || '', comp.styles || []);
          if (includeStyles) {
            acc[`${name}.css`] = templates[outputFormat].styles ? templates[outputFormat].styles(name, comp.styles || []) : '';
          }
          return acc;
        }, {}),
        'App.tsx': `
import React from 'react';
${components.map((comp, index) => `import ${comp.name || `Component${index + 1}`} from './components/${comp.name || `Component${index + 1}`}';`).join('\n')}

function App() {
  return (
    <div className="App">
      ${components.map((comp, index) => `<${comp.name || `Component${index + 1}`} />`).join('\n      ')}
    </div>
  );
}

export default App;
`
      }
    };

    return JSON.stringify(structure, null, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CodeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Code Generator</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">Generate production-ready code</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={copyCode}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <CopyIcon className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={downloadCode}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
          {/* Settings Panel */}
          <div className="w-80 border-r border-gray-200 dark:border-slate-700 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Output Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                  Output Format
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'react', label: 'React/TypeScript', icon: BracesIcon },
                    { value: 'vue', label: 'Vue.js', icon: FileTextIcon },
                    { value: 'html', label: 'HTML/CSS/JS', icon: CodeIcon }
                  ].map(format => {
                    const Icon = format.icon;
                    return (
                      <button
                        key={format.value}
                        onClick={() => setOutputFormat(format.value)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                          outputFormat === format.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{format.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Code Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                  Code Options
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeStyles}
                      onChange={(e) => setIncludeStyles(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-slate-300">Include Styles</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeTypes}
                      onChange={(e) => setIncludeTypes(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-slate-300">Include TypeScript Types</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={minifyOutput}
                      onChange={(e) => setMinifyOutput(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-slate-300">Minify Output</span>
                  </label>
                </div>
              </div>

              {/* Component List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                  Components ({components.length})
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {components.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-slate-400">No components available</p>
                  ) : (
                    components.map((component, index) => (
                      <div
                        key={index}
                        className="p-2 bg-gray-50 dark:bg-slate-800 rounded border text-sm"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {component.name || `Component ${index + 1}`}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">
                          {component.type || 'Custom Component'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Project Structure */}
              <div>
                <button
                  onClick={() => setGeneratedCode(generateProjectStructure())}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <FileTextIcon className="w-4 h-4" />
                  <span>Generate Project Structure</span>
                </button>
              </div>
            </div>
          </div>

          {/* Code Output */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
              {[
                { id: 'component', label: 'Component' },
                { id: 'styles', label: 'Styles' },
                { id: 'test', label: 'Tests' },
                { id: 'script', label: 'Script' }
              ].filter(tab => {
                if (outputFormat === 'html' && tab.id === 'test') return false;
                if (outputFormat === 'vue' && (tab.id === 'test' || tab.id === 'script')) return false;
                if (outputFormat === 'react' && tab.id === 'script') return false;
                return true;
              }).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-900'
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code Editor */}
            <div className="flex-1 p-6 overflow-auto">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm font-mono leading-relaxed">
                <code>{generatedCode || '// Generated code will appear here'}</code>
              </pre>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-400">
                <div>
                  Format: {outputFormat.toUpperCase()} • Tab: {activeTab} • Lines: {generatedCode.split('\n').length}
                </div>
                <div>
                  Characters: {generatedCode.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;
