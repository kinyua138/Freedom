import React, { useState, useEffect } from 'react';
import { TypeIcon, CopyIcon, DownloadIcon, EyeIcon } from 'lucide-react';

const TypographySystem = ({ isOpen, onClose, onFontSelect }) => {
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [fontWeight, setFontWeight] = useState(400);
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');
  const [activeTab, setActiveTab] = useState('fonts');
  const [customFonts, setCustomFonts] = useState([]);

  // Popular web fonts
  const webFonts = [
    { name: 'Inter', category: 'Sans Serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { name: 'Roboto', category: 'Sans Serif', weights: [100, 300, 400, 500, 700, 900] },
    { name: 'Open Sans', category: 'Sans Serif', weights: [300, 400, 500, 600, 700, 800] },
    { name: 'Lato', category: 'Sans Serif', weights: [100, 300, 400, 700, 900] },
    { name: 'Montserrat', category: 'Sans Serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { name: 'Poppins', category: 'Sans Serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
    { name: 'Source Sans Pro', category: 'Sans Serif', weights: [200, 300, 400, 600, 700, 900] },
    { name: 'Nunito', category: 'Sans Serif', weights: [200, 300, 400, 500, 600, 700, 800, 900] },
    { name: 'Playfair Display', category: 'Serif', weights: [400, 500, 600, 700, 800, 900] },
    { name: 'Merriweather', category: 'Serif', weights: [300, 400, 700, 900] },
    { name: 'Lora', category: 'Serif', weights: [400, 500, 600, 700] },
    { name: 'PT Serif', category: 'Serif', weights: [400, 700] },
    { name: 'Fira Code', category: 'Monospace', weights: [300, 400, 500, 600, 700] },
    { name: 'Source Code Pro', category: 'Monospace', weights: [200, 300, 400, 500, 600, 700, 800, 900] },
    { name: 'JetBrains Mono', category: 'Monospace', weights: [100, 200, 300, 400, 500, 600, 700, 800] },
    { name: 'Dancing Script', category: 'Handwriting', weights: [400, 500, 600, 700] },
    { name: 'Pacifico', category: 'Handwriting', weights: [400] },
    { name: 'Lobster', category: 'Display', weights: [400] }
  ];

  // Typography scales
  const typographyScales = {
    'Minor Second': 1.067,
    'Major Second': 1.125,
    'Minor Third': 1.2,
    'Major Third': 1.25,
    'Perfect Fourth': 1.333,
    'Augmented Fourth': 1.414,
    'Perfect Fifth': 1.5,
    'Golden Ratio': 1.618
  };

  // Generate typography scale
  const generateScale = (baseSize, ratio, steps = 8) => {
    const scale = [];
    for (let i = -2; i <= steps - 3; i++) {
      const size = Math.round(baseSize * Math.pow(ratio, i));
      scale.push(size);
    }
    return scale.reverse();
  };

  // Load Google Font
  const loadGoogleFont = (fontName) => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
    link.rel = 'stylesheet';
    
    // Check if font is already loaded
    const existingLink = document.querySelector(`link[href*="${fontName.replace(' ', '+')}"]`);
    if (!existingLink) {
      document.head.appendChild(link);
    }
  };

  // Generate CSS for typography system
  const generateCSS = () => {
    const scale = generateScale(fontSize, typographyScales['Perfect Fourth']);
    
    return `
/* Typography System */
:root {
  --font-family-primary: '${selectedFont}', sans-serif;
  --font-size-base: ${fontSize}px;
  --line-height-base: ${lineHeight};
  --letter-spacing-base: ${letterSpacing}em;
  --font-weight-base: ${fontWeight};
}

/* Typography Scale */
.text-xs { font-size: ${scale[0]}px; }
.text-sm { font-size: ${scale[1]}px; }
.text-base { font-size: ${scale[2]}px; }
.text-lg { font-size: ${scale[3]}px; }
.text-xl { font-size: ${scale[4]}px; }
.text-2xl { font-size: ${scale[5]}px; }
.text-3xl { font-size: ${scale[6]}px; }
.text-4xl { font-size: ${scale[7]}px; }
.text-5xl { font-size: ${scale[8]}px; }

/* Font Weights */
.font-thin { font-weight: 100; }
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-extrabold { font-weight: 800; }
.font-black { font-weight: 900; }

/* Line Heights */
.leading-tight { line-height: 1.25; }
.leading-snug { line-height: 1.375; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.625; }
.leading-loose { line-height: 2; }

/* Letter Spacing */
.tracking-tighter { letter-spacing: -0.05em; }
.tracking-tight { letter-spacing: -0.025em; }
.tracking-normal { letter-spacing: 0em; }
.tracking-wide { letter-spacing: 0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.tracking-widest { letter-spacing: 0.1em; }
`;
  };

  // Copy CSS to clipboard
  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS());
      // Add toast notification here
    } catch (err) {
      console.error('Failed to copy CSS:', err);
    }
  };

  // Download CSS file
  const downloadCSS = () => {
    const css = generateCSS();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typography-system.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load selected font
  useEffect(() => {
    if (selectedFont !== 'system') {
      loadGoogleFont(selectedFont);
    }
  }, [selectedFont]);

  if (!isOpen) return null;

  const currentFont = webFonts.find(f => f.name === selectedFont);
  const scale = generateScale(fontSize, typographyScales['Perfect Fourth']);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TypeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Typography System</h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">Design consistent typography scales</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyCSS}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <CopyIcon className="w-4 h-4" />
              <span>Copy CSS</span>
            </button>
            <button
              onClick={downloadCSS}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
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

        <div className="flex h-[calc(90vh-100px)]">
          {/* Controls Panel */}
          <div className="w-80 border-r border-gray-200 dark:border-slate-700 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Font Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                  Font Family
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {webFonts.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => setSelectedFont(font.name)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedFont === font.name
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                      }`}
                      style={{ fontFamily: font.name }}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{font.name}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">{font.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Properties */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Base Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Line Height: {lineHeight}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Letter Spacing: {letterSpacing}em
                  </label>
                  <input
                    type="range"
                    min="-0.1"
                    max="0.2"
                    step="0.01"
                    value={letterSpacing}
                    onChange={(e) => setLetterSpacing(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Font Weight
                  </label>
                  <select
                    value={fontWeight}
                    onChange={(e) => setFontWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    {currentFont?.weights.map((weight) => (
                      <option key={weight} value={weight}>
                        {weight} - {
                          weight <= 200 ? 'Thin' :
                          weight <= 300 ? 'Light' :
                          weight <= 400 ? 'Normal' :
                          weight <= 500 ? 'Medium' :
                          weight <= 600 ? 'Semibold' :
                          weight <= 700 ? 'Bold' :
                          weight <= 800 ? 'Extrabold' : 'Black'
                        }
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Preview Text
                </label>
                <textarea
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white resize-none"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-8">
              {/* Typography Scale Preview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Typography Scale</h3>
                <div className="space-y-4">
                  {[
                    { name: 'text-5xl', size: scale[8], label: 'Heading 1' },
                    { name: 'text-4xl', size: scale[7], label: 'Heading 2' },
                    { name: 'text-3xl', size: scale[6], label: 'Heading 3' },
                    { name: 'text-2xl', size: scale[5], label: 'Heading 4' },
                    { name: 'text-xl', size: scale[4], label: 'Heading 5' },
                    { name: 'text-lg', size: scale[3], label: 'Heading 6' },
                    { name: 'text-base', size: scale[2], label: 'Body Text' },
                    { name: 'text-sm', size: scale[1], label: 'Small Text' },
                    { name: 'text-xs', size: scale[0], label: 'Caption' }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center space-x-4">
                      <div className="w-20 text-xs text-gray-500 dark:text-slate-400 font-mono">
                        {item.size}px
                      </div>
                      <div className="w-24 text-xs text-gray-500 dark:text-slate-400">
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontFamily: selectedFont,
                          fontSize: `${item.size}px`,
                          lineHeight: lineHeight,
                          letterSpacing: `${letterSpacing}em`,
                          fontWeight: fontWeight
                        }}
                        className="text-gray-900 dark:text-white"
                      >
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sample Content</h3>
                <div
                  style={{
                    fontFamily: selectedFont,
                    lineHeight: lineHeight,
                    letterSpacing: `${letterSpacing}em`
                  }}
                  className="space-y-4"
                >
                  <h1
                    style={{ fontSize: `${scale[8]}px`, fontWeight: 700 }}
                    className="text-gray-900 dark:text-white"
                  >
                    Main Heading
                  </h1>
                  <h2
                    style={{ fontSize: `${scale[6]}px`, fontWeight: 600 }}
                    className="text-gray-900 dark:text-white"
                  >
                    Section Heading
                  </h2>
                  <p
                    style={{ fontSize: `${scale[2]}px`, fontWeight: fontWeight }}
                    className="text-gray-700 dark:text-slate-300"
                  >
                    {previewText}
                  </p>
                  <p
                    style={{ fontSize: `${scale[1]}px`, fontWeight: fontWeight }}
                    className="text-gray-600 dark:text-slate-400"
                  >
                    This is smaller body text that might be used for captions or secondary information.
                  </p>
                </div>
              </div>

              {/* Font Weights Preview */}
              {currentFont && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Weights</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentFont.weights.map((weight) => (
                      <div
                        key={weight}
                        style={{
                          fontFamily: selectedFont,
                          fontSize: `${fontSize}px`,
                          fontWeight: weight,
                          lineHeight: lineHeight,
                          letterSpacing: `${letterSpacing}em`
                        }}
                        className="text-gray-900 dark:text-white"
                      >
                        Weight {weight}: The quick brown fox
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographySystem;
