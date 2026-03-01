import React from 'react';
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
}

export function SectionRenderer({ section, index }: Props) {
    const selectedSectionId = useBuilderStore(state => state.selectedSectionId);
    const setSelectedSection = useBuilderStore(state => state.setSelectedSection);
    const tokens = useBuilderStore(state => state.present.tokens);
    const isSelected = selectedSectionId === section.id;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedSection(section.id);
    };

    const renderBlock = () => {
        // UX 3.0 Rendering Path
        if (section.elements && section.elements.length > 0) {
            const getPaddingClass = () => {
                switch (section.layout.padding) {
                    case 'compact': return 'py-12';
                    case 'spacious': return 'py-32';
                    case 'default':
                    default: return 'py-20';
                }
            };

            const getBg = () => {
                const type = section.layout.backgroundType;
                if (type === 'solid') return `${tokens.colors.background}`;
                if (type === 'gradient') return `linear-gradient(135deg, ${tokens.colors.background}, ${tokens.colors.secondary}20)`;
                return 'transparent';
            };

            const gridClass = section.layout.columns?.desktop === 2 ? 'md:grid-cols-2'
                : section.layout.columns?.desktop === 3 ? 'md:grid-cols-3'
                    : section.layout.columns?.desktop === 4 ? 'md:grid-cols-4'
                        : 'grid-cols-1';

            return (
                <div className={`relative ${getPaddingClass()} w-full transition-all`} style={{ background: getBg() }}>
                    <div className={`mx-auto flex flex-col items-center justify-center ${section.layout.width === 'full' ? 'w-full px-6' : 'max-w-6xl px-6'}`}>
                        <div className={`w-full grid gap-8 ${gridClass}`}>
                            {section.elements.map(el => <ElementRenderer key={el.id} element={el} />)}
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
            style={{
                // Adding a nice transition to section wrapper
                transform: isSelected ? 'scale(1.002)' : 'scale(1)',
            }}
        >
            {/* Locked overlay indicator */}
            {section.isLocked && (
                <div className="absolute top-3 left-3 z-20 bg-gray-900/80 backdrop-blur-sm text-yellow-500 p-1.5 rounded-lg shadow-lg border border-gray-700/50" title="This section is locked from AI edits">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
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
