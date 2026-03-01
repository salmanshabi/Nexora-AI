import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Section } from '../../store/types';

export function CallToActionBlock({ section, index }: { section: Section, index: number }) {
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
            case 'pill': return '32px'; // larger for CTA container
            case 'slight': return '12px';
            default: return '0px';
        }
    };

    const getBtnBorderRadius = () => {
        switch (tokens.roundness) {
            case 'pill': return '9999px';
            case 'slight': return '8px';
            default: return '0px';
        }
    }

    return (
        <div className="relative py-24 px-10">
            <div
                className="max-w-4xl mx-auto text-center p-16 transition-all"
                style={{
                    backgroundColor: `${tokens.colors.primary}10`,
                    borderRadius: getBorderRadius(),
                    border: `1px solid ${tokens.colors.primary}30`
                }}
            >
                <h2
                    className="font-bold mb-6 outline-none hover:ring-2 hover:ring-gray-300/50 transition-all cursor-text rounded-md px-2"
                    style={{ fontSize: `${3 * tokens.typography.baseSizeMultiplier}rem`, color: tokens.colors.text }}
                    contentEditable suppressContentEditableWarning onBlur={(e) => updateProp('title', e.currentTarget.textContent)}
                >
                    {p.title || "Ready to get started?"}
                </h2>

                <p
                    className="opacity-70 mb-10 outline-none hover:ring-2 hover:ring-gray-300/50 transition-all cursor-text rounded-md px-2"
                    style={{ fontSize: `${1.25 * tokens.typography.baseSizeMultiplier}rem`, color: tokens.colors.text }}
                    contentEditable suppressContentEditableWarning onBlur={(e) => updateProp('subtitle', e.currentTarget.textContent)}
                >
                    {p.subtitle || "Join thousands of users today."}
                </p>

                <button
                    className="px-10 py-5 font-semibold transition-transform hover:scale-105 shadow-2xl"
                    style={{
                        borderRadius: getBtnBorderRadius(),
                        fontSize: `${1.1 * tokens.typography.baseSizeMultiplier}rem`,
                        background: `linear-gradient(135deg, ${tokens.colors.primary}, ${tokens.colors.secondary})`,
                        color: '#fff'
                    }}
                >
                    {p.button?.label || p.buttonText || "Call To Action"}
                </button>
            </div>
        </div>
    );
}
