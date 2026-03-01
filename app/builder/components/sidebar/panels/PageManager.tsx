import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { PageData, Section } from '../../../store/types';
import { FilePlus, X, GripVertical, Plus } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { useLanguage } from '@/app/context/LanguageContext';
import { translations } from '@/app/translations';

export function PageManager() {
    const pages = useBuilderStore(state => state.present.pages);
    const activePageId = useBuilderStore(state => state.activePageId);
    const setActivePage = useBuilderStore(state => state.setActivePage);
    const addPage = useBuilderStore(state => state.addPage);
    const removePage = useBuilderStore(state => state.removePage);
    const addSection = useBuilderStore(state => state.addSection);

    const { lang } = useLanguage();
    const t = translations[lang].builder;

    const handleAddPage = () => {
        const slug = prompt("Enter page name (e.g. About Us):");
        if (!slug) return;

        // Simple ID generator for example
        const id = slug.toLowerCase().replace(/\s+/g, '-');

        if (pages.some(p => p.id === id)) {
            alert("A page with a similar name already exists.");
            return;
        }

        const newPage: PageData = {
            id,
            title: slug,
            slug: `/${id}`,
            isHiddenInNav: false,
            seo: { metaTitle: slug, metaDescription: "" },
            sections: []
        }

        addPage(newPage);
        setActivePage(id);
    };

    const handleAddSection = (type: string) => {
        const section: Section = {
            id: `${type.toLowerCase()}-${Date.now()}`,
            type,
            isLocked: false,
            layout: {
                width: 'contained',
                padding: 'default',
                columns: { desktop: 1 },
                columnGap: 'md',
                verticalAlign: 'center',
                backgroundType: 'transparent',
                animation: 'none'
            },
            content: {}
        };
        addSection(activePageId, section);
    };

    const activePageTitle = pages.find(p => p.id === activePageId)?.title || "Unknown";

    return (
        <div className="space-y-8">
            {/* Pages List */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{t.pages.yourPages}</h3>
                    <button
                        onClick={handleAddPage}
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md flex items-center gap-1"
                    >
                        <FilePlus size={12} /> {t.pages.add}
                    </button>
                </div>

                <div className="space-y-2">
                    {pages.map(p => (
                        <div
                            key={p.id}
                            onClick={() => setActivePage(p.id)}
                            className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${activePageId === p.id ? 'bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.05)] text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-800'}`}
                        >
                            <div className="flex items-center gap-3">
                                <GripVertical size={14} className="opacity-30 group-hover:opacity-100 transition-opacity cursor-grab" />
                                <span className="font-medium text-sm">{p.title}</span>
                            </div>
                            {p.id !== 'home' && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); removePage(p.id); if (activePageId === p.id) setActivePage('home'); }}
                                    className="text-gray-600 hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <hr className="border-gray-800" />

            {/* Add Section Library */}
            <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">{t.pages.addBlockTo} <span className="text-cyan-400">{activePageTitle}</span></h3>
                <div className="grid grid-cols-2 gap-3">
                    {["Hero", "Features", "Text", "CallToAction"].map(t => (
                        <button
                            key={t}
                            onClick={() => handleAddSection(t)}
                            className="group bg-gray-900 border border-gray-800 hover:border-cyan-500 hover:bg-cyan-950/20 hover:shadow-lg p-5 rounded-xl flex flex-col items-center gap-3 transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-950 group-hover:bg-cyan-900/50 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 transition-colors shadow-inner border border-gray-800 group-hover:border-cyan-500/30">
                                <Plus size={18} />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">{t === "CallToAction" ? "CTA" : t}</span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
