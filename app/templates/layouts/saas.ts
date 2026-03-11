import { v4 as uuidv4 } from 'uuid';
import { AppStateSnapshot, Section } from '../../builder/store/types';

export const getSaasTemplate = (): Partial<AppStateSnapshot> => {
    return {
        pages: [{
            id: "home",
            title: "Home",
            slug: "/",
            isHiddenInNav: false,
            seo: { metaTitle: "Velocity | Ship Faster", metaDescription: "Modern software landing page." },
            sections: [
                createSaaSHero(),
                createLogoCloud(),
                createFeaturesSplit1(),
                createFeaturesSplit2(),
                createTestimonials(),
                createPricing(),
                createCtaBanner()
            ]
        }],
        tokens: {
            colors: { primary: "#4F46E5", secondary: "#06B6D4", background: "#020617", text: "#F8FAFC" },
            typography: { headingFont: "Inter", bodyFont: "Inter", baseSizeMultiplier: 1.0 },
            spacing: "comfortable", roundness: "sharp", shadows: "soft",
            advanced: { spacingScale: 'default', shadowStyle: 'soft', buttonSystem: { roundness: 'sharp', hoverStyle: 'scale' }, containerWidth: 'standard' }
        }
    };
};

function createSaaSHero(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'custom',
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
                props: { style: { gap: '1.5rem', width: '100%', paddingRight: '2rem', marginTop: '4rem', marginBottom: '4rem' } },
                children: [
                    { id: `${id}-badge`, type: 'Text', props: { content: 'VELOCITY V2.0 IS LIVE', size: 'sm', customColor: '#06B6D4', style: { fontWeight: 'bold', letterSpacing: '0.1em' } } },
                    { id: `${id}-title`, type: 'Text', props: { content: 'Ship software faster than ever before.', size: 'lg', style: { fontWeight: '900', lineHeight: '1.1', fontSize: '4rem', letterSpacing: '-0.03em' } } },
                    { id: `${id}-sub`, type: 'Text', props: { content: 'Our revolutionary platform gives developers the tools they need to build, test, and deploy at warp speed.', size: 'md', customColor: '#94A3B8', style: { fontSize: '1.25rem', lineHeight: '1.6' } } },
                    {
                        id: `${id}-btn-row`, type: 'Container', props: { style: { flexDirection: 'row', gap: '1rem', marginTop: '1rem' } },
                        children: [
                            { id: `${id}-btn1`, type: 'Button', props: { content: 'Start Building', variant: 'primary', size: 'lg', style: { backgroundColor: '#4F46E5', color: '#ffffff' } } },
                            { id: `${id}-btn2`, type: 'Button', props: { content: 'View Documentation', variant: 'outline', size: 'lg', style: { borderColor: '#334155', color: '#F8FAFC' } } }
                        ]
                    },
                    { id: `${id}-trust`, type: 'Text', props: { content: 'No credit card required. 14-day free trial.', size: 'sm', customColor: '#64748B', style: { marginTop: '1rem' } } }
                ]
            },
            {
                id: `${id}-el2`,
                type: 'Image',
                props: { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000', roundedCorners: 'slight', style: { height: '500px', width: '100%', objectFit: 'cover', transform: 'perspective(1000px) rotateY(-10deg)', boxShadow: '-20px 20px 60px rgba(0,0,0,0.5)' }, animation: 'slideLeft' }
            }
        ] as any[]
    };
}

function createLogoCloud(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'custom',
            columns: { desktop: 1 },
            columnGap: 'none',
            verticalAlign: 'center',
            backgroundType: 'transparent',
            animation: 'fadeIn'
        },
        elements: [
            {
                id: `${id}-wrap`,
                type: 'Container',
                props: { style: { padding: '2rem 0', alignItems: 'center', textAlign: 'center', borderTop: '1px solid #1E293B', borderBottom: '1px solid #1E293B' } },
                children: [
                    { id: `${id}-t`, type: 'Text', props: { content: 'TRUSTED BY FORWARD-THINKING TEAMS ALL OVER THE WORLD', size: 'sm', customColor: '#64748B', style: { fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '2rem' } } },
                    {
                        id: `${id}-logos`, type: 'Container', props: { style: { flexDirection: 'row', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', opacity: '0.5' } },
                        children: [
                            { id: `${id}-l1`, type: 'Text', props: { content: 'ACME CORP', size: 'lg', style: { fontWeight: '900', userSelect: 'none' } } },
                            { id: `${id}-l2`, type: 'Text', props: { content: 'GLOBEX', size: 'lg', style: { fontWeight: '900', userSelect: 'none' } } },
                            { id: `${id}-l3`, type: 'Text', props: { content: 'SOYLENT', size: 'lg', style: { fontWeight: '900', userSelect: 'none' } } },
                            { id: `${id}-l4`, type: 'Text', props: { content: 'INITECH', size: 'lg', style: { fontWeight: '900', userSelect: 'none' } } },
                            { id: `${id}-l5`, type: 'Text', props: { content: 'UMBRELLA', size: 'lg', style: { fontWeight: '900', userSelect: 'none' } } }
                        ]
                    }
                ]
            }
        ] as any[]
    };
}

function createFeaturesSplit1(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'custom',
            columns: { desktop: 2, mobile: 1 },
            columnGap: 'lg',
            verticalAlign: 'center',
            backgroundType: 'transparent',
            animation: 'slideUp'
        },
        elements: [
            {
                id: `${id}-img`,
                type: 'Image',
                props: { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000', roundedCorners: 'slight', style: { height: '400px', width: '100%', objectFit: 'cover' } }
            },
            {
                id: `${id}-txt`,
                type: 'Container',
                props: { style: { gap: '1.5rem', width: '100%', paddingLeft: '2rem', marginTop: '6rem', marginBottom: '6rem' } },
                children: [
                    { id: `${id}-b`, type: 'Text', props: { content: 'DATA-DRIVEN INSIGHTS', size: 'sm', customColor: '#4F46E5', style: { fontWeight: 'bold', letterSpacing: '0.1em' } } },
                    { id: `${id}-h`, type: 'Text', props: { content: 'See exactly what your users are doing.', size: 'lg', style: { fontWeight: 'bold', fontSize: '2.5rem', lineHeight: '1.2', letterSpacing: '-0.02em' } } },
                    { id: `${id}-p`, type: 'Text', props: { content: 'Stop guessing. Our advanced analytics engine tracks every interaction, click, and conversion, giving you the power to optimize with confidence.', size: 'md', customColor: '#94A3B8' } },
                    {
                        id: `${id}-list`, type: 'Container', props: { style: { gap: '0.5rem', marginTop: '1rem' } },
                        children: [
                            { id: `${id}-li1`, type: 'Text', props: { content: '✓ Real-time user tracking dashboards', size: 'md', customColor: '#F8FAFC' } },
                            { id: `${id}-li2`, type: 'Text', props: { content: '✓ Automated conversion funnel analysis', size: 'md', customColor: '#F8FAFC' } },
                            { id: `${id}-li3`, type: 'Text', props: { content: '✓ One-click report generation', size: 'md', customColor: '#F8FAFC' } }
                        ]
                    }
                ]
            }
        ] as any[]
    };
}

function createFeaturesSplit2(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'custom',
            columns: { desktop: 2, mobile: 1 },
            columnGap: 'lg',
            verticalAlign: 'center',
            backgroundType: 'transparent',
            animation: 'slideUp'
        },
        elements: [
            {
                id: `${id}-txt`,
                type: 'Container',
                props: { style: { gap: '1.5rem', width: '100%', paddingRight: '2rem', marginTop: '4rem', marginBottom: '8rem' } },
                children: [
                    { id: `${id}-b`, type: 'Text', props: { content: 'SEAMLESS INTEGRATION', size: 'sm', customColor: '#06B6D4', style: { fontWeight: 'bold', letterSpacing: '0.1em' } } },
                    { id: `${id}-h`, type: 'Text', props: { content: 'Plays nicely with your existing stack.', size: 'lg', style: { fontWeight: 'bold', fontSize: '2.5rem', lineHeight: '1.2', letterSpacing: '-0.02em' } } },
                    { id: `${id}-p`, type: 'Text', props: { content: 'Connect Velocity to your favorite tools in seconds. We support over 100+ native integrations including Slack, Jira, GitHub, and Figma.', size: 'md', customColor: '#94A3B8' } },
                    { id: `${id}-btn`, type: 'Button', props: { content: 'View Integrations', variant: 'outline', size: 'md', style: { width: 'fit-content', marginTop: '1rem' } } }
                ]
            },
            {
                id: `${id}-img`,
                type: 'Image',
                props: { url: 'https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=2000', roundedCorners: 'slight', style: { height: '400px', width: '100%', objectFit: 'cover' } }
            }
        ] as any[]
    };
}

function createTestimonials(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'spacious',
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
                props: { customBg: '#0F172A', roundedCorners: 'slight' as const, style: { border: '1px solid #1E293B', padding: '2rem' } },
                children: [
                    {
                        id: `${id}-stars${num}`, type: 'Text' as const, props: { content: '★★★★★', size: 'md' as const, customColor: '#F59E0B', style: { marginBottom: '1rem' } }
                    },
                    { id: `${id}-t${num}`, type: 'Text' as const, props: { content: '"Velocity has completely transformed how our engineering team ships code. We have cut our deployment times in half."', size: 'md' as const, style: { color: '#F8FAFC', lineHeight: '1.6', marginBottom: '2rem', fontStyle: 'italic' } } },
                    {
                        id: `${id}-profile${num}`, type: 'Container' as const, props: { style: { flexDirection: 'row', gap: '1rem', alignItems: 'center' } }, children: [
                            { id: `${id}-img${num}`, type: 'Image' as const, props: { url: `https://i.pravatar.cc/150?img=${num + 10}`, roundedCorners: 'full' as const, style: { width: '40px', height: '40px' } } },
                            {
                                id: `${id}-namebox${num}`, type: 'Container' as const, props: {}, children: [
                                    { id: `${id}-name${num}`, type: 'Text' as const, props: { content: 'Sarah Jenkins', size: 'sm' as const, style: { fontWeight: 'bold' } } },
                                    { id: `${id}-title${num}`, type: 'Text' as const, props: { content: 'CTO at TechCorp', size: 'sm' as const, customColor: '#64748B' } }
                                ]
                            }
                        ]
                    }
                ]
            }))
        ] as any[]
    };
}

function createPricing(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'spacious',
            columns: { desktop: 3, tablet: 3, mobile: 1 },
            columnGap: 'lg',
            verticalAlign: 'top',
            backgroundType: 'solid',
            animation: 'staggerChildren'
        },
        elements: [
            {
                id: `${id}-wrapH`, type: 'Container', props: { style: { gridColumn: '1 / -1', textAlign: 'center', marginBottom: '3rem' } }, children: [
                    { id: `${id}-ph`, type: 'Text', props: { content: 'Simple, transparent pricing', size: 'lg', style: { fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' } } },
                    { id: `${id}-ps`, type: 'Text', props: { content: 'No hidden fees. Cancel anytime.', size: 'md', customColor: '#94A3B8' } }
                ]
            },
            {
                id: `${id}-card-1`,
                type: 'FeatureCard' as const,
                props: { customBg: '#0F172A', roundedCorners: 'slight' as const, style: { border: '1px solid #1E293B', padding: '3rem 2rem' } },
                children: [
                    { id: `${id}-c1-h`, type: 'Text' as const, props: { content: `Starter`, size: 'lg' as const, style: { fontWeight: 'bold', marginBottom: '0.5rem', color: '#F8FAFC' } } },
                    { id: `${id}-c1-p`, type: 'Text' as const, props: { content: `$29/mo`, size: 'lg' as const, style: { fontWeight: '900', fontSize: '3rem', marginBottom: '2rem' } } },
                    { id: `${id}-c1-btn`, type: 'Button' as const, props: { content: 'Get Started', variant: 'outline' as const, style: { width: '100%', marginBottom: '2rem' } } },
                    { id: `${id}-c1-f1`, type: 'Text' as const, props: { content: '✓ Up to 5 users', size: 'sm' as const, customColor: '#94A3B8', style: { marginBottom: '0.5rem' } } },
                    { id: `${id}-c1-f2`, type: 'Text' as const, props: { content: '✓ Basic Analytics', size: 'sm' as const, customColor: '#94A3B8', style: { marginBottom: '0.5rem' } } },
                    { id: `${id}-c1-f3`, type: 'Text' as const, props: { content: '✓ 24-hour support SLA', size: 'sm' as const, customColor: '#94A3B8' } }
                ]
            },
            {
                id: `${id}-card-2`,
                type: 'FeatureCard' as const,
                props: { customBg: '#0F172A', roundedCorners: 'slight' as const, style: { border: '2px solid #4F46E5', padding: '3rem 2rem', transform: 'scale(1.05)', zIndex: '10', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' } },
                children: [
                    { id: `${id}-badge`, type: 'Text' as const, props: { content: `MOST POPULAR`, size: 'sm' as const, customColor: '#4F46E5', style: { fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '1rem' } } },
                    { id: `${id}-c2-h`, type: 'Text' as const, props: { content: `Pro`, size: 'lg' as const, style: { fontWeight: 'bold', marginBottom: '0.5rem', color: '#F8FAFC' } } },
                    { id: `${id}-c2-p`, type: 'Text' as const, props: { content: `$99/mo`, size: 'lg' as const, style: { fontWeight: '900', fontSize: '3rem', marginBottom: '2rem' } } },
                    { id: `${id}-c2-btn`, type: 'Button' as const, props: { content: 'Start Free Trial', variant: 'primary' as const, style: { width: '100%', marginBottom: '2rem', backgroundColor: '#4F46E5' } } },
                    { id: `${id}-c2-f1`, type: 'Text' as const, props: { content: '✓ Up to 50 users', size: 'sm' as const, customColor: '#F8FAFC', style: { marginBottom: '0.5rem' } } },
                    { id: `${id}-c2-f2`, type: 'Text' as const, props: { content: '✓ Advanced Analytics', size: 'sm' as const, customColor: '#F8FAFC', style: { marginBottom: '0.5rem' } } },
                    { id: `${id}-c2-f3`, type: 'Text' as const, props: { content: '✓ 1-hour support SLA', size: 'sm' as const, customColor: '#F8FAFC', style: { marginBottom: '0.5rem' } } },
                    { id: `${id}-c2-f4`, type: 'Text' as const, props: { content: '✓ Custom integrations', size: 'sm' as const, customColor: '#F8FAFC' } }
                ]
            },
            {
                id: `${id}-card-3`,
                type: 'FeatureCard' as const,
                props: { customBg: '#0F172A', roundedCorners: 'slight' as const, style: { border: '1px solid #1E293B', padding: '3rem 2rem' } },
                children: [
                    { id: `${id}-c3-h`, type: 'Text' as const, props: { content: `Enterprise`, size: 'lg' as const, style: { fontWeight: 'bold', marginBottom: '0.5rem', color: '#F8FAFC' } } },
                    { id: `${id}-c3-p`, type: 'Text' as const, props: { content: `Let's talk`, size: 'lg' as const, style: { fontWeight: '900', fontSize: '2.5rem', marginBottom: '2rem', lineHeight: '3rem' } } },
                    { id: `${id}-c3-btn`, type: 'Button' as const, props: { content: 'Contact Sales', variant: 'outline' as const, style: { width: '100%', marginBottom: '2rem' } } },
                    { id: `${id}-c3-f1`, type: 'Text' as const, props: { content: '✓ Unlimited users', size: 'sm' as const, customColor: '#94A3B8', style: { marginBottom: '0.5rem' } } },
                    { id: `${id}-c3-f2`, type: 'Text' as const, props: { content: '✓ Dedicated account manager', size: 'sm' as const, customColor: '#94A3B8', style: { marginBottom: '0.5rem' } } },
                    { id: `${id}-c3-f3`, type: 'Text' as const, props: { content: '✓ SSO & SAML', size: 'sm' as const, customColor: '#94A3B8' } }
                ]
            }
        ] as any[]
    };
}

function createCtaBanner(title = "Ready to boost your productivity?", subtitle = "Join over 10,000 teams who use Velocity to ship better software faster.", btnText = "Start your free 14-day trial"): Section {
    const id = uuidv4();
    return {
        id,
        type: "CallToAction",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'spacious',
            columns: { desktop: 1 },
            columnGap: 'none',
            verticalAlign: 'center',
            backgroundType: 'transparent',
            animation: 'slideUp'
        },
        elements: [
            {
                id: `${id}-wrap`,
                type: 'Container',
                props: { style: { padding: '6rem 2rem', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' } },
                children: [
                    { id: `${id}-t`, type: 'Text', props: { content: title, size: 'lg', customColor: '#ffffff', style: { fontWeight: '900', fontSize: '3.5rem', letterSpacing: '-0.02em', maxWidth: '800px' } } },
                    { id: `${id}-s`, type: 'Text', props: { content: subtitle, size: 'md', customColor: '#C7D2FE', style: { marginBottom: '3rem', marginTop: '1rem', fontSize: '1.25rem', maxWidth: '600px' } } },
                    { id: `${id}-b`, type: 'Button', props: { content: btnText, variant: 'primary', size: 'lg', style: { backgroundColor: '#ffffff', color: '#312E81', fontWeight: 'bold', padding: '1.25rem 3rem' } } }
                ]
            }
        ] as any[]
    };
}
