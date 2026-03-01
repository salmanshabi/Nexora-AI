import React from 'react';
import { ElementNode } from '../../store/types';
import { useBuilderStore } from '../../store/useBuilderStore';

interface DynamicTextProps {
    element: ElementNode;
    isEditing?: boolean;
    onSave?: (content: string) => void;
    onDoubleClick?: (e: React.MouseEvent) => void;
}

export function DynamicText({ element, isEditing, onSave, onDoubleClick }: DynamicTextProps) {
    const tokens = useBuilderStore(state => state.present.tokens);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const setSelectedElement = useBuilderStore(state => state.setSelectedElement);

    const isSelected = selectedElementId === element.id;

    const editRef = React.useRef<HTMLElement>(null);
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

    const editingClasses = isEditing ? 'ring-2 ring-cyan-400 ring-offset-1 cursor-text outline-none' : '';

    return (
        <div
            ref={editRef as React.RefObject<HTMLDivElement>}
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
            className={`cursor-text outline-none transition-all ${isSelected ? 'ring-2 ring-cyan-500 rounded-sm' : 'hover:ring-1 hover:ring-gray-400/50'} ${editingClasses}`}
            style={{
                color: element.props.customColor || tokens.colors.text,
                fontSize: getFontSize(),
                textAlign: getAlignment() as React.CSSProperties['textAlign'],
                width: element.props.fullWidth ? '100%' : 'auto',
                ...element.props.style,
            }}
        >
            {element.props.content || 'Text Element'}
        </div>
    );
}
