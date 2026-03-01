import React from 'react';
import { ElementNode } from '../../store/types';
import { useBuilderStore } from '../../store/useBuilderStore';
import { ExternalLink } from 'lucide-react';

export function DynamicButton({ element }: { element: ElementNode }) {
    const tokens = useBuilderStore(state => state.present.tokens);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const setSelectedElement = useBuilderStore(state => state.setSelectedElement);

    const isSelected = selectedElementId === element.id;
    const variant = element.props.variant || 'primary';

    const getRoundness = () => {
        const shape = element.props.roundedCorners && element.props.roundedCorners !== 'inherit'
            ? element.props.roundedCorners
            : (tokens.advanced?.buttonSystem.roundness || tokens.roundness);

        switch (shape) {
            case 'pill': return '9999px';
            case 'full': return '9999px';
            case 'slight': return '8px';
            default: return '0px';
        }
    };

    const getBackground = () => {
        if (element.props.customBg) return element.props.customBg;
        switch (variant) {
            case 'primary': return `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.secondary})`;
            case 'secondary': return `${tokens.colors.text}10`;
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return tokens.colors.primary;
        }
    };

    const getColor = () => {
        if (element.props.customColor) return element.props.customColor;
        switch (variant) {
            case 'primary': return '#ffffff';
            case 'outline': return tokens.colors.text;
            case 'ghost': return tokens.colors.text;
            default: return tokens.colors.text;
        }
    };

    const getBorder = () => {
        if (variant === 'outline') return `2px solid ${tokens.colors.primary}50`;
        return 'none';
    };

    const getSizeClasses = () => {
        switch (element.props.size) {
            case 'sm': return 'px-4 py-2 text-sm';
            case 'lg': return 'px-8 py-4 text-lg';
            default: return 'px-6 py-3 text-base';
        }
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                setSelectedElement(element.id);
            }}
            className={`relative font-semibold inline-flex items-center justify-center gap-2 transition-all ${getSizeClasses()} ${isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-950' : ''} hover:scale-105 shadow-xl`}
            style={{
                borderRadius: getRoundness(),
                background: getBackground(),
                color: getColor(),
                border: getBorder(),
                width: element.props.fullWidth ? '100%' : 'auto',
                ...element.props.style,
            }}
        >
            {element.props.content || 'Button'}
            {element.props.url && element.props.openInNewTab && <ExternalLink size={14} className="opacity-50" />}
        </button>
    );
}
