import React from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { Renderer } from './Renderer';

export function Canvas() {
  const { deviceMode, rootBlockId, selectBlock } = useEditorStore();
  
  const getCanvasWidth = () => {
    switch (deviceMode) {
      case 'mobile': return 'max-w-[390px]';
      case 'tablet': return 'max-w-[768px]';
      case 'desktop': default: return 'max-w-full';
    }
  };

  const handleCanvasClick = () => {
    // Deselect if clicking outside
    selectBlock(null);
  };

  return (
    <div 
      className="flex-1 bg-[#09090B] overflow-auto flex justify-center p-4 custom-scrollbar pattern-dots pattern-gray-800 pattern-bg-transparent pattern-size-4 pattern-opacity-40"
      onClick={handleCanvasClick}
    >
      <div 
        className={`w-full ${getCanvasWidth()} bg-white shadow-2xl transition-all duration-300 ease-in-out relative origin-top`}
      >
        <Renderer id={rootBlockId} />
      </div>
    </div>
  );
}
