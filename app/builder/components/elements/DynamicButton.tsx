import React from 'react';
import { ElementNode } from '../../store/types';
import { useBuilderStore } from '../../store/useBuilderStore';
import { ExternalLink } from 'lucide-react';

interface DynamicButtonProps {
    element: ElementNode;
    isEditing?: boolean;
    onSave?: (content: string) => void;
    onDoubleClick?: (e: React.MouseEvent) => void;
}

export function DynamicButton({ element, isEditing, onSave, onDoubleClick }: DynamicButtonProps) {
    const tokens = useBuilderStore(state => state.present.tokens);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const setSelectedElement = useBuilderStore(state => state.setSelectedElement);

    const isSelected = selectedElementId === element.id;
    const variant = element.props.variant || 'primary';

    const editRef = React.useRef<HTMLButtonElement>(null);
    const cancelledRef = React.useRef(false);

    React.useEffect(() => {
        if (isEditing && editRef.current) {
            editRef.current.focus();
            // Select all text in the element
            const range = document.createRange();
            range.selectNodeContents(editRef.current);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }, [isEditing]);

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

    const editingClasses = isEditing ? 'ring-2 ring-cyan-400 ring-offset-1 cursor-text outline-none' : '';

    return (
        <button
            ref={editRef}
            onClick={(e) => {
                e.stopPropagation();
                setSelectedElement(element.id);
            }}
            onDoubleClick={onDoubleClick}
            contentEditable={isEditing || undefined}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => {
                if (isEditing && !cancelledRef.current) {
                    onSave?.(e.currentTarget.textContent || '');
                }
                cancelledRef.current = false;
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Escape') {
                    cancelledRef.current = true;
                    (e.target as HTMLElement).blur();
                }
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    (e.target as HTMLElement).blur();
                }
            }}
            className={`relative font-semibold inline-flex items-center justify-center gap-2 transition-all ${getSizeClasses()} ${isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-950' : ''} hover:scale-105 shadow-xl ${editingClasses}`}
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
