"use client";
import React from 'react';
import { Reorder } from 'framer-motion';
import { useBuilderStore } from '../../store/useBuilderStore';
import { SectionRenderer } from './SectionRenderer';
import { SiteNavbar } from './SiteNavbar';

export function BuilderCanvas() {
    const activePageId = useBuilderStore(state => state.activePageId);
    const pages = useBuilderStore(state => state.present.pages);
    const activePage = pages.find(p => p.id === activePageId);
    const reorderSections = useBuilderStore(state => state.reorderSections);
    const setSelectedSection = useBuilderStore(state => state.setSelectedSection);
    const tokens = useBuilderStore(state => state.present.tokens);
    const device = useBuilderStore(state => state.device);

    if (!activePage) return <div className="flex-1 flex items-center justify-center text-gray-400">Page not found</div>;

    const getCanvasWidth = () => {
        switch (device) {
            case 'mobile': return 'max-w-[375px]';
            case 'tablet': return 'max-w-[768px]';
            case 'desktop': return 'w-full max-w-7xl mx-auto';
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden" onClick={() => setSelectedSection(null)}>
            {/* Scalable Canvas Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 flex justify-center custom-scrollbar">
                <div
                    className={`shadow-2xl transition-all duration-500 ease-in-out origin-top border border-gray-800 rounded-b-xl ${getCanvasWidth()}`}
                    style={{
                        minHeight: '100%',
                        fontFamily: tokens.typography.bodyFont,
                        color: tokens.colors.text,
                        backgroundColor: tokens.colors.background
                    }}
                >
                    <SiteNavbar />
                    <Reorder.Group
                        axis="y"
                        values={activePage.sections}
                        onReorder={(newOrder) => reorderSections(activePage.id, newOrder)}
                        className="w-full flex flex-col"
                    >
                        {activePage.sections.map((section, index) => (
                            <Reorder.Item
                                key={section.id}
                                value={section}
                            // Currently dragging the whole section might interfere with text editing.
                            // In a production app, we'd use useDragControls and attach it to a specific handle icon.
                            // For now, we allow dragging but it might be sensitive.
                            >
                                <SectionRenderer section={section} index={index} />
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    {activePage.sections.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-600 border-2 border-dashed border-gray-800 rounded-xl m-8">
                            <p className="font-medium">This page is empty.</p>
                            <p className="text-sm mt-2 opacity-70">Add a section from the right sidebar.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
