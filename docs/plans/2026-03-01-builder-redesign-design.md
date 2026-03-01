# Builder Redesign — Design Document

**Date:** 2026-03-01
**Status:** Approved

---

## Goal

Upgrade the Nexora AI website builder from a two-panel layout to a professional three-panel editing environment (Left Structure Navigator + Canvas + Right Inspector) with inline canvas editing, a standalone TopBar, and a five-tab inspector — comparable to Webflow/Framer/Wix.

---

## Current Architecture

```
[BuilderCanvas (flex-1)] | [SidebarLayout (w-[360px])]
```

- TopBar (DeviceToggle + Undo/Redo) is embedded inside BuilderCanvas
- Right sidebar context-switches between: global tabs (Pages/Templates/Design), SectionInspector, ElementInspector
- No left panel; no inline canvas editing
- AIChatBar pinned at bottom of right sidebar

---

## Proposed Layout

```
┌─────────────────────────────────────────────────────────────┐
│  TopBar (full width, 52px)                                  │
├──────────────────┬──────────────────────┬───────────────────┤
│  LeftPanel       │  BuilderCanvas       │  RightPanel       │
│  (w-60, 240px)   │  (flex-1)            │  (w-80, 320px)    │
│                  │                      │                   │
│  Structure       │  Device frame +      │  5-tab Inspector  │
│  Navigator       │  live sections       │  + AI ChatBar     │
└──────────────────┴──────────────────────┴───────────────────┘
```

### TopBar
- Left: Nexora logo → site name (inline editable) → page breadcrumb dropdown
- Center: Device toggle (Desktop / Tablet / Mobile)
- Right: Undo / Redo → Preview button → Publish CTA → auto-save dot indicator

### Left Panel (LeftPanel.tsx)
Three modes via icon sidebar (40px strip on far left):

| Icon | Mode | Content |
|------|------|---------|
| `□□` | Pages | Page list with add/rename/delete |
| `≡` | Layers | Recursive tree: Pages → Sections → Elements |
| `+` | Add | Section template library |

Layers tree: click = select (syncs canvas), drag = reorder sections, lock icon per section.

### Right Panel (RightPanel.tsx — replaces SidebarLayout)
Five always-visible tabs, context-aware content:

| Tab | Nothing selected | Section selected | Element selected |
|-----|-----------------|-----------------|-----------------|
| Structure | Design Tokens | Layout controls | Container props |
| Style | Global presets | BG/border | Fill, color, radius |
| Content | Site settings | Block text fields | Text/image/href |
| Animate | Global defaults | Section entry | Element entry + hover |
| AI | Global AI chat | Section-scoped AI | Element-scoped AI |

AIChatBar always pinned at bottom.

### Canvas Inline Editing
- Single click element → select (inspector opens)
- Double click Text/Button → `contentEditable` inline edit mode
- Blur/Enter → save via `updateElement()`
- Escape → discard
- Single click Image → right panel jumps to Content tab
- Hover section toolbar: ↑ ↓ ⧉ Duplicate 🗑 Delete + Add element
- Empty section → centered "+ Add element" CTA
- Empty page → full-canvas "+ Add first section" prompt

---

## Store Changes (Minimal)

Only UI state additions — no `AppStateSnapshot` shape changes:

```typescript
// New UI-only state in useBuilderStore
leftPanelTab: 'pages' | 'layers' | 'add';
setLeftPanelTab: (tab: 'pages' | 'layers' | 'add') => void;

inspectorTab: 'structure' | 'style' | 'content' | 'animate' | 'ai';
setInspectorTab: (tab: ...) => void;
```

No history stack changes needed (UI state is not undo-able).

---

## Migration Phases

| Phase | Scope | Files |
|-------|-------|-------|
| 1 | Extract TopBar | New `TopBar.tsx`, update `BuilderCanvas.tsx`, `page.tsx` |
| 2 | Left Panel | New `LeftPanel.tsx`, `StructureTree.tsx`, store UI state |
| 3 | Right Panel tabs | Rename/restructure `SidebarLayout` → `RightPanel.tsx` with 5 tabs |
| 4 | Canvas inline editing | Update `ElementRenderer.tsx`, `DynamicText.tsx`, `DynamicButton.tsx` |
| 5 | Canvas hover toolbar + empty states | Update `SectionRenderer.tsx` |
| 6 | Animation tab | New `AnimateInspector.tsx` |

---

## File Structure After Redesign

```
app/builder/
├── page.tsx                          (updated: 3-panel layout)
├── store/
│   ├── types.ts                      (unchanged)
│   └── useBuilderStore.ts            (add leftPanelTab, inspectorTab)
├── components/
│   ├── topbar/
│   │   └── TopBar.tsx                (NEW)
│   ├── canvas/
│   │   ├── BuilderCanvas.tsx         (remove TopBar, keep canvas)
│   │   ├── SectionRenderer.tsx       (add hover toolbar, empty states)
│   │   ├── SiteNavbar.tsx            (unchanged)
│   │   └── DeviceToggle.tsx          (moved to TopBar)
│   ├── left-panel/
│   │   ├── LeftPanel.tsx             (NEW — shell + icon sidebar)
│   │   └── StructureTree.tsx         (NEW — recursive layers tree)
│   ├── right-panel/
│   │   ├── RightPanel.tsx            (NEW — replaces SidebarLayout)
│   │   └── tabs/
│   │       ├── StructureTab.tsx      (NEW — wraps existing inspectors)
│   │       ├── StyleTab.tsx          (NEW — colors/spacing/radius)
│   │       ├── ContentTab.tsx        (NEW — text/image/link editing)
│   │       ├── AnimateTab.tsx        (NEW)
│   │       └── AITab.tsx             (NEW — wraps AIChatBar)
│   ├── elements/
│   │   ├── ElementRenderer.tsx       (add inline edit mode)
│   │   ├── DynamicText.tsx           (add contentEditable)
│   │   ├── DynamicButton.tsx         (add contentEditable)
│   │   └── ...                       (unchanged)
│   └── sidebar/                      (legacy — removed after migration)
│       └── panels/
│           ├── PageManager.tsx       (moved to LeftPanel)
│           ├── DesignTokens.tsx      (moved to RightPanel Structure tab)
│           ├── ElementInspector.tsx  (moved to RightPanel Style/Content tabs)
│           ├── SectionInspector.tsx  (moved to RightPanel Structure tab)
│           └── AIChatBar.tsx         (moved to RightPanel bottom)
```
