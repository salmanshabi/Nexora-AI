"use client";
import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Section } from '../../store/types';

const SECTION_TEMPLATES = [
    { label: 'Hero', type: 'Hero', icon: '⚡', description: 'Full-width hero with headline and CTA' },
    { label: 'Features', type: 'Features', icon: '✦', description: 'Grid of feature highlights' },
    { label: 'Call to Action', type: 'CallToAction', icon: '→', description: 'CTA with button' },
    { label: 'Text Block', type: 'Text', icon: 'T', description: 'Rich text content section' },
];

export function AddPanel() {
    const activePageId = useBuilderStore(state => state.activePageId);
    const addSection = useBuilderStore(state => state.addSection);

    const handleAdd = (type: string) => {
        const newSection: Section = {
            id: `${type.toLowerCase()}-${Date.now()}`,
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
        addSection(activePageId, newSection);
    };

    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3 px-1">
                Sections
            </p>
            {SECTION_TEMPLATES.map(({ label, type, icon, description }) => (
                <button
                    key={type}
                    onClick={() => handleAdd(type)}
                    className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-gray-800/60 transition-colors group"
                >
                    <span className="text-base leading-none mt-0.5 w-5 text-center shrink-0">{icon}</span>
                    <div>
                        <div className="text-xs font-semibold text-gray-300 group-hover:text-white">{label}</div>
                        <div className="text-[10px] text-gray-600 leading-snug mt-0.5">{description}</div>
                    </div>
                </button>
            ))}
        </div>
    );
}
