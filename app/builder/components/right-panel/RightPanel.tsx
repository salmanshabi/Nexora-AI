"use client";
import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Layers, Paintbrush, Type, Zap, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { StructureTab } from './tabs/StructureTab';
import { StyleTab } from './tabs/StyleTab';
import { ContentTab } from './tabs/ContentTab';
import { AnimateTab } from './tabs/AnimateTab';
import { AITab } from './tabs/AITab';
import { AIChatBar } from '../sidebar/AIChatBar';

const TABS = [
    { id: 'structure' as const, icon: Layers, label: 'Structure' },
    { id: 'style' as const, icon: Paintbrush, label: 'Style' },
    { id: 'content' as const, icon: Type, label: 'Content' },
    { id: 'animate' as const, icon: Zap, label: 'Animate' },
    { id: 'ai' as const, icon: Sparkles, label: 'AI' },
];

export function RightPanel() {
    const inspectorTab = useBuilderStore(state => state.inspectorTab);
    const setInspectorTab = useBuilderStore(state => state.setInspectorTab);

    return (
        <div className="flex flex-col w-80 shrink-0 border-l border-gray-800 bg-[#0a0a0a]">
            {/* Tab bar */}
            <div className="flex border-b border-gray-800 shrink-0">
                {TABS.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setInspectorTab(id)}
                        title={label}
                        className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 ${
                            inspectorTab === id
                                ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                                : 'border-transparent text-gray-600 hover:text-gray-400'
                        }`}
                    >
                        <Icon size={14} />
                        <span className="hidden lg:block">{label}</span>
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={inspectorTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                    >
                        {inspectorTab === 'structure' && <StructureTab />}
                        {inspectorTab === 'style' && <StyleTab />}
                        {inspectorTab === 'content' && <ContentTab />}
                        {inspectorTab === 'animate' && <AnimateTab />}
                        {inspectorTab === 'ai' && <AITab />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* AI ChatBar pinned at bottom (hidden on AI tab since it shows full panel) */}
            {inspectorTab !== 'ai' && (
                <div className="shrink-0 border-t border-gray-800 p-3">
                    <AIChatBar />
                </div>
            )}
        </div>
    );
}
