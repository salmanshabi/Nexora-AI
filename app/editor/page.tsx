'use client';

import React from 'react';
import { EditorLayout } from '@/components/editor/EditorLayout';
import { useEditorStore } from '@/lib/editor/store';

export default function EditorPage() {
  const { blocks, rootBlockId } = useEditorStore();

  return (
    <EditorLayout />
  );
}
