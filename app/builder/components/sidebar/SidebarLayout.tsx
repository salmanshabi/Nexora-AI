import React, { useState } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { PageManager } from './panels/PageManager';
import { DesignTokens } from './panels/DesignTokens';
import { SectionInspector } from './panels/SectionInspector';
import { ElementInspector } from './panels/ElementInspector';
import { TemplatesPanel } from './panels/TemplatesPanel';
import { Settings2, Layers, Focus, ArrowLeft, LayoutTemplate } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIChatBar } from './AIChatBar';
import { useLanguage } from '@/app/context/LanguageContext';
import { translations } from '@/app/translations';

export function SidebarLayout() {
    const selectedSectionId = useBuilderStore(state => state.selectedSectionId);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const setSelectedSection = useBuilderStore(state => state.setSelectedSection);
    const setSelectedElement = useBuilderStore(state => state.setSelectedElement);
    const [activeTab, setActiveTab] = useState<'pages' | 'design' | 'templates'>('pages');
    const { lang } = useLanguage();
    const t = translations[lang].builder;

    const renderContent = () => {
        if (selectedElementId) {
            return (
                <motion.div
                    key="element-inspector"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col overflow-hidden"
                >
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 sticky top-0 z-10 backdrop-blur-md shadow-sm">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedElement(null)}
                                className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                                title={t.inspector.backToSection}
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <h2 className="text-sm font-semibold flex items-center gap-2 text-cyan-300">
                                <Focus size={16} />
                                {t.inspector.element}
                            </h2>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <ElementInspector />
                    </div>
                </motion.div>
            );
        }

        if (selectedSectionId) {
            return (
                <motion.div
                    key="inspector"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col overflow-hidden"
                >
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 sticky top-0 z-10 backdrop-blur-md shadow-sm">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedSection(null)}
                                className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                                title={t.inspector.backToGlobal}
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <h2 className="text-sm font-semibold flex items-center gap-2 text-cyan-300">
                                <Focus size={16} />
                                {t.inspector.section}
                            </h2>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <SectionInspector />
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                key="global"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
            >
                <div className="p-4 border-b border-gray-800 shrink-0">
                    <div className="flex bg-gray-950 p-1.5 rounded-xl border border-gray-800 shadow-inner overflow-x-auto hide-scrollbar">
                        <button
                            onClick={() => setActiveTab('pages')}
                            className={`flex-1 min-w-max px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'pages' ? 'bg-gray-800 text-white shadow-md ring-1 ring-gray-700' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}
                        >
                            <Layers size={14} /> {t.tabs.structure}
                        </button>
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={`flex-1 min-w-max px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'templates' ? 'bg-gray-800 text-cyan-400 shadow-md ring-1 ring-cyan-500/50' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}
                        >
                            <LayoutTemplate size={14} /> {t.tabs.templates}
                        </button>
                        <button
                            onClick={() => setActiveTab('design')}
                            className={`flex-1 min-w-max px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'design' ? 'bg-gray-800 text-violet-400 shadow-md ring-1 ring-violet-500/50' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}
                        >
                            <Settings2 size={14} /> {t.tabs.theme}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                    {activeTab === 'pages' && <PageManager />}
                    {activeTab === 'templates' && <TemplatesPanel />}
                    {activeTab === 'design' && <DesignTokens />}
                </div>
            </motion.div>
        );
    };

    return (
        <aside className="w-[360px] bg-gray-900/90 backdrop-blur-xl border-l border-white/5 flex flex-col shrink-0 shadow-2xl relative z-40">
            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>

            <div className="mt-auto shrink-0 border-t border-gray-800 p-4 bg-gray-950/95 backdrop-blur-xl z-50">
                <AIChatBar />
            </div>
        </aside>
    );
}
