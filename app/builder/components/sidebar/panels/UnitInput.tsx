import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UnitInputProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    icon?: React.ReactNode;
}

const UNITS = ['px', '%', 'vh', 'vw', 'rem', 'em', 'auto'];

export function UnitInput({ value = '', onChange, placeholder = 'Auto', label, icon }: UnitInputProps) {
    const [num, setNum] = useState<string>('');
    const [unit, setUnit] = useState<string>('px');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Parse incoming string (e.g., "100%", "50px", "auto")
    useEffect(() => {
        if (!value || value === 'auto') {
            setNum('');
            setUnit(value === 'auto' ? 'auto' : 'px');
            return;
        }

        const match = value.match(/^([\d.-]+)(.*)$/);
        if (match) {
            setNum(match[1]);
            if (match[2] && UNITS.includes(match[2])) {
                setUnit(match[2]);
            } else if (!match[2]) {
                setUnit('px'); // default fallback if no unit provided
            }
        } else {
            // Unrecognized format
            setNum(value);
            setUnit('');
        }
    }, [value]);

    const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setNum(val);
        if (val === '') {
            onChange('');
        } else {
            onChange(`${val}${unit === 'auto' ? 'px' : unit}`);
        }
    };

    const handleUnitSelect = (u: string) => {
        setUnit(u);
        setIsDropdownOpen(false);
        if (u === 'auto') {
            setNum('');
            onChange('auto');
        } else if (num !== '') {
            onChange(`${num}${u}`);
        }
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {(label || icon) && (
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                    {icon} {label}
                </label>
            )}
            <div className="relative flex items-center bg-gray-950 border border-gray-800 rounded-lg group focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
                <input
                    type={unit === 'auto' ? 'text' : 'number'}
                    value={unit === 'auto' ? 'Auto' : num}
                    onChange={handleNumChange}
                    placeholder={placeholder}
                    disabled={unit === 'auto'}
                    className="w-full bg-transparent px-3 py-2 text-sm text-gray-200 outline-none disabled:opacity-50"
                />

                <div className="relative border-l border-gray-800 h-full flex items-center px-1">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-1 text-xs text-gray-400 font-medium px-2 py-1.5 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    >
                        {unit}
                        <ChevronDown size={12} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-1 w-20 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 py-1"
                                >
                                    {UNITS.map(u => (
                                        <button
                                            key={u}
                                            onClick={() => handleUnitSelect(u)}
                                            className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${unit === u ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                                        >
                                            {u}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
