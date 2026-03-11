import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Copy, Trash2 } from 'lucide-react';
import { useEditorStore } from '@/lib/editor/store';
import { BoxStyles } from '@/lib/editor/types';

// Utility to convert our camelCase schema styles to valid React styles
const parseStyles = (styles?: BoxStyles): React.CSSProperties => {
  if (!styles) return {};
  return {
    ...styles,
  } as React.CSSProperties;
};

export function Renderer({ id }: { id: string }) {
  const { blocks, selectedBlockId, hoveredBlockId, selectBlock, hoverBlock, duplicateBlock, removeBlock } = useEditorStore();
  const block = blocks[id];

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: block?.type,
      isContainer: true,
    },
  });

  if (!block) return null;

  const isSelected = selectedBlockId === id;
  const isHovered = hoveredBlockId === id;
  const isRoot = id === 'root';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(id);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    hoverBlock(id);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hoveredBlockId === id) {
      hoverBlock(block.parentId || null);
    }
  };

  const baseClasses = `relative transition-all duration-200 ${
    isSelected ? 'outline outline-2 outline-blue-500 z-10' : ''
  } ${
    isHovered && !isSelected ? 'outline outline-1 outline-blue-300 outline-dashed z-0' : ''
  }`;

  // Drop indicator
  const dropIndicator = isOver ? (
    <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 border-dashed pointer-events-none z-20 transition-all rounded" />
  ) : null;

  const style = parseStyles(block.styles);

  // Content rendering based on block type
  const renderContent = () => {
    if (block.children && block.children.length > 0) {
      return block.children.map((childId) => <Renderer key={childId} id={childId} />);
    }

    // Default placeholders
    if (block.type === 'text') {
      return (block.props?.text as string) || 'Double click to edit text';
    }
    if (block.type === 'button') {
      return (block.props?.text as string) || 'Click me';
    }
    if (block.type === 'image') {
      return (
        <div className="bg-gray-200 flex items-center justify-center h-full w-full text-gray-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
    
    // For empty containers
    if (!isRoot && block.children.length === 0) {
      return (
        <div className="min-h-[60px] min-w-[60px] flex items-center justify-center text-xs text-gray-400 p-4 border border-dashed border-gray-300 rounded">
          Empty {block.type}
        </div>
      );
    }
    
    return null;
  };

  // Tag type mapping
  let Tag: React.ElementType = 'div';
  if (block.type === 'section') Tag = 'section';
  if (block.type === 'button') Tag = 'button';
  if (block.type === 'text') Tag = 'p';

  return (
    <Tag
      ref={setNodeRef}
      className={baseClasses}
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...block.props}
    >
      {renderContent()}
      {dropIndicator}
      
      {/* Selection pill with quick actions */}
      {isSelected ? (
        <div className="absolute -top-7 left-0 bg-blue-500 text-white text-[11px] px-2 py-1 rounded-t whitespace-nowrap z-30 font-medium flex items-center gap-3 shadow-sm select-none">
          <span className="pointer-events-none">{block.name}</span>
          {!isRoot && (
            <div className="flex items-center gap-1.5 border-l border-blue-400 pl-2">
              <button 
                onClick={(e) => { e.stopPropagation(); duplicateBlock(id); }}
                className="hover:text-blue-200 transition-colors bg-transparent border-none p-0 flex"
                title="Duplicate"
              >
                <Copy size={12} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); removeBlock(id); }}
                className="hover:text-red-200 transition-colors bg-transparent border-none p-0 flex"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </Tag>
  );
}
