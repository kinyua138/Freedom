import React, { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ClockIcon,
  TagIcon,
  DocumentIcon,
  CubeIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const SearchSystem = ({ 
  data = [], 
  onResults, 
  placeholder = "Search...",
  searchFields = ['name', 'description'],
  filters = {},
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('search-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSearchHistory(parsed);
        setRecentSearches(parsed.slice(0, 5));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = (newHistory) => {
    localStorage.setItem('search-history', JSON.stringify(newHistory));
  };

  // Generate search suggestions
  useEffect(() => {
    if (query.length > 1) {
      const newSuggestions = generateSuggestions(query, data, searchFields);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, data, searchFields]);

  // Perform search and filtering
  useEffect(() => {
    const results = performSearch(query, data, searchFields, activeFilters);
    onResults(results);
  }, [query, data, searchFields, activeFilters, onResults]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateSuggestions = (searchQuery, items, fields) => {
    const suggestions = new Set();
    const lowercaseQuery = searchQuery.toLowerCase();

    items.forEach(item => {
      fields.forEach(field => {
        const value = getNestedValue(item, field);
        if (typeof value === 'string' && value.toLowerCase().includes(lowercaseQuery)) {
          // Extract words that contain the query
          const words = value.split(/\s+/);
          words.forEach(word => {
            if (word.toLowerCase().includes(lowercaseQuery) && word.length > 2) {
              suggestions.add(word);
            }
          });
        }
      });

      // Add tags if available
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          if (tag.toLowerCase().includes(lowercaseQuery)) {
            suggestions.add(tag);
          }
        });
      }
    });

    return Array.from(suggestions).slice(0, 8);
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const performSearch = (searchQuery, items, fields, filters) => {
    let results = [...items];

    // Apply text search
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      results = results.filter(item => {
        return fields.some(field => {
          const value = getNestedValue(item, field);
          return typeof value === 'string' && value.toLowerCase().includes(lowercaseQuery);
        });
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([filterKey, filterConfig]) => {
      const filterValue = activeFilters[filterKey];
      if (filterValue !== undefined && filterValue !== '' && filterValue !== 'all') {
        results = results.filter(item => {
          const itemValue = getNestedValue(item, filterConfig.field);
          
          switch (filterConfig.type) {
            case 'select':
              return itemValue === filterValue;
            case 'multiselect':
              return Array.isArray(filterValue) 
                ? filterValue.some(val => itemValue?.includes?.(val))
                : itemValue?.includes?.(filterValue);
            case 'range':
              const [min, max] = filterValue;
              return itemValue >= min && itemValue <= max;
            case 'date':
              const itemDate = new Date(itemValue);
              const filterDate = new Date(filterValue);
              return itemDate.toDateString() === filterDate.toDateString();
            case 'boolean':
              return itemValue === filterValue;
            default:
              return true;
          }
        });
      }
    });

    return results;
  };

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    
    if (searchTerm.trim()) {
      // Add to search history
      const newHistory = [
        searchTerm,
        ...searchHistory.filter(term => term !== searchTerm)
      ].slice(0, 20);
      
      setSearchHistory(newHistory);
      setRecentSearches(newHistory.slice(0, 5));
      saveSearchHistory(newHistory);
    }
    
    setIsOpen(false);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearFilter = (filterKey) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setQuery('');
  };

  const activeFilterCount = Object.keys(activeFilters).length + (query ? 1 : 0);

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder={placeholder}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-3">
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <XMarkIcon className="h-4 w-4 text-gray-400" />
            </button>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1 rounded-full transition-colors ${
              activeFilterCount > 0 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400'
            }`}
          >
            <FunnelIcon className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 max-h-96 overflow-hidden">
          {/* Quick Actions */}
          {activeFilterCount > 0 && (
            <div className="p-3 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Active Filters ({activeFilterCount})
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Clear All
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {query && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    Search: "{query}"
                    <button
                      onClick={() => setQuery('')}
                      className="ml-1 hover:text-blue-600 dark:hover:text-blue-100"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {Object.entries(activeFilters).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-300"
                  >
                    {filters[key]?.label || key}: {Array.isArray(value) ? value.join(', ') : value}
                    <button
                      onClick={() => clearFilter(key)}
                      className="ml-1 hover:text-gray-600 dark:hover:text-slate-100"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto">
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Suggestions
                </h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <MagnifyingGlassIcon className="h-4 w-4 inline mr-2" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center"
                    >
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            {Object.keys(filters).length > 0 && (
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3 flex items-center">
                  <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                  Filters
                </h4>
                
                <div className="space-y-4">
                  {Object.entries(filters).map(([key, config]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                        {config.label}
                      </label>
                      
                      {config.type === 'select' && (
                        <select
                          value={activeFilters[key] || ''}
                          onChange={(e) => handleFilterChange(key, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All {config.label}</option>
                          {config.options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {config.type === 'multiselect' && (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {config.options.map(option => (
                            <label key={option.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={activeFilters[key]?.includes?.(option.value) || false}
                                onChange={(e) => {
                                  const current = activeFilters[key] || [];
                                  const newValue = e.target.checked
                                    ? [...current, option.value]
                                    : current.filter(v => v !== option.value);
                                  handleFilterChange(key, newValue);
                                }}
                                className="rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-slate-300">
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {config.type === 'range' && (
                        <div className="space-y-2">
                          <input
                            type="range"
                            min={config.min}
                            max={config.max}
                            value={activeFilters[key]?.[1] || config.max}
                            onChange={(e) => {
                              const current = activeFilters[key] || [config.min, config.max];
                              handleFilterChange(key, [current[0], parseInt(e.target.value)]);
                            }}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-600 dark:text-slate-400">
                            <span>{activeFilters[key]?.[0] || config.min}</span>
                            <span>{activeFilters[key]?.[1] || config.max}</span>
                          </div>
                        </div>
                      )}
                      
                      {config.type === 'date' && (
                        <input
                          type="date"
                          value={activeFilters[key] || ''}
                          onChange={(e) => handleFilterChange(key, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSystem;
