import { Template } from './index';

export const portfolioTemplate: Template = {
  id: 'template_portfolio_01',
  name: 'Minimal Creative',
  category: 'Personal Portfolio',
  description: 'A striking minimal template for designers and photographers.',
  thumbnail: '/templates/portfolio.png',
  globalStyles: {
    theme: 'light',
    colors: {
      primary: '#000000',
      secondary: '#E5E5E5',
      accent: '#FF3366',
      background: '#FAFAFA',
      text: '#111111',
      muted: '#666666',
    },
    typography: {
      headingFont: 'Outfit, sans-serif',
      bodyFont: 'Inter, sans-serif',
      baseSize: '16px',
    },
  },
  rootChildren: ['port_nav', 'port_hero', 'port_gallery', 'port_footer'],
  blocks: {
    // 1. Navbar
    'port_nav': {
      id: 'port_nav', type: 'navbar', name: 'Header', parentId: 'root', children: ['port_logo', 'port_links'], props: {},
      styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 60px', backgroundColor: 'transparent' }
    },
    'port_logo': { id: 'port_logo', type: 'text', name: 'Logo', parentId: 'port_nav', children: [], props: { text: 'Alex.Design' }, styles: { fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#000000' } },
    'port_links': { id: 'port_links', type: 'container', name: 'Links', parentId: 'port_nav', children: ['pl1', 'pl2'], props: {}, styles: { display: 'flex', gap: '32px' } },
    'pl1': { id: 'pl1', type: 'text', name: 'Link', parentId: 'port_links', children: [], props: { text: 'Work' }, styles: { fontWeight: '500', color: '#000000' } },
    'pl2': { id: 'pl2', type: 'text', name: 'Link', parentId: 'port_links', children: [], props: { text: 'Contact' }, styles: { fontWeight: '500', color: '#666666' } },

    // 2. Hero
    'port_hero': {
      id: 'port_hero', type: 'hero', name: 'Hero', parentId: 'root', children: ['ph_title', 'ph_sub'], props: {},
      styles: { padding: '120px 60px', maxWidth: '1000px' }
    },
    'ph_title': { id: 'ph_title', type: 'text', name: 'Headline', parentId: 'port_hero', children: [], props: { text: 'I design digital experiences that shape the future.' }, styles: { fontSize: '84px', fontWeight: '800', lineHeight: '1.05', letterSpacing: '-0.03em', color: '#000000', marginBottom: '32px' } },
    'ph_sub': { id: 'ph_sub', type: 'text', name: 'Subheadline', parentId: 'port_hero', children: [], props: { text: 'Senior Product Designer based in London. Currently shaping the future of finance at Fintech Corp.' }, styles: { fontSize: '24px', color: '#666666', lineHeight: '1.5', maxWidth: '600px' } },

    // 3. Grid Gallery
    'port_gallery': {
      id: 'port_gallery', type: 'section', name: 'Work Grid', parentId: 'root', children: ['pg_wrap'], props: {},
      styles: { padding: '40px 60px 120px' }
    },
    'pg_wrap': { id: 'pg_wrap', type: 'grid', name: 'Grid', parentId: 'port_gallery', children: ['pw1', 'pw2', 'pw3', 'pw4'], props: {}, styles: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' } },
    
    'pw1': { id: 'pw1', type: 'container', name: 'Project 1', parentId: 'pg_wrap', children: ['pw1_img', 'pw1_t', 'pw1_c'], props: {}, styles: { display: 'flex', flexDirection: 'column' } },
    'pw1_img': { id: 'pw1_img', type: 'image', name: 'Image', parentId: 'pw1', children: [], props: { src: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=1000' }, styles: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', marginBottom: '24px', backgroundColor: '#E5E5E5' } },
    'pw1_t': { id: 'pw1_t', type: 'text', name: 'Name', parentId: 'pw1', children: [], props: { text: 'Fintech Mobile App' }, styles: { fontSize: '24px', fontWeight: '600', marginBottom: '8px' } },
    'pw1_c': { id: 'pw1_c', type: 'text', name: 'Category', parentId: 'pw1', children: [], props: { text: 'UI/UX Design' }, styles: { color: '#666666', fontSize: '14px' } },

    'pw2': { id: 'pw2', type: 'container', name: 'Project 2', parentId: 'pg_wrap', children: ['pw2_img', 'pw2_t', 'pw2_c'], props: {}, styles: { display: 'flex', flexDirection: 'column', marginTop: '120px' } }, // Masonry effect
    'pw2_img': { id: 'pw2_img', type: 'image', name: 'Image', parentId: 'pw2', children: [], props: { src: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1000' }, styles: { width: '100%', aspectRatio: '3/4', objectFit: 'cover', marginBottom: '24px', backgroundColor: '#E5E5E5' } },
    'pw2_t': { id: 'pw2_t', type: 'text', name: 'Name', parentId: 'pw2', children: [], props: { text: 'Brand Identity' }, styles: { fontSize: '24px', fontWeight: '600', marginBottom: '8px' } },
    'pw2_c': { id: 'pw2_c', type: 'text', name: 'Category', parentId: 'pw2', children: [], props: { text: 'Branding' }, styles: { color: '#666666', fontSize: '14px' } },

    'pw3': { id: 'pw3', type: 'container', name: 'Project 3', parentId: 'pg_wrap', children: ['pw3_img', 'pw3_t', 'pw3_c'], props: {}, styles: { display: 'flex', flexDirection: 'column' } },
    'pw3_img': { id: 'pw3_img', type: 'image', name: 'Image', parentId: 'pw3', children: [], props: { src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000' }, styles: { width: '100%', aspectRatio: '1', objectFit: 'cover', marginBottom: '24px', backgroundColor: '#E5E5E5' } },
    'pw3_t': { id: 'pw3_t', type: 'text', name: 'Name', parentId: 'pw3', children: [], props: { text: 'Editorial Magazine' }, styles: { fontSize: '24px', fontWeight: '600', marginBottom: '8px' } },
    'pw3_c': { id: 'pw3_c', type: 'text', name: 'Category', parentId: 'pw3', children: [], props: { text: 'Print Design' }, styles: { color: '#666666', fontSize: '14px' } },

    'pw4': { id: 'pw4', type: 'container', name: 'Project 4', parentId: 'pg_wrap', children: ['pw4_img', 'pw4_t', 'pw4_c'], props: {}, styles: { display: 'flex', flexDirection: 'column', marginTop: '120px' } },
    'pw4_img': { id: 'pw4_img', type: 'image', name: 'Image', parentId: 'pw4', children: [], props: { src: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&q=80&w=1000' }, styles: { width: '100%', aspectRatio: '16/9', objectFit: 'cover', marginBottom: '24px', backgroundColor: '#E5E5E5' } },
    'pw4_t': { id: 'pw4_t', type: 'text', name: 'Name', parentId: 'pw4', children: [], props: { text: 'E-commerce Platform' }, styles: { fontSize: '24px', fontWeight: '600', marginBottom: '8px' } },
    'pw4_c': { id: 'pw4_c', type: 'text', name: 'Category', parentId: 'pw4', children: [], props: { text: 'Web Design' }, styles: { color: '#666666', fontSize: '14px' } },

    // 4. Footer
    'port_footer': {
      id: 'port_footer', type: 'section', name: 'Footer', parentId: 'root', children: ['pf_t', 'pf_e'], props: {},
      styles: { padding: '120px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #E5E5E5' }
    },
    'pf_t': { id: 'pf_t', type: 'text', name: 'Text', parentId: 'port_footer', children: [], props: { text: 'Let\'s talk about your project.' }, styles: { fontSize: '48px', fontWeight: '800', letterSpacing: '-0.02em', maxWidth: '400px' } },
    'pf_e': { id: 'pf_e', type: 'text', name: 'Email', parentId: 'port_footer', children: [], props: { text: 'hello@alex.design' }, styles: { fontSize: '24px', color: '#666666', textDecoration: 'underline' } },
  }
};
