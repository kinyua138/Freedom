import React, { useState, useEffect } from 'react';
import { PaletteIcon, CopyIcon, RefreshCwIcon, SaveIcon, HeartIcon } from 'lucide-react';

const ColorPaletteGenerator = ({ isOpen, onClose, onColorSelect }) => {
  const [palettes, setPalettes] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [activeTab, setActiveTab] = useState('generator');
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [paletteType, setPaletteType] = useState('complementary');

  // Load saved palettes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('colorPalettes');
    if (saved) {
      setSavedPalettes(JSON.parse(saved));
    }
  }, []);

  // Color harmony algorithms
  const generatePalette = (base, type) => {
    const hsl = hexToHsl(base);
    let colors = [];

    switch (type) {
      case 'complementary':
        colors = [
          base,
          hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
          hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 100)),
          hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 0)),
          hslToHex((hsl.h + 180) % 360, hsl.s, Math.min(hsl.l + 15, 100))
        ];
        break;
      case 'triadic':
        colors = [
          base,
          hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
          hslToHex(hsl.h, Math.max(hsl.s - 20, 0), hsl.l),
          hslToHex(hsl.h, Math.min(hsl.s + 20, 100), hsl.l)
        ];
        break;
      case 'analogous':
        colors = [
          hslToHex((hsl.h - 30) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h - 15) % 360, hsl.s, hsl.l),
          base,
          hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
        ];
        break;
      case 'monochromatic':
        colors = [
          hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 40, 0)),
          hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 0)),
          base,
          hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 100)),
          hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 40, 100))
        ];
        break;
      default:
        colors = [base];
    }

    return colors;
  };

  // Generate random palettes
  const generateRandomPalettes = () => {
    const types = ['complementary', 'triadic', 'analogous', 'monochromatic'];
    const newPalettes = [];

    for (let i = 0; i < 6; i++) {
      const randomHue = Math.floor(Math.random() * 360);
      const randomSat = 60 + Math.floor(Math.random() * 40);
      const randomLight = 40 + Math.floor(Math.random() * 40);
      const randomBase = hslToHex(randomHue, randomSat, randomLight);
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      newPalettes.push({
        id: Date.now() + i,
        name: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} Palette ${i + 1}`,
        type: randomType,
        colors: generatePalette(randomBase, randomType)
      });
    }

    setPalettes(newPalettes);
  };

  // Generate palette from base color
  const generateFromBase = () => {
    const newPalette = {
      id: Date.now(),
      name: `${paletteType.charAt(0).toUpperCase() + paletteType.slice(1)} Palette`,
      type: paletteType,
      colors: generatePalette(baseColor, paletteType)
    };
    setPalettes([newPalette, ...palettes.slice(0, 5)]);
  };

  // Save palette
  const savePalette = (palette) => {
    const newSaved = [...savedPalettes, { ...palette, savedAt: new Date().toISOString() }];
    setSavedPalettes(newSaved);
    localStorage.setItem('colorPalettes', JSON.stringify(newSaved));
  };

  // Copy color to clipboard
  const copyColor = async (color) => {
    try {
      await navigator.clipboard.writeText(color);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  // Color conversion utilities
  function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Initialize with random palettes
  useEffect(() => {
    if (palettes.length === 0) {
      generateRandomPalettes();
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <PaletteIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Color Palette Generator</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">Create beautiful color harmonies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="text-2xl text-gray-500 dark:text-slate-400">×</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'generator'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Generator
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'saved'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Saved Palettes ({savedPalettes.length})
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'generator' && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Base Color
                  </label>
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-16 h-10 rounded-lg border border-gray-300 dark:border-slate-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Harmony Type
                  </label>
                  <select
                    value={paletteType}
                    onChange={(e) => setPaletteType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="complementary">Complementary</option>
                    <option value="triadic">Triadic</option>
                    <option value="analogous">Analogous</option>
                    <option value="monochromatic">Monochromatic</option>
                  </select>
                </div>
                <button
                  onClick={generateFromBase}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <PaletteIcon className="w-4 h-4" />
                  <span>Generate</span>
                </button>
                <button
                  onClick={generateRandomPalettes}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <RefreshCwIcon className="w-4 h-4" />
                  <span>Random</span>
                </button>
              </div>

              {/* Generated Palettes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {palettes.map((palette) => (
                  <div key={palette.id} className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{palette.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => savePalette(palette)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Save palette"
                        >
                          <HeartIcon className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                        </button>
                      </div>
                    </div>
                    <div className="flex rounded-lg overflow-hidden shadow-sm">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 h-20 relative group cursor-pointer"
                          style={{ backgroundColor: color }}
                          onClick={() => copyColor(color)}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <CopyIcon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-1 left-1 right-1">
                            <div className="text-xs font-mono text-white bg-black/50 rounded px-1 py-0.5 text-center">
                              {color.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-4">
              {savedPalettes.length === 0 ? (
                <div className="text-center py-12">
                  <PaletteIcon className="w-16 h-16 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No saved palettes</h3>
                  <p className="text-gray-600 dark:text-slate-400">Save palettes from the generator to see them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedPalettes.map((palette, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{palette.name}</h3>
                        <span className="text-xs text-gray-500 dark:text-slate-500">
                          {new Date(palette.savedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex rounded-lg overflow-hidden shadow-sm">
                        {palette.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="flex-1 h-20 relative group cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => copyColor(color)}
                          >
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <CopyIcon className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="absolute bottom-1 left-1 right-1">
                              <div className="text-xs font-mono text-white bg-black/50 rounded px-1 py-0.5 text-center">
                                {color.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteGenerator;
