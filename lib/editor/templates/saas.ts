import { Template } from './index';

export const saasTemplate: Template = {
  id: 'template_saas_01',
  name: 'Modern SaaS',
  category: 'SaaS / Startup',
  description: 'A clean, conversion-optimized template for software companies.',
  thumbnail: '/templates/saas.png',
  globalStyles: {
    theme: 'light',
    colors: {
      primary: '#0F172A',
      secondary: '#475569',
      accent: '#3B82F6',
      background: '#FFFFFF',
      text: '#0F172A',
      muted: '#F8FAFC',
    },
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      baseSize: '16px',
    },
  },
  rootChildren: ['saas_navbar', 'saas_hero', 'saas_features', 'saas_pricing', 'saas_footer'],
  blocks: {
    // 1. Navbar
    'saas_navbar': {
      id: 'saas_navbar',
      type: 'navbar',
      name: 'Navigation',
      parentId: 'root',
      children: ['saas_nav_logo', 'saas_nav_links', 'saas_nav_cta'],
      props: {},
      styles: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
      }
    },
    'saas_nav_logo': {
      id: 'saas_nav_logo',
      type: 'text',
      name: 'Logo Text',
      parentId: 'saas_navbar',
      children: [],
      props: { text: 'NexoraApp' },
      styles: { fontSize: '24px', fontWeight: 'bold', color: '#0F172A' }
    },
    'saas_nav_links': {
      id: 'saas_nav_links',
      type: 'container',
      name: 'Nav Links',
      parentId: 'saas_navbar',
      children: ['saas_link_1', 'saas_link_2', 'saas_link_3'],
      props: {},
      styles: { display: 'flex', gap: '32px' }
    },
    'saas_link_1': { id: 'saas_link_1', type: 'text', name: 'Link', parentId: 'saas_nav_links', children: [], props: { text: 'Features' }, styles: { color: '#475569', cursor: 'pointer' } },
    'saas_link_2': { id: 'saas_link_2', type: 'text', name: 'Link', parentId: 'saas_nav_links', children: [], props: { text: 'Pricing' }, styles: { color: '#475569', cursor: 'pointer' } },
    'saas_link_3': { id: 'saas_link_3', type: 'text', name: 'Link', parentId: 'saas_nav_links', children: [], props: { text: 'About' }, styles: { color: '#475569', cursor: 'pointer' } },
    'saas_nav_cta': {
      id: 'saas_nav_cta',
      type: 'button',
      name: 'Nav CTA',
      parentId: 'saas_navbar',
      children: [],
      props: { text: 'Get Started' },
      styles: { backgroundColor: '#3B82F6', color: 'white', padding: '10px 20px', borderRadius: '6px', fontWeight: '500' }
    },

    // 2. Hero Section
    'saas_hero': {
      id: 'saas_hero',
      type: 'hero',
      name: 'Hero Section',
      parentId: 'root',
      children: ['saas_hero_content', 'saas_hero_image'],
      props: {},
      styles: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '80px 40px',
        backgroundColor: '#F8FAFC',
        minHeight: '80vh',
      }
    },
    'saas_hero_content': {
      id: 'saas_hero_content',
      type: 'container',
      name: 'Hero Content',
      parentId: 'saas_hero',
      children: ['saas_hero_title', 'saas_hero_subtitle', 'saas_hero_cta'],
      props: {},
      styles: { width: '50%', display: 'flex', flexDirection: 'column', gap: '24px' }
    },
    'saas_hero_title': {
      id: 'saas_hero_title',
      type: 'text',
      name: 'Title',
      parentId: 'saas_hero_content',
      children: [],
      props: { text: 'Build Better Software, Faster.' },
      styles: { fontSize: '56px', fontWeight: '800', lineHeight: '1.2', color: '#0F172A' }
    },
    'saas_hero_subtitle': {
      id: 'saas_hero_subtitle',
      type: 'text',
      name: 'Subtitle',
      parentId: 'saas_hero_content',
      children: [],
      props: { text: 'Empower your team with the most advanced collaboration tools on the market. Start your free trial today.' },
      styles: { fontSize: '20px', color: '#475569', lineHeight: '1.6' }
    },
    'saas_hero_cta': {
      id: 'saas_hero_cta',
      type: 'button',
      name: 'Hero Button',
      parentId: 'saas_hero_content',
      children: [],
      props: { text: 'Start Free Trial' },
      styles: { backgroundColor: '#3B82F6', color: 'white', padding: '16px 32px', borderRadius: '8px', fontSize: '18px', fontWeight: '600', alignSelf: 'flex-start' }
    },
    'saas_hero_image': {
      id: 'saas_hero_image',
      type: 'image',
      name: 'Hero Image',
      parentId: 'saas_hero',
      children: [],
      props: { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80', alt: 'Dashboard preview' },
      styles: { width: '45%', height: '400px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }
    },

    // 3. Features
    'saas_features': {
      id: 'saas_features',
      type: 'features',
      name: 'Features Section',
      parentId: 'root',
      children: ['saas_feat_title', 'saas_feat_grid'],
      props: {},
      styles: { padding: '80px 40px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center' }
    },
    'saas_feat_title': {
      id: 'saas_feat_title',
      type: 'text',
      name: 'Section Title',
      parentId: 'saas_features',
      children: [],
      props: { text: 'Everything you need to scale' },
      styles: { fontSize: '36px', fontWeight: 'bold', color: '#0F172A', marginBottom: '48px', textAlign: 'center' }
    },
    'saas_feat_grid': {
      id: 'saas_feat_grid',
      type: 'grid',
      name: 'Features Grid',
      parentId: 'saas_features',
      children: ['saas_f1', 'saas_f2', 'saas_f3'],
      props: {},
      styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', width: '100%', maxWidth: '1200px' }
    },
    'saas_f1': { id: 'saas_f1', type: 'container', name: 'Feature Card', parentId: 'saas_feat_grid', children: ['saas_f1_t', 'saas_f1_d'], props: {}, styles: { padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' } },
    'saas_f1_t': { id: 'saas_f1_t', type: 'text', name: 'Title', parentId: 'saas_f1', children: [], props: { text: 'Real-time Analytics' }, styles: { fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' } },
    'saas_f1_d': { id: 'saas_f1_d', type: 'text', name: 'Desc', parentId: 'saas_f1', children: [], props: { text: 'Track your growth with powerful dashboard metrics.' }, styles: { color: '#475569' } },
    
    'saas_f2': { id: 'saas_f2', type: 'container', name: 'Feature Card', parentId: 'saas_feat_grid', children: ['saas_f2_t', 'saas_f2_d'], props: {}, styles: { padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' } },
    'saas_f2_t': { id: 'saas_f2_t', type: 'text', name: 'Title', parentId: 'saas_f2', children: [], props: { text: 'Team Collaboration' }, styles: { fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' } },
    'saas_f2_d': { id: 'saas_f2_d', type: 'text', name: 'Desc', parentId: 'saas_f2', children: [], props: { text: 'Work together seamlessly with built-in presence.' }, styles: { color: '#475569' } },

    'saas_f3': { id: 'saas_f3', type: 'container', name: 'Feature Card', parentId: 'saas_feat_grid', children: ['saas_f3_t', 'saas_f3_d'], props: {}, styles: { padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' } },
    'saas_f3_t': { id: 'saas_f3_t', type: 'text', name: 'Title', parentId: 'saas_f3', children: [], props: { text: 'Bank-grade Security' }, styles: { fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' } },
    'saas_f3_d': { id: 'saas_f3_d', type: 'text', name: 'Desc', parentId: 'saas_f3', children: [], props: { text: 'Your data is encrypted and protected 24/7.' }, styles: { color: '#475569' } },

    // 4. Pricing
    'saas_pricing': {
      id: 'saas_pricing',
      type: 'pricing',
      name: 'Pricing Section',
      parentId: 'root',
      children: ['saas_p_title', 'saas_p_cards'],
      props: {},
      styles: { padding: '80px 40px', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center' }
    },
    'saas_p_title': {
      id: 'saas_p_title',
      type: 'text',
      name: 'Pricing Title',
      parentId: 'saas_pricing',
      children: [],
      props: { text: 'Simple, transparent pricing' },
      styles: { fontSize: '36px', fontWeight: 'bold', marginBottom: '48px', color: '#0F172A' }
    },
    'saas_p_cards': {
      id: 'saas_p_cards',
      type: 'grid',
      name: 'Cards Grid',
      parentId: 'saas_pricing',
      children: ['saas_p_basic', 'saas_p_pro'],
      props: {},
      styles: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', maxWidth: '900px', width: '100%' }
    },
    'saas_p_basic': {
      id: 'saas_p_basic', type: 'container', name: 'Basic Plan', parentId: 'saas_p_cards', children: ['p1_t', 'p1_p', 'p1_b'], props: {},
      styles: { padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center' }
    },
    'p1_t': { id: 'p1_t', type: 'text', name: 'Plan Name', parentId: 'saas_p_basic', children: [], props: { text: 'Starter' }, styles: { fontSize: '20px', fontWeight: '600', color: '#475569' } },
    'p1_p': { id: 'p1_p', type: 'text', name: 'Price', parentId: 'saas_p_basic', children: [], props: { text: '$29/mo' }, styles: { fontSize: '48px', fontWeight: '800', margin: '24px 0', color: '#0F172A' } },
    'p1_b': { id: 'p1_b', type: 'button', name: 'Subscribe', parentId: 'saas_p_basic', children: [], props: { text: 'Start Trial' }, styles: { backgroundColor: '#E2E8F0', color: '#0F172A', padding: '12px 24px', borderRadius: '8px', width: '100%' } },

    'saas_p_pro': {
      id: 'saas_p_pro', type: 'container', name: 'Pro Plan', parentId: 'saas_p_cards', children: ['p2_t', 'p2_p', 'p2_b'], props: {},
      styles: { padding: '40px', backgroundColor: '#0F172A', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }
    },
    'p2_t': { id: 'p2_t', type: 'text', name: 'Plan Name', parentId: 'saas_p_pro', children: [], props: { text: 'Professional' }, styles: { fontSize: '20px', fontWeight: '600', color: '#94A3B8' } },
    'p2_p': { id: 'p2_p', type: 'text', name: 'Price', parentId: 'saas_p_pro', children: [], props: { text: '$99/mo' }, styles: { fontSize: '48px', fontWeight: '800', margin: '24px 0', color: '#FFFFFF' } },
    'p2_b': { id: 'p2_b', type: 'button', name: 'Subscribe', parentId: 'saas_p_pro', children: [], props: { text: 'Get Pro' }, styles: { backgroundColor: '#3B82F6', color: '#FFFFFF', padding: '12px 24px', borderRadius: '8px', width: '100%' } },

    // 5. Footer
    'saas_footer': {
      id: 'saas_footer',
      type: 'section',
      name: 'Footer',
      parentId: 'root',
      children: ['saas_footer_text'],
      props: {},
      styles: { padding: '40px', backgroundColor: '#0F172A', color: '#94A3B8', textAlign: 'center' }
    },
    'saas_footer_text': {
      id: 'saas_footer_text',
      type: 'text',
      name: 'Copyright',
      parentId: 'saas_footer',
      children: [],
      props: { text: '© 2026 NexoraApp Inc. All rights reserved.' },
      styles: {}
    }
  }
};
