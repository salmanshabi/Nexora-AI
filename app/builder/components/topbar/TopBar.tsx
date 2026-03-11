"use client";
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { useBuilderStore } from '../../store/useBuilderStore';
import type { AppStateSnapshot } from '../../store/types';
import { DeviceToggle } from '../shared/DeviceToggle';
import { Undo2, Redo2, Eye, Zap, Save, Check, ChevronDown, ZoomIn, ZoomOut, RotateCcw, History } from 'lucide-react';

const AUTO_SAVE_DELAY_MS = 4000;

interface ProjectVersion {
    id: string;
    reason: string | null;
    created_at: string;
}

type PublishStatus = 'idle' | 'publishing' | 'published';

export function TopBar() {
    const router = useRouter();
    const undo = useBuilderStore(state => state.undo);
    const redo = useBuilderStore(state => state.redo);
    const past = useBuilderStore(state => state.past);
    const future = useBuilderStore(state => state.future);
    const projectId = useBuilderStore(state => state.projectId);
    const loadProject = useBuilderStore(state => state.loadProject);
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
    const [isDirty, setIsDirty] = useState(false);
    const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
    const [versionsOpen, setVersionsOpen] = useState(false);
    const [versions, setVersions] = useState<ProjectVersion[]>([]);
    const [versionsLoading, setVersionsLoading] = useState(false);
    const [versionsError, setVersionsError] = useState<string | null>(null);
    const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);
    const [publishStatus, setPublishStatus] = useState<PublishStatus>('idle');
    const [publishError, setPublishError] = useState<string | null>(null);
    const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const versionsRef = useRef<HTMLDivElement>(null);
    const saveResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const publishResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const previousProjectId = useRef<string | null>(null);
    const lastSavedSnapshot = useRef<string | null>(null);

    const stateSnapshot = useMemo(() => JSON.stringify(presentState), [presentState]);

    const activePage = pages.find(p => p.id === activePageId);

    const saveProject = useCallback(async (source: 'manual' | 'auto'): Promise<string | null> => {
        if (saveStatus === 'saving') return null;
        let currentProjectId = projectId;

        const parseError = async (response: Response) => {
            try {
                const payload: { error?: string } = await response.json();
                if (payload?.error) return payload.error;
            } catch {
                // Ignore parse failures and fallback to status text
            }
            return `Request failed with status ${response.status}`;
        };

        if (source === 'manual') {
            setSaveError(null);
        }
        setSaveStatus('saving');

        try {
            if (projectId) {
                const updateRes = await fetch(`/api/projects/${projectId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: websiteName,
                        state: presentState,
                        reason: source === 'auto' ? 'auto_save' : 'manual_save',
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
                currentProjectId = newProjectId;
            }

            lastSavedSnapshot.current = stateSnapshot;
            setIsDirty(false);
            setSaveStatus('saved');
            if (saveResetTimer.current) clearTimeout(saveResetTimer.current);
            saveResetTimer.current = setTimeout(() => setSaveStatus('idle'), 2000);
            return currentProjectId;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to save project';
            console.error('Save project error:', error);
            setSaveError(message);
            setSaveStatus('idle');
            return null;
        }
    }, [projectId, presentState, router, saveStatus, setProjectId, stateSnapshot, websiteName]);

    const handleSave = async () => {
        await saveProject('manual');
    };

    const fetchVersions = useCallback(async () => {
        if (!projectId) {
            setVersions([]);
            setVersionsError('Save this project first to enable version history.');
            return;
        }

        setVersionsLoading(true);
        setVersionsError(null);

        try {
            const response = await fetch(`/api/projects/${projectId}/versions?limit=20`, { cache: 'no-store' });
            const payload: { error?: string; versions?: ProjectVersion[] } = await response.json();

            if (!response.ok) {
                throw new Error(payload?.error || 'Failed to load versions');
            }

            setVersions(payload.versions ?? []);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load versions';
            setVersionsError(message);
            setVersions([]);
        } finally {
            setVersionsLoading(false);
        }
    }, [projectId]);

    const handleToggleVersions = async () => {
        if (versionsOpen) {
            setVersionsOpen(false);
            return;
        }

        setVersionsOpen(true);
        await fetchVersions();
    };

    const restoreVersion = useCallback(async (versionId: string) => {
        if (!projectId || restoringVersionId) return;
        if (isDirty && !window.confirm('You have unsaved changes. Restore anyway?')) return;

        setRestoringVersionId(versionId);
        setVersionsError(null);

        try {
            const response = await fetch(`/api/projects/${projectId}/versions/${versionId}/restore`, {
                method: 'POST',
            });
            const payload: { error?: string; project?: { state?: unknown } } = await response.json();

            if (!response.ok) {
                throw new Error(payload?.error || 'Failed to restore version');
            }

            const restoredState = payload?.project?.state;
            if (!restoredState || typeof restoredState !== 'object') {
                throw new Error('Restore response did not include a valid project state');
            }

            loadProject(projectId, restoredState as AppStateSnapshot);
            lastSavedSnapshot.current = JSON.stringify(restoredState);
            setIsDirty(false);
            setSaveStatus('saved');
            if (saveResetTimer.current) clearTimeout(saveResetTimer.current);
            saveResetTimer.current = setTimeout(() => setSaveStatus('idle'), 2000);
            setVersionsOpen(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to restore version';
            setVersionsError(message);
        } finally {
            setRestoringVersionId(null);
        }
    }, [isDirty, loadProject, projectId, restoringVersionId]);

    const refreshPublishStatus = useCallback(async () => {
        if (!projectId) {
            setPublishedUrl(null);
            setPublishError(null);
            return;
        }

        try {
            const response = await fetch(`/api/projects/${projectId}/publish`, { cache: 'no-store' });
            const payload: { published?: boolean; publicUrl?: string; error?: string } = await response.json();
            if (!response.ok) {
                throw new Error(payload?.error || 'Failed to load publish status');
            }

            if (payload.published && payload.publicUrl) {
                setPublishedUrl(payload.publicUrl);
            } else {
                setPublishedUrl(null);
            }
            setPublishError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load publish status';
            setPublishError(message);
        }
    }, [projectId]);

    const handlePublish = async () => {
        if (publishStatus === 'publishing') return;

        setPublishError(null);
        setPublishStatus('publishing');

        let currentProjectId = projectId;
        if (!currentProjectId) {
            currentProjectId = await saveProject('manual');
        }

        if (!currentProjectId) {
            setPublishStatus('idle');
            setPublishError('Save project first before publishing.');
            return;
        }

        try {
            const response = await fetch(`/api/projects/${currentProjectId}/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            const payload: { publicUrl?: string; error?: string } = await response.json();
            if (!response.ok || !payload.publicUrl) {
                throw new Error(payload?.error || 'Failed to publish');
            }

            setPublishedUrl(payload.publicUrl);
            setPublishStatus('published');
            if (publishResetTimer.current) clearTimeout(publishResetTimer.current);
            publishResetTimer.current = setTimeout(() => setPublishStatus('idle'), 2500);
            window.open(payload.publicUrl, '_blank');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to publish';
            setPublishStatus('idle');
            setPublishError(message);
        }
    };

    // Keep unsaved-state baseline aligned with current loaded project and in-memory edits.
    useEffect(() => {
        if (lastSavedSnapshot.current === null) {
            lastSavedSnapshot.current = stateSnapshot;
            previousProjectId.current = projectId;
            setIsDirty(false);
            return;
        }

        if (previousProjectId.current !== projectId) {
            previousProjectId.current = projectId;
            lastSavedSnapshot.current = stateSnapshot;
            setIsDirty(false);
            return;
        }

        setIsDirty(lastSavedSnapshot.current !== stateSnapshot);
    }, [projectId, stateSnapshot]);

    useEffect(() => {
        void refreshPublishStatus();
    }, [refreshPublishStatus]);

    // Debounced autosave for unsaved changes.
    useEffect(() => {
        if (autoSaveTimer.current) {
            clearTimeout(autoSaveTimer.current);
            autoSaveTimer.current = null;
        }

        if (!isDirty || saveStatus === 'saving') {
            return;
        }

        autoSaveTimer.current = setTimeout(() => {
            void saveProject('auto');
        }, AUTO_SAVE_DELAY_MS);

        return () => {
            if (autoSaveTimer.current) {
                clearTimeout(autoSaveTimer.current);
                autoSaveTimer.current = null;
            }
        };
    }, [isDirty, projectId, saveProject, saveStatus, stateSnapshot]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setPageDropdownOpen(false);
            }
            if (versionsRef.current && !versionsRef.current.contains(e.target as Node)) {
                setVersionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (saveResetTimer.current) clearTimeout(saveResetTimer.current);
            if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
            if (publishResetTimer.current) clearTimeout(publishResetTimer.current);
        };
    }, []);

    const zoomPercent = Math.round(canvasZoom * 100);

    const formatVersionReason = (reason: string | null) => {
        if (!reason) return 'Snapshot';
        if (reason === 'initial_create') return 'Initial';
        if (reason === 'manual_save') return 'Manual save';
        if (reason === 'auto_save') return 'Autosave';
        if (reason.startsWith('restore:')) return 'Restore point';
        return reason.replaceAll('_', ' ');
    };

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

                <div className="relative" ref={versionsRef}>
                    <button
                        onClick={() => { void handleToggleVersions(); }}
                        disabled={!projectId && saveStatus === 'saving'}
                        title={projectId ? 'Version history' : 'Save once to create version history'}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white border border-gray-700 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all disabled:opacity-60"
                    >
                        <History size={14} />
                        <span className="hidden sm:inline">Versions</span>
                    </button>

                    {versionsOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-gray-700/80 bg-[#171717] shadow-2xl shadow-black/50 z-50 p-2">
                            <div className="flex items-center justify-between px-2 py-1.5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Version History</p>
                                <button
                                    onClick={() => { void fetchVersions(); }}
                                    className="text-[11px] text-cyan-300 hover:text-cyan-200"
                                >
                                    Refresh
                                </button>
                            </div>

                            {!projectId && (
                                <p className="px-2 py-4 text-xs text-amber-400">Save this project first to enable versions.</p>
                            )}

                            {projectId && versionsLoading && (
                                <p className="px-2 py-4 text-xs text-gray-400">Loading versions...</p>
                            )}

                            {projectId && !versionsLoading && versionsError && (
                                <p className="px-2 py-4 text-xs text-red-400">{versionsError}</p>
                            )}

                            {projectId && !versionsLoading && !versionsError && versions.length === 0 && (
                                <p className="px-2 py-4 text-xs text-gray-500">No snapshots yet.</p>
                            )}

                            {projectId && !versionsLoading && !versionsError && versions.length > 0 && (
                                <div className="max-h-72 overflow-y-auto space-y-1">
                                    {versions.map((version) => (
                                        <button
                                            key={version.id}
                                            onClick={() => { void restoreVersion(version.id); }}
                                            disabled={restoringVersionId !== null}
                                            className="w-full rounded-md border border-transparent px-2 py-2 text-left hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-colors disabled:opacity-60"
                                        >
                                            <p className="text-xs font-medium text-gray-200">
                                                {formatVersionReason(version.reason)}
                                            </p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                {new Date(version.created_at).toLocaleString()}
                                            </p>
                                            {restoringVersionId === version.id && (
                                                <p className="text-[11px] text-cyan-300 mt-1">Restoring...</p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

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
                    onClick={() => { void handlePublish(); }}
                    disabled={publishStatus === 'publishing'}
                    title={publishError ? publishError : (publishedUrl ? `Live: ${publishedUrl}` : 'Publish site')}
                    className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all border ${publishStatus === 'published'
                        ? 'text-emerald-100 bg-emerald-600 border-emerald-500'
                        : publishStatus === 'publishing'
                            ? 'text-cyan-100 bg-cyan-700 border-cyan-600 cursor-wait'
                            : 'text-black bg-cyan-500 hover:bg-cyan-400 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                        }`}
                >
                    {publishStatus === 'publishing' ? <RotateCcw size={14} className="animate-spin" /> : <Zap size={14} />}
                    <span>{publishStatus === 'published' ? 'Published' : publishStatus === 'publishing' ? 'Publishing...' : 'Publish'}</span>
                </button>
                {saveError && (
                    <span className="hidden lg:inline text-xs text-red-400 ml-2 max-w-[220px] truncate" title={saveError}>
                        {saveError}
                    </span>
                )}
                {!saveError && publishError && (
                    <span className="hidden lg:inline text-xs text-red-400 ml-2 max-w-[220px] truncate" title={publishError}>
                        {publishError}
                    </span>
                )}
                {!saveError && (
                    <span className={`hidden xl:inline text-xs ml-2 ${isDirty ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {saveStatus === 'saving' ? 'Saving…' : isDirty ? 'Unsaved changes' : 'All changes saved'}
                    </span>
                )}
                {publishedUrl && (
                    <a
                        href={publishedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden 2xl:inline text-xs text-cyan-300 hover:text-cyan-200 underline ml-2"
                    >
                        View live site
                    </a>
                )}
            </div>
        </div>
    );
}
