import React, { useState } from 'react';
import { Layers, Cuboid, LayoutTemplate, FileText, Database } from 'lucide-react';
import { LayersPanel } from './LayersPanel';
import { ComponentsPanel } from './ComponentsPanel';
import { TemplatesPanel } from './TemplatesPanel';
import { PagesPanel } from './PagesPanel';
import { CMSPanel } from './CMSPanel';

type Tab = 'pages' | 'layers' | 'components' | 'templates' | 'cms';

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('components');

  return (
    <div className="w-64 border-r border-[#2C2C30] bg-[#18181B] flex flex-col shrink-0">
      <div className="flex border-b border-[#2C2C30] p-2 space-x-1 shrink-0 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-3 py-2 flex justify-center rounded-md transition-colors ${
            activeTab === 'pages' ? 'bg-[#2C2C30] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2C2C30]/50'
          }`}
          title="Pages"
        >
          <FileText size={16} />
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={`px-3 py-2 flex justify-center rounded-md transition-colors ${
            activeTab === 'layers' ? 'bg-[#2C2C30] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2C2C30]/50'
          }`}
          title="Layers"
        >
          <Layers size={16} />
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`px-3 py-2 flex justify-center rounded-md transition-colors ${
            activeTab === 'components' ? 'bg-[#2C2C30] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2C2C30]/50'
          }`}
          title="Components"
        >
          <Cuboid size={16} />
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-3 py-2 flex justify-center rounded-md transition-colors ${
            activeTab === 'templates' ? 'bg-[#2C2C30] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2C2C30]/50'
          }`}
          title="Templates"
        >
          <LayoutTemplate size={16} />
        </button>
        <button
          onClick={() => setActiveTab('cms')}
          className={`px-3 py-2 flex justify-center rounded-md transition-colors ${
            activeTab === 'cms' ? 'bg-[#2C2C30] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-[#2C2C30]/50'
          }`}
          title="CMS Collections"
        >
          <Database size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
        {activeTab === 'pages' && <PagesPanel />}
        {activeTab === 'layers' && <LayersPanel />}
        {activeTab === 'components' && <ComponentsPanel />}
        {activeTab === 'templates' && <TemplatesPanel />}
        {activeTab === 'cms' && <CMSPanel />}
      </div>
    </div>
  );
}
