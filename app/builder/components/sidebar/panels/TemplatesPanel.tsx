import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { Section } from '../../../store/types';
import { Plus, LayoutTemplate, MessageSquare, CreditCard, Rocket } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '@/app/context/LanguageContext';
import { translations } from '@/app/translations';

export function TemplatesPanel() {
    const activePageId = useBuilderStore(state => state.activePageId);
    const addSection = useBuilderStore(state => state.addSection);
    const { lang } = useLanguage();
    const t = translations[lang].builder;

    const handleAddTemplate = (templateId: string) => {
        const id = uuidv4();

        let newSection: Section;

        switch (templateId) {
            case 'hero_split':
                newSection = {
                    id,
                    type: "Hero",
                    isLocked: false,
                    layout: {
                        width: 'contained',
                        padding: 'spacious',
                        columns: { desktop: 2, mobile: 1 },
                        columnGap: 'lg',
                        verticalAlign: 'center',
                        backgroundType: 'transparent',
                        animation: 'fadeIn'
                    },
                    elements: [
                        {
                            id: `${id}-el1`,
                            type: 'Container',
                            props: { style: { gap: '1.5rem', width: '100%', paddingRight: '2rem' } },
                            children: [
                                {
                                    id: `${id}-badge`,
                                    type: 'Text',
                                    props: { content: 'NEW FEATURE', size: 'sm', customColor: '#0ea5e9', style: { fontWeight: 'bold', letterSpacing: '0.1em' } }
                                },
                                {
                                    id: `${id}-title`,
                                    type: 'Text',
                                    props: { content: 'Build Faster with Templates', size: 'lg', style: { fontWeight: '800', lineHeight: '1.1' } }
                                },
                                {
                                    id: `${id}-sub`,
                                    type: 'Text',
                                    props: { content: 'Instantly drop in production-ready components engineered for incredible conversions.', size: 'md', customColor: '#9ca3af' }
                                },
                                {
                                    id: `${id}-btn-row`,
                                    type: 'Container',
                                    props: { style: { flexDirection: 'row', gap: '1rem', marginTop: '1rem' } },
                                    children: [
                                        { id: `${id}-btn1`, type: 'Button', props: { content: 'Get Started', variant: 'primary', size: 'lg' } },
                                        { id: `${id}-btn2`, type: 'Button', props: { content: 'Learn More', variant: 'outline', size: 'lg' } }
                                    ]
                                }
                            ]
                        },
                        {
                            id: `${id}-el2`,
                            type: 'Image',
                            props: { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000', roundedCorners: 'slight', style: { height: '400px', width: '100%', objectFit: 'cover' } }
                        }
                    ]
                };
                break;
            case 'feature_grid':
                newSection = {
                    id,
                    type: "Features",
                    isLocked: false,
                    layout: {
                        width: 'contained',
                        padding: 'default',
                        columns: { desktop: 3, tablet: 2, mobile: 1 },
                        columnGap: 'md',
                        verticalAlign: 'top',
                        backgroundType: 'transparent',
                        animation: 'staggerChildren'
                    },
                    elements: [
                        ...[1, 2, 3].map((num) => ({
                            id: `${id}-card-${num}`,
                            type: 'FeatureCard' as const,
                            props: { customBg: '#0f172a', roundedCorners: 'slight' as const, style: { border: '1px solid #1e293b' } },
                            children: [
                                { id: `${id}-t${num}`, type: 'Text' as const, props: { content: `Feature ${num}`, size: 'lg' as const, style: { fontWeight: 'bold', marginBottom: '0.5rem' } } },
                                { id: `${id}-s${num}`, type: 'Text' as const, props: { content: 'This is a powerful advantage your customers will absolutely love.', size: 'sm' as const, customColor: '#9ca3af' } }
                            ]
                        }))
                    ]
                };
                break;
            case 'cta_banner':
                newSection = {
                    id,
                    type: "CallToAction",
                    isLocked: false,
                    layout: {
                        width: 'contained',
                        padding: 'spacious',
                        columns: { desktop: 1 },
                        columnGap: 'none',
                        verticalAlign: 'center',
                        backgroundType: 'solid',
                        animation: 'slideUp'
                    },
                    elements: [
                        {
                            id: `${id}-wrap`,
                            type: 'Container',
                            props: { customBg: '#0ea5e9', roundedCorners: 'slight', style: { padding: '4rem', alignItems: 'center', textAlign: 'center' } },
                            children: [
                                { id: `${id}-t`, type: 'Text', props: { content: 'Ready to launch?', size: 'lg', customColor: '#000000', style: { fontWeight: '800' } } },
                                { id: `${id}-s`, type: 'Text', props: { content: 'Join thousands of satisfied customers today.', size: 'md', customColor: '#000000', style: { opacity: '0.8', marginBottom: '2rem', marginTop: '1rem' } } },
                                { id: `${id}-b`, type: 'Button', props: { content: 'Start Free Trial', customBg: '#000000', customColor: '#ffffff', size: 'lg' } }
                            ]
                        }
                    ]
                };
                break;
            default:
                return;
        }

        addSection(activePageId, newSection);
    };

    const templates = [
        { id: 'hero_split', name: t.templates.heroSplit, desc: t.templates.heroSplitDesc, icon: LayoutTemplate },
        { id: 'feature_grid', name: t.templates.featureGrid, desc: t.templates.featureGridDesc, icon: Rocket },
        { id: 'cta_banner', name: t.templates.ctaBanner, desc: t.templates.ctaBannerDesc, icon: MessageSquare },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{t.templates.library}</h3>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">{templates.length} {t.templates.available}</span>
            </div>

            <p className="text-xs text-gray-400">{t.templates.instruction}</p>

            <div className="grid grid-cols-1 gap-3">
                {templates.map(t => (
                    <button
                        key={t.id}
                        onClick={() => handleAddTemplate(t.id)}
                        className="group flex flex-col items-start gap-2 p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:bg-gray-800 hover:border-cyan-500/50 transition-all text-left"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <div className="p-2 bg-gray-950 rounded-lg group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors">
                                <t.icon size={18} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{t.name}</h4>
                            </div>
                            <Plus size={16} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{t.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
