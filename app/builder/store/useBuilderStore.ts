import { create } from 'zustand';

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

    setLeftPanelTab: (tab: 'pages' | 'layers' | 'add') => void;
    setInspectorTab: (tab: 'structure' | 'style' | 'content' | 'animate' | 'ai') => void;

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

export const useBuilderStore = create<BuilderState>((set) => ({
    past: [],
    present: initialState,
    future: [],

    activePageId: "home",
    selectedSectionId: null,
    selectedElementId: null,

    leftPanelTab: 'layers',
    inspectorTab: 'structure',

    setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),
    setInspectorTab: (tab) => set({ inspectorTab: tab }),

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

}));
