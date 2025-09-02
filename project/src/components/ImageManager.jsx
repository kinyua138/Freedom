import React, { useState, useEffect, useRef } from 'react';
import { UploadIcon, ImageIcon, TrashIcon, EditIcon, DownloadIcon, CopyIcon, FolderIcon, GridIcon, ListIcon, SearchIcon } from 'lucide-react';

const ImageManager = ({ isOpen, onClose, onImageSelect }) => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [folders, setFolders] = useState(['all', 'uploads', 'screenshots', 'icons', 'backgrounds']);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  // Load images from localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('imageManager');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  // Save images to localStorage
  const saveImages = (newImages) => {
    setImages(newImages);
    localStorage.setItem('imageManager', JSON.stringify(newImages));
  };

  // Handle file upload
  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files);
    const newImages = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        continue;
      }

      // Create progress entry
      const progressId = Date.now() + i;
      setUploadProgress(prev => ({ ...prev, [progressId]: 0 }));

      try {
        // Convert file to base64
        const base64 = await fileToBase64(file);
        
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({ ...prev, [progressId]: progress }));
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Create image object
        const imageObj = {
          id: Date.now() + i,
          name: file.name,
          size: file.size,
          type: file.type,
          folder: selectedFolder === 'all' ? 'uploads' : selectedFolder,
          uploadDate: new Date().toISOString(),
          base64: base64,
          width: 0,
          height: 0,
          tags: []
        };

        // Get image dimensions
        const dimensions = await getImageDimensions(base64);
        imageObj.width = dimensions.width;
        imageObj.height = dimensions.height;

        newImages.push(imageObj);

        // Remove progress entry
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[progressId];
          return newProgress;
        });

      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[progressId];
          return newProgress;
        });
      }
    }

    if (newImages.length > 0) {
      saveImages([...images, ...newImages]);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Get image dimensions
  const getImageDimensions = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = src;
    });
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  // Filter images
  const getFilteredImages = () => {
    let filtered = images;

    // Filter by folder
    if (selectedFolder !== 'all') {
      filtered = filtered.filter(img => img.folder === selectedFolder);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  // Delete images
  const deleteImages = (imageIds) => {
    const newImages = images.filter(img => !imageIds.includes(img.id));
    saveImages(newImages);
    setSelectedImages([]);
  };

  // Copy image URL
  const copyImageUrl = async (image) => {
    try {
      await navigator.clipboard.writeText(image.base64);
      // Add toast notification here
    } catch (err) {
      console.error('Failed to copy image URL:', err);
    }
  };

  // Download image
  const downloadImage = (image) => {
    const link = document.createElement('a');
    link.href = image.base64;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Toggle image selection
  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  if (!isOpen) return null;

  const filteredImages = getFilteredImages();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Image Manager</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">Upload and manage your images</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedImages.length > 0 && (
              <button
                onClick={() => deleteImages(selectedImages)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Delete ({selectedImages.length})</span>
              </button>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <UploadIcon className="w-4 h-4" />
              <span>Upload</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <span className="text-2xl text-gray-500 dark:text-slate-400">×</span>
            </button>
          </div>
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
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Folder Filter */}
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              {folders.map(folder => (
                <option key={folder} value={folder}>
                  {folder === 'all' ? 'All Folders' : folder.charAt(0).toUpperCase() + folder.slice(1)}
                </option>
              ))}
            </select>

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

        {/* Upload Area */}
        <div
          className={`m-6 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon className="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Drop images here or click to upload
          </h3>
          <p className="text-gray-600 dark:text-slate-400">
            Supports JPG, PNG, GIF, WebP up to 10MB
          </p>
          
          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([id, progress]) => (
                <div key={id} className="bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-400px)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-slate-400">
              {filteredImages.length} images
              {selectedImages.length > 0 && ` • ${selectedImages.length} selected`}
            </div>
            {selectedImages.length > 0 && (
              <button
                onClick={() => setSelectedImages([])}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Clear selection
              </button>
            )}
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`group relative bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedImages.includes(image.id) ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                  }`}
                  onClick={() => onImageSelect && onImageSelect(image)}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleImageSelection(image.id);
                      }}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* Image */}
                  <div className="aspect-square">
                    <img
                      src={image.base64}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyImageUrl(image);
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Copy URL"
                      >
                        <CopyIcon className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(image);
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Download"
                      >
                        <DownloadIcon className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImages([image.id]);
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {image.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">
                      {image.width} × {image.height} • {formatFileSize(image.size)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`flex items-center space-x-4 p-3 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all ${
                    selectedImages.includes(image.id) ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:border-gray-300 dark:hover:border-slate-600'
                  }`}
                  onClick={() => onImageSelect && onImageSelect(image)}
                >
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleImageSelection(image.id);
                    }}
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                  />

                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={image.base64}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {image.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-slate-400">
                      {image.width} × {image.height} • {formatFileSize(image.size)} • {image.folder}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-slate-500">
                      {new Date(image.uploadDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyImageUrl(image);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-500 rounded-lg transition-colors"
                      title="Copy URL"
                    >
                      <CopyIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image);
                      }}
                      className="p-2 text-gray-400 hover:text-green-500 rounded-lg transition-colors"
                      title="Download"
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImages([image.id]);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No images found</h3>
              <p className="text-gray-600 dark:text-slate-400">Upload some images to get started</p>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageManager;
