"use client";
import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { SectionInspector } from '../../sidebar/panels/SectionInspector';
import { ElementInspector } from '../../sidebar/panels/ElementInspector';
import { DesignTokens } from '../../sidebar/panels/DesignTokens';

export function StructureTab() {
    const selectedSectionId = useBuilderStore(state => state.selectedSectionId);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);

    if (selectedElementId) return <ElementInspector />;
    if (selectedSectionId) return <SectionInspector />;
    return <DesignTokens />;
}
