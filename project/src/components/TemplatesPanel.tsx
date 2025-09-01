import React from 'react';
import { Square, Move, Sparkles } from 'lucide-react';
import { TemplateComponent, DragData } from '../types';

interface TemplatesPanelProps {
  templates: TemplateComponent[];
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ templates }) => {
  const handleDragStart = (e: React.DragEvent, template: TemplateComponent) => {
    const dragData: DragData = {
      type: 'template',
      componentType: template.type
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-gray-200/50 p-6 overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Templates</h2>
        </div>
        <p className="text-sm text-gray-600">Drag components to build your interface</p>
      </div>
      
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.type}
            draggable
            onDragStart={(e) => handleDragStart(e, template)}
            className="group relative bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border border-purple-200/50 rounded-xl p-5 cursor-move transition-all duration-300 hover:shadow-lg hover:scale-105 hover:from-purple-100 hover:via-blue-100 hover:to-indigo-100 hover:border-purple-300/50"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 border border-gray-100">
                  <Square className="w-6 h-6 text-purple-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-base">{template.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Interactive component</p>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Move className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            {/* Drag indicator */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/50 rounded-xl">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-emerald-800">Quick Tips</h3>
        </div>
        <ul className="space-y-2 text-xs text-emerald-700">
          <li className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Drag components to the canvas to add them</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Click components to select and edit properties</span>
          </li>
          <li className="flex items-start space-x-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Changes update in real-time</span>
          </li>
        </ul>
      </div>
    </div>
  );
};