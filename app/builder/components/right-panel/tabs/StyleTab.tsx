"use client";
import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { DesignTokens } from '../../sidebar/panels/DesignTokens';
import { ElementInspector } from '../../sidebar/panels/ElementInspector';
import { SectionInspector } from '../../sidebar/panels/SectionInspector';

export function StyleTab() {
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const selectedSectionId = useBuilderStore(state => state.selectedSectionId);
    if (selectedElementId) return <ElementInspector />;
    if (selectedSectionId) return <SectionInspector />;
    return <DesignTokens />;
}
