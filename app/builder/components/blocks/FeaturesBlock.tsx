import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Section } from '../../store/types';

export function FeaturesBlock({ section, index }: { section: Section, index: number }) {
    const tokens = useBuilderStore(state => state.present.tokens);
    const activePageId = useBuilderStore(state => state.activePageId);
    const updateSection = useBuilderStore(state => state.updateSection);
    const p = (section.content || {}) as any;

    const updateProp = (key: string, value: string | null) => {
        if (!value) return;
        updateSection(activePageId, section.id, {
            content: { ...section.content, [key]: value }
        });
    };

    const updateFeature = (fIndex: number, field: string, value: string | null) => {
        if (!value) return;
        const newFeatures = [...(p.features || [])];
        newFeatures[fIndex] = { ...newFeatures[fIndex], [field]: value };
        updateSection(activePageId, section.id, {
            content: { ...section.content, features: newFeatures }
        });
    };

    const getBorderRadius = () => {
        switch (tokens.roundness) {
            case 'pill': return '24px';
            case 'slight': return '8px';
            default: return '0px';
        }
    };

    const defaultFeatures = [
        { title: "Feature One", desc: "First amazing feature" },
        { title: "Feature Two", desc: "Second amazing feature" },
        { title: "Feature Three", desc: "Third amazing feature" }
    ];

    const features = p.features && p.features.length > 0 ? p.features : defaultFeatures;

    return (
        <div className="relative py-24 px-10" style={{
            background: section.layout.backgroundType === 'solid' ? `${tokens.colors.text}05` : 'transparent'
        }}>
            <div className="max-w-6xl mx-auto">
                <h2
                    className="font-bold text-center mb-16 outline-none hover:ring-2 hover:ring-gray-300/50 transition-all cursor-text rounded-md px-2"
                    style={{ fontSize: `${2.5 * tokens.typography.baseSizeMultiplier}rem`, color: tokens.colors.text }}
                    contentEditable suppressContentEditableWarning onBlur={(e) => updateProp('title', e.currentTarget.textContent)}
                >
                    {p.title || "Our Features"}
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((f: any, i: number) => (
                        <div key={i} className="p-8 transition-transform hover:-translate-y-2 border border-transparent hover:border-white/10" style={{ backgroundColor: `${tokens.colors.text}05`, borderRadius: getBorderRadius() }}>
                            <div className="w-12 h-12 mb-6 flex items-center justify-center text-white" style={{ borderRadius: tokens.roundness === 'pill' ? '9999px' : tokens.roundness === 'slight' ? '8px' : '0px', background: section.layout?.backgroundType === 'transparent' ? 'transparent' : section.layout?.backgroundType === 'solid' ? tokens.colors.background : `linear-gradient(135deg, ${tokens.colors.background}, ${tokens.colors.secondary}10)` }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m5 12 5 5L20 7" /></svg>
                            </div>
                            <h3
                                className="font-bold mb-3 outline-none hover:ring-1 hover:ring-gray-300/30 rounded px-1 cursor-text -ml-1 transition-all"
                                style={{ fontSize: `${1.25 * tokens.typography.baseSizeMultiplier}rem`, color: tokens.colors.text }}
                                contentEditable suppressContentEditableWarning onBlur={(e) => updateFeature(i, 'title', e.currentTarget.textContent)}
                            >
                                {f.title}
                            </h3>
                            <p
                                className="opacity-70 leading-relaxed outline-none hover:ring-1 hover:ring-gray-300/30 rounded px-1 cursor-text -ml-1 transition-all"
                                style={{ fontSize: `${1 * tokens.typography.baseSizeMultiplier}rem`, color: tokens.colors.text }}
                                contentEditable suppressContentEditableWarning onBlur={(e) => updateFeature(i, 'desc', e.currentTarget.textContent)}
                            >
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
