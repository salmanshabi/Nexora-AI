import React, { useMemo, useRef, useState } from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { ElementNode } from '../../../store/types';
import { Type, PaintBucket, Link2, LayoutTemplate, Box, Type as TypeIcon } from 'lucide-react';
import { UnitInput } from './UnitInput';
import { useLanguage } from '@/app/context/LanguageContext';
import { translations } from '@/app/translations';

export function ElementInspector() {
    const activePageId = useBuilderStore(state => state.activePageId);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const projectId = useBuilderStore(state => state.projectId);
    const pages = useBuilderStore(state => state.present.pages);
    const updateElement = useBuilderStore(state => state.updateElement);

    const { lang } = useLanguage();
    const t = translations[lang].builder;
    const imageUploadInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const match = useMemo(() => {
        if (!selectedElementId) return null;
        const page = pages.find(p => p.id === activePageId);
        if (!page) return null;

        for (const section of page.sections) {
            if (!section.elements) continue;

            let foundNode: ElementNode | null = null;
            const search = (nodes: ElementNode[]) => {
                for (const n of nodes) {
                    if (n.id === selectedElementId) {
                        foundNode = n;
                        return true;
                    }
                    if (n.children && search(n.children)) return true;
                }
                return false;
            };

            if (search(section.elements)) {
                return { sectionId: section.id, element: foundNode! };
            }
        }
        return null;
    }, [pages, activePageId, selectedElementId]);

    if (!match) return <div className="p-8 text-center text-gray-500 text-sm">{t.inspector.pleaseSelect}</div>;

    const { sectionId, element } = match;
    const customStyle = element.props.style || {};

    const updateProp = (key: string, value: unknown) => {
        updateElement(activePageId, sectionId, element.id, { [key]: value });
    };

    const updateStyle = (key: string, value: string) => {
        const newStyle = { ...customStyle };
        if (value === '' || value === 'auto') {
            delete newStyle[key];
        } else {
            newStyle[key] = value;
        }
        updateProp('style', newStyle);
    };

    const uploadImageToProject = async (file: File | null) => {
        if (!file) return;

        if (!projectId) {
            setUploadError('Save this project first, then upload an image.');
            return;
        }

        try {
            setIsUploadingImage(true);
            setUploadError(null);

            const formData = new FormData();
            formData.set('file', file);

            const response = await fetch(`/api/projects/${projectId}/assets`, {
                method: 'POST',
                body: formData,
            });

            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                const message = typeof payload?.error === 'string' ? payload.error : 'Failed to upload image';
                throw new Error(message);
            }

            const uploadedUrl = payload?.asset?.url;
            if (typeof uploadedUrl !== 'string' || uploadedUrl.length === 0) {
                throw new Error('Upload succeeded but URL was missing');
            }

            updateProp('url', uploadedUrl);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to upload image';
            setUploadError(message);
        } finally {
            setIsUploadingImage(false);
            if (imageUploadInputRef.current) {
                imageUploadInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-200 pb-12">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-[10px] uppercase tracking-widest font-bold">
                {element.type} Settings
            </div>

            {/* Content Field */}
            {(element.type === 'Text' || element.type === 'Button') && (
                <section>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                        <Type size={14} /> {t.inspector.content}
                    </label>
                    {element.type === 'Text' ? (
                        <textarea
                            value={element.props.content || ''}
                            onChange={(e) => updateProp('content', e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm text-gray-300 focus:ring-1 focus:ring-cyan-500 outline-none resize-y min-h-[100px]"
                        />
                    ) : (
                        <input
                            type="text"
                            value={element.props.content || ''}
                            onChange={(e) => updateProp('content', e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm text-gray-300 focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                    )}
                </section>
            )}

            {/* Image Properties */}
            {element.type === 'Image' && (
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                        <Link2 size={14} /> {t.inspector.imageSource}
                    </h3>
                    <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={element.props.url || ''}
                        onChange={(e) => updateProp('url', e.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm text-gray-300 focus:ring-1 focus:ring-cyan-500 outline-none mb-4"
                    />
                    <div className="flex items-center gap-3 mb-4">
                        <input
                            ref={imageUploadInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                void uploadImageToProject(file);
                            }}
                        />
                        <button
                            onClick={() => imageUploadInputRef.current?.click()}
                            disabled={isUploadingImage}
                            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                            {isUploadingImage ? 'Uploading...' : 'Upload from device'}
                        </button>
                        {!projectId && (
                            <span className="text-[11px] text-amber-400">Save project once to enable uploads.</span>
                        )}
                    </div>
                    {uploadError && (
                        <p className="text-xs text-red-400 mb-4">{uploadError}</p>
                    )}

                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{t.inspector.objectFit}</h3>
                    <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 shadow-inner">
                        {['cover', 'contain', 'fill'].map((fit) => (
                            <button
                                key={fit}
                                onClick={() => updateProp('objectFit', fit)}
                                className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${element.props.objectFit === fit || (!element.props.objectFit && fit === 'cover') ? 'bg-gray-800 text-white shadow ring-1 ring-cyan-500/50' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'}`}
                            >
                                {fit}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Advanced Layout & Sizing */}
            <section className="pt-4 border-t border-gray-800/50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                    <LayoutTemplate size={14} /> {t.inspector.layoutAndSize}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <UnitInput
                        label={t.inspector.width}
                        value={customStyle.width || ''}
                        onChange={(val) => updateStyle('width', val)}
                    />
                    <UnitInput
                        label={t.inspector.height}
                        value={customStyle.height || ''}
                        onChange={(val) => updateStyle('height', val)}
                    />
                </div>

                {element.type === 'Container' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">{t.inspector.direction}</label>
                            <select
                                value={customStyle.flexDirection || 'column'}
                                onChange={(e) => updateStyle('flexDirection', e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-xs text-gray-300 outline-none"
                            >
                                <option value="row">{t.inspector.row}</option>
                                <option value="column">{t.inspector.col}</option>
                            </select>
                        </div>
                        <UnitInput
                            label="Gap"
                            value={customStyle.gap || '1rem'}
                            onChange={(val) => updateStyle('gap', val)}
                        />
                    </div>
                )}
            </section>

            {/* Spacing (Margin & Padding) */}
            <section className="pt-4 border-t border-gray-800/50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                    <Box size={14} /> {t.inspector.spacing}
                </h3>
                <div className="space-y-4">
                    <div className="p-3 bg-gray-950/50 border border-gray-800 rounded-xl relative">
                        <span className="absolute top-1 left-2 text-[9px] font-bold text-gray-600 uppercase">{t.inspector.margin}</span>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <UnitInput label={t.inspector.top} value={customStyle.marginTop} onChange={(val) => updateStyle('marginTop', val)} />
                            <UnitInput label={t.inspector.bottom} value={customStyle.marginBottom} onChange={(val) => updateStyle('marginBottom', val)} />
                            <UnitInput label={t.inspector.left} value={customStyle.marginLeft} onChange={(val) => updateStyle('marginLeft', val)} />
                            <UnitInput label={t.inspector.right} value={customStyle.marginRight} onChange={(val) => updateStyle('marginRight', val)} />
                        </div>
                    </div>

                    <div className="p-3 bg-gray-950/50 border border-gray-800 rounded-xl relative">
                        <span className="absolute top-1 left-2 text-[9px] font-bold text-gray-600 uppercase">{t.inspector.padding}</span>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <UnitInput label={t.inspector.top} value={customStyle.paddingTop} onChange={(val) => updateStyle('paddingTop', val)} />
                            <UnitInput label={t.inspector.bottom} value={customStyle.paddingBottom} onChange={(val) => updateStyle('paddingBottom', val)} />
                            <UnitInput label={t.inspector.left} value={customStyle.paddingLeft} onChange={(val) => updateStyle('paddingLeft', val)} />
                            <UnitInput label={t.inspector.right} value={customStyle.paddingRight} onChange={(val) => updateStyle('paddingRight', val)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Typography */}
            {element.type === 'Text' && (
                <section className="pt-4 border-t border-gray-800/50">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                        <TypeIcon size={14} /> {t.inspector.typography}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <UnitInput
                            label={t.inspector.fontSize}
                            value={customStyle.fontSize || ''}
                            onChange={(val) => updateStyle('fontSize', val)}
                        />
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">{t.inspector.weight}</label>
                            <select
                                value={customStyle.fontWeight || 'normal'}
                                onChange={(e) => updateStyle('fontWeight', e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-xs text-gray-300 outline-none"
                            >
                                <option value="normal">{t.inspector.normal}</option>
                                <option value="bold">{t.inspector.bold}</option>
                                <option value="800">{t.inspector.extraBold}</option>
                            </select>
                        </div>
                    </div>
                </section>
            )}

            {/* Colors & Appearance */}
            <section className="pt-4 border-t border-gray-800/50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                    <PaintBucket size={14} /> {t.inspector.appearance}
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.inspector.bgColor}</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={element.props.customBg || '#000000'}
                                onChange={(e) => updateProp('customBg', e.target.value)}
                                className="h-6 w-6 rounded cursor-pointer bg-transparent"
                            />
                            <button
                                onClick={() => updateProp('customBg', undefined)}
                                className="text-[10px] text-gray-500 hover:text-red-400"
                            >{t.inspector.clear}</button>
                        </div>
                    </div>

                    {(element.type === 'Text' || element.type === 'Button') && (
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.inspector.textColor}</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={element.props.customColor || '#ffffff'}
                                    onChange={(e) => updateProp('customColor', e.target.value)}
                                    className="h-6 w-6 rounded cursor-pointer bg-transparent"
                                />
                                <button
                                    onClick={() => updateProp('customColor', undefined)}
                                    className="text-[10px] text-gray-500 hover:text-red-400"
                                >{t.inspector.clear}</button>
                            </div>
                        </div>
                    )}

                    <UnitInput
                        label={t.inspector.borderRadius}
                        value={customStyle.borderRadius || ''}
                        onChange={(val) => updateStyle('borderRadius', val)}
                    />
                </div>
            </section>
        </div>
    );
}
