import React, { useState } from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { 
  ChevronRight, 
  ChevronDown, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  PanelTop,
  List,
  DollarSign,
  MessageSquare,
  Navigation
} from 'lucide-react';
import { BlockType } from '@/lib/editor/types';

const getBlockIcon = (type: BlockType) => {
  switch (type) {
    case 'container': return <Layout size={14} />;
    case 'grid': return <Layout size={14} />;
    case 'text': return <Type size={14} />;
    case 'image': return <ImageIcon size={14} />;
    case 'button': return <Square size={14} className="fill-current" />;
    case 'hero': return <PanelTop size={14} />;
    case 'features': return <List size={14} />;
    case 'pricing': return <DollarSign size={14} />;
    case 'testimonials': return <MessageSquare size={14} />;
    case 'navbar': return <Navigation size={14} />;
    case 'section': default: return <Square size={14} />;
  }
};

function LayerItem({ id, depth = 0 }: { id: string; depth?: number }) {
  const { 
    blocks, 
    selectedBlockId, 
    hoveredBlockId, 
    selectBlock, 
    hoverBlock,
    removeBlock,
    updateBlock
  } = useEditorStore();
  
  const [isExpanded, setIsExpanded] = useState(true);
  
  const block = blocks[id];
  if (!block) return null;

  const isSelected = selectedBlockId === id;
  const isHovered = hoveredBlockId === id;
  const isRoot = id === 'root';
  const hasChildren = block.children && block.children.length > 0;

  return (
    <div>
      <div 
        className={`flex items-center px-2 py-1.5 cursor-pointer text-xs group transition-colors ${
          isSelected 
            ? 'bg-blue-600/20 text-blue-400' 
            : isHovered 
              ? 'bg-[#2C2C30] text-gray-200' 
              : 'text-gray-400 hover:bg-[#2C2C30] hover:text-gray-200'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={(e) => {
          e.stopPropagation();
          selectBlock(id);
        }}
        onMouseEnter={() => !isSelected && hoverBlock(id)}
        onMouseLeave={() => !isSelected && hoverBlock(null)}
      >
        {/* Expand/Collapse Toggle */}
        <div 
          className="w-4 h-4 flex items-center justify-center mr-1"
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }
          }}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : null}
        </div>
        
        {/* Icon */}
        <div className="mr-2 opacity-70">
          {getBlockIcon(block.type)}
        </div>
        
        {/* Name */}
        <span className="flex-1 truncate select-none">{block.name}</span>
        
        {/* Actions (visible on hover) */}
        {!isRoot && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="p-1 hover:text-white rounded"
              onClick={(e) => {
                e.stopPropagation();
                updateBlock(id, { isHidden: !block.isHidden });
              }}
              title={block.isHidden ? "Show" : "Hide"}
            >
              {block.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
            <button 
              className="p-1 hover:text-red-400 rounded"
              onClick={(e) => {
                e.stopPropagation();
                removeBlock(id);
              }}
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
      
      {/* Children recursive rendering */}
      {isExpanded && hasChildren && (
        <div>
          {block.children.map((childId) => (
            <LayerItem key={childId} id={childId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function LayersPanel() {
  const { rootBlockId } = useEditorStore();

  return (
    <div className="text-sm pb-10">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Elements Tree</h3>
      <div className="flex flex-col">
        <LayerItem id={rootBlockId} />
      </div>
    </div>
  );
}
