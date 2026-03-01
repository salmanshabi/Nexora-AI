import React, { useState } from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Baseline, Scan } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { translations } from '@/app/translations';

export function DesignTokens() {
    const tokens = useBuilderStore(state => state.present.tokens);
    const updateTokens = useBuilderStore(state => state.updateTokens);

    const [showPro, setShowPro] = useState(false);
    const { lang } = useLanguage();
    const t = translations[lang].builder;

    // Simplified preset maps specifically for the UX 2.0
    const colorPresets = [
        { name: 'Ocean', primary: '#0ea5e9', bg: '#020617' },
        { name: 'Forest', primary: '#22c55e', bg: '#052e16' },
        { name: 'Sunset', primary: '#f97316', bg: '#431407' },
        { name: 'Royal', primary: '#8b5cf6', bg: '#1e1b4b' },
        { name: 'Minimal', primary: '#171717', bg: '#fafafa' }, // Light mode
        { name: 'Cyber', primary: '#ec4899', bg: '#000000' }
    ];

    const handlePresetSelect = (preset: typeof colorPresets[0]) => {
        // In a real implementation this would map all 4 colors properly
        updateTokens({
            colors: {
                ...tokens.colors,
                primary: preset.primary,
                background: preset.bg,
                text: preset.bg === '#fafafa' ? '#171717' : '#f8fafc',
                secondary: preset.primary // Simplified
            }
        });
    };

    return (
        <div className="space-y-8">
            {/* Colors */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <Palette size={14} /> {t.design.colors}
                    </h3>
                    <button
                        onClick={() => setShowPro(!showPro)}
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded transition-colors ${showPro ? 'bg-cyan-950 text-cyan-400' : 'bg-gray-900 text-gray-500 hover:text-white'}`}
                    >
                        {t.design.proMode}
                    </button>
                </div>

                {!showPro ? (
                    <div className="grid grid-cols-3 gap-3">
                        {colorPresets.map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => handlePresetSelect(preset)}
                                className={`h-12 rounded-xl flex overflow-hidden shadow-sm transition-transform hover:scale-105 border ${tokens.colors.primary === preset.primary && tokens.colors.background === preset.bg ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-gray-800'}`}
                                title={preset.name}
                            >
                                <div className="flex-1 h-full" style={{ backgroundColor: preset.bg }} />
                                <div className="flex-1 h-full" style={{ backgroundColor: preset.primary }} />
                            </button>
                        ))}
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3 bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-inner">
                        {Object.entries(tokens.colors).map(([key, value]) => (
                            <div key={key}>
                                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1 block">{key}</label>
                                <div className="flex items-center gap-2 bg-gray-950 p-1.5 rounded-lg border border-gray-800 focus-within:border-cyan-500 transition-colors">
                                    <input
                                        type="color"
                                        value={value}
                                        onChange={(e) => updateTokens({ colors: { ...tokens.colors, [key]: e.target.value } })}
                                        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                                    />
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => updateTokens({ colors: { ...tokens.colors, [key]: e.target.value } })}
                                        className="w-full bg-transparent text-xs text-white outline-none font-mono uppercase"
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </section>

            <hr className="border-gray-800" />

            {/* Typography & Spacing */}
            <section className="space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <Baseline size={14} /> {t.design.textSize}
                        </label>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-900">
                            {Math.round(tokens.typography.baseSizeMultiplier * 100)}%
                        </span>
                    </div>
                    <input
                        type="range" min="0.5" max="2" step="0.1"
                        value={tokens.typography.baseSizeMultiplier}
                        onChange={(e) => updateTokens({ typography: { ...tokens.typography, baseSizeMultiplier: parseFloat(e.target.value) } })}
                        className="w-full h-1.5 bg-gray-950 border border-gray-800 rounded-lg appearance-none cursor-pointer hover:accent-cyan-400 accent-cyan-500 outline-none"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-3">
                        <Scan size={14} /> {t.design.roundness}
                    </label>
                    <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 shadow-inner">
                        {['sharp', 'slight', 'pill'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => updateTokens({ roundness: opt as any })}
                                className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${tokens.roundness === opt ? 'bg-gray-800 text-white shadow ring-1 ring-gray-700' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-3">
                        {t.design.fontStyle}
                    </label>
                    <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 shadow-inner">
                        {['Sans Serif', 'Serif'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => updateTokens({ typography: { ...tokens.typography, headingFont: opt, bodyFont: opt } })}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${tokens.typography.headingFont === opt ? 'bg-gray-800 text-white shadow ring-1 ring-gray-700' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}
                            >
                                <span className={opt === 'Serif' ? 'font-serif' : 'font-sans'}>{opt}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
