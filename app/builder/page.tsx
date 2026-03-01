"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useBuilderStore } from './store/useBuilderStore';
import { BuilderCanvas } from './components/canvas/BuilderCanvas';
import { RightPanel } from './components/right-panel/RightPanel';
import { TopBar } from './components/topbar/TopBar';
import { LeftPanel } from './components/left-panel/LeftPanel';
import { getTemplateState } from '../templates/templateData';

export default function BuilderPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const loadTemplate = useBuilderStore(state => state.loadTemplate);

    const { status } = useSession();

    // Ensure we don't render zustand state on the server (Hydration Error protection)
    useEffect(() => {
        setMounted(true);

        // Intercept template selection from URL on first mount
        const params = new URLSearchParams(window.location.search);
        const templateId = params.get('template');
        if (templateId) {
            const templateState = getTemplateState(templateId);
            if (templateState) {
                loadTemplate(templateState);
            }
            // Clear URL to prevent reloading on refresh
            router.replace('/builder');
        }
    }, [router, loadTemplate]);

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
