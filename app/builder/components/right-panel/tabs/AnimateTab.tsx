"use client";
import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';

const ANIMATIONS = [
    'none', 'fadeIn', 'slideUp', 'slideLeft', 'revealOnScroll', 'staggerChildren',
] as const;

export function AnimateTab() {
    const selectedSectionId = useBuilderStore(state => state.selectedSectionId);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const activePageId = useBuilderStore(state => state.activePageId);
    const pages = useBuilderStore(state => state.present.pages);
    const updateSection = useBuilderStore(state => state.updateSection);

    const activePage = pages.find(p => p.id === activePageId);
    const section = activePage?.sections.find(s => s.id === selectedSectionId);

    if (!section && !selectedElementId) {
        return (
            <div className="text-center py-8">
                <p className="text-xs text-gray-500">Select a section or element to configure its animation.</p>
            </div>
        );
    }

    if (section && !selectedElementId) {
        return (
            <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Section Entry Animation</p>
                <div className="grid grid-cols-2 gap-2">
                    {ANIMATIONS.map(anim => (
                        <button
                            key={anim}
                            onClick={() => updateSection(activePageId, section.id, {
                                layout: { ...section.layout, animation: anim }
                            })}
                            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all capitalize ${
                                section.layout.animation === anim
                                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                                    : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                            }`}
                        >
                            {anim === 'none' ? 'None' : anim}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <p className="text-xs text-gray-500 text-center py-8">Element animation controls coming soon.</p>
    );
}
