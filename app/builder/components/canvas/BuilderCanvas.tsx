"use client";
import React, { useRef, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { useBuilderStore } from '../../store/useBuilderStore';
import { SectionRenderer } from './SectionRenderer';
import { SiteNavbar } from './SiteNavbar';
import { createSection } from '../../utils/sectionFactory';

export function BuilderCanvas() {
    const activePageId = useBuilderStore(state => state.activePageId);
    const pages = useBuilderStore(state => state.present.pages);
    const activePage = pages.find(p => p.id === activePageId);
    const reorderSections = useBuilderStore(state => state.reorderSections);
    const setSelectedSection = useBuilderStore(state => state.setSelectedSection);
    const setSelectedElement = useBuilderStore(state => state.setSelectedElement);
    const setLeftPanelTab = useBuilderStore(state => state.setLeftPanelTab);
    const addSection = useBuilderStore(state => state.addSection);
    const tokens = useBuilderStore(state => state.present.tokens);
    const device = useBuilderStore(state => state.device);
    const canvasZoom = useBuilderStore(state => state.canvasZoom);
    const setCanvasZoom = useBuilderStore(state => state.setCanvasZoom);

    const canvasRef = useRef<HTMLDivElement>(null);

    // Zoom with Cmd/Ctrl + scroll
    const handleWheel = useCallback((e: WheelEvent) => {
        if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            setCanvasZoom(canvasZoom + delta);
        }
    }, [canvasZoom, setCanvasZoom]);

    useEffect(() => {
        const el = canvasRef.current;
        if (!el) return;
        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    // Keyboard zoom: Cmd+/Cmd-
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey) {
                if (e.key === '=' || e.key === '+') {
                    e.preventDefault();
                    setCanvasZoom(canvasZoom + 0.1);
                } else if (e.key === '-') {
                    e.preventDefault();
                    setCanvasZoom(canvasZoom - 0.1);
                } else if (e.key === '0') {
                    e.preventDefault();
                    setCanvasZoom(1);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canvasZoom, setCanvasZoom]);

    if (!activePage) return <div className="flex-1 flex items-center justify-center text-gray-400">Page not found</div>;

    const getCanvasWidth = () => {
        switch (device) {
            case 'mobile': return 375;
            case 'tablet': return 768;
            case 'desktop': return 1280;
        }
    };

    const canvasWidth = getCanvasWidth();

    const handleCanvasClick = () => {
        setSelectedSection(null);
        setSelectedElement(null);
    };

    const handleInsertSection = (index: number) => {
        addSection(activePageId, createSection('Text'), index);
    };

    return (
        <div
            ref={canvasRef}
            className="flex-1 flex flex-col bg-[#0c0c0c] overflow-hidden relative"
            onClick={handleCanvasClick}
        >
            {/* Dot grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Horizontal Ruler */}
            <div className="h-6 bg-[#111] border-b border-gray-800/60 flex items-end shrink-0 z-10 relative overflow-hidden">
                <div
                    className="flex items-end h-full"
                    style={{
                        width: `${canvasWidth * canvasZoom}px`,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    {Array.from({ length: Math.ceil(canvasWidth / 100) + 1 }).map((_, i) => (
                        <div
                            key={i}
                            className="relative shrink-0"
                            style={{ width: `${100 * canvasZoom}px` }}
                        >
                            <span className="absolute bottom-1 left-0.5 text-[9px] text-gray-600 font-mono leading-none">
                                {i * 100}
                            </span>
                            <div className="absolute bottom-0 left-0 w-px h-2 bg-gray-700" />
                            {/* Half mark */}
                            <div className="absolute bottom-0 w-px h-1 bg-gray-800" style={{ left: `${50 * canvasZoom}px` }} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Vertical Ruler */}
                <div className="w-6 bg-[#111] border-r border-gray-800/60 flex flex-col shrink-0 z-10 relative overflow-hidden">
                    {Array.from({ length: 60 }).map((_, i) => (
                        <div
                            key={i}
                            className="relative shrink-0"
                            style={{ height: `${100 * canvasZoom}px` }}
                        >
                            <span className="absolute top-0.5 left-0.5 text-[9px] text-gray-600 font-mono leading-none" style={{ writingMode: 'vertical-lr' }}>
                                {i * 100}
                            </span>
                            <div className="absolute top-0 left-full -ml-px w-px h-full">
                                <div className="w-2 h-px bg-gray-700 absolute top-0 right-0" />
                                <div className="w-1 h-px bg-gray-800 absolute right-0" style={{ top: `${50 * canvasZoom}px` }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1 overflow-y-auto overflow-x-auto p-8 flex justify-center custom-scrollbar relative">
                    <div
                        className="relative origin-top transition-transform duration-200 ease-out"
                        style={{
                            transform: `scale(${canvasZoom})`,
                            width: `${canvasWidth}px`,
                            minWidth: `${canvasWidth}px`,
                        }}
                    >
                        {/* Site preview frame */}
                        <div
                            className="shadow-2xl border border-gray-800/80 rounded-xl overflow-hidden relative"
                            style={{
                                minHeight: '100vh',
                                fontFamily: tokens.typography.bodyFont,
                                color: tokens.colors.text,
                                backgroundColor: tokens.colors.background,
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
                                    <React.Fragment key={section.id}>
                                        {/* Insertion point BEFORE this section */}
                                        <InsertionPoint onInsert={() => handleInsertSection(index)} />

                                        <Reorder.Item
                                            value={section}
                                            dragListener={false}
                                        >
                                            <SectionRenderer section={section} index={index} totalSections={activePage.sections.length} />
                                        </Reorder.Item>
                                    </React.Fragment>
                                ))}
                                {/* Insertion point AFTER last section */}
                                <InsertionPoint onInsert={() => handleInsertSection(activePage.sections.length)} />
                            </Reorder.Group>

                            {activePage.sections.length === 0 && (
                                <div className="flex flex-col items-center justify-center gap-4 h-64 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl m-8">
                                    <Plus size={28} className="text-gray-600" />
                                    <p className="font-medium text-gray-400">This page is empty</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setLeftPanelTab('add'); }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium transition-colors"
                                    >
                                        <Plus size={14} />
                                        Add first section
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Page dimensions footer */}
                        <div className="flex justify-center mt-3">
                            <span className="text-[10px] font-mono text-gray-600 bg-[#111] px-3 py-1 rounded-full border border-gray-800/50">
                                {canvasWidth} × auto &nbsp;·&nbsp; {Math.round(canvasZoom * 100)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Insertion point between sections — a "+" line that appears on hover
function InsertionPoint({ onInsert }: { onInsert: () => void }) {
    return (
        <div className="group/insert relative h-0 z-20">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 group-hover/insert:opacity-100 transition-all duration-200 pointer-events-none group-hover/insert:pointer-events-auto">
                {/* Line */}
                <div className="absolute left-4 right-4 h-px bg-cyan-500/50" />
                {/* Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onInsert(); }}
                    className="relative z-10 w-7 h-7 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-all hover:scale-110"
                    title="Add section here"
                >
                    <Plus size={14} strokeWidth={2.5} />
                </button>
            </div>
            {/* Invisible hover target */}
            <div className="absolute left-0 right-0 -top-3 h-6 cursor-pointer" />
        </div>
    );
}
