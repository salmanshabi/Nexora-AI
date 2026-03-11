import React from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo, 
  Redo, 
  Play, 
  Save, 
  ChevronLeft,
  ChevronDown,
  Sparkles,
  Loader2,
  Send
} from 'lucide-react';
import Link from 'next/link';

import { templates, generateTemplateInstance } from '@/lib/editor/templates/registry';

export function TopToolbar() {
  const { deviceMode, setDeviceMode, undo, redo, history, isPreviewMode, togglePreviewMode, blocks, addBlock, updateGlobalStyles, updateBlockStyles, applyTemplate } = useEditorStore();
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiInput, setAiInput] = React.useState('');

  const handlePublish = () => {
    alert('Site published successfully!');
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiLoading) return;

    setIsAiLoading(true);
    try {
      const res = await fetch('/api/editor/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiInput, currentState: blocks })
      });

      if (!res.ok) throw new Error("Failed to fetch from AI");

      const data = await res.json();
      
      if (data.mutations && Array.isArray(data.mutations)) {
        data.mutations.forEach((mut: { 
          action: string; 
          blockType?: "section" | "hero" | "features" | "pricing" | "testimonials" | "navbar" | "grid" | "container" | "text" | "image" | "button"; 
          parentId?: string; 
          styles?: Record<string, unknown>; 
          id?: string; 
          baseTemplateId?: string; 
          overrides?: Record<string, { props?: Record<string, unknown>; styles?: Record<string, unknown> }> 
        }) => {
          if (mut.action === 'addBlock' && mut.blockType && mut.parentId) {
            addBlock(mut.blockType, mut.parentId);
          } else if (mut.action === 'updateGlobalStyles' && mut.styles) {
            updateGlobalStyles(mut.styles);
          } else if (mut.action === 'updateBlockStyles' && mut.id && mut.styles) {
            updateBlockStyles(mut.id, mut.styles);
          } else if (mut.action === 'applyTemplate' && mut.baseTemplateId) {
            // 1. Find the local template JSON
            const template = templates.find(t => t.id === mut.baseTemplateId);
            if (template) {
              // 2. Generate new IDs for the instance
              const { blocks: newBlocks, rootChildren, globalStyles } = generateTemplateInstance(template);
              
              // 3. Apply the AI Overrides mapping to the instantiated blocks
              // mut.overrides example: { "saas_hero_title": { props: { text: "Hello" } } }
              const overrides = mut.overrides;
              if (overrides) {
                Object.keys(overrides).forEach(baseId => {
                  // Find the newly generated instance ID that matches this original base ID pattern
                  const matchKey = Object.keys(newBlocks).find(k => k.endsWith(`_${baseId}`));
                  if (matchKey) {
                    newBlocks[matchKey] = {
                      ...newBlocks[matchKey],
                      props: { ...newBlocks[matchKey].props, ...(overrides[baseId]?.props || {}) },
                      styles: { ...newBlocks[matchKey].styles, ...(overrides[baseId]?.styles || {}) }
                    };
                  } else if (baseId === 'global' && overrides.global?.styles) {
                    // Patch global styles
                    Object.assign(globalStyles, overrides.global.styles);
                  }
                });
              }

              // 4. Apply everything to store
              applyTemplate(newBlocks, rootChildren, globalStyles);
            }
          }
        });
      }
      setAiInput('');
    } catch (error) {
      console.error(error);
      alert('AI Assistant failed to apply changes.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="h-14 border-b border-[#2C2C30] bg-[#18181B] flex items-center justify-between px-4 shrink-0 transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex items-center space-x-1 border-r border-[#2C2C30] pr-4">
          <button className="flex items-center text-sm text-gray-300 hover:text-white transition-colors mr-2">
            <span>Home</span>
            <ChevronDown size={14} className="ml-1 opacity-70" />
          </button>
          <div className="h-4 w-px bg-[#2C2C30] mx-2"></div>
          <button 
            onClick={undo}
            disabled={history.past.length === 0}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2C2C30] rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Undo"
          >
            <Undo size={16} />
          </button>
          <button 
            onClick={redo}
            disabled={history.future.length === 0}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2C2C30] rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Redo"
          >
            <Redo size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-4">
        <form onSubmit={handleAiSubmit} className="relative flex items-center group">
          <div className="absolute left-3 text-indigo-400">
            {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="group-hover:animate-pulse transition-all" />}
          </div>
          <input 
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            disabled={isAiLoading}
            placeholder="Ask AI to modify layout, add sections, or change styling..."
            className="w-full bg-[#09090B] border border-[#2C2C30] hover:border-[#3f3f46] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-full py-1.5 pl-10 pr-10 text-sm text-gray-200 placeholder-gray-500 transition-all outline-none"
          />
          <button 
            type="submit"
            disabled={!aiInput.trim() || isAiLoading}
            className="absolute right-2 text-indigo-500 hover:text-indigo-400 disabled:opacity-50 disabled:hover:text-indigo-500 p-1 rounded-full transition-colors"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

      <div className="flex items-center bg-[#09090B] p-1 rounded-lg border border-[#2C2C30]">
        <button
          onClick={() => setDeviceMode('desktop')}
          className={`p-1.5 rounded-md transition-all ${
            deviceMode === 'desktop' 
              ? 'bg-[#2C2C30] text-white shadow-sm' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Desktop"
        >
          <Monitor size={16} />
        </button>
        <button
          onClick={() => setDeviceMode('tablet')}
          className={`p-1.5 rounded-md transition-all ${
            deviceMode === 'tablet' 
              ? 'bg-[#2C2C30] text-white shadow-sm' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Tablet"
        >
          <Tablet size={16} />
        </button>
        <button
          onClick={() => setDeviceMode('mobile')}
          className={`p-1.5 rounded-md transition-all ${
            deviceMode === 'mobile' 
              ? 'bg-[#2C2C30] text-white shadow-sm' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Mobile"
        >
          <Smartphone size={16} />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button 
          onClick={togglePreviewMode}
          className={`flex items-center space-x-1 px-3 py-1.5 text-sm md:text-xs lg:text-sm rounded-md transition-colors border ${
            isPreviewMode 
              ? 'bg-blue-600 border-blue-500 text-white' 
              : 'text-gray-300 hover:text-white hover:bg-[#2C2C30] border-transparent hover:border-[#3f3f46]'
          }`}
        >
          <Play size={14} className="mr-1.5" />
          {isPreviewMode ? 'Exit Preview' : 'Preview'}
        </button>
        <button 
          onClick={handlePublish}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm md:text-xs lg:text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors shadow-sm shadow-blue-900/20"
        >
          <Save size={14} className="mr-1.5" />
          Publish
        </button>
      </div>
    </div>
  );
}
