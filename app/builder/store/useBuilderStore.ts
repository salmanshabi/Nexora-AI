import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AppStateSnapshot, DesignTokens, PageData, Section, ElementProps, ElementNode } from './types';

export interface BuilderState {
    // History Stacks
    past: AppStateSnapshot[];
    present: AppStateSnapshot;
    future: AppStateSnapshot[];

    // UI Selection State (Not saved in history)
    activePageId: string;
    selectedSectionId: string | null;
    selectedElementId: string | null; // Phase 5: Element selection state

    // Panel UI State (not saved in history)
    leftPanelTab: 'pages' | 'layers' | 'add';
    inspectorTab: 'structure' | 'style' | 'content' | 'animate' | 'ai';
    device: 'desktop' | 'tablet' | 'mobile';
    canvasZoom: number; // 0.5 to 2.0

    setLeftPanelTab: (tab: 'pages' | 'layers' | 'add') => void;
    setInspectorTab: (tab: 'structure' | 'style' | 'content' | 'animate' | 'ai') => void;
    setDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
    setCanvasZoom: (zoom: number) => void;

    // View Actions
    setActivePage: (pageId: string) => void;
    setSelectedSection: (sectionId: string | null) => void;
    setSelectedElement: (elementId: string | null) => void; // Phase 5 action

    // History Actions
    undo: () => void;
    redo: () => void;

    // Universal Setter
    setAppState: (newState: AppStateSnapshot) => void;
    loadTemplate: (newState: Partial<AppStateSnapshot>) => void;

    // Granular Mutations
    updateTokens: (updates: Partial<DesignTokens>) => void;
    updateWebsiteProps: (updates: Partial<AppStateSnapshot['websiteProps']>) => void;

    addPage: (page: PageData) => void;
    updatePage: (pageId: string, updates: Partial<PageData>) => void;
    removePage: (pageId: string) => void;

    addSection: (pageId: string, section: Section, index?: number) => void;
    updateSection: (pageId: string, sectionId: string, updates: Partial<Section>) => void;
    removeSection: (pageId: string, sectionId: string) => void;
    reorderSections: (pageId: string, newSections: Section[]) => void;
    updateElement: (pageId: string, sectionId: string, elementId: string, updates: Partial<ElementProps>) => void;
    deleteElement: (pageId: string, sectionId: string, elementId: string) => void;
    duplicateElement: (pageId: string, sectionId: string, elementId: string) => void;
}

// --- DEFAULT STATE ---

const defaultTokens: DesignTokens = {
    colors: {
        primary: "#0ea5e9", // cyan-500
        secondary: "#38bdf8",
        background: "#020617", // slate-950
        text: "#f8fafc",
    },
    typography: {
        headingFont: "Sans Serif",
        bodyFont: "Sans Serif",
        baseSizeMultiplier: 1.0,
    },
    spacing: "comfortable",
    roundness: "slight",
    shadows: "soft",
    advanced: {
        spacingScale: 'default',
        shadowStyle: 'soft',
        buttonSystem: {
            roundness: 'slight',
            hoverStyle: 'scale',
        },
        containerWidth: 'standard'
    }
};

const initialSection: Section = {
    id: "hero-initial",
    type: "Hero",
    isLocked: false,
    layout: {
        width: 'contained',
        padding: 'default',
        columns: { desktop: 1 },
        columnGap: 'md',
        verticalAlign: 'center',
        backgroundType: 'transparent',
        animation: 'none'
    },
    // The legacy content string mapping payload, kept for backwards compatibility until elements mapped
    content: {
        title: "Welcome to Nexora AI",
        subtitle: "Build something amazing.",
        buttonText: "Get Started"
    },
    // UX 3.0 Tree
    elements: [
        {
            id: 'hero-title-initial',
            type: 'Text',
            props: {
                content: 'Welcome to Nexora AI',
                textAlign: { desktop: 'center' },
            }
        }
    ]
};

const defaultPages: PageData[] = [
    {
        id: "home",
        title: "Home",
        slug: "/",
        isHiddenInNav: false,
        seo: { metaTitle: "Home", metaDescription: "" },
        sections: [initialSection]
    }
];

const initialState: AppStateSnapshot = {
    websiteProps: { name: "Nexora Project" },
    tokens: defaultTokens,
    pages: defaultPages,
};

// --- HELPER FUNC ---

const saveToHistory = (state: BuilderState, newState: AppStateSnapshot): Partial<BuilderState> => {
    // Limit history stack size to prevent massive memory usage (e.g., 20)
    const MAX_HISTORY = 20;
    const newPast = [...state.past, state.present];
    if (newPast.length > MAX_HISTORY) {
        newPast.shift(); // Remove oldest
    }
    return {
        past: newPast,
        present: newState,
        future: [] // Any new action clears the redo stack
    };
};

// --- STORE ---

export const useBuilderStore = create<BuilderState>()(persist((set) => ({
    past: [],
    present: initialState,
    future: [],

    activePageId: "home",
    selectedSectionId: null,
    selectedElementId: null,

    leftPanelTab: 'layers',
    inspectorTab: 'structure',
    device: 'desktop',
    canvasZoom: 1,

    setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),
    setInspectorTab: (tab) => set({ inspectorTab: tab }),
    setDevice: (device) => set({ device }),
    setCanvasZoom: (zoom) => set({ canvasZoom: Math.min(2, Math.max(0.5, zoom)) }),

    loadTemplate: (templateState) => set((state) => {
        const nextState = { ...state.present, ...templateState };
        return {
            ...saveToHistory(state, nextState),
            activePageId: "home",
            selectedSectionId: null,
            selectedElementId: null
        }
    }),

    setActivePage: (pageId) => set({ activePageId: pageId }),
    setSelectedSection: (sectionId) => set({ selectedSectionId: sectionId, selectedElementId: null }), // Deselect el
    setSelectedElement: (elementId) => set({ selectedElementId: elementId }),

    undo: () => set((state) => {
        if (state.past.length === 0) return state; // Nothing to undo
        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, state.past.length - 1);
        return {
            past: newPast,
            present: previous,
            future: [state.present, ...state.future]
        };
    }),

    redo: () => set((state) => {
        if (state.future.length === 0) return state; // Nothing to redo
        const next = state.future[0];
        const newFuture = state.future.slice(1);
        return {
            past: [...state.past, state.present],
            present: next,
            future: newFuture
        };
    }),

    setAppState: (newState) => set((state) => saveToHistory(state, newState)),

    updateTokens: (updates) => set((state) => {
        const newState = {
            ...state.present,
            tokens: { ...state.present.tokens, ...updates }
        };
        return saveToHistory(state, newState);
    }),

    updateWebsiteProps: (updates) => set((state) => {
        const newState = {
            ...state.present,
            websiteProps: { ...state.present.websiteProps, ...updates }
        };
        return saveToHistory(state, newState);
    }),

    addPage: (page) => set((state) => {
        const newState = {
            ...state.present,
            pages: [...state.present.pages, page]
        };
        return saveToHistory(state, newState);
    }),

    updatePage: (pageId, updates) => set((state) => {
        const newState = {
            ...state.present,
            pages: state.present.pages.map(p => p.id === pageId ? { ...p, ...updates } : p)
        };
        return saveToHistory(state, newState);
    }),

    removePage: (pageId) => set((state) => {
        const newState = {
            ...state.present,
            pages: state.present.pages.filter(p => p.id !== pageId)
        };
        return saveToHistory(state, newState);
    }),

    addSection: (pageId, section, index) => set((state) => {
        const newState = {
            ...state.present,
            pages: state.present.pages.map(p => {
                if (p.id !== pageId) return p;
                const newSections = [...p.sections];
                if (index !== undefined) {
                    newSections.splice(index, 0, section);
                } else {
                    newSections.push(section);
                }
                return { ...p, sections: newSections };
            })
        };
        return saveToHistory(state, newState);
    }),

    updateSection: (pageId, sectionId, updates) => set((state) => {
        const newState = {
            ...state.present,
            pages: state.present.pages.map(p => {
                if (p.id !== pageId) return p;
                return {
                    ...p,
                    sections: p.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s)
                };
            })
        };
        return saveToHistory(state, newState);
    }),

    removeSection: (pageId, sectionId) => set((state) => {
        const newState = {
            ...state.present,
            pages: state.present.pages.map(p => {
                if (p.id !== pageId) return p;
                return { ...p, sections: p.sections.filter(s => s.id !== sectionId) };
            })
        };
        return saveToHistory(state, newState);
    }),

    reorderSections: (pageId, newSections) => set((state) => {
        const newState = {
            ...state.present,
            pages: state.present.pages.map(p => {
                if (p.id !== pageId) return p;
                return { ...p, sections: newSections };
            })
        };
        return saveToHistory(state, newState);
    }),

    updateElement: (pageId, sectionId, elementId, updates) => set((state) => {
        const newState = {
            ...state.present,
            pages: state.present.pages.map(p => {
                if (p.id !== pageId) return p;
                return {
                    ...p,
                    sections: p.sections.map(s => {
                        if (s.id !== sectionId) return s;

                        const updateTree = (nodes: ElementNode[]): ElementNode[] => {
                            return nodes.map(n => {
                                if (n.id === elementId) {
                                    return { ...n, props: { ...n.props, ...updates } };
                                }
                                if (n.children) {
                                    return { ...n, children: updateTree(n.children) };
                                }
                                return n;
                            });
                        };

                        if (!s.elements) return s;
                        return { ...s, elements: updateTree(s.elements) };
                    })
                };
            })
        };
        return saveToHistory(state, newState);
    }),

    deleteElement: (pageId, sectionId, elementId) => set((state) => {
        const removeFromTree = (nodes: ElementNode[]): ElementNode[] => {
            return nodes.filter(n => n.id !== elementId).map(n => {
                if (n.children) return { ...n, children: removeFromTree(n.children) };
                return n;
            });
        };
        const newState = {
            ...state.present,
            pages: state.present.pages.map(p => {
                if (p.id !== pageId) return p;
                return {
                    ...p,
                    sections: p.sections.map(s => {
                        if (s.id !== sectionId || !s.elements) return s;
                        return { ...s, elements: removeFromTree(s.elements) };
                    })
                };
            })
        };
        return { ...saveToHistory(state, newState), selectedElementId: null };
    }),

    duplicateElement: (pageId, sectionId, elementId) => set((state) => {
        const cloneWithNewIds = (node: ElementNode): ElementNode => {
            const newId = `${node.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            return {
                ...node,
                id: newId,
                children: node.children?.map(cloneWithNewIds),
            };
        };
        const duplicateInTree = (nodes: ElementNode[]): ElementNode[] => {
            const result: ElementNode[] = [];
            for (const n of nodes) {
                result.push(n);
                if (n.id === elementId) {
                    result.push(cloneWithNewIds(n));
                } else if (n.children) {
                    // Still need to check children
                    const updated = duplicateInTree(n.children);
                    if (updated !== n.children) {
                        result[result.length - 1] = { ...n, children: updated };
                    }
                }
            }
            return result;
        };
        const newState = {
            ...state.present,
            pages: state.present.pages.map(p => {
                if (p.id !== pageId) return p;
                return {
                    ...p,
                    sections: p.sections.map(s => {
                        if (s.id !== sectionId || !s.elements) return s;
                        return { ...s, elements: duplicateInTree(s.elements) };
                    })
                };
            })
        };
        return saveToHistory(state, newState);
    }),

}),
    {
        name: 'nexora-builder-state',
        skipHydration: true,
        partialize: (state: BuilderState) => ({
            present: state.present,
            activePageId: state.activePageId,
            device: state.device,
            canvasZoom: state.canvasZoom,
        }),
    }
));
