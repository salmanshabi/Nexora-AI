"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useBuilderStore } from './store/useBuilderStore';
import type { AppStateSnapshot } from './store/types';
import { BuilderCanvas } from './components/canvas/BuilderCanvas';
import { RightPanel } from './components/right-panel/RightPanel';
import { TopBar } from './components/topbar/TopBar';
import { LeftPanel } from './components/left-panel/LeftPanel';
import { getTemplateState } from '../templates/templateData';

export default function BuilderPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const loadTemplate = useBuilderStore(state => state.loadTemplate);
    const loadProject = useBuilderStore(state => state.loadProject);
    const setProjectId = useBuilderStore(state => state.setProjectId);

    const { status } = useSession();

    // Ensure we don't render zustand state on the server (Hydration Error protection)
    useEffect(() => {
        let cancelled = false;

        const bootstrapBuilder = async () => {
            const params = new URLSearchParams(window.location.search);
            const templateId = params.get('template');
            const projectIdFromUrl = params.get('project');

            if (projectIdFromUrl) {
                try {
                    const res = await fetch(`/api/projects/${projectIdFromUrl}`, { cache: "no-store" });
                    if (res.ok) {
                        const data: { project?: { state?: unknown } } = await res.json();
                        const remoteState = data?.project?.state;
                        if (remoteState && typeof remoteState === "object") {
                            loadProject(projectIdFromUrl, remoteState as AppStateSnapshot);
                        } else {
                            setProjectId(projectIdFromUrl);
                            useBuilderStore.persist.rehydrate();
                        }
                    } else {
                        setProjectId(projectIdFromUrl);
                        useBuilderStore.persist.rehydrate();
                    }
                } catch (error) {
                    console.error("Failed to load project from API:", error);
                    setProjectId(projectIdFromUrl);
                    useBuilderStore.persist.rehydrate();
                }

                if (!cancelled) setMounted(true);
                return;
            }

            if (templateId) {
                // URL has a template — load it directly, skip localStorage restore
                const templateState = getTemplateState(templateId);
                if (templateState) {
                    loadTemplate(templateState);
                }
                setProjectId(null);
                // Clear URL to prevent reloading on refresh
                router.replace('/builder');
            } else {
                // No template/project in URL — restore from localStorage if available
                useBuilderStore.persist.rehydrate();
            }

            if (!cancelled) setMounted(true);
        };

        void bootstrapBuilder();

        return () => {
            cancelled = true;
        };
    }, [router, loadTemplate, loadProject, setProjectId]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-up");
        }
    }, [status, router]);

    if (!mounted) return (
        <div className="flex h-screen w-full bg-[#050505] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-cyan-500 font-mono tracking-widest text-sm uppercase">Loading Builder Environment</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen w-full bg-[#050505] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">
            <TopBar />
            <div className="flex flex-1 overflow-hidden">
                <LeftPanel />
                <BuilderCanvas />
                <RightPanel />
            </div>
        </div>
    );
}
