"use client";
import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { DeviceToggle } from '../shared/DeviceToggle';
import { Undo2, Redo2, Eye, Zap } from 'lucide-react';

export function TopBar() {
    const undo = useBuilderStore(state => state.undo);
    const redo = useBuilderStore(state => state.redo);
    const past = useBuilderStore(state => state.past);
    const future = useBuilderStore(state => state.future);
    const websiteName = useBuilderStore(state => state.present.websiteProps.name);
    const updateWebsiteProps = useBuilderStore(state => state.updateWebsiteProps);
    const pages = useBuilderStore(state => state.present.pages);
    const activePageId = useBuilderStore(state => state.activePageId);
    const activePage = pages.find(p => p.id === activePageId);
    const device = useBuilderStore(state => state.device);
    const setDevice = useBuilderStore(state => state.setDevice);

    return (
        <div className="flex items-center justify-between h-[52px] px-4 bg-gray-950 border-b border-gray-800 shrink-0 z-50">
            {/* Left: Logo + site name + page breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm shrink-0">
                    <Zap size={16} className="text-cyan-400" />
                    <span className="hidden sm:inline text-gray-500">/</span>
                </div>
                <input
                    type="text"
                    value={websiteName}
                    onChange={(e) => updateWebsiteProps({ name: e.target.value })}
                    aria-label="Site name"
                    className="bg-transparent text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-cyan-500/50 hover:bg-gray-900 focus:bg-gray-900 px-2 py-1 rounded-md transition-colors min-w-0 max-w-[160px] truncate"
                    title="Site name"
                />
                {activePage && (
                    <>
                        <span className="text-gray-600">/</span>
                        <span className="text-sm text-gray-400 truncate max-w-[120px]">{activePage.title}</span>
                    </>
                )}
            </div>

            {/* Center: Device toggle */}
            <div className="flex items-center">
                <DeviceToggle current={device} onChange={setDevice} />
            </div>

            {/* Right: History + actions */}
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={undo}
                    disabled={past.length === 0}
                    title="Undo (Ctrl+Z)"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <Undo2 size={16} />
                </button>
                <button
                    onClick={redo}
                    disabled={future.length === 0}
                    title="Redo (Ctrl+Shift+Z)"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <Redo2 size={16} />
                </button>

                <div className="w-px h-6 bg-gray-800 mx-1" />

                <button
                    onClick={() => window.open('/preview', '_blank')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border border-gray-700"
                >
                    <Eye size={14} />
                    <span className="hidden sm:inline">Preview</span>
                </button>

                <button
                    disabled
                    title="Publishing coming soon"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-black bg-cyan-500 hover:bg-cyan-400 rounded-lg transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Zap size={14} />
                    <span>Publish</span>
                </button>
            </div>
        </div>
    );
}
