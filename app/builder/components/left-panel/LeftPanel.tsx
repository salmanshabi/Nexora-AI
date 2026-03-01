"use client";
import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { LayoutDashboard, Layers, Plus } from 'lucide-react';
import { PageManager } from '../sidebar/panels/PageManager';
import { StructureTree } from './StructureTree';
import { AddPanel } from './AddPanel';
import { AnimatePresence, motion } from 'framer-motion';

const TABS = [
    { id: 'pages' as const, icon: LayoutDashboard, label: 'Pages' },
    { id: 'layers' as const, icon: Layers, label: 'Layers' },
    { id: 'add' as const, icon: Plus, label: 'Add' },
];

export function LeftPanel() {
    const leftPanelTab = useBuilderStore(state => state.leftPanelTab);
    const setLeftPanelTab = useBuilderStore(state => state.setLeftPanelTab);

    return (
        <div className="flex h-full shrink-0 border-r border-gray-800">
            {/* Icon sidebar */}
            <div className="flex flex-col items-center gap-1 w-10 py-3 bg-gray-950 border-r border-gray-800">
                {TABS.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setLeftPanelTab(id)}
                        title={label}
                        className={`flex flex-col items-center justify-center w-8 h-8 rounded-lg transition-all ${
                            leftPanelTab === id
                                ? 'bg-cyan-950 text-cyan-400'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
                        }`}
                    >
                        <Icon size={15} />
                    </button>
                ))}
            </div>

            {/* Panel content */}
            <div className="w-[200px] flex flex-col bg-[#0a0a0a] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={leftPanelTab}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className="flex-1 overflow-y-auto custom-scrollbar p-3"
                    >
                        {leftPanelTab === 'pages' && <PageManager />}
                        {leftPanelTab === 'layers' && <StructureTree />}
                        {leftPanelTab === 'add' && <AddPanel />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
