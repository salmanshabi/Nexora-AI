import React from 'react';
import { ElementNode } from '../../store/types';
import { useBuilderStore } from '../../store/useBuilderStore';

export function DynamicImage({ element }: { element: ElementNode }) {
    const tokens = useBuilderStore(state => state.present.tokens);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const setSelectedElement = useBuilderStore(state => state.setSelectedElement);

    const isSelected = selectedElementId === element.id;

    const getRoundness = () => {
        const shape = element.props.roundedCorners && element.props.roundedCorners !== 'inherit'
            ? element.props.roundedCorners
            : tokens.roundness;

        switch (shape) {
            case 'pill': return '24px'; // for images pill usually means highly rounded corners
            case 'full': return '9999px'; // circle
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
            className={`relative overflow-hidden transition-all ${isSelected ? 'ring-2 ring-cyan-400' : 'hover:ring-1 hover:ring-cyan-500/50'}`}
            style={{
                borderRadius: getRoundness(),
                width: element.props.fullWidth ? '100%' : 'auto',
                ...element.props.style,
            }}
        >
            {element.props.url ? (
                <img
                    src={element.props.url}
                    alt={element.props.altText || 'Image element'}
                    style={{
                        objectFit: element.props.objectFit || 'cover',
                        width: '100%',
                        height: '100%' // Usually controlled by parent container aspect ratio
                    }}
                />
            ) : (
                <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-500">
                    No Image Selected
                </div>
            )}

            {element.props.overlayColor && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundColor: element.props.overlayColor,
                        opacity: element.props.overlayOpacity ?? 0.5
                    }}
                />
            )}
        </div>
    );
}
