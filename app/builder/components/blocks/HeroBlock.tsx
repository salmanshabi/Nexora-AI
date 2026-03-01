import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Section } from '../../store/types';

export function HeroBlock({ section, index }: { section: Section, index: number }) {
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

    const getBorderRadius = () => {
        switch (tokens.roundness) {
            case 'pill': return '9999px';
            case 'slight': return '8px';
            default: return '0px';
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center py-32 px-6 text-center" style={{
            minHeight: `${50 * tokens.typography.baseSizeMultiplier}vh`,
            background: section.layout.backgroundType === 'transparent' ? 'transparent' : section.layout.backgroundType === 'solid' ? tokens.colors.background : `linear-gradient(135deg, ${tokens.colors.background}, ${tokens.colors.secondary}20)`
        }}>
            {p.badge && (
                <span className="inline-block px-4 py-1.5 font-bold tracking-widest uppercase mb-6" style={{ backgroundColor: `${tokens.colors.primary}20`, color: tokens.colors.primary, fontSize: `${0.75 * tokens.typography.baseSizeMultiplier}rem`, borderRadius: getBorderRadius() }}>
                    {p.badge}
                </span>
            )}
            <h1
                className="font-bold max-w-4xl mx-auto tracking-tight leading-tight mb-8 outline-none hover:ring-2 hover:ring-gray-300/50 transition-all cursor-text rounded-md px-2"
                style={{ fontSize: `${4 * tokens.typography.baseSizeMultiplier}rem`, color: tokens.colors.text }}
                contentEditable suppressContentEditableWarning onBlur={(e) => updateProp('title', e.currentTarget.textContent)}
            >
                {p.title || "Hero Title"}
            </h1>
            <p
                className="max-w-2xl mx-auto opacity-70 mb-12 leading-relaxed outline-none hover:ring-2 hover:ring-gray-300/50 transition-all cursor-text rounded-md px-2"
                style={{ fontSize: `${1.25 * tokens.typography.baseSizeMultiplier}rem`, color: tokens.colors.text }}
                contentEditable suppressContentEditableWarning onBlur={(e) => updateProp('subtitle', e.currentTarget.textContent)}
            >
                {p.subtitle || "Add your compelling subtitle here."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
                {p.buttons?.map((btn: any, i: number) => (
                    <button
                        key={i}
                        className="px-8 py-4 font-semibold transition-transform hover:scale-105 shadow-xl"
                        style={{
                            borderRadius: getBorderRadius(),
                            fontSize: `${1 * tokens.typography.baseSizeMultiplier}rem`,
                            background: btn.style === 'primary' ? `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.secondary})` : 'transparent',
                            color: btn.style === 'primary' ? '#fff' : tokens.colors.text,
                            border: btn.style === 'outline' ? `2px solid ${tokens.colors.primary}40` : 'none'
                        }}
                    >
                        {btn.label}
                    </button>
                )) || (
                        <button
                            className="px-8 py-4 font-semibold transition-transform hover:scale-105 shadow-xl"
                            style={{
                                borderRadius: getBorderRadius(),
                                fontSize: `${1 * tokens.typography.baseSizeMultiplier}rem`,
                                background: `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.secondary})`,
                                color: '#fff'
                            }}
                        >
                            {p.buttonText || "Get Started"}
                        </button>
                    )}
            </div>
        </div>
    );
}
