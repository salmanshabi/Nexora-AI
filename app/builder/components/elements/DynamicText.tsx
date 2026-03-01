import React from 'react';
import { ElementNode } from '../../store/types';
import { useBuilderStore } from '../../store/useBuilderStore';

export function DynamicText({ element }: { element: ElementNode }) {
    const tokens = useBuilderStore(state => state.present.tokens);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const setSelectedElement = useBuilderStore(state => state.setSelectedElement);
    const activePageId = useBuilderStore(state => state.activePageId);
    // Note: updating elements will require a store action capable of traversing the tree 
    // For now, click to select.

    const isSelected = selectedElementId === element.id;

    // Default styles based on token mapping
    const getFontSize = () => {
        const base = tokens.typography.baseSizeMultiplier;
        switch (element.props.size) {
            case 'sm': return `${0.875 * base}rem`;
            case 'lg': return `${3 * base}rem`;
            case 'md':
            default: return `${1 * base}rem`;
        }
    };

    const getAlignment = () => {
        // Just handling desktop for simplicity in this initial iteration
        return element.props.textAlign?.desktop || 'left';
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                setSelectedElement(element.id);
            }}
            className={`cursor-text outline-none transition-all ${isSelected ? 'ring-2 ring-cyan-500 rounded-sm' : 'hover:ring-1 hover:ring-gray-400/50'}`}
            style={{
                color: element.props.customColor || tokens.colors.text,
                fontSize: getFontSize(),
                textAlign: getAlignment() as any,
                width: element.props.fullWidth ? '100%' : 'auto',
                ...element.props.style,
            }}
        >
            {element.props.content || 'Text Element'}
        </div>
    );
}
