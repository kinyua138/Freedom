import React, { useState, useEffect } from 'react';
import { SearchIcon, CopyIcon, DownloadIcon, StarIcon, GridIcon, ListIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import * as HeroIcons from '@heroicons/react/24/outline';

const IconLibraryBrowser = ({ isOpen, onClose, onIconSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('lucide');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [iconSize, setIconSize] = useState(24);

  // Icon libraries
  const iconLibraries = {
    lucide: {
      name: 'Lucide Icons',
      icons: Object.keys(LucideIcons).filter(name => 
        name !== 'createLucideIcon' && 
        name !== 'default' && 
        typeof LucideIcons[name] === 'function'
      ),
      getIcon: (name) => LucideIcons[name],
      categories: {
        'all': 'All Icons',
        'arrow': 'Arrows',
        'file': 'Files',
        'user': 'Users',
        'heart': 'Social',
        'home': 'Interface',
        'settings': 'Settings',
        'mail': 'Communication',
        'calendar': 'Time',
        'shopping': 'Commerce',
        'music': 'Media',
        'map': 'Maps',
        'tool': 'Tools'
      }
    },
    heroicons: {
      name: 'Hero Icons',
      icons: Object.keys(HeroIcons).filter(name => typeof HeroIcons[name] === 'function'),
      getIcon: (name) => HeroIcons[name],
      categories: {
        'all': 'All Icons',
        'arrow': 'Arrows',
        'document': 'Documents',
        'user': 'Users',
        'heart': 'Social',
        'home': 'Interface',
        'cog': 'Settings',
        'envelope': 'Communication',
        'calendar': 'Time',
        'shopping': 'Commerce',
        'musical': 'Media',
        'map': 'Maps'
      }
    }
  };

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('iconFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites);
    localStorage.setItem('iconFavorites', JSON.stringify(newFavorites));
  };

  // Toggle favorite
  const toggleFavorite = (iconName, library) => {
    const favoriteKey = `${library}:${iconName}`;
    const newFavorites = favorites.includes(favoriteKey)
      ? favorites.filter(fav => fav !== favoriteKey)
      : [...favorites, favoriteKey];
    saveFavorites(newFavorites);
  };

  // Filter icons
  const getFilteredIcons = () => {
    const library = iconLibraries[selectedLibrary];
    let icons = library.icons;

    // Filter by search term
    if (searchTerm) {
      icons = icons.filter(icon => 
        icon.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      icons = icons.filter(icon => 
        icon.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    return icons;
  };

  // Copy icon code
  const copyIconCode = async (iconName, format = 'jsx') => {
    let code = '';
    
    switch (format) {
      case 'jsx':
        if (selectedLibrary === 'lucide') {
          code = `import { ${iconName} } from 'lucide-react';\n\n<${iconName} size={${iconSize}} />`;
        } else {
          code = `import { ${iconName} } from '@heroicons/react/24/outline';\n\n<${iconName} className="w-6 h-6" />`;
        }
        break;
      case 'svg':
        // This would require actual SVG content - simplified for demo
        code = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n  <!-- ${iconName} SVG content -->\n</svg>`;
        break;
      case 'css':
        code = `.icon-${iconName.toLowerCase()} {\n  width: ${iconSize}px;\n  height: ${iconSize}px;\n  background-image: url('path/to/${iconName.toLowerCase()}.svg');\n}`;
        break;
    }

    try {
      await navigator.clipboard.writeText(code);
      // Add toast notification here
    } catch (err) {
      console.error('Failed to copy icon code:', err);
    }
  };

  // Download icon as SVG
  const downloadIcon = (iconName) => {
    // This is a simplified version - in a real app, you'd get the actual SVG content
    const svgContent = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <!-- ${iconName} SVG content -->
</svg>`;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${iconName.toLowerCase()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const filteredIcons = getFilteredIcons();
  const currentLibrary = iconLibraries[selectedLibrary];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <GridIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Icon Library Browser</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">Browse and use icons in your projects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="text-2xl text-gray-500 dark:text-slate-400">×</span>
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Library Selection */}
            <select
              value={selectedLibrary}
              onChange={(e) => setSelectedLibrary(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              {Object.entries(iconLibraries).map(([key, library]) => (
                <option key={key} value={key}>{library.name}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              {Object.entries(currentLibrary.categories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* Icon Size */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-slate-400">Size:</label>
              <input
                type="range"
                min="16"
                max="48"
                value={iconSize}
                onChange={(e) => setIconSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600 dark:text-slate-400 w-8">{iconSize}px</span>
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}
              >
                <GridIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Icons Grid/List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          <div className="mb-4 text-sm text-gray-600 dark:text-slate-400">
            {filteredIcons.length} icons found
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-16 gap-4">
              {filteredIcons.map((iconName) => {
                const IconComponent = currentLibrary.getIcon(iconName);
                const favoriteKey = `${selectedLibrary}:${iconName}`;
                const isFavorite = favorites.includes(favoriteKey);

                return (
                  <div
                    key={iconName}
                    className="group relative p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onIconSelect && onIconSelect(iconName, selectedLibrary)}
                  >
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(iconName, selectedLibrary);
                      }}
                      className={`absolute top-1 right-1 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                        isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      <StarIcon className="w-3 h-3" fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>

                    {/* Icon */}
                    <div className="flex items-center justify-center mb-2">
                      {IconComponent && (
                        <IconComponent 
                          size={iconSize} 
                          className="text-gray-700 dark:text-slate-300"
                        />
                      )}
                    </div>

                    {/* Icon Name */}
                    <div className="text-xs text-center text-gray-600 dark:text-slate-400 truncate">
                      {iconName}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyIconCode(iconName);
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Copy JSX"
                      >
                        <CopyIcon className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadIcon(iconName);
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Download SVG"
                      >
                        <DownloadIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredIcons.map((iconName) => {
                const IconComponent = currentLibrary.getIcon(iconName);
                const favoriteKey = `${selectedLibrary}:${iconName}`;
                const isFavorite = favorites.includes(favoriteKey);

                return (
                  <div
                    key={iconName}
                    className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onIconSelect && onIconSelect(iconName, selectedLibrary)}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {IconComponent && (
                        <IconComponent 
                          size={iconSize} 
                          className="text-gray-700 dark:text-slate-300"
                        />
                      )}
                    </div>

                    {/* Icon Name */}
                    <div className="flex-1 font-medium text-gray-900 dark:text-white">
                      {iconName}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(iconName, selectedLibrary);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <StarIcon className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyIconCode(iconName);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-500 rounded-lg transition-colors"
                        title="Copy JSX"
                      >
                        <CopyIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadIcon(iconName);
                        }}
                        className="p-2 text-gray-400 hover:text-green-500 rounded-lg transition-colors"
                        title="Download SVG"
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredIcons.length === 0 && (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No icons found</h3>
              <p className="text-gray-600 dark:text-slate-400">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-400">
            <div>
              {favorites.length} favorites • {currentLibrary.icons.length} total icons
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => copyIconCode('ExampleIcon', 'jsx')}
                className="hover:text-blue-500 transition-colors"
              >
                Copy as JSX
              </button>
              <button
                onClick={() => copyIconCode('ExampleIcon', 'svg')}
                className="hover:text-blue-500 transition-colors"
              >
                Copy as SVG
              </button>
              <button
                onClick={() => copyIconCode('ExampleIcon', 'css')}
                className="hover:text-blue-500 transition-colors"
              >
                Copy as CSS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconLibraryBrowser;
