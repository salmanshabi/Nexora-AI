import React from 'react';
import { ElementNode } from '../../store/types';
import { useBuilderStore } from '../../store/useBuilderStore';
import { ElementRenderer } from './ElementRenderer';

export function DynamicContainer({ element }: { element: ElementNode }) {
    const tokens = useBuilderStore(state => state.present.tokens);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const setSelectedElement = useBuilderStore(state => state.setSelectedElement);

    const isSelected = selectedElementId === element.id;

    const getRoundness = () => {
        const shape = element.props.roundedCorners && element.props.roundedCorners !== 'inherit'
            ? element.props.roundedCorners
            : tokens.roundness;

        switch (shape) {
            case 'pill': return '24px'; // containers rarely need pill, but just in case
            case 'full': return '9999px';
            case 'slight': return '8px';
            default: return '0px';
        }
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                setSelectedElement(element.id);
            }}
            className={`relative transition-all flex flex-col gap-4 ${isSelected ? 'ring-2 ring-cyan-400' : 'hover:ring-1 hover:ring-cyan-500/30'}`}
            style={{
                borderRadius: getRoundness(),
                backgroundColor: element.props.customBg || 'transparent',
                width: element.props.fullWidth ? '100%' : 'auto',
                padding: element.type === 'FeatureCard' ? '2rem' : '0', // Basic padding for cards
                ...element.props.style,
            }}
        >
            {element.children?.map(child => (
                <ElementRenderer key={child.id} element={child} />
            ))}
        </div>
    );
}
