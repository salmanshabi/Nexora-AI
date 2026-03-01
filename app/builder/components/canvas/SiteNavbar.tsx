import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';

export function SiteNavbar() {
    const pages = useBuilderStore(state => state.present.pages);
    const activePageId = useBuilderStore(state => state.activePageId);
    const setActivePage = useBuilderStore(state => state.setActivePage);
    const tokens = useBuilderStore(state => state.present.tokens);
    const websiteProps = useBuilderStore(state => state.present.websiteProps);

    return (
        <nav className="flex items-center justify-between p-8 bg-transparent" style={{ color: tokens.colors.text }}>
            <div className="font-bold text-2xl tracking-tighter cursor-pointer flex items-center gap-3">
                {websiteProps.logoUrl ? (
                    <img src={websiteProps.logoUrl} alt="Logo" className="max-h-8 object-contain" />
                ) : (
                    websiteProps.name
                )}
            </div>
            <div className="hidden md:flex items-center gap-8 font-medium text-sm">
                {pages.filter(p => !p.isHiddenInNav).map((p) => (
                    <button
                        key={p.id}
                        onClick={(e) => { e.stopPropagation(); setActivePage(p.id); }}
                        style={{
                            color: activePageId === p.id ? tokens.colors.primary : tokens.colors.text,
                            opacity: activePageId === p.id ? 1 : 0.7
                        }}
                        className="hover:opacity-100 transition-opacity uppercase tracking-widest text-xs font-bold"
                    >
                        {p.title}
                    </button>
                ))}
            </div>
        </nav>
    );
}
