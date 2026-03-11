import { Template } from './index';
import { saasTemplate } from './saas';
import { restaurantTemplate } from './restaurant';
import { portfolioTemplate } from './portfolio';

// Export the array of available templates
export const templates: Template[] = [
  saasTemplate,
  restaurantTemplate,
  portfolioTemplate
];

// Helper to get a template by ID
export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(t => t.id === id);
};

// Re-export core types
export * from './index';
