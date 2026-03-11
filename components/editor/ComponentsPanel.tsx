import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BlockType } from '@/lib/editor/types';
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Layout, 
  PanelTop, 
  List, 
  DollarSign, 
  MessageSquare,
  Navigation
} from 'lucide-react';

const COMPONENTS: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: 'section', label: 'Section', icon: <Square size={20} /> },
  { type: 'container', label: 'Container', icon: <Layout size={20} /> },
  { type: 'grid', label: 'Grid', icon: <Layout size={20} /> },
  { type: 'text', label: 'Text', icon: <Type size={20} /> },
  { type: 'image', label: 'Image', icon: <ImageIcon size={20} /> },
  { type: 'button', label: 'Button', icon: <Square size={20} className="fill-current" /> },
  
  // Pre-made blocks
  { type: 'hero', label: 'Hero', icon: <PanelTop size={20} /> },
  { type: 'features', label: 'Features', icon: <List size={20} /> },
  { type: 'pricing', label: 'Pricing', icon: <DollarSign size={20} /> },
  { type: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={20} /> },
  { type: 'navbar', label: 'Navbar', icon: <Navigation size={20} /> },
];

function DraggableComponent({ type, label, icon }: { type: BlockType; label: string; icon: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${type}`,
    data: {
      isNewComponent: true,
      type,
    },
  });

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      className={`bg-[#2C2C30] border border-[#3f3f46] hover:border-indigo-500 rounded p-3 flex flex-col items-center justify-center cursor-grab transition-all select-none
        ${isDragging ? 'opacity-50 scale-95 border-indigo-500' : 'hover:scale-[1.02]'}
      `}
    >
      <div className="text-gray-400 mb-2 pointer-events-none">
        {icon}
      </div>
      <span className="text-xs text-gray-300 font-medium pointer-events-none">{label}</span>
    </div>
  );
}

export function ComponentsPanel() {
  return (
    <div className="text-sm pb-10">
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Basic Elements</h3>
        <div className="grid grid-cols-2 gap-2">
          {COMPONENTS.slice(0, 6).map((comp) => (
            <DraggableComponent key={comp.type} {...comp} />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sections</h3>
        <div className="grid grid-cols-2 gap-2">
          {COMPONENTS.slice(6).map((comp) => (
            <DraggableComponent key={comp.type} {...comp} />
          ))}
        </div>
      </div>
    </div>
  );
}
