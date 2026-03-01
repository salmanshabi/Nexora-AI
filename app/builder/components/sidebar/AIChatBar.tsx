import React, { useRef, useState } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { useLanguage } from '@/app/context/LanguageContext';
import { translations } from '@/app/translations';
import { Paperclip, Loader2, Sparkles } from 'lucide-react';
import merge from 'lodash/merge';

export function AIChatBar() {
    const [prompt, setPrompt] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const presentState = useBuilderStore(state => state.present);
    const setAppState = useBuilderStore(state => state.setAppState);

    // Phase 4 Diff Staging State
    const [stagedPatch, setStagedPatch] = useState<any>(null);

    const { lang } = useLanguage();
    const t = translations[lang].builder;

    const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleAIEdit = async () => {
        if ((!prompt.trim() && attachments.length === 0) || isEditing) return;
        setIsEditing(true);

        // Extract only the fields the AI should see and modify
        // IMPORTANT: Filter out locked sections!
        const safePages = presentState.pages.map(page => ({
            ...page,
            sections: page.sections.filter(s => !s.isLocked)
        }));

        const safeState = {
            websiteProps: presentState.websiteProps,
            tokens: presentState.tokens,
            pages: safePages,
            activePageId: useBuilderStore.getState().activePageId
        };

        try {
            const formData = new FormData();
            formData.append("prompt", prompt);
            formData.append("currentState", JSON.stringify(safeState));
            formData.append("language", lang); // Pass language in the request

            attachments.forEach(file => {
                formData.append("images", file);
            });

            const res = await fetch("/api/edit", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to edit via API");
            const updates = await res.json();

            // Stage the diff for user review (Phase 4 requirement)
            setStagedPatch(updates);

            setPrompt("");
            setAttachments([]);
        } catch (e) {
            console.error("AI Edit Failed:", e);
            alert("AI synthesis failed. Check console.");
        } finally {
            setIsEditing(false);
        }
    };

    const applyPatch = () => {
        if (!stagedPatch) return;

        // Merge the patch into current state
        // Keep locked sections strictly untouched
        let newPages = [...presentState.pages];

        if (stagedPatch.pages) {
            newPages = stagedPatch.pages.map((patchedPage: any) => {
                const originalPage = presentState.pages.find(p => p.id === patchedPage.id);
                if (!originalPage) return patchedPage;

                // Preserve locked sections
                const lockedSections = originalPage.sections.filter(s => s.isLocked);
                const unlockedPatchedSections = patchedPage.sections || [];

                // Simple strategy: insert locked sections back at their approximate original indices
                const mergedSections = [...unlockedPatchedSections];
                originalPage.sections.forEach((originalSec, idx) => {
                    if (originalSec.isLocked) {
                        mergedSections.splice(idx, 0, originalSec); // Re-insert lock block
                    }
                });

                // Deep merge the rest of the page properties
                return merge({}, originalPage, { ...patchedPage, sections: mergedSections });
            });
        }

        const newState = {
            websiteProps: stagedPatch.websiteProps ? merge({}, presentState.websiteProps, stagedPatch.websiteProps) : presentState.websiteProps,
            tokens: stagedPatch.tokens ? merge({}, presentState.tokens, stagedPatch.tokens) : presentState.tokens,
            pages: newPages.length > 0 ? newPages : presentState.pages
        };

        setAppState(newState);
        setStagedPatch(null);
    };


    const discardPatch = () => {
        setStagedPatch(null);
    };

    return (
        <div className="relative">
            {/* Diff Preview Toast Overlay */}
            {stagedPatch && (
                <div className="absolute bottom-[calc(100%+16px)] left-0 right-0 bg-gray-900 border border-cyan-500/50 rounded-2xl p-4 shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5">
                    <h4 className="text-cyan-400 font-bold mb-3 flex items-center gap-2 text-sm"><Sparkles size={16} /> {t.chatBar.synthesisComplete}</h4>
                    <ul className="text-xs text-gray-300 space-y-2 mb-4 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                        {stagedPatch.pages && <li className="flex items-start gap-2"><span>✨</span> {t.chatBar.updatedPages}</li>}
                        {stagedPatch.pages && stagedPatch.pages.map((p: any) => p.sections?.map((s: any) => (
                            <li key={s.id} className="flex items-start gap-2 text-[10px] opacity-70 ml-6 border-l border-gray-700 pl-2 py-0.5">
                                - {s.elements ? t.chatBar.modifiedAdvanced : `${t.chatBar.tweakedComponent} ${s.type}`}
                            </li>
                        )))}
                        {stagedPatch.tokens && <li className="flex items-start gap-2"><span>🎨</span> {t.chatBar.reconfiguredTokens}</li>}
                        {stagedPatch.websiteProps && <li className="flex items-start gap-2"><span>📝</span> {t.chatBar.modifiedSite}</li>}
                        {!stagedPatch.pages && !stagedPatch.tokens && !stagedPatch.websiteProps && <li>{t.chatBar.generalImprovements}</li>}
                    </ul>
                    <div className="flex gap-2">
                        <button onClick={applyPatch} className="flex-1 bg-cyan-500 text-black font-bold py-2 rounded-lg hover:bg-cyan-400 transition-colors">{t.applyChanges}</button>
                        <button onClick={discardPatch} className="flex-1 bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-700 transition-colors">{t.discard}</button>
                    </div>
                </div>
            )}

            {/* Attachments Preview */}
            {attachments.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 custom-scrollbar">
                    {attachments.map((file, i) => (
                        <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-700 shrink-0">
                            <img src={URL.createObjectURL(file)} alt="attachment" className="w-full h-full object-cover" />
                            <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5 text-white hover:bg-red-500/80">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Field */}
            <div className={`mt-2 flex items-center gap-3 rounded-2xl bg-gray-950 p-2 shadow-inner transition-all ${isEditing ? "ring-2 ring-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]" : "ring-1 ring-gray-800 focus-within:ring-cyan-500/50"}`}>
                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-500 hover:text-cyan-400 rounded-xl hover:bg-gray-900 transition-colors" title={t.chatBar.attachImage}>
                    <Paperclip size={18} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileAttach} />

                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAIEdit(); }}
                    placeholder={isEditing ? t.chatWaitPlaceholder : t.chatPlaceholder}
                    disabled={isEditing}
                    className="flex-1 bg-transparent text-[15px] font-medium text-white outline-none placeholder-gray-600 disabled:opacity-50"
                />

                <button
                    onClick={handleAIEdit}
                    disabled={(!prompt.trim() && attachments.length === 0) || isEditing}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all shadow-lg ${prompt.trim() || attachments.length > 0 ? "bg-cyan-500 text-black hover:bg-cyan-400 hover:scale-105" : "bg-gray-800 text-gray-500 opacity-50"}`}
                >
                    {isEditing ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Sparkles size={18} />
                    )}
                </button>
            </div>
        </div>
    );
}
