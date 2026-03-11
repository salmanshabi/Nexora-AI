"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useBuilderStore } from '../../store/useBuilderStore';
import { DeviceToggle } from '../shared/DeviceToggle';
import { Undo2, Redo2, Eye, Zap, Save, Check, ChevronDown, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export function TopBar() {
    const router = useRouter();
    const undo = useBuilderStore(state => state.undo);
    const redo = useBuilderStore(state => state.redo);
    const past = useBuilderStore(state => state.past);
    const future = useBuilderStore(state => state.future);
    const projectId = useBuilderStore(state => state.projectId);
    const setProjectId = useBuilderStore(state => state.setProjectId);
    const presentState = useBuilderStore(state => state.present);
    const websiteName = useBuilderStore(state => state.present.websiteProps.name);
    const updateWebsiteProps = useBuilderStore(state => state.updateWebsiteProps);
    const pages = useBuilderStore(state => state.present.pages);
    const activePageId = useBuilderStore(state => state.activePageId);
    const setActivePage = useBuilderStore(state => state.setActivePage);
    const device = useBuilderStore(state => state.device);
    const setDevice = useBuilderStore(state => state.setDevice);
    const canvasZoom = useBuilderStore(state => state.canvasZoom);
    const setCanvasZoom = useBuilderStore(state => state.setCanvasZoom);

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [saveError, setSaveError] = useState<string | null>(null);
    const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const saveResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activePage = pages.find(p => p.id === activePageId);

    const handleSave = async () => {
        if (saveStatus === 'saving') return;

        setSaveError(null);
        setSaveStatus('saving');

        const parseError = async (response: Response) => {
            try {
                const payload: { error?: string } = await response.json();
                if (payload?.error) return payload.error;
            } catch {
                // Ignore parse failures and fallback to status text
            }
            return `Request failed with status ${response.status}`;
        };

        try {
            if (projectId) {
                const updateRes = await fetch(`/api/projects/${projectId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: websiteName,
                        state: presentState,
                        reason: 'manual_save',
                    }),
                });

                if (!updateRes.ok) {
                    throw new Error(await parseError(updateRes));
                }
            } else {
                const createRes = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: websiteName,
                        state: presentState,
                    }),
                });

                if (!createRes.ok) {
                    throw new Error(await parseError(createRes));
                }

                const payload: { project?: { id?: string } } = await createRes.json();
                const newProjectId = payload?.project?.id;

                if (!newProjectId) {
                    throw new Error('Created project is missing an ID');
                }

                setProjectId(newProjectId);
                router.replace(`/builder?project=${newProjectId}`);
            }

            setSaveStatus('saved');
            if (saveResetTimer.current) clearTimeout(saveResetTimer.current);
            saveResetTimer.current = setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to save project';
            console.error('Save project error:', error);
            setSaveError(message);
            setSaveStatus('idle');
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setPageDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (saveResetTimer.current) clearTimeout(saveResetTimer.current);
        };
    }, []);

    const zoomPercent = Math.round(canvasZoom * 100);

    return (
        <div className="flex items-center justify-between h-[56px] px-4 bg-[#0d0d0d] border-b border-gray-800/60 shrink-0 z-50">
            {/* Left: Logo + site name + page selector */}
            <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm shrink-0 mr-1">
                    <Zap size={18} className="text-cyan-400" />
                </div>

                <input
                    type="text"
                    value={websiteName}
                    onChange={(e) => updateWebsiteProps({ name: e.target.value })}
                    aria-label="Site name"
                    className="bg-transparent text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-cyan-500/50 hover:bg-gray-900 focus:bg-gray-900 px-2 py-1.5 rounded-md transition-colors min-w-0 max-w-[160px] truncate"
                    title="Site name"
                />

                <span className="text-gray-700">/</span>

                {/* Page selector dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setPageDropdownOpen(!pageDropdownOpen)}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-900 rounded-md transition-colors"
                    >
                        <span className="truncate max-w-[120px]">{activePage?.title || 'Select page'}</span>
                        <ChevronDown size={12} className={`text-gray-500 transition-transform ${pageDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {pageDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-gray-700/60 rounded-lg shadow-xl shadow-black/50 py-1 min-w-[180px] z-50">
                            {pages.map(page => (
                                <button
                                    key={page.id}
                                    onClick={() => { setActivePage(page.id); setPageDropdownOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${page.id === activePageId
                                            ? 'bg-cyan-950/40 text-cyan-300'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                                        }`}
                                >
                                    <span>{page.title}</span>
                                    <span className="text-[10px] text-gray-600 font-mono">{page.slug}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Center: Device toggle + Zoom controls */}
            <div className="flex items-center gap-3">
                <DeviceToggle current={device} onChange={setDevice} />

                <div className="w-px h-6 bg-gray-800" />

                {/* Zoom controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCanvasZoom(canvasZoom - 0.1)}
                        disabled={canvasZoom <= 0.5}
                        title="Zoom out"
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ZoomOut size={14} />
                    </button>

                    <button
                        onClick={() => setCanvasZoom(1)}
                        title="Reset zoom"
                        className="px-2 py-1 rounded-md text-[11px] font-mono text-gray-400 hover:text-white hover:bg-gray-800 transition-all min-w-[48px] text-center"
                    >
                        {zoomPercent}%
                    </button>

                    <button
                        onClick={() => setCanvasZoom(canvasZoom + 0.1)}
                        disabled={canvasZoom >= 2}
                        title="Zoom in"
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ZoomIn size={14} />
                    </button>
                </div>
            </div>

            {/* Right: History + Save + Preview + Publish */}
            <div className="flex items-center gap-1.5 shrink-0">
                <button
                    onClick={undo}
                    disabled={past.length === 0}
                    title="Undo (⌘Z)"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <Undo2 size={15} />
                </button>
                <button
                    onClick={redo}
                    disabled={future.length === 0}
                    title="Redo (⌘⇧Z)"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <Redo2 size={15} />
                </button>

                <div className="w-px h-6 bg-gray-800 mx-0.5" />

                {/* Save button with status */}
                <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    title={saveError ? saveError : 'Save project'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all border ${saveStatus === 'saved'
                            ? 'text-green-400 border-green-500/30 bg-green-500/10'
                            : saveStatus === 'saving'
                                ? 'text-gray-400 border-gray-700 bg-gray-800 cursor-wait'
                                : 'text-gray-300 hover:text-white border-gray-700 bg-gray-800 hover:bg-gray-700'
                        }`}
                >
                    {saveStatus === 'saved' ? <Check size={14} /> : saveStatus === 'saving' ? <RotateCcw size={14} className="animate-spin" /> : <Save size={14} />}
                    <span className="hidden sm:inline">
                        {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Save'}
                    </span>
                </button>

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
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-black bg-cyan-500 hover:bg-cyan-400 rounded-lg transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Zap size={14} />
                    <span>Publish</span>
                </button>
                {saveError && (
                    <span className="hidden lg:inline text-xs text-red-400 ml-2 max-w-[220px] truncate" title={saveError}>
                        {saveError}
                    </span>
                )}
            </div>
        </div>
    );
}
