import React from 'react';
import { ChevronUp, ChevronDown, Copy, Trash2, Plus } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { ElementRenderer } from '../elements/ElementRenderer';
import { Section } from '../../store/types';
import { HeroBlock } from '../blocks/HeroBlock';
import { FeaturesBlock } from '../blocks/FeaturesBlock';
import { CallToActionBlock } from '../blocks/CallToActionBlock';
import { TextBlock } from '../blocks/TextBlock';

interface Props {
    section: Section;
    index: number;
    totalSections: number;
}

export function SectionRenderer({ section, index, totalSections }: Props) {
    const selectedSectionId = useBuilderStore(state => state.selectedSectionId);
    const setSelectedSection = useBuilderStore(state => state.setSelectedSection);
    const tokens = useBuilderStore(state => state.present.tokens);
    const activePageId = useBuilderStore(state => state.activePageId);
    const pages = useBuilderStore(state => state.present.pages);
    const addSection = useBuilderStore(state => state.addSection);
    const removeSection = useBuilderStore(state => state.removeSection);
    const reorderSections = useBuilderStore(state => state.reorderSections);
    const isSelected = selectedSectionId === section.id;

    const activePage = pages.find(p => p.id === activePageId);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedSection(section.id);
    };

    const moveUp = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!activePage || index === 0) return;
        const sections = [...activePage.sections];
        [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
        reorderSections(activePageId, sections);
    };

    const moveDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!activePage || index === totalSections - 1) return;
        const sections = [...activePage.sections];
        [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
        reorderSections(activePageId, sections);
    };

    const duplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        const clone: Section = JSON.parse(JSON.stringify(section));
        clone.id = `${section.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        addSection(activePageId, clone, index + 1);
    };

    const deleteSelf = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeSection(activePageId, section.id);
        setSelectedSection(null);
    };

    const renderBlock = () => {
        const getPaddingClass = () => {
            switch (section.layout.padding) {
                case 'compact': return 'py-12';
                case 'spacious': return 'py-32';
                default: return 'py-20';
            }
        };

        const getBg = () => {
            const type = section.layout.backgroundType;
            if (type === 'solid') return tokens.colors.background;
            if (type === 'gradient') return `linear-gradient(135deg, ${tokens.colors.background}, ${tokens.colors.secondary}20)`;
            return 'transparent';
        };

        const gridClass = section.layout.columns?.desktop === 2 ? 'md:grid-cols-2'
            : section.layout.columns?.desktop === 3 ? 'md:grid-cols-3'
            : section.layout.columns?.desktop === 4 ? 'md:grid-cols-4'
            : 'grid-cols-1';

        // UX 3.0 Rendering Path (sections with an elements array)
        if (section.elements !== undefined) {
            if (section.elements.length === 0) {
                return (
                    <div className={`relative ${getPaddingClass()} w-full`} style={{ background: getBg() }}>
                        <div className="flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed border-gray-700/60 rounded-xl mx-6">
                            <Plus size={20} className="text-gray-500" />
                            <p className="text-sm text-gray-500 font-medium">Empty section</p>
                            <p className="text-xs text-gray-600">Use the AI chat to add elements</p>
                        </div>
                    </div>
                );
            }

            return (
                <div className={`relative ${getPaddingClass()} w-full transition-all`} style={{ background: getBg() }}>
                    <div className={`mx-auto flex flex-col items-center justify-center ${section.layout.width === 'full' ? 'w-full px-6' : 'max-w-6xl px-6'}`}>
                        <div className={`w-full grid gap-8 ${gridClass}`}>
                            {section.elements.map(el => <ElementRenderer key={el.id} element={el} sectionId={section.id} />)}
                        </div>
                    </div>
                </div>
            );
        }

        // Legacy UX 2.0 Rendering Path
        switch (section.type) {
            case 'Hero': return <HeroBlock section={section} index={index} />;
            case 'Features': return <FeaturesBlock section={section} index={index} />;
            case 'CallToAction': return <CallToActionBlock section={section} index={index} />;
            case 'Text': return <TextBlock section={section} index={index} />;
            default: return <div className="p-8 text-center bg-red-900/20 text-red-500 font-bold border border-red-500/50 rounded-lg">Unknown block: {section.type}</div>;
        }
    };

    return (
        <div
            className={`relative group transition-all duration-300 border-2 ${isSelected ? 'border-cyan-500 z-10 shadow-[0_0_20px_rgba(34,211,238,0.15)] ring-1 ring-cyan-500/50' : 'border-transparent hover:border-cyan-500/30'} ${section.isLocked ? 'opacity-90' : ''}`}
            onClick={handleClick}
            style={{ transform: isSelected ? 'scale(1.002)' : 'scale(1)' }}
        >
            {/* Locked overlay indicator */}
            {section.isLocked && (
                <div className="absolute top-3 left-3 z-20 bg-gray-900/80 backdrop-blur-sm text-yellow-500 p-1.5 rounded-lg shadow-lg border border-gray-700/50" title="This section is locked from AI edits">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
            )}

            {/* Hover toolbar — top-right, hidden when locked */}
            {!section.isLocked && (
                <div className="absolute top-2 right-2 z-30 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={moveUp}
                        disabled={index === 0}
                        title="Move up"
                        className="p-1.5 rounded bg-gray-900/90 border border-gray-700/60 text-gray-400 hover:text-white hover:border-cyan-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronUp size={14} />
                    </button>
                    <button
                        onClick={moveDown}
                        disabled={index === totalSections - 1}
                        title="Move down"
                        className="p-1.5 rounded bg-gray-900/90 border border-gray-700/60 text-gray-400 hover:text-white hover:border-cyan-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronDown size={14} />
                    </button>
                    <button
                        onClick={duplicate}
                        title="Duplicate section"
                        className="p-1.5 rounded bg-gray-900/90 border border-gray-700/60 text-gray-400 hover:text-white hover:border-cyan-500/50 transition-colors"
                    >
                        <Copy size={14} />
                    </button>
                    <button
                        onClick={deleteSelf}
                        title="Delete section"
                        className="p-1.5 rounded bg-gray-900/90 border border-gray-700/60 text-gray-400 hover:text-red-400 hover:border-red-500/50 transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )}

            {/* Contextual hover badge */}
            {!isSelected && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-cyan-950/80 backdrop-blur-md px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 shadow-xl border border-cyan-500/30 font-mono text-[10px] text-cyan-300 font-bold uppercase tracking-widest pointer-events-none">
                    {section.type}
                </div>
            )}

            {renderBlock()}
        </div>
    );
}
