import { Template } from './index';

export const restaurantTemplate: Template = {
  id: 'template_restaurant_01',
  name: 'Fine Dining',
  category: 'Restaurant',
  description: 'An elegant, dark-themed template for premium restaurants.',
  thumbnail: '/templates/restaurant.png',
  globalStyles: {
    theme: 'dark',
    colors: {
      primary: '#18181B',
      secondary: '#27272A',
      accent: '#D4AF37', // Gold
      background: '#09090B',
      text: '#FAFAFA',
      muted: '#A1A1AA',
    },
    typography: {
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Lato, sans-serif',
      baseSize: '16px',
    },
  },
  rootChildren: ['rest_nav', 'rest_hero', 'rest_menu', 'rest_footer'],
  blocks: {
    // 1. Navigation
    'rest_nav': {
      id: 'rest_nav', type: 'navbar', name: 'Header', parentId: 'root', children: ['rest_nav_logo', 'rest_nav_links', 'rest_nav_cta'], props: {},
      styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', backgroundColor: 'transparent', position: 'absolute', top: '0', width: '100%', zIndex: 50 }
    },
    'rest_nav_logo': { id: 'rest_nav_logo', type: 'text', name: 'Logo', parentId: 'rest_nav', children: [], props: { text: 'L\'Etoile' }, styles: { fontSize: '28px', fontFamily: 'Playfair Display, serif', color: '#D4AF37', letterSpacing: '0.05em' } },
    'rest_nav_links': { id: 'rest_nav_links', type: 'container', name: 'Links', parentId: 'rest_nav', children: ['rl1', 'rl2', 'rl3'], props: {}, styles: { display: 'flex', gap: '40px' } },
    'rl1': { id: 'rl1', type: 'text', name: 'Link', parentId: 'rest_nav_links', children: [], props: { text: 'Menu' }, styles: { color: '#FAFAFA', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '0.1em' } },
    'rl2': { id: 'rl2', type: 'text', name: 'Link', parentId: 'rest_nav_links', children: [], props: { text: 'Story' }, styles: { color: '#FAFAFA', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '0.1em' } },
    'rl3': { id: 'rl3', type: 'text', name: 'Link', parentId: 'rest_nav_links', children: [], props: { text: 'Visit' }, styles: { color: '#FAFAFA', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '0.1em' } },
    'rest_nav_cta': { id: 'rest_nav_cta', type: 'button', name: 'Reserve', parentId: 'rest_nav', children: [], props: { text: 'Reservations' }, styles: { border: '1px solid #D4AF37', backgroundColor: 'transparent', color: '#D4AF37', padding: '12px 24px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '12px' } },

    // 2. Hero Section
    'rest_hero': {
      id: 'rest_hero', type: 'hero', name: 'Hero', parentId: 'root', children: ['rest_hero_img', 'rest_hero_overlay', 'rest_hero_content'], props: {},
      styles: { position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    'rest_hero_img': { id: 'rest_hero_img', type: 'image', name: 'BG Image', parentId: 'rest_hero', children: [], props: { src: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2000&auto=format&fit=crop', alt: 'Restaurant Interior' }, styles: { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 } },
    'rest_hero_overlay': { id: 'rest_hero_overlay', type: 'container', name: 'Overlay', parentId: 'rest_hero', children: [], props: {}, styles: { position: 'absolute', inset: '0', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 } },
    'rest_hero_content': { id: 'rest_hero_content', type: 'container', name: 'Content', parentId: 'rest_hero', children: ['rh_sub', 'rh_title'], props: {}, styles: { position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' } },
    'rh_sub': { id: 'rh_sub', type: 'text', name: 'Subtitle', parentId: 'rest_hero_content', children: [], props: { text: 'EXPERIENCE CULINARY EXCELLENCE' }, styles: { color: '#D4AF37', letterSpacing: '0.2em', fontSize: '14px', textTransform: 'uppercase' } },
    'rh_title': { id: 'rh_title', type: 'text', name: 'Title', parentId: 'rest_hero_content', children: [], props: { text: 'Taste The Extraordinary' }, styles: { color: '#FAFAFA', fontSize: '72px', fontFamily: 'Playfair Display, serif', lineHeight: '1.1' } },

    // 3. Menu Highlights
    'rest_menu': {
      id: 'rest_menu', type: 'section', name: 'Menu', parentId: 'root', children: ['rm_header', 'rm_grid'], props: {},
      styles: { backgroundColor: '#09090B', padding: '100px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }
    },
    'rm_header': { id: 'rm_header', type: 'container', name: 'Header', parentId: 'rest_menu', children: ['rm_sub', 'rm_title'], props: {}, styles: { textAlign: 'center', marginBottom: '60px' } },
    'rm_sub': { id: 'rm_sub', type: 'text', name: 'Sub', parentId: 'rm_header', children: [], props: { text: 'DISCOVER' }, styles: { color: '#D4AF37', letterSpacing: '0.2em', fontSize: '14px', textTransform: 'uppercase', marginBottom: '16px' } },
    'rm_title': { id: 'rm_title', type: 'text', name: 'Title', parentId: 'rm_header', children: [], props: { text: 'Signatures' }, styles: { color: '#FAFAFA', fontSize: '48px', fontFamily: 'Playfair Display, serif' } },
    
    'rm_grid': { id: 'rm_grid', type: 'grid', name: 'Items', parentId: 'rest_menu', children: ['i1', 'i2', 'i3'], props: {}, styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', maxWidth: '1200px', width: '100%' } },
    
    'i1': { id: 'i1', type: 'container', name: 'Item', parentId: 'rm_grid', children: ['i1_img', 'i1_text'], props: {}, styles: { display: 'flex', flexDirection: 'column', gap: '24px' } },
    'i1_img': { id: 'i1_img', type: 'image', name: 'Img', parentId: 'i1', children: [], props: { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', alt: 'Steak' }, styles: { width: '100%', aspectRatio: '1', objectFit: 'cover' } },
    'i1_text': { id: 'i1_text', type: 'container', name: 'Text', parentId: 'i1', children: ['i1_t', 'i1_d'], props: {}, styles: { textAlign: 'center' } },
    'i1_t': { id: 'i1_t', type: 'text', name: 'Name', parentId: 'i1_text', children: [], props: { text: 'Wagyu Ribeye' }, styles: { color: '#FAFAFA', fontSize: '24px', fontFamily: 'Playfair Display, serif', marginBottom: '8px' } },
    'i1_d': { id: 'i1_d', type: 'text', name: 'Desc', parentId: 'i1_text', children: [], props: { text: 'Truffle mashed potatoes, asparagus.' }, styles: { color: '#A1A1AA', fontSize: '14px' } },

    'i2': { id: 'i2', type: 'container', name: 'Item', parentId: 'rm_grid', children: ['i2_img', 'i2_text'], props: {}, styles: { display: 'flex', flexDirection: 'column', gap: '24px' } },
    'i2_img': { id: 'i2_img', type: 'image', name: 'Img', parentId: 'i2', children: [], props: { src: 'https://images.unsplash.com/photo-1551223964-f6fc5c7426b6?auto=format&fit=crop&q=80&w=800', alt: 'Salmon' }, styles: { width: '100%', aspectRatio: '1', objectFit: 'cover' } },
    'i2_text': { id: 'i2_text', type: 'container', name: 'Text', parentId: 'i2', children: ['i2_t', 'i2_d'], props: {}, styles: { textAlign: 'center' } },
    'i2_t': { id: 'i2_t', type: 'text', name: 'Name', parentId: 'i2_text', children: [], props: { text: 'Seared Scallops' }, styles: { color: '#FAFAFA', fontSize: '24px', fontFamily: 'Playfair Display, serif', marginBottom: '8px' } },
    'i2_d': { id: 'i2_d', type: 'text', name: 'Desc', parentId: 'i2_text', children: [], props: { text: 'Cauliflower purée, brown butter.' }, styles: { color: '#A1A1AA', fontSize: '14px' } },

    'i3': { id: 'i3', type: 'container', name: 'Item', parentId: 'rm_grid', children: ['i3_img', 'i3_text'], props: {}, styles: { display: 'flex', flexDirection: 'column', gap: '24px' } },
    'i3_img': { id: 'i3_img', type: 'image', name: 'Img', parentId: 'i3', children: [], props: { src: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80&w=800', alt: 'Dessert' }, styles: { width: '100%', aspectRatio: '1', objectFit: 'cover' } },
    'i3_text': { id: 'i3_text', type: 'container', name: 'Text', parentId: 'i3', children: ['i3_t', 'i3_d'], props: {}, styles: { textAlign: 'center' } },
    'i3_t': { id: 'i3_t', type: 'text', name: 'Name', parentId: 'i3_text', children: [], props: { text: 'Chocolate Lava' }, styles: { color: '#FAFAFA', fontSize: '24px', fontFamily: 'Playfair Display, serif', marginBottom: '8px' } },
    'i3_d': { id: 'i3_d', type: 'text', name: 'Desc', parentId: 'i3_text', children: [], props: { text: 'Vanilla bean ice cream, berry coulis.' }, styles: { color: '#A1A1AA', fontSize: '14px' } },

    // 4. Footer
    'rest_footer': {
      id: 'rest_footer', type: 'section', name: 'Footer', parentId: 'root', children: ['rf_t', 'rf_c'], props: {},
      styles: { backgroundColor: '#18181B', padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }
    },
    'rf_t': { id: 'rf_t', type: 'text', name: 'Logo', parentId: 'rest_footer', children: [], props: { text: 'L\'Etoile' }, styles: { color: '#D4AF37', fontFamily: 'Playfair Display, serif', fontSize: '24px' } },
    'rf_c': { id: 'rf_c', type: 'text', name: 'Copy', parentId: 'rest_footer', children: [], props: { text: '123 Culinary Ave, New York, NY | (212) 555-0199' }, styles: { color: '#A1A1AA', fontSize: '14px' } }
  }
};
