import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { BlockData, EditorState, BoxStyles } from './types';

interface EditorActions {
  // Block Actions
  addBlock: (blockType: BlockData['type'], parentId: string, index?: number) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<BlockData>) => void;
  updateBlockStyles: (id: string, styles: Partial<BoxStyles>) => void;
  moveBlock: (id: string, newParentId: string, newIndex: number) => void;
  duplicateBlock: (id: string) => void;
  applyTemplate: (blocks: Record<string, BlockData>, rootChildren: string[], globalStyles: EditorState['globalStyles']) => void;
  
  // Selection Actions
  selectBlock: (id: string | null) => void;
  hoverBlock: (id: string | null) => void;
  setDraggedBlock: (id: string | null) => void;
  
  // View Actions
  setDeviceMode: (mode: EditorState['deviceMode']) => void;
  togglePreviewMode: () => void;
  updateGlobalStyles: (styles: Partial<EditorState['globalStyles']>) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  
  // State initialization
  loadState: (state: Partial<EditorState>) => void;
}

const initialRootId = 'root';

const createDefaultBlock = (type: BlockData['type']): Omit<BlockData, 'id'> => {
  return {
    type,
    name: type.charAt(0).toUpperCase() + type.slice(1),
    children: [],
    props: {},
    styles: {
      padding: '16px',
    },
  };
};

const initialState: Omit<EditorState, 'history'> = {
  blocks: {
    [initialRootId]: {
      id: initialRootId,
      type: 'container',
      name: 'Body',
      children: [],
      styles: {
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      },
    },
  },
  rootBlockId: initialRootId,
  selectedBlockId: null,
  hoveredBlockId: null,
  draggedBlockId: null,
  deviceMode: 'desktop',
  isPreviewMode: false,
  globalStyles: {
    theme: 'light',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#0066ff',
      background: '#ffffff',
      text: '#111111',
      muted: '#f5f5f5',
    },
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      baseSize: '16px',
    },
  },
};

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  ...initialState,
  history: { past: [], future: [] },

  saveHistory: () => {
    const { blocks, history } = get();
    set({
      history: {
        past: [...history.past, blocks],
        future: [], // Clear future on new action
      },
    });
  },

  undo: () => {
    const { history, blocks } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);

    set({
      blocks: previous,
      history: {
        past: newPast,
        future: [blocks, ...history.future],
      },
      selectedBlockId: null,
    });
  },

  redo: () => {
    const { history, blocks } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      blocks: next,
      history: {
        past: [...history.past, blocks],
        future: newFuture,
      },
      selectedBlockId: null,
    });
  },

  addBlock: (blockType, parentId, index) => {
    const state = get();
    state.saveHistory();
    
    const id = uuidv4();
    const newBlock: BlockData = {
      id,
      parentId,
      ...createDefaultBlock(blockType),
      name: `${blockType} - ${id.substring(0, 4)}`,
    };

    set((state) => {
      const parent = state.blocks[parentId];
      if (!parent) return state;

      const newChildren = [...parent.children];
      if (index !== undefined) {
        newChildren.splice(index, 0, id);
      } else {
        newChildren.push(id);
      }

      return {
        blocks: {
          ...state.blocks,
          [id]: newBlock,
          [parentId]: {
            ...parent,
            children: newChildren,
          },
        },
        selectedBlockId: id, // Auto select newly added block
      };
    });
  },

  removeBlock: (id) => {
    if (id === initialRootId) return; // Cannot delete root
    
    const state = get();
    state.saveHistory();

    set((state) => {
      const blockToRemove = state.blocks[id];
      if (!blockToRemove) return state;

      const newBlocks = { ...state.blocks };
      
      // Helper to recursively delete children
      const deleteRecursive = (blockId: string) => {
        const block = newBlocks[blockId];
        if (block?.children) {
          block.children.forEach(deleteRecursive);
        }
        delete newBlocks[blockId];
      };

      // Remove from parent
      if (blockToRemove.parentId) {
        const parent = newBlocks[blockToRemove.parentId];
        if (parent) {
          newBlocks[blockToRemove.parentId] = {
            ...parent,
            children: parent.children.filter((childId) => childId !== id),
          };
        }
      }

      deleteRecursive(id);

      return {
        blocks: newBlocks,
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
      };
    });
  },

  updateBlock: (id, updates) => {
    get().saveHistory();
    set((state) => ({
      blocks: {
        ...state.blocks,
        [id]: {
          ...state.blocks[id],
          ...updates,
        },
      },
    }));
  },

  updateBlockStyles: (id, newStyles) => {
    get().saveHistory();
    set((state) => ({
      blocks: {
        ...state.blocks,
        [id]: {
          ...state.blocks[id],
          styles: {
            ...state.blocks[id].styles,
            ...newStyles,
          },
        },
      },
    }));
  },

  moveBlock: (id, newParentId, newIndex) => {
    const state = get();
    if (id === initialRootId) return; // Cannot move root
    if (id === newParentId) return; // Cannot move inside itself
    
    // Prevent moving a parent into its own child context to avoid infinite loops
    let currentParentCheck = newParentId;
    while (currentParentCheck !== initialRootId) {
      if (currentParentCheck === id) return;
      currentParentCheck = state.blocks[currentParentCheck].parentId || initialRootId;
    }

    state.saveHistory();

    set((state) => {
      const block = state.blocks[id];
      const oldParentId = block.parentId!;
      const newBlocks = { ...state.blocks };

      // Remove from old parent
      const oldParent = newBlocks[oldParentId];
      if (oldParent) {
          newBlocks[oldParentId] = {
              ...oldParent,
              children: oldParent.children.filter((childId) => childId !== id),
          };
      }

      // Add to new parent
      const newParent = newBlocks[newParentId];
      if (newParent) {
          const newChildren = [...newParent.children];
          newChildren.splice(newIndex, 0, id);
          newBlocks[newParentId] = {
              ...newParent,
              children: newChildren,
          };
      }

      // Update block's parent reference
      newBlocks[id] = {
          ...block,
          parentId: newParentId,
      };
      
      return { blocks: newBlocks };
    });
  },

  duplicateBlock: (id) => {
    const state = get();
    if (id === initialRootId) return;
    
    state.saveHistory();
    
    set((state) => {
      const blockToClone = state.blocks[id];
      if (!blockToClone || !blockToClone.parentId) return state;
      
      const newBlocks = { ...state.blocks };
      
      const cloneRecursive = (originalId: string, parentId: string): string => {
        const originalBlock = state.blocks[originalId];
        const newId = uuidv4();
        
        const newBlock: BlockData = {
          ...originalBlock,
          id: newId,
          parentId,
          name: `${originalBlock.name} (Copy)`,
          children: [],
        };
        
        newBlocks[newId] = newBlock;
        
        // Clone children recursively
        if (originalBlock.children && originalBlock.children.length > 0) {
            newBlock.children = originalBlock.children.map(childId => cloneRecursive(childId, newId));
        }
        
        return newId;
      };
      
      const rootCloneId = cloneRecursive(id, blockToClone.parentId);
      
      // Add root clone to parent's children array right after the original
      const parentBlock = newBlocks[blockToClone.parentId];
      const originalIndex = parentBlock.children.indexOf(id);
      
      newBlocks[blockToClone.parentId] = {
          ...parentBlock,
          children: [
            ...parentBlock.children.slice(0, originalIndex + 1),
            rootCloneId,
            ...parentBlock.children.slice(originalIndex + 1)
          ]
      };
      
      return { 
          blocks: newBlocks,
          selectedBlockId: rootCloneId 
      };
    });
  },

  applyTemplate: (newBlocks, rootChildren, globalStyles) => {
    const state = get();
    state.saveHistory();

    set((state) => {
      const rootBlock = state.blocks[initialRootId];
      if (!rootBlock) return state; // Safety check

      return {
        blocks: {
          [initialRootId]: {
            ...rootBlock,
            children: rootChildren,
          },
          ...newBlocks,
        },
        globalStyles,
        selectedBlockId: null,
      };
    });
  },

  selectBlock: (id) => set({ selectedBlockId: id }),
  hoverBlock: (id) => set({ hoveredBlockId: id }),
  setDraggedBlock: (id) => set({ draggedBlockId: id }),
  setDeviceMode: (mode) => set({ deviceMode: mode }),
  togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
  
  updateGlobalStyles: (styles) => set((state) => ({
    globalStyles: { ...state.globalStyles, ...styles }
  })),

  loadState: (newState) => set(newState),
}));
