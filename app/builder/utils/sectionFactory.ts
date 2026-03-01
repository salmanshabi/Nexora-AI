import { Section } from '../store/types';

export function createSection(type: string): Section {
    return {
        id: `${type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'default',
            columns: { desktop: 1 },
            columnGap: 'md',
            verticalAlign: 'center',
            backgroundType: 'transparent',
            animation: 'none',
        },
        elements: [],
    };
}
