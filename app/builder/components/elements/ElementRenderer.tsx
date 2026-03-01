import React from 'react';
import { ElementNode } from '../../store/types';
import { DynamicText } from './DynamicText';
import { DynamicButton } from './DynamicButton';
import { DynamicImage } from './DynamicImage';
import { DynamicContainer } from '@/app/builder/components/elements/DynamicContainer';

export function ElementRenderer({ element }: { element: ElementNode }) {
    switch (element.type) {
        case 'Text':
            return <DynamicText element={element} />;
        case 'Button':
            return <DynamicButton element={element} />;
        case 'Image':
            return <DynamicImage element={element} />;
        case 'Container':
        case 'FeatureCard':
            return <DynamicContainer element={element} />;
        // 'Icon' can be added later as a separate component or integrated into Text/Image
        default:
            return <div className="p-4 border border-red-500 bg-red-500/10 text-red-500 text-xs text-center">Unknown Element: {element.type}</div>;
    }
}
