import React from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { templates, generateTemplateInstance } from '@/lib/editor/templates/registry';
import { LayoutTemplate } from 'lucide-react';

export function TemplatesPanel() {
  const { applyTemplate } = useEditorStore();

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    if (window.confirm(`Are you sure you want to apply the "${template.name}" template? This will replace your current canvas.`)) {
      const { blocks, rootChildren, globalStyles } = generateTemplateInstance(template);
      applyTemplate(blocks, rootChildren, globalStyles);
    }
  };

  return (
    <div className="text-sm pb-10">
      <div className="flex items-center space-x-2 px-2 mb-4">
        <LayoutTemplate size={16} className="text-indigo-400" />
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Template Library</h3>
      </div>
      
      <div className="space-y-4 px-2">
        {templates.map((template) => (
          <div 
            key={template.id}
            className="flex flex-col rounded-lg overflow-hidden border border-[#3f3f46] bg-[#121214] hover:border-indigo-500 transition-colors group cursor-pointer"
            onClick={() => handleApplyTemplate(template.id)}
          >
            {/* Mock Thumbnail Image - In production this would use template.thumbnail */}
            <div className="aspect-video bg-[#09090B] border-b border-[#3f3f46] flex items-center justify-center p-4 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent z-0"></div>
               <div className="w-full h-full border border-dashed border-gray-700 rounded bg-[#18181B] z-10 flex items-center justify-center shadow-inner">
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{template.category}</span>
               </div>
               
               {/* Hover Overlay */}
               <div className="absolute inset-0 bg-indigo-600/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                 <span className="text-white font-medium text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">Use Template</span>
               </div>
            </div>
            <div className="p-3">
              <span className="block text-sm font-medium text-gray-200 mb-1">{template.name}</span>
              <span className="block text-xs text-gray-500">{template.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
