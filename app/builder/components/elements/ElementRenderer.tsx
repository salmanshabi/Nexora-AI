import React from 'react';
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

export function ElementRenderer({ element, sectionId }: Props) {
    const [isEditing, setIsEditing] = React.useState(false);
    const updateElement = useBuilderStore(state => state.updateElement);
    const activePageId = useBuilderStore(state => state.activePageId);

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
        // 'Icon' can be added later as a separate component or integrated into Text/Image
        default:
            return <div className="p-4 border border-red-500 bg-red-500/10 text-red-500 text-xs text-center">Unknown Element: {element.type}</div>;
    }
}
