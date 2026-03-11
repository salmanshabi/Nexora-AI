import { v4 as uuidv4 } from 'uuid';
import { AppStateSnapshot, Section } from '../../builder/store/types';

export const getAgencyTemplate = (): Partial<AppStateSnapshot> => {
    return {
        pages: [{
            id: "home",
            title: "Home",
            slug: "/",
            isHiddenInNav: false,
            seo: { metaTitle: "Kinetic | Digital Agency", metaDescription: "We build digital futures." },
            sections: [
                createAgencyHero(),
                createTickerTape(),
                createServiceBento(),
                createCaseStudy(),
                createContactCta()
            ]
        }],
        tokens: {
            colors: { primary: "#39FF14", secondary: "#A3E635", background: "#09090B", text: "#FFFFFF" },
            typography: { headingFont: "Syne", bodyFont: "Manrope", baseSizeMultiplier: 1.0 },
            spacing: "spacious", roundness: "sharp", shadows: "soft",
            advanced: { spacingScale: 'spacious', shadowStyle: 'soft', buttonSystem: { roundness: 'sharp', hoverStyle: 'shadow' }, containerWidth: 'fluid' }
        }
    };
};

function createAgencyHero(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'custom',
            columns: { desktop: 2, mobile: 1 },
            columnGap: 'md',
            verticalAlign: 'center',
            backgroundType: 'transparent',
            animation: 'slideUp'
        },
        elements: [
            {
                id: `${id}-txt`,
                type: 'Container',
                props: { style: { padding: '8rem 2rem', gap: '2rem' } },
                children: [
                    { id: `${id}-badge`, type: 'Text', props: { content: 'CREATIVE & TECHNOLOGY PARTNERS', size: 'sm', customColor: '#39FF14', style: { letterSpacing: '0.15em', fontWeight: 'bold' } } },
                    { id: `${id}-h`, type: 'Text', props: { content: 'We build digital futures that perform.', size: 'lg', style: { fontFamily: 'Syne', fontSize: '5rem', lineHeight: '1', fontWeight: '800' } } },
                    { id: `${id}-p`, type: 'Text', props: { content: 'Kinetic is an independent agency partnering with the world\'s most ambitious brands to create digital products that command attention.', size: 'md', customColor: '#A1A1AA', style: { fontSize: '1.25rem', lineHeight: '1.6', maxWidth: '500px' } } },
                    { id: `${id}-b`, type: 'Button', props: { content: 'Start a Project', variant: 'primary', size: 'lg', style: { backgroundColor: '#39FF14', color: '#000000', fontWeight: 'bold', width: 'fit-content' } } }
                ]
            },
            {
                id: `${id}-img`,
                type: 'Image', // In a real scenario, this might be a custom webgl/video block. We'll use an abstract image.
                props: { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1600', roundedCorners: 'slight', style: { height: '600px', width: '100%', objectFit: 'cover' }, animation: 'fadeIn' }
            }
        ] as any[]
    };
}

function createTickerTape(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'full',
            padding: 'custom',
            columns: { desktop: 1 },
            columnGap: 'none',
            verticalAlign: 'center',
            backgroundType: 'solid',
            animation: 'none'
        },
        elements: [
            {
                id: `${id}-wrap`,
                type: 'Container',
                props: { style: { padding: '1.5rem', overflow: 'hidden', whiteSpace: 'nowrap' } },
                children: [
                    { id: `${id}-txt`, type: 'Text', props: { content: 'STRATEGY • DESIGN • DEVELOPMENT • MARKETING • STRATEGY • DESIGN • DEVELOPMENT • MARKETING • STRATEGY • DESIGN • DEVELOPMENT • MARKETING', size: 'lg', style: { fontFamily: 'Syne', fontWeight: 'bold', letterSpacing: '0.2em', color: '#000000', fontSize: '1.5rem', display: 'inline-block', animation: 'scroll 20s linear infinite' /* Needs external CSS for @keyframes scroll */ } } }
                ]
            }
        ] as any[]
    };
}

function createServiceBento(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'spacious',
            columns: { desktop: 2, mobile: 1 },
            columnGap: 'md',
            verticalAlign: 'top',
            backgroundType: 'transparent',
            animation: 'staggerChildren'
        },
        elements: [
            {
                id: `${id}-c1`, type: 'FeatureCard', props: { customBg: '#18181B', style: { padding: '4rem 2rem', border: '1px solid #27272A', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' } }, children: [
                    { id: `${id}-c1n`, type: 'Text', props: { content: '01', size: 'sm', customColor: '#A1A1AA' } },
                    { id: `${id}-c1h`, type: 'Text', props: { content: 'Digital Strategy', size: 'lg', style: { fontFamily: 'Syne', fontSize: '2.5rem', fontWeight: 'bold' } } },
                    { id: `${id}-c1p`, type: 'Text', props: { content: 'Research, positioning, and architectures that set the foundation for scalable growth.', size: 'md', customColor: '#A1A1AA' } }
                ]
            },
            {
                id: `${id}-col2`, type: 'Container', props: { style: { gap: '1rem', display: 'flex', flexDirection: 'column' } }, children: [
                    {
                        id: `${id}-c2`, type: 'FeatureCard', props: { customBg: '#18181B', style: { padding: '2rem', border: '1px solid #27272A', flex: '1', display: 'flex', flexDirection: 'column', gap: '1rem' } }, children: [
                            { id: `${id}-c2n`, type: 'Text', props: { content: '02', size: 'sm', customColor: '#A1A1AA' } },
                            { id: `${id}-c2h`, type: 'Text', props: { content: 'Experience Design (UX/UI)', size: 'lg', style: { fontFamily: 'Syne', fontSize: '2rem', fontWeight: 'bold' } } }
                        ]
                    },
                    {
                        id: `${id}-c3`, type: 'FeatureCard', props: { customBg: '#18181B', style: { padding: '2rem', border: '1px solid #27272A', flex: '1', display: 'flex', flexDirection: 'column', gap: '1rem' } }, children: [
                            { id: `${id}-c3n`, type: 'Text', props: { content: '03', size: 'sm', customColor: '#A1A1AA' } },
                            { id: `${id}-c3h`, type: 'Text', props: { content: 'Full-Stack Development', size: 'lg', style: { fontFamily: 'Syne', fontSize: '2rem', fontWeight: 'bold' } } }
                        ]
                    }
                ]
            }
        ] as any[]
    };
}

function createCaseStudy(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero",
        isLocked: false,
        layout: {
            width: 'full',
            padding: 'custom',
            columns: { desktop: 1 },
            columnGap: 'none',
            verticalAlign: 'center',
            backgroundType: 'image',
            backgroundImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2500',
            animation: 'revealOnScroll'
        },
        elements: [
            {
                id: `${id}-ov`,
                type: 'Container',
                props: { style: { height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(9, 9, 11, 0.7)' } },
                children: [
                    {
                        id: `${id}-inner`, type: 'Container', props: { style: { textAlign: 'center', maxWidth: '800px', padding: '2rem' } }, children: [
                            { id: `${id}-tag`, type: 'Text', props: { content: 'FEATURED CASE STUDY', size: 'sm', customColor: '#39FF14', style: { letterSpacing: '0.15em', fontWeight: 'bold', marginBottom: '1rem' } } },
                            { id: `${id}-h`, type: 'Text', props: { content: 'How we helped Acme Corp increase conversions by 300%', size: 'lg', style: { fontFamily: 'Syne', fontSize: '4rem', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '2rem' } } },
                            { id: `${id}-b`, type: 'Button', props: { content: 'Read the Study', variant: 'outline', size: 'lg', style: { borderColor: '#ffffff', color: '#ffffff' } } }
                        ]
                    }
                ]
            }
        ] as any[]
    };
}

function createContactCta(): Section {
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
                id: `${id}-w`,
                type: 'Container',
                props: { style: { padding: '6rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' } },
                children: [
                    { id: `${id}-h`, type: 'Text', props: { content: 'Ready?', size: 'lg', style: { fontFamily: 'Syne', fontSize: '8rem', fontWeight: '800', lineHeight: '1' } } },
                    { id: `${id}-h2`, type: 'Text', props: { content: 'Let\'s get to work.', size: 'lg', style: { fontFamily: 'Syne', fontSize: '3rem', fontWeight: 'bold', color: '#A1A1AA' } } },
                    { id: `${id}-b`, type: 'Button', props: { content: 'hello@kinetic.agency', variant: 'primary', size: 'lg', style: { backgroundColor: '#39FF14', color: '#000000', fontSize: '1.5rem', padding: '1.5rem 3rem', marginTop: '2rem' } } }
                ]
            }
        ] as any[]
    };
}
