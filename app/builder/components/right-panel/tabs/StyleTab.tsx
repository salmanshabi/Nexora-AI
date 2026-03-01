"use client";
import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { DesignTokens } from '../../sidebar/panels/DesignTokens';
import { ElementInspector } from '../../sidebar/panels/ElementInspector';

export function StyleTab() {
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    if (selectedElementId) return <ElementInspector />;
    return <DesignTokens />;
}
