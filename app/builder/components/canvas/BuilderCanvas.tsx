import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import { Undo2, Redo2 } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { SectionRenderer } from './SectionRenderer';
import { DeviceToggle } from './DeviceToggle';
import { SiteNavbar } from './SiteNavbar';
import LanguageToggle from '@/app/components/LanguageToggle';

export function BuilderCanvas() {
    const activePageId = useBuilderStore(state => state.activePageId);
    const pages = useBuilderStore(state => state.present.pages);
    const activePage = pages.find(p => p.id === activePageId);
    const reorderSections = useBuilderStore(state => state.reorderSections);
    const setSelectedSection = useBuilderStore(state => state.setSelectedSection);
    const tokens = useBuilderStore(state => state.present.tokens);

    const past = useBuilderStore(state => state.past);
    const future = useBuilderStore(state => state.future);
    const undo = useBuilderStore(state => state.undo);
    const redo = useBuilderStore(state => state.redo);

    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

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
            {/* Top Bar / Header */}
            <header className="h-14 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <DeviceToggle current={device} onChange={setDevice} />
                    <span className="text-xs font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                        {device === 'desktop' ? '100% (Desktop)' : device === 'tablet' ? '768px (Tablet)' : '375px (Mobile)'}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <LanguageToggle />

                    {/* Undo / Redo controls */}
                    <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 p-1 rounded-lg">
                        <button
                            onClick={(e) => { e.stopPropagation(); undo(); }}
                            disabled={past.length === 0}
                            className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            title="Undo"
                        >
                            <Undo2 size={16} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); redo(); }}
                            disabled={future.length === 0}
                            className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            title="Redo"
                        >
                            <Redo2 size={16} />
                        </button>
                    </div>
                </div>
            </header>

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
                    onClick={(e) => {
                        // Allows deselecting when clicking specific empty areas, but mostly handled by parent
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
