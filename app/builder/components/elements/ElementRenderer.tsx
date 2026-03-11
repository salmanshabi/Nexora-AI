import React, { useRef, useEffect, useCallback } from 'react';
import { Copy, Trash2, Type, MousePointer, Image as ImageIcon, Square } from 'lucide-react';
import { ElementNode } from '../../store/types';
import { useBuilderStore } from '../../store/useBuilderStore';
import { DynamicText } from './DynamicText';
import { DynamicButton } from './DynamicButton';
import { DynamicImage } from './DynamicImage';
import { DynamicContainer } from '@/app/builder/components/elements/DynamicContainer';

interface Props {
    element: ElementNode;
    sectionId: string;
}

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
    Text: <Type size={10} />,
    Button: <MousePointer size={10} />,
    Image: <ImageIcon size={10} />,
    Container: <Square size={10} />,
    FeatureCard: <Square size={10} />,
};

export function ElementRenderer({ element, sectionId }: Props) {
    const [isEditing, setIsEditing] = React.useState(false);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const setSelectedElement = useBuilderStore(state => state.setSelectedElement);
    const updateElement = useBuilderStore(state => state.updateElement);
    const deleteElement = useBuilderStore(state => state.deleteElement);
    const duplicateElement = useBuilderStore(state => state.duplicateElement);
    const activePageId = useBuilderStore(state => state.activePageId);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const isSelected = selectedElementId === element.id;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isEditing) {
            setSelectedElement(element.id);
        }
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (element.type === 'Text' || element.type === 'Button') {
            setIsEditing(true);
        }
    };

    const handleSave = (newContent: string) => {
        updateElement(activePageId, sectionId, element.id, { content: newContent });
        setIsEditing(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteElement(activePageId, sectionId, element.id);
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        duplicateElement(activePageId, sectionId, element.id);
    };

    // Keyboard shortcuts when selected
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isSelected || isEditing) return;

        if (e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault();
            deleteElement(activePageId, sectionId, element.id);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setSelectedElement(null);
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
            e.preventDefault();
            duplicateElement(activePageId, sectionId, element.id);
        }
    }, [isSelected, isEditing, deleteElement, duplicateElement, setSelectedElement, activePageId, sectionId, element.id]);

    useEffect(() => {
        if (isSelected) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isSelected, handleKeyDown]);

    // Deselect editing mode when clicking outside
    useEffect(() => {
        if (!isEditing) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsEditing(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEditing]);

    const renderElement = () => {
        switch (element.type) {
            case 'Text':
                return (
                    <DynamicText
                        element={element}
                        isEditing={isEditing}
                        onSave={handleSave}
                        onDoubleClick={handleDoubleClick}
                    />
                );
            case 'Button':
                return (
                    <DynamicButton
                        element={element}
                        isEditing={isEditing}
                        onSave={handleSave}
                        onDoubleClick={handleDoubleClick}
                    />
                );
            case 'Image':
                return <DynamicImage element={element} />;
            case 'Container':
            case 'FeatureCard':
                return <DynamicContainer element={element} sectionId={sectionId} />;
            default:
                return <div className="p-4 border border-red-500 bg-red-500/10 text-red-500 text-xs text-center">Unknown Element: {element.type}</div>;
        }
    };

    return (
        <div
            ref={wrapperRef}
            className={`relative group/el transition-all duration-150 cursor-pointer ${isSelected && !isEditing ? 'z-20' : ''
                }`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            {/* Selection bounding box */}
            {isSelected && !isEditing && (
                <>
                    {/* Blue outline */}
                    <div className="absolute inset-0 pointer-events-none border-2 border-cyan-500 z-10" style={{ borderRadius: 2 }} />

                    {/* Corner handles */}
                    <div className="absolute -top-[3px] -left-[3px] w-[7px] h-[7px] bg-white border-2 border-cyan-500 z-20 pointer-events-none" />
                    <div className="absolute -top-[3px] -right-[3px] w-[7px] h-[7px] bg-white border-2 border-cyan-500 z-20 pointer-events-none" />
                    <div className="absolute -bottom-[3px] -left-[3px] w-[7px] h-[7px] bg-white border-2 border-cyan-500 z-20 pointer-events-none" />
                    <div className="absolute -bottom-[3px] -right-[3px] w-[7px] h-[7px] bg-white border-2 border-cyan-500 z-20 pointer-events-none" />

                    {/* Floating mini toolbar */}
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-[#1a1a1a] rounded-lg shadow-xl shadow-black/40 border border-gray-700/60 px-1 py-0.5 z-30">
                        {/* Element type badge */}
                        <span className="flex items-center gap-1 px-1.5 py-1 text-[9px] font-bold uppercase tracking-widest text-cyan-300 border-r border-gray-700/60 mr-0.5">
                            {ELEMENT_ICONS[element.type] || <Square size={10} />}
                            {element.type}
                        </span>

                        <button
                            onClick={handleDuplicate}
                            title="Duplicate (⌘D)"
                            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700/60 transition-colors"
                        >
                            <Copy size={12} />
                        </button>

                        <button
                            onClick={handleDelete}
                            title="Delete (⌫)"
                            className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </>
            )}

            {/* Hover outline (when not selected) */}
            {!isSelected && !isEditing && (
                <div className="absolute inset-0 pointer-events-none border border-transparent group-hover/el:border-cyan-500/30 transition-colors z-10" style={{ borderRadius: 2 }} />
            )}

            {renderElement()}
        </div>
    );
}
