# Builder Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the Nexora builder to a three-panel professional editor (Left Structure Navigator + Canvas + Right Inspector) with inline canvas editing, a standalone TopBar, and a five-tab inspector.

**Architecture:** Extract TopBar from BuilderCanvas, add a LeftPanel (240px) for structure navigation, replace SidebarLayout with a RightPanel (320px) with five context-aware tabs (Structure/Style/Content/Animate/AI), and add double-click inline editing on canvas elements.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Tailwind CSS v4, Zustand (useBuilderStore), Framer Motion (AnimatePresence, Reorder), Lucide React icons.

---

## Task 1: Add UI State to Store

**Files:**
- Modify: `app/builder/store/useBuilderStore.ts`

**Step 1: Add new UI state fields to `BuilderState` interface**

In `useBuilderStore.ts`, add to the `BuilderState` interface after `selectedElementId`:

```typescript
// Panel UI State (not saved in history)
leftPanelTab: 'pages' | 'layers' | 'add';
inspectorTab: 'structure' | 'style' | 'content' | 'animate' | 'ai';

setLeftPanelTab: (tab: 'pages' | 'layers' | 'add') => void;
setInspectorTab: (tab: 'structure' | 'style' | 'content' | 'animate' | 'ai') => void;
```

**Step 2: Initialize and implement in the store**

In the `create<BuilderState>((set) => ({` block, after `selectedElementId: null,` add:

```typescript
leftPanelTab: 'layers',
inspectorTab: 'structure',

setLeftPanelTab: (tab) => set({ leftPanelTab: tab }),
setInspectorTab: (tab) => set({ inspectorTab: tab }),
```

**Step 3: Verify TypeScript**

```bash
cd "/Users/salmanshabi/Desktop/nexora AI/nexora AI/nexora"
npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 errors.

**Step 4: Commit**

```bash
git add app/builder/store/useBuilderStore.ts
git commit -m "feat(builder): add leftPanelTab and inspectorTab UI state to store"
```

---

## Task 2: Extract TopBar

**Files:**
- Create: `app/builder/components/topbar/TopBar.tsx`
- Modify: `app/builder/components/canvas/BuilderCanvas.tsx` (remove embedded TopBar)
- Modify: `app/builder/page.tsx` (add TopBar to layout)

**Step 1: Create `TopBar.tsx`**

```tsx
"use client";
import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { DeviceToggle } from '../canvas/DeviceToggle';
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
                    className="bg-transparent text-sm font-semibold text-white outline-none hover:bg-gray-900 focus:bg-gray-900 px-2 py-1 rounded-md transition-colors min-w-0 max-w-[160px] truncate"
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
                <DeviceToggle />
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

                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-black bg-cyan-500 hover:bg-cyan-400 rounded-lg transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                    <Zap size={14} />
                    <span>Publish</span>
                </button>
            </div>
        </div>
    );
}
```

**Step 2: Remove TopBar from BuilderCanvas**

Read `BuilderCanvas.tsx` first. Find and remove the entire top bar `div` that contains `DeviceToggle` and the undo/redo buttons. The canvas scroll container should become the root of the component.

**Step 3: Update `page.tsx` to three-panel layout**

Replace the current return in `BuilderPage` with:

```tsx
return (
    <div className="flex flex-col h-screen w-full bg-[#050505] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
            {/* LeftPanel added in Task 3 */}
            <BuilderCanvas />
            {/* RightPanel added in Task 5 — keep SidebarLayout for now */}
            <SidebarLayout />
        </div>
    </div>
);
```

Add import: `import { TopBar } from './components/topbar/TopBar';`

**Step 4: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

**Step 5: Commit**

```bash
git add app/builder/components/topbar/TopBar.tsx app/builder/components/canvas/BuilderCanvas.tsx app/builder/page.tsx
git commit -m "feat(builder): extract TopBar with site name, preview and publish actions"
```

---

## Task 3: Create Left Panel Shell

**Files:**
- Create: `app/builder/components/left-panel/LeftPanel.tsx`

**Step 1: Create `LeftPanel.tsx`**

```tsx
"use client";
import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { LayoutDashboard, Layers, Plus } from 'lucide-react';
import { PageManager } from '../sidebar/panels/PageManager';
import { StructureTree } from './StructureTree';
import { AddPanel } from './AddPanel';
import { AnimatePresence, motion } from 'framer-motion';

const TABS = [
    { id: 'pages' as const, icon: LayoutDashboard, label: 'Pages' },
    { id: 'layers' as const, icon: Layers, label: 'Layers' },
    { id: 'add' as const, icon: Plus, label: 'Add' },
];

export function LeftPanel() {
    const leftPanelTab = useBuilderStore(state => state.leftPanelTab);
    const setLeftPanelTab = useBuilderStore(state => state.setLeftPanelTab);

    return (
        <div className="flex h-full shrink-0 border-r border-gray-800">
            {/* Icon sidebar */}
            <div className="flex flex-col items-center gap-1 w-10 py-3 bg-gray-950 border-r border-gray-800">
                {TABS.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setLeftPanelTab(id)}
                        title={label}
                        className={`flex flex-col items-center justify-center w-8 h-8 rounded-lg transition-all ${
                            leftPanelTab === id
                                ? 'bg-cyan-950 text-cyan-400'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
                        }`}
                    >
                        <Icon size={15} />
                    </button>
                ))}
            </div>

            {/* Panel content */}
            <div className="w-[200px] flex flex-col bg-[#0a0a0a] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={leftPanelTab}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className="flex-1 overflow-y-auto custom-scrollbar p-3"
                    >
                        {leftPanelTab === 'pages' && <PageManager />}
                        {leftPanelTab === 'layers' && <StructureTree />}
                        {leftPanelTab === 'add' && <AddPanel />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
```

**Step 2: Commit shell (sub-components added in Task 4)**

```bash
git add app/builder/components/left-panel/LeftPanel.tsx
git commit -m "feat(builder): add LeftPanel shell with pages/layers/add tabs"
```

---

## Task 4: Structure Tree + Add Panel

**Files:**
- Create: `app/builder/components/left-panel/StructureTree.tsx`
- Create: `app/builder/components/left-panel/AddPanel.tsx`
- Modify: `app/builder/page.tsx` (add LeftPanel)

**Step 1: Create `StructureTree.tsx`**

```tsx
"use client";
import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Lock, ChevronRight, Type, Image, Square, MousePointer } from 'lucide-react';
import { ElementNode, Section } from '../../store/types';

const ELEMENT_ICONS: Record<string, React.ElementType> = {
    Text: Type,
    Button: MousePointer,
    Image: Image,
    Container: Square,
    Icon: Square,
    FeatureCard: Square,
};

function ElementRow({ element, depth = 0 }: { element: ElementNode; depth?: number }) {
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const setSelectedElement = useBuilderStore(state => state.setSelectedElement);
    const isSelected = selectedElementId === element.id;
    const Icon = ELEMENT_ICONS[element.type] ?? Square;

    return (
        <div>
            <button
                onClick={() => setSelectedElement(element.id)}
                style={{ paddingLeft: `${8 + depth * 12}px` }}
                className={`w-full flex items-center gap-1.5 pr-2 py-1 rounded text-left transition-colors text-xs ${
                    isSelected
                        ? 'bg-cyan-950/60 text-cyan-300'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
            >
                <Icon size={11} className="shrink-0 opacity-60" />
                <span className="truncate">
                    {element.props.content?.slice(0, 20) || element.type}
                </span>
            </button>
            {element.children?.map(child => (
                <ElementRow key={child.id} element={child} depth={depth + 1} />
            ))}
        </div>
    );
}

function SectionRow({ section }: { section: Section }) {
    const [expanded, setExpanded] = React.useState(true);
    const selectedSectionId = useBuilderStore(state => state.selectedSectionId);
    const setSelectedSection = useBuilderStore(state => state.setSelectedSection);
    const isSelected = selectedSectionId === section.id;

    return (
        <div className="mb-0.5">
            <button
                onClick={() => setSelectedSection(section.id)}
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left transition-colors ${
                    isSelected
                        ? 'bg-cyan-950/60 text-cyan-300'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
            >
                <ChevronRight
                    size={12}
                    className={`shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
                />
                <span className="text-[11px] font-semibold truncate flex-1">{section.type}</span>
                {section.isLocked && <Lock size={10} className="shrink-0 text-yellow-500" />}
            </button>

            {expanded && section.elements && section.elements.length > 0 && (
                <div className="ml-2 border-l border-gray-800 pl-1">
                    {section.elements.map(el => (
                        <ElementRow key={el.id} element={el} depth={0} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function StructureTree() {
    const pages = useBuilderStore(state => state.present.pages);
    const activePageId = useBuilderStore(state => state.activePageId);
    const activePage = pages.find(p => p.id === activePageId);

    if (!activePage) return null;

    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 px-2">
                {activePage.title}
            </p>
            {activePage.sections.length === 0 ? (
                <p className="text-xs text-gray-600 px-2 py-4 text-center">No sections yet</p>
            ) : (
                activePage.sections.map(section => (
                    <SectionRow key={section.id} section={section} />
                ))
            )}
        </div>
    );
}
```

**Step 2: Create `AddPanel.tsx`**

```tsx
"use client";
import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Section } from '../../store/types';

const SECTION_TEMPLATES = [
    { label: 'Hero', type: 'Hero', icon: '⚡', description: 'Full-width hero with headline and CTA' },
    { label: 'Features', type: 'Features', icon: '✦', description: 'Grid of feature highlights' },
    { label: 'Call to Action', type: 'CallToAction', icon: '→', description: 'CTA with button' },
    { label: 'Text Block', type: 'Text', icon: 'T', description: 'Rich text content section' },
];

export function AddPanel() {
    const activePageId = useBuilderStore(state => state.activePageId);
    const addSection = useBuilderStore(state => state.addSection);

    const handleAdd = (type: string) => {
        const newSection: Section = {
            id: `${type.toLowerCase()}-${Date.now()}`,
            type,
            isLocked: false,
            layout: {
                width: 'contained',
                padding: 'default',
                columns: { desktop: 1 },
                columnGap: 'md',
                verticalAlign: 'center',
                backgroundType: 'transparent',
                animation: 'none',
            },
            elements: [],
        };
        addSection(activePageId, newSection);
    };

    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3 px-1">
                Sections
            </p>
            {SECTION_TEMPLATES.map(({ label, type, icon, description }) => (
                <button
                    key={type}
                    onClick={() => handleAdd(type)}
                    className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-gray-800/60 transition-colors group"
                >
                    <span className="text-base leading-none mt-0.5 w-5 text-center shrink-0">{icon}</span>
                    <div>
                        <div className="text-xs font-semibold text-gray-300 group-hover:text-white">{label}</div>
                        <div className="text-[10px] text-gray-600 leading-snug mt-0.5">{description}</div>
                    </div>
                </button>
            ))}
        </div>
    );
}
```

**Step 3: Wire LeftPanel into `page.tsx`**

Add import and insert `<LeftPanel />` before `<BuilderCanvas />`:

```tsx
import { LeftPanel } from './components/left-panel/LeftPanel';

// Inside the flex row div:
<LeftPanel />
<BuilderCanvas />
<SidebarLayout />
```

**Step 4: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

**Step 5: Commit**

```bash
git add app/builder/components/left-panel/
git commit -m "feat(builder): add left panel structure tree, page manager, and add section panel"
```

---

## Task 5: Right Panel with Five Tabs

**Files:**
- Create: `app/builder/components/right-panel/RightPanel.tsx`
- Create: `app/builder/components/right-panel/tabs/StructureTab.tsx`
- Create: `app/builder/components/right-panel/tabs/StyleTab.tsx`
- Create: `app/builder/components/right-panel/tabs/ContentTab.tsx`
- Create: `app/builder/components/right-panel/tabs/AnimateTab.tsx`
- Create: `app/builder/components/right-panel/tabs/AITab.tsx`
- Modify: `app/builder/page.tsx` (swap SidebarLayout for RightPanel)

**Step 1: Create `RightPanel.tsx`**

```tsx
"use client";
import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Layers, Paintbrush, Type, Zap, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { StructureTab } from './tabs/StructureTab';
import { StyleTab } from './tabs/StyleTab';
import { ContentTab } from './tabs/ContentTab';
import { AnimateTab } from './tabs/AnimateTab';
import { AITab } from './tabs/AITab';
import { AIChatBar } from '../sidebar/AIChatBar';

const TABS = [
    { id: 'structure' as const, icon: Layers, label: 'Structure' },
    { id: 'style' as const, icon: Paintbrush, label: 'Style' },
    { id: 'content' as const, icon: Type, label: 'Content' },
    { id: 'animate' as const, icon: Zap, label: 'Animate' },
    { id: 'ai' as const, icon: Sparkles, label: 'AI' },
];

export function RightPanel() {
    const inspectorTab = useBuilderStore(state => state.inspectorTab);
    const setInspectorTab = useBuilderStore(state => state.setInspectorTab);

    return (
        <div className="flex flex-col w-80 shrink-0 border-l border-gray-800 bg-[#0a0a0a]">
            {/* Tab bar */}
            <div className="flex border-b border-gray-800 shrink-0">
                {TABS.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setInspectorTab(id)}
                        title={label}
                        className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 ${
                            inspectorTab === id
                                ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                                : 'border-transparent text-gray-600 hover:text-gray-400'
                        }`}
                    >
                        <Icon size={14} />
                        <span className="hidden lg:block">{label}</span>
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={inspectorTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                    >
                        {inspectorTab === 'structure' && <StructureTab />}
                        {inspectorTab === 'style' && <StyleTab />}
                        {inspectorTab === 'content' && <ContentTab />}
                        {inspectorTab === 'animate' && <AnimateTab />}
                        {inspectorTab === 'ai' && <AITab />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* AI ChatBar pinned at bottom (hidden on AI tab since it shows full panel) */}
            {inspectorTab !== 'ai' && (
                <div className="shrink-0 border-t border-gray-800 p-3">
                    <AIChatBar />
                </div>
            )}
        </div>
    );
}
```

**Step 2: Create `StructureTab.tsx`**

```tsx
"use client";
import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { SectionInspector } from '../../sidebar/panels/SectionInspector';
import { ElementInspector } from '../../sidebar/panels/ElementInspector';
import { DesignTokens } from '../../sidebar/panels/DesignTokens';

export function StructureTab() {
    const selectedSectionId = useBuilderStore(state => state.selectedSectionId);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);

    if (selectedElementId) return <ElementInspector />;
    if (selectedSectionId) return <SectionInspector />;
    return <DesignTokens />;
}
```

**Step 3: Create `StyleTab.tsx`**

```tsx
"use client";
import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { DesignTokens } from '../../sidebar/panels/DesignTokens';
import { ElementInspector } from '../../sidebar/panels/ElementInspector';

export function StyleTab() {
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    if (selectedElementId) return <ElementInspector />;
    return <DesignTokens />;
}
```

**Step 4: Create `ContentTab.tsx`**

```tsx
"use client";
import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { ElementInspector } from '../../sidebar/panels/ElementInspector';

export function ContentTab() {
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const updateWebsiteProps = useBuilderStore(state => state.updateWebsiteProps);
    const websiteName = useBuilderStore(state => state.present.websiteProps.name);

    if (selectedElementId) return <ElementInspector />;

    return (
        <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Site Settings</p>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                    Site Name
                </label>
                <input
                    type="text"
                    value={websiteName}
                    onChange={(e) => updateWebsiteProps({ name: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm text-white outline-none focus:border-cyan-500"
                />
            </div>
            <p className="text-xs text-gray-600 text-center mt-8">
                Select an element on the canvas to edit its content.
            </p>
        </div>
    );
}
```

**Step 5: Create `AnimateTab.tsx`**

```tsx
"use client";
import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';

const ANIMATIONS = [
    'none', 'fadeIn', 'slideUp', 'slideLeft', 'revealOnScroll', 'staggerChildren',
] as const;

export function AnimateTab() {
    const selectedSectionId = useBuilderStore(state => state.selectedSectionId);
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const activePageId = useBuilderStore(state => state.activePageId);
    const pages = useBuilderStore(state => state.present.pages);
    const updateSection = useBuilderStore(state => state.updateSection);

    const activePage = pages.find(p => p.id === activePageId);
    const section = activePage?.sections.find(s => s.id === selectedSectionId);

    if (!section && !selectedElementId) {
        return (
            <div className="text-center py-8">
                <p className="text-xs text-gray-500">Select a section or element to configure its animation.</p>
            </div>
        );
    }

    if (section && !selectedElementId) {
        return (
            <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Section Entry Animation</p>
                <div className="grid grid-cols-2 gap-2">
                    {ANIMATIONS.map(anim => (
                        <button
                            key={anim}
                            onClick={() => updateSection(activePageId, section.id, {
                                layout: { ...section.layout, animation: anim }
                            })}
                            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all capitalize ${
                                section.layout.animation === anim
                                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                                    : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                            }`}
                        >
                            {anim === 'none' ? 'None' : anim}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <p className="text-xs text-gray-500 text-center py-8">Element animation controls coming soon.</p>
    );
}
```

**Step 6: Create `AITab.tsx`**

```tsx
"use client";
import React from 'react';
import { AIChatBar } from '../../sidebar/AIChatBar';

export function AITab() {
    return (
        <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">AI Assistant</p>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Describe changes and the AI will update your site. Select a section to scope changes to it.
            </p>
            <AIChatBar />
        </div>
    );
}
```

**Step 7: Swap SidebarLayout for RightPanel in `page.tsx`**

```tsx
import { RightPanel } from './components/right-panel/RightPanel';
// Remove: import { SidebarLayout } from './components/sidebar/SidebarLayout';

// Replace <SidebarLayout /> with <RightPanel />
```

**Step 8: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

**Step 9: Commit**

```bash
git add app/builder/components/right-panel/ app/builder/page.tsx
git commit -m "feat(builder): add five-tab right panel inspector (Structure/Style/Content/Animate/AI)"
```

---

## Task 6: Inline Canvas Editing

**Files:**
- Modify: `app/builder/components/elements/ElementRenderer.tsx`
- Modify: `app/builder/components/elements/DynamicText.tsx`
- Modify: `app/builder/components/elements/DynamicButton.tsx`
- Modify: `app/builder/components/canvas/SectionRenderer.tsx` (pass sectionId to ElementRenderer)

**Step 1: Read current ElementRenderer.tsx and DynamicText.tsx**

Read both files before modifying to understand their existing props interface.

**Step 2: Add `sectionId` prop to `ElementRenderer`**

Add `sectionId: string` to the `Props` interface.

In `SectionRenderer.tsx`, find `<ElementRenderer key={el.id} element={el} />` and change to:
```tsx
<ElementRenderer key={el.id} element={el} sectionId={section.id} />
```

**Step 3: Add inline editing to `ElementRenderer`**

Add these to the component body:

```tsx
const [isEditing, setIsEditing] = React.useState(false);
const updateElement = useBuilderStore(state => state.updateElement);
const activePageId = useBuilderStore(state => state.activePageId);

const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === 'Text' || element.type === 'Button') {
        setIsEditing(true);
    }
};

const handleSave = (newContent: string) => {
    updateElement(activePageId, sectionId, element.id, { content: newContent });
    setIsEditing(false);
};
```

Pass `isEditing`, `onSave={handleSave}`, and `onDoubleClick={handleDoubleClick}` as props to `DynamicText` and `DynamicButton`.

**Step 4: Update `DynamicText.tsx`**

Add `isEditing?: boolean`, `onSave?: (content: string) => void`, `onDoubleClick?: (e: React.MouseEvent) => void` to the props interface.

Add a `contentRef = React.useRef<HTMLElement>(null)`.

When `isEditing` becomes `true`, use a `useEffect` to focus the element and select all text:

```tsx
React.useEffect(() => {
    if (isEditing && contentRef.current) {
        contentRef.current.focus();
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
    }
}, [isEditing]);
```

When rendering in edit mode, add to the element's existing JSX:
- `contentEditable={isEditing || undefined}`
- `suppressContentEditableWarning={isEditing}`
- `ref={contentRef}`
- `onBlur={(e) => isEditing && onSave?.(e.currentTarget.textContent || '')}`
- `onKeyDown={(e) => { if (e.key === 'Escape') { setIsEditing(false); } if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}`
- Add to className when isEditing: `outline-none ring-2 ring-cyan-400 ring-offset-1 cursor-text`
- Wrap in `onDoubleClick={handleDoubleClick}` on the outer element

Note: Do NOT use any innerHTML assignment — use only `textContent` via the ref and `contentEditable`, which avoids XSS risk since we are only handling plain text content.

**Step 5: Update `DynamicButton.tsx`** with the same pattern as DynamicText.

**Step 6: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

**Step 7: Commit**

```bash
git add app/builder/components/elements/ app/builder/components/canvas/SectionRenderer.tsx
git commit -m "feat(builder): add inline double-click editing for Text and Button elements"
```

---

## Task 7: Section Hover Toolbar + Empty States

**Files:**
- Modify: `app/builder/components/canvas/SectionRenderer.tsx`
- Modify: `app/builder/components/canvas/BuilderCanvas.tsx` (empty page state)

**Step 1: Add imports to `SectionRenderer.tsx`**

Add: `ChevronUp, ChevronDown, Copy, Trash2, Plus` from `lucide-react`.

Also import `useBuilderStore` actions: `removeSection`, `addSection`, `reorderSections`.

**Step 2: Add move up / move down logic**

The SectionRenderer already has `index` as a prop. Add:

```tsx
const pages = useBuilderStore(state => state.present.pages);
const reorderSections = useBuilderStore(state => state.reorderSections);
const removeSection = useBuilderStore(state => state.removeSection);
const addSection = useBuilderStore(state => state.addSection);
const activePageId = useBuilderStore(state => state.activePageId);

const activePage = pages.find(p => p.id === activePageId);

const moveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePage || index === 0) return;
    const sections = [...activePage.sections];
    [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
    reorderSections(activePageId, sections);
};

const moveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePage || index === activePage.sections.length - 1) return;
    const sections = [...activePage.sections];
    [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
    reorderSections(activePageId, sections);
};

const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSection = JSON.parse(JSON.stringify(section));
    newSection.id = `${section.type.toLowerCase()}-${Date.now()}`;
    newSection.isLocked = false;
    addSection(activePageId, newSection, index + 1);
};

const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeSection(activePageId, section.id);
};
```

**Step 3: Add hover toolbar to section wrapper**

Inside the section wrapper `div` (before `renderBlock()`), add:

```tsx
{/* Hover action toolbar */}
<div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-1 shadow-xl pointer-events-auto">
    <button onClick={moveUp} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" title="Move up">
        <ChevronUp size={14} />
    </button>
    <button onClick={moveDown} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" title="Move down">
        <ChevronDown size={14} />
    </button>
    <div className="w-px h-4 bg-gray-700" />
    <button onClick={handleDuplicate} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" title="Duplicate">
        <Copy size={14} />
    </button>
    <button onClick={handleDelete} className="p-1.5 rounded hover:bg-red-900/60 text-gray-400 hover:text-red-400 transition-colors" title="Delete">
        <Trash2 size={14} />
    </button>
</div>
```

**Step 4: Add empty section state in `renderBlock()`**

In the UX 3.0 rendering path, if `section.elements.length === 0`, render:

```tsx
if (section.elements && section.elements.length === 0) {
    return (
        <div className="flex items-center justify-center py-20 mx-4 my-4 border-2 border-dashed border-gray-800 rounded-xl group-hover:border-cyan-500/40 transition-colors">
            <div className="flex flex-col items-center gap-2 text-gray-600">
                <Plus size={20} />
                <span className="text-xs font-semibold">Empty section</span>
            </div>
        </div>
    );
}
```

**Step 5: Add empty page state in `BuilderCanvas.tsx`**

Read `BuilderCanvas.tsx` first. In the section list rendering area, if `activePage.sections.length === 0`, render before or instead of the Reorder.Group:

```tsx
{activePage.sections.length === 0 ? (
    <div className="flex flex-1 items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3 text-gray-600">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center">
                <Plus size={24} />
            </div>
            <span className="text-sm font-semibold">Add your first section</span>
            <span className="text-xs text-gray-700">Use the + panel on the left</span>
        </div>
    </div>
) : (
    <Reorder.Group ...>{/* existing section list */}</Reorder.Group>
)}
```

**Step 6: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -30
```

**Step 7: Commit**

```bash
git add app/builder/components/canvas/
git commit -m "feat(builder): add section hover toolbar, move up/down, empty section and empty page states"
```

---

## Task 8: Final Integration + Cleanup

**Files:**
- Review: `app/builder/page.tsx`
- Optional: remove or archive `app/builder/components/sidebar/SidebarLayout.tsx` (keep until confirmed stable)

**Step 1: Final TypeScript check**

```bash
cd "/Users/salmanshabi/Desktop/nexora AI/nexora AI/nexora"
npx tsc --noEmit 2>&1
```

Expected: 0 errors.

**Step 2: Verify dev server starts**

```bash
npm run dev 2>&1 | head -20
```

Expected: `✓ Ready` on port 3000.

**Step 3: Manual test checklist**

Navigate to `http://localhost:3000/builder` and verify:
- [ ] TopBar shows site name, device toggle, undo/redo, preview, publish
- [ ] Left panel shows Layers tree with sections and elements
- [ ] Left panel Pages tab shows page list
- [ ] Left panel Add tab lists section types and clicking one adds it
- [ ] Right panel has 5 tabs (Structure / Style / Content / Animate / AI)
- [ ] Clicking a section selects it (Structure tab shows SectionInspector)
- [ ] Clicking an element selects it (Structure tab shows ElementInspector)
- [ ] Double-clicking a text element activates inline edit (blue ring)
- [ ] Typing in inline edit and pressing Enter saves the content
- [ ] Pressing Escape cancels the edit
- [ ] Section hover toolbar appears on hover with move/duplicate/delete
- [ ] Move up/down reorders sections
- [ ] Undo restores previous state after any change

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat(builder): complete three-panel builder redesign with inline editing and structure navigator"
```

---

## Summary of New Files

| File | Purpose |
|------|---------|
| `components/topbar/TopBar.tsx` | Standalone top bar: site name, device toggle, undo/redo, preview, publish |
| `components/left-panel/LeftPanel.tsx` | Left panel shell: icon sidebar + animated tab content |
| `components/left-panel/StructureTree.tsx` | Recursive layers tree synced with store selection |
| `components/left-panel/AddPanel.tsx` | Section type picker |
| `components/right-panel/RightPanel.tsx` | Five-tab inspector with pinned AI chat bar |
| `components/right-panel/tabs/StructureTab.tsx` | Layout/inspector — context-aware |
| `components/right-panel/tabs/StyleTab.tsx` | Colors/spacing — context-aware |
| `components/right-panel/tabs/ContentTab.tsx` | Text/image/link editing — context-aware |
| `components/right-panel/tabs/AnimateTab.tsx` | Entry animation picker |
| `components/right-panel/tabs/AITab.tsx` | Full AI chat panel |

## Modified Files

| File | Change |
|------|--------|
| `store/useBuilderStore.ts` | Add `leftPanelTab`, `inspectorTab`, setters |
| `page.tsx` | Three-panel layout: TopBar + LeftPanel + Canvas + RightPanel |
| `canvas/BuilderCanvas.tsx` | Remove embedded TopBar; add empty page state |
| `canvas/SectionRenderer.tsx` | Hover toolbar + move up/down + empty section state + pass sectionId |
| `elements/ElementRenderer.tsx` | Inline edit mode on double-click, accept sectionId prop |
| `elements/DynamicText.tsx` | contentEditable with ref-based focus, no innerHTML |
| `elements/DynamicButton.tsx` | contentEditable with ref-based focus |
