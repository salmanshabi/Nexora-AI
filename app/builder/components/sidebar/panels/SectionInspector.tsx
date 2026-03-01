import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { Lock, Unlock, Copy, Trash2, Columns } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { translations } from '@/app/translations';

export function SectionInspector() {
    const activePageId = useBuilderStore(state => state.activePageId);
    const selectedSectionId = useBuilderStore(state => state.selectedSectionId);
    const pages = useBuilderStore(state => state.present.pages);
    const updateSection = useBuilderStore(state => state.updateSection);
    const removeSection = useBuilderStore(state => state.removeSection);
    const setSelectedSection = useBuilderStore(state => state.setSelectedSection);
    const addSection = useBuilderStore(state => state.addSection);

    const { lang } = useLanguage();
    const t = translations[lang].builder;

    const activePage = pages.find(p => p.id === activePageId);
    const section = activePage?.sections.find(s => s.id === selectedSectionId);

    if (!section) return null;

    const toggleLock = () => {
        updateSection(activePageId, section.id, { isLocked: !section.isLocked });
    };

    const handleDelete = () => {
        removeSection(activePageId, section.id);
        setSelectedSection(null);
    };

    const handleDuplicate = () => {
        const index = activePage!.sections.findIndex(s => s.id === section.id);
        const newSection = JSON.parse(JSON.stringify(section)); // deep clone
        newSection.id = `${section.type.toLowerCase()}-${Date.now()}`;
        newSection.isLocked = false; // Never duplicate a locked state automatically
        addSection(activePageId, newSection, index + 1);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-200">
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={toggleLock}
                    className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${section.isLocked ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                    {section.isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                    <span className="text-[10px] uppercase tracking-wider font-bold">
                        {section.isLocked ? t.section.locked : t.section.unlocked}
                    </span>
                </button>

                <button
                    onClick={handleDuplicate}
                    className="flex-1 flex flex-col items-center gap-2 py-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                >
                    <Copy size={18} />
                    <span className="text-[10px] uppercase tracking-wider font-bold">{t.section.duplicate}</span>
                </button>

                <button
                    onClick={handleDelete}
                    className="flex-1 flex flex-col items-center gap-2 py-3 bg-red-950/20 border border-red-900/50 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-900/40 hover:border-red-500/50 transition-all"
                >
                    <Trash2 size={18} />
                    <span className="text-[10px] uppercase tracking-wider font-bold">{t.section.delete}</span>
                </button>
            </div>

            {/* Helper Note for Locking */}
            {section.isLocked && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 p-3 rounded-lg text-xs text-yellow-500/80 leading-relaxed shadow-inner">
                    <strong>{t.section.aiLockActive}</strong> {t.section.aiLockDesc}
                </div>
            )}

            <hr className="border-gray-800" />

            {/* Width Controls */}
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{t.section.containerWidth}</h3>
                </div>
                <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 shadow-inner gap-1">
                    {['contained', 'full'].map((w) => (
                        <button
                            key={w}
                            onClick={() => updateSection(activePageId, section.id, { layout: { ...section.layout, width: w as 'contained' | 'full' } })}
                            className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${section.layout.width === w ? 'bg-gray-800 text-white shadow ring-1 ring-cyan-500/50' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}
                        >
                            {w}
                        </button>
                    ))}
                </div>
            </section>

            {/* Desktop Columns */}
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2"><Columns size={14} /> {t.section.desktopColumns}</h3>
                </div>
                <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 shadow-inner gap-1">
                    {[1, 2, 3, 4].map((col) => (
                        <button
                            key={col}
                            onClick={() => updateSection(activePageId, section.id, { layout: { ...section.layout, columns: { ...section.layout.columns, desktop: col as 1 | 2 | 3 | 4 } } })}
                            className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${section.layout.columns.desktop === col ? 'bg-gray-800 text-white shadow ring-1 ring-cyan-500/50' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}
                        >
                            {col}
                        </button>
                    ))}
                </div>
            </section>

            {/* Background Styles */}
            <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{t.section.background}</h3>
                <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 shadow-inner gap-1">
                    {['transparent', 'solid', 'gradient', 'image'].map((bg) => (
                        <button
                            key={bg}
                            onClick={() => updateSection(activePageId, section.id, { layout: { ...section.layout, backgroundType: bg as 'transparent' | 'solid' | 'gradient' | 'image' } })}
                            className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${section.layout.backgroundType === bg ? 'bg-gray-800 text-white shadow ring-1 ring-cyan-500/50' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}
                        >
                            {bg === 'transparent' ? 'None' : bg}
                        </button>
                    ))}
                </div>
            </section>

            {/* Padding Control */}
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{t.section.verticalPadding}</h3>
                </div>
                <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 shadow-inner gap-1">
                    {['compact', 'default', 'spacious', 'custom'].map((pad) => (
                        <button
                            key={pad}
                            onClick={() => updateSection(activePageId, section.id, { layout: { ...section.layout, padding: pad as 'compact' | 'default' | 'spacious' | 'custom' } })}
                            className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${section.layout.padding === pad ? 'bg-gray-800 text-white shadow ring-1 ring-cyan-500/50' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}
                        >
                            {pad}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
