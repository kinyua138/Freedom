import React, { useState } from 'react';
import { 
  Settings, 
  FileText,
  Type, 
  Palette, 
  Layout,
  Zap,
  Accessibility,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

import PageManager from './PageManager';
import FileStructurePanel from './FileStructurePanel';

const PropertiesPanel = ({
  selectedComponent,
  showPageManager,
  pages,
  onPagesChange,
  onTogglePageManager,
  components,
  onDeleteComponent,
  onDuplicateComponent,
  onUpdateProperty,
  onUpdateStyle,
  onUpdateInteraction,
 onUpdateAccessibility,
  onNavigateToPage
}) => {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    style: false,
    layout: false,
    interactive: false,
    accessibility: false
  });

  if (showPageManager) {
    return (
      <PageManager 
        pages={pages}
        onPagesChange={onPagesChange}
        onBack={onTogglePageManager}
      />
    );
  }

  // Show file structure when no component is selected
  if (!selectedComponent) {
    return (
      <FileStructurePanel
        components={components}
        selectedComponentId={null}
        onSelectComponent={(id) => {
          // This will be handled by the parent component
          window.dispatchEvent(new CustomEvent('selectComponent', { detail: { id } }));
        }}
        onUpdateComponent={onUpdateProperty}
        onDeleteComponent={onDeleteComponent}
        onDuplicateComponent={onDuplicateComponent}
      />
    );
  }
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };


  const PropertySection = ({ title, icon: Icon, isExpanded, onToggle, children }) => (
    <div className="mb-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-800">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  const ColorInput = ({ label, value, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer hover:scale-105 transition-transform duration-200"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  const SelectInput = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const NumberInput = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex items-center space-x-1 min-w-0">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500"
          />
          {unit && <span className="text-xs text-gray-500">{unit}</span>}
        </div>
      </div>
    </div>
  );

  const ToggleInput = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          value ? 'bg-purple-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const SpacingInput = ({ label, value, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Top</label>
          <input
            type="number"
            min="0"
            value={value?.top || 0}
            onChange={(e) => onChange({ ...value, top: Number(e.target.value) })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Right</label>
          <input
            type="number"
            min="0"
            value={value?.right || 0}
            onChange={(e) => onChange({ ...value, right: Number(e.target.value) })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Bottom</label>
          <input
            type="number"
            min="0"
            value={value?.bottom || 0}
            onChange={(e) => onChange({ ...value, bottom: Number(e.target.value) })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Left</label>
          <input
            type="number"
            min="0"
            value={value?.left || 0}
            onChange={(e) => onChange({ ...value, left: Number(e.target.value) })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );

  // Default values for safety
  const style = selectedComponent.style || {};
  const interactions = selectedComponent.interactions || {};
  const accessibility = selectedComponent.accessibility || {};

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      {/* Page Manager Button */}
      <button
        onClick={onTogglePageManager}
        className="w-full flex items-center justify-center space-x-2 p-3 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-purple-100 hover:border-blue-300 transition-all duration-300 group"
      >
        <FileText className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium text-blue-700">Manage Pages</span>
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Properties</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Editing {selectedComponent.type}</span>
        </div>
      </div>

      {/* General Properties */}
      <PropertySection
        title="General"
        icon={Settings}
        isExpanded={expandedSections.general}
        onToggle={() => toggleSection('general')}
      >
        <div className="space-y-4">
          {/* Dynamic property inputs based on component type */}
          {Object.keys(selectedComponent.props).map((propKey) => {
            if (propKey === 'visible' || propKey === 'disabled') return null;
            
            return (
              <div key={propKey}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {propKey.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  value={selectedComponent.props[propKey] || ''}
                  onChange={(e) => onUpdateProperty(propKey, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Enter ${propKey.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                />
              </div>
            );
          })}
          
          <ToggleInput
            label="Visible"
            value={selectedComponent.props.visible !== false}
            onChange={(value) => onUpdateProperty('visible', value)}
          />
          
          <ToggleInput
            label="Enabled"
            value={selectedComponent.props.disabled !== true}
            onChange={(value) => onUpdateProperty('disabled', !value)}
          />
        </div>
      </PropertySection>

      {/* Style Properties */}
      <PropertySection
        title="Style"
        icon={Palette}
        isExpanded={expandedSections.style}
        onToggle={() => toggleSection('style')}
      >
        <div className="space-y-4">
          <ColorInput
            label="Background Color"
            value={style.backgroundColor || '#3B82F6'}
            onChange={(value) => onUpdateStyle('backgroundColor', value)}
          />
          
          <ColorInput
            label="Text Color"
            value={style.textColor || '#FFFFFF'}
            onChange={(value) => onUpdateStyle('textColor', value)}
          />
          
          <ColorInput
            label="Border Color"
            value={style.borderColor || '#E5E7EB'}
            onChange={(value) => onUpdateStyle('borderColor', value)}
          />

          <SelectInput
            label="Font Family"
            value={style.fontFamily || 'Inter'}
            onChange={(value) => onUpdateStyle('fontFamily', value)}
            options={[
              { value: 'Inter', label: 'Inter' },
              { value: 'system-ui', label: 'System UI' },
              { value: 'serif', label: 'Serif' },
              { value: 'mono', label: 'Monospace' }
            ]}
          />

          <SelectInput
            label="Font Size"
            value={style.fontSize || 'base'}
            onChange={(value) => onUpdateStyle('fontSize', value)}
            options={[
              { value: 'xs', label: 'Extra Small' },
              { value: 'sm', label: 'Small' },
              { value: 'base', label: 'Base' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra Large' },
              { value: '2xl', label: '2X Large' }
            ]}
          />

          <SelectInput
            label="Font Weight"
            value={style.fontWeight || 'medium'}
            onChange={(value) => onUpdateStyle('fontWeight', value)}
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'medium', label: 'Medium' },
              { value: 'semibold', label: 'Semi Bold' },
              { value: 'bold', label: 'Bold' }
            ]}
          />

          <SelectInput
            label="Text Align"
            value={style.textAlign || 'center'}
            onChange={(value) => onUpdateStyle('textAlign', value)}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' }
            ]}
          />

          <NumberInput
            label="Border Width"
            value={style.borderWidth || 0}
            onChange={(value) => onUpdateStyle('borderWidth', value)}
            min={0}
            max={10}
            unit="px"
          />

          <SelectInput
            label="Border Style"
            value={style.borderStyle || 'solid'}
            onChange={(value) => onUpdateStyle('borderStyle', value)}
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'dashed', label: 'Dashed' },
              { value: 'dotted', label: 'Dotted' },
              { value: 'none', label: 'None' }
            ]}
          />

          <SelectInput
            label="Border Radius"
            value={style.borderRadius || 'lg'}
            onChange={(value) => onUpdateStyle('borderRadius', value)}
            options={[
              { value: 'none', label: 'Square' },
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra Large' },
              { value: 'full', label: 'Full Round' }
            ]}
          />

          <SelectInput
            label="Box Shadow"
            value={style.boxShadow || 'md'}
            onChange={(value) => onUpdateStyle('boxShadow', value)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra Large' }
            ]}
          />

          <NumberInput
            label="Opacity"
            value={style.opacity || 100}
            onChange={(value) => onUpdateStyle('opacity', value)}
            min={0}
            max={100}
            unit="%"
          />
        </div>
      </PropertySection>

      {/* Layout Properties */}
      <PropertySection
        title="Layout"
        icon={Layout}
        isExpanded={expandedSections.layout}
        onToggle={() => toggleSection('layout')}
      >
        <div className="space-y-4">
          <SelectInput
            label="Width"
            value={style.customWidth ? `${style.customWidth}px` : 'auto'}
            onChange={(value) => {
              if (value === 'auto') {
                onUpdateStyle('customWidth', null);
              } else {
                const numValue = parseInt(value);
                if (!isNaN(numValue)) {
                  onUpdateStyle('customWidth', numValue);
                }
              }
            }}
            options={[
              { value: 'auto', label: 'Auto' },
              { value: '200', label: '200px' },
              { value: '300', label: '300px' },
              { value: '400', label: '400px' },
              { value: '500', label: '500px' },
              { value: '600', label: '600px' }
            ]}
          />

          <SelectInput
            label="Height"
            value={style.customHeight ? `${style.customHeight}px` : 'auto'}
            onChange={(value) => {
              if (value === 'auto') {
                onUpdateStyle('customHeight', null);
              } else {
                const numValue = parseInt(value);
                if (!isNaN(numValue)) {
                  onUpdateStyle('customHeight', numValue);
                }
              }
            }}
            options={[
              { value: 'auto', label: 'Auto' },
              { value: '100', label: '100px' },
              { value: '200', label: '200px' },
              { value: '300', label: '300px' },
              { value: '400', label: '400px' },
              { value: '500', label: '500px' }
            ]}
          />

          <NumberInput
            label="Custom Width"
            value={style.customWidth || 200}
            onChange={(value) => onUpdateStyle('customWidth', value)}
            min={50}
            max={1200}
            unit="px"
          />

          <NumberInput
            label="Custom Height"
            value={style.customHeight || 100}
            onChange={(value) => onUpdateStyle('customHeight', value)}
            min={30}
            max={800}
            unit="px"
          />

          <SpacingInput
            label="Margin"
            value={style.margin || { top: 0, right: 0, bottom: 0, left: 0 }}
            onChange={(value) => onUpdateStyle('margin', value)}
          />

          <SpacingInput
            label="Padding"
            value={style.padding || { top: 12, right: 24, bottom: 12, left: 24 }}
            onChange={(value) => onUpdateStyle('padding', value)}
          />

          <NumberInput
            label="Rotate"
            value={style.rotate || 0}
            onChange={(value) => onUpdateStyle('rotate', value)}
            min={-180}
            max={180}
            unit="°"
          />

          <NumberInput
            label="Scale"
            value={style.scale || 100}
            onChange={(value) => onUpdateStyle('scale', value)}
            min={50}
            max={200}
            unit="%"
          />
        </div>
      </PropertySection>

      {/* Interactive Properties */}
      <PropertySection
        title="Interactive"
        icon={Zap}
        isExpanded={expandedSections.interactive}
        onToggle={() => toggleSection('interactive')}
      >
        <div className="space-y-4">
          <SelectInput
            label="On Click Action"
            value={interactions.onClick?.action || 'none'}
            onChange={(value) => onUpdateInteraction('onClick', { ...interactions.onClick, action: value })}
            options={[
              { value: 'none', label: 'None' },
              { value: 'navigate', label: 'Navigate to Page' },
              { value: 'modal', label: 'Open Modal' },
              { value: 'alert', label: 'Show Alert' }
            ]}
          />

          {interactions.onClick?.action === 'navigate' && (
            <SelectInput
              label="Navigate To"
              value={interactions.onClick?.value || pages[0]?.id || ''}
              onChange={(value) => onUpdateInteraction('onClick', { ...interactions.onClick, value })}
              options={[
                ...pages.map(page => ({
                  value: page.id,
                  label: page.name
                }))
              ]}
            />
          )}

          {interactions.onClick?.action === 'alert' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alert Message</label>
              <input
                type="text"
                value={interactions.onClick?.value || ''}
                onChange={(e) => onUpdateInteraction('onClick', { ...interactions.onClick, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter alert message"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link URL (Optional)</label>
            <input
              type="url"
              value={interactions.linkUrl || ''}
              onChange={(e) => onUpdateInteraction('linkUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="https://example.com"
            />
          </div>

          <SelectInput
            label="Hover Animation"
            value={interactions.hoverAnimation || 'scale'}
            onChange={(value) => onUpdateInteraction('hoverAnimation', value)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'scale', label: 'Scale' },
              { value: 'bounce', label: 'Bounce' },
              { value: 'pulse', label: 'Pulse' },
              { value: 'glow', label: 'Glow' }
            ]}
          />
        </div>
      </PropertySection>

      {/* Accessibility Properties */}
      <PropertySection
        title="Accessibility"
        icon={Accessibility}
        isExpanded={expandedSections.accessibility}
        onToggle={() => toggleSection('accessibility')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ARIA Label</label>
            <input
              type="text"
              value={accessibility.ariaLabel || ''}
              onChange={(e) => onUpdateAccessibility('ariaLabel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Describe the element's purpose"
            />
          </div>

          <NumberInput
            label="Tab Index"
            value={accessibility.tabIndex || 0}
            onChange={(value) => onUpdateAccessibility('tabIndex', value)}
            min={-1}
            max={100}
          />
        </div>
      </PropertySection>

      {/* Component Info */}
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl">
        <h3 className="font-medium text-blue-800 mb-2">Component Info</h3>
        <div className="space-y-1 text-sm">
          <p className="text-blue-700">ID: <span className="font-mono text-xs">{selectedComponent.id}</span></p>
          <p className="text-blue-700">Type: {selectedComponent.type}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;

export { PropertiesPanel }