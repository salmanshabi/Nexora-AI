import { BlockData, GlobalStyles } from '../types';

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  globalStyles: GlobalStyles;
  blocks: Record<string, BlockData>; // A partial block dictionary to merge into state
  rootChildren: string[]; // Order of the top-level sections in this template
}

// Generate unique IDs for template blocks to avoid collisions when applied multiple times
export const generateTemplateInstance = (template: Template) => {
  const instanceIdPrefix = `tpl_${Date.now()}_`;
  const newBlocks: Record<string, BlockData> = {};
  const newRootChildren: string[] = [];

  const mapId = (oldId: string) => `${instanceIdPrefix}${oldId}`;

  // Deep clone and remap IDs
  Object.values(template.blocks).forEach((block) => {
    const newId = mapId(block.id);
    const newParentId = block.parentId === 'root' ? 'root' : block.parentId ? mapId(block.parentId) : undefined;
    
    newBlocks[newId] = {
      ...block,
      id: newId,
      parentId: newParentId,
      children: block.children.map(mapId),
    };
  });

  template.rootChildren.forEach(childId => {
    newRootChildren.push(mapId(childId));
  });

  return { blocks: newBlocks, rootChildren: newRootChildren, globalStyles: template.globalStyles };
};
