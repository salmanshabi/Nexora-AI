import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Section } from '../../store/types';

export function TextBlock({ section, index }: { section: Section, index: number }) {
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

    return (
        <div className="relative py-20 px-10">
            <div className="max-w-3xl mx-auto">
                <h2
                    className="font-bold mb-8 outline-none hover:ring-2 hover:ring-gray-300/50 transition-all cursor-text rounded-md px-2 -ml-2"
                    style={{ fontSize: `${2 * tokens.typography.baseSizeMultiplier}rem`, color: tokens.colors.text }}
                    contentEditable suppressContentEditableWarning onBlur={(e) => updateProp('title', e.currentTarget.textContent)}
                >
                    {p.title || "Section Title"}
                </h2>

                <div
                    className="opacity-80 leading-relaxed space-y-4 outline-none hover:ring-2 hover:ring-gray-300/50 transition-all cursor-text rounded-md p-2 -ml-2"
                    style={{ fontSize: `${1.1 * tokens.typography.baseSizeMultiplier}rem`, color: tokens.colors.text }}
                    contentEditable suppressContentEditableWarning onBlur={(e) => updateProp('paragraph', e.currentTarget.textContent)}
                >
                    {p.paragraph || "Write your paragraph text here. Click to edit."}
                </div>
            </div>
        </div>
    );
}
