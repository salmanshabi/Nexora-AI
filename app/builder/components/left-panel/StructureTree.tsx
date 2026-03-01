"use client";
import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Lock, ChevronRight, Type, Image, Square, MousePointer } from 'lucide-react';
import { ElementNode, Section } from '../../store/types';

const ELEMENT_ICONS: Record<string, React.ElementType> = {
    Text: Type,
    Button: MousePointer,
    Image: Image,
    Container: Square,
    Icon: Square,
    FeatureCard: Square,
};

function ElementRow({ element, depth = 0 }: { element: ElementNode; depth?: number }) {
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const setSelectedElement = useBuilderStore(state => state.setSelectedElement);
    const isSelected = selectedElementId === element.id;
    const Icon = ELEMENT_ICONS[element.type] ?? Square;

    return (
        <div>
            <button
                onClick={() => setSelectedElement(element.id)}
                style={{ paddingLeft: `${8 + depth * 12}px` }}
                className={`w-full flex items-center gap-1.5 pr-2 py-1 rounded text-left transition-colors text-xs ${
                    isSelected
                        ? 'bg-cyan-950/60 text-cyan-300'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
            >
                <Icon size={11} className="shrink-0 opacity-60" />
                <span className="truncate">
                    {element.props.content?.slice(0, 20) || element.type}
                </span>
            </button>
            {element.children?.map(child => (
                <ElementRow key={child.id} element={child} depth={depth + 1} />
            ))}
        </div>
    );
}

function SectionRow({ section }: { section: Section }) {
    const [expanded, setExpanded] = React.useState(true);
    const selectedSectionId = useBuilderStore(state => state.selectedSectionId);
    const setSelectedSection = useBuilderStore(state => state.setSelectedSection);
    const isSelected = selectedSectionId === section.id;

    return (
        <div className="mb-0.5">
            <button
                onClick={() => setSelectedSection(section.id)}
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left transition-colors ${
                    isSelected
                        ? 'bg-cyan-950/60 text-cyan-300'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
            >
                <ChevronRight
                    size={12}
                    className={`shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
                />
                <span className="text-[11px] font-semibold truncate flex-1">{section.type}</span>
                {section.isLocked && <Lock size={10} className="shrink-0 text-yellow-500" />}
            </button>

            {expanded && section.elements && section.elements.length > 0 && (
                <div className="ml-2 border-l border-gray-800 pl-1">
                    {section.elements.map(el => (
                        <ElementRow key={el.id} element={el} depth={0} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function StructureTree() {
    const pages = useBuilderStore(state => state.present.pages);
    const activePageId = useBuilderStore(state => state.activePageId);
    const activePage = pages.find(p => p.id === activePageId);

    if (!activePage) return null;

    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 px-2">
                {activePage.title}
            </p>
            {activePage.sections.length === 0 ? (
                <p className="text-xs text-gray-600 px-2 py-4 text-center">No sections yet</p>
            ) : (
                activePage.sections.map(section => (
                    <SectionRow key={section.id} section={section} />
                ))
            )}
        </div>
    );
}
