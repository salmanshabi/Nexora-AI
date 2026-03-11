'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { TopToolbar } from './TopToolbar';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useEditorStore } from '@/lib/editor/store';

export function EditorLayout() {
  const { isPreviewMode, addBlock, setDraggedBlock } = useEditorStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setDraggedBlock(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedBlock(null);

    if (!over) return;

    // Handle dragged component from sidebar
    if (active.data.current?.isNewComponent) {
      const type = active.data.current.type;
      const targetParentId = over.id as string;
      addBlock(type, targetParentId);
      return;
    }

    // Handle rearranging blocks inside the layers or canvas
    if (active.id !== over.id) {
       // A quick way for layers panel, but we will implement full sorting soon.
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen w-screen bg-[#0E0E10] text-gray-200 overflow-hidden font-sans">
        <TopToolbar />
        <div className="flex flex-1 overflow-hidden relative">
          {!isPreviewMode && <Sidebar />}
          <Canvas />
          {!isPreviewMode && <PropertiesPanel />}
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="bg-[#2C2C30] p-3 rounded shadow-lg border border-[#3f3f46] opacity-80 text-white text-sm">
            Dragging {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
