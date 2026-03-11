import { v4 as uuidv4 } from 'uuid';
import { AppStateSnapshot, Section } from '../../builder/store/types';

export const getCreativeTemplate = (): Partial<AppStateSnapshot> => {
    return {
        pages: [{
            id: "home",
            title: "Home",
            slug: "/",
            isHiddenInNav: false,
            seo: { metaTitle: "Obsidian | Design Portfolio", metaDescription: "Creative design studio." },
            sections: [
                createCreativeHero(),
                createSelectedWorks(),
                createServicesList(),
                createAboutSplit(),
                createBoldFooterCta()
            ]
        }],
        tokens: {
            colors: { primary: "#E11D48", secondary: "#FDA4AF", background: "#0A0A0A", text: "#F4F4F5" },
            typography: { headingFont: "Playfair Display", bodyFont: "Inter", baseSizeMultiplier: 1.0 },
            spacing: "spacious", roundness: "sharp", shadows: "none",
            advanced: { spacingScale: 'spacious', shadowStyle: 'none', buttonSystem: { roundness: 'sharp', hoverStyle: 'shadow' }, containerWidth: 'wide' }
        }
    };
};

function createCreativeHero(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero",
        isLocked: false,
        layout: {
            width: 'full',
            padding: 'spacious',
            columns: { desktop: 2, mobile: 1 },
            columnGap: 'md',
            verticalAlign: 'center',
            backgroundType: 'transparent',
            animation: 'fadeIn'
        },
        elements: [
            {
                id: `${id}-el1`,
                type: 'Container',
                props: { style: { padding: '8rem 2rem 4rem 4rem', width: '100%', zIndex: '10' } },
                children: [
                    { id: `${id}-h1`, type: 'Text', props: { content: 'We Craft Digital', size: 'lg', style: { fontFamily: 'Playfair Display', fontSize: '6rem', lineHeight: '1', fontWeight: '400', letterSpacing: '-0.05em', whiteSpace: 'nowrap' } } },
                    { id: `${id}-h2`, type: 'Text', props: { content: 'Experiences.', size: 'lg', style: { fontFamily: 'Playfair Display', fontSize: '6rem', lineHeight: '1', fontWeight: '400', color: '#E11D48', letterSpacing: '-0.05em' } } },
                    { id: `${id}-p`, type: 'Text', props: { content: 'AWARD-WINNING DESIGN ATELIER BASED IN PARIS.', size: 'sm', customColor: '#A1A1AA', style: { letterSpacing: '0.2em', marginTop: '3rem', fontSize: '0.8rem' } } }
                ]
            },
            {
                id: `${id}-el2`,
                type: 'Image',
                props: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2500', roundedCorners: 'sharp', style: { height: '80vh', width: '80%', objectFit: 'cover', marginLeft: 'auto', filter: 'grayscale(30%)' }, animation: 'revealOnScroll' }
            }
        ] as any[]
    };
}

function createSelectedWorks(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'custom',
            columns: { desktop: 2, mobile: 1 },
            columnGap: 'lg',
            verticalAlign: 'top',
            backgroundType: 'transparent',
            animation: 'staggerChildren'
        },
        elements: [
            {
                id: `${id}-head`, type: 'Container', props: { style: { gridColumn: '1 / -1', paddingBottom: '4rem', paddingTop: '4rem', borderBottom: '1px solid #27272A', marginBottom: '4rem' } }, children: [
                    { id: `${id}-txt`, type: 'Text', props: { content: 'Selected Works (23-24)', size: 'md', style: { fontFamily: 'Playfair Display', fontSize: '2rem' } } }
                ]
            },
            // Left Column (Offset down)
            {
                id: `${id}-col1`, type: 'Container', props: { style: { gap: '4rem', marginTop: '6rem' } }, children: [
                    {
                        id: `${id}-w1`, type: 'Container', props: { style: { gap: '1rem' } }, children: [
                            { id: `${id}-i1`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?auto=format&fit=crop&q=80&w=800', roundedCorners: 'inherit', style: { width: '100%', height: '600px', objectFit: 'cover' }, animation: 'revealOnScroll' } },
                            { id: `${id}-t1`, type: 'Text', props: { content: 'Aura Skincare', size: 'lg', style: { fontFamily: 'Playfair Display', fontSize: '1.5rem', marginTop: '1rem' } } },
                            { id: `${id}-s1`, type: 'Text', props: { content: 'Branding / E-commerce', size: 'sm', customColor: '#A1A1AA' } }
                        ]
                    },
                    {
                        id: `${id}-w2`, type: 'Container', props: { style: { gap: '1rem' } }, children: [
                            { id: `${id}-i2`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800', roundedCorners: 'inherit', style: { width: '100%', height: '500px', objectFit: 'cover' }, animation: 'revealOnScroll' } },
                            { id: `${id}-t2`, type: 'Text', props: { content: 'KINFOLK Magazine', size: 'lg', style: { fontFamily: 'Playfair Display', fontSize: '1.5rem', marginTop: '1rem' } } },
                            { id: `${id}-s2`, type: 'Text', props: { content: 'Editorial / Print', size: 'sm', customColor: '#A1A1AA' } }
                        ]
                    }
                ]
            },
            // Right Column (Starts higher)
            {
                id: `${id}-col2`, type: 'Container', props: { style: { gap: '4rem' } }, children: [
                    {
                        id: `${id}-w3`, type: 'Container', props: { style: { gap: '1rem' } }, children: [
                            { id: `${id}-i3`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=80&w=800', roundedCorners: 'inherit', style: { width: '100%', height: '500px', objectFit: 'cover' }, animation: 'revealOnScroll' } },
                            { id: `${id}-t3`, type: 'Text', props: { content: 'Maison Margiela', size: 'lg', style: { fontFamily: 'Playfair Display', fontSize: '1.5rem', marginTop: '1rem' } } },
                            { id: `${id}-s3`, type: 'Text', props: { content: 'Art Direction', size: 'sm', customColor: '#A1A1AA' } }
                        ]
                    },
                    {
                        id: `${id}-w4`, type: 'Container', props: { style: { gap: '1rem' } }, children: [
                            { id: `${id}-i4`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=800', roundedCorners: 'inherit', style: { width: '100%', height: '700px', objectFit: 'cover' }, animation: 'revealOnScroll' } },
                            { id: `${id}-t4`, type: 'Text', props: { content: 'Objekt Gallery', size: 'lg', style: { fontFamily: 'Playfair Display', fontSize: '1.5rem', marginTop: '1rem' } } },
                            { id: `${id}-s4`, type: 'Text', props: { content: 'Spatial Design / Web3', size: 'sm', customColor: '#A1A1AA' } }
                        ]
                    }
                ]
            }
        ] as any[]
    };
}

function createServicesList(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'spacious',
            columns: { desktop: 1 },
            columnGap: 'none',
            verticalAlign: 'center',
            backgroundType: 'transparent',
            animation: 'revealOnScroll'
        },
        elements: [
            {
                id: `${id}-wrap`, type: 'Container', props: { style: { width: '100%', paddingTop: '6rem' } }, children: [
                    { id: `${id}-th`, type: 'Text', props: { content: 'OUR EXPERTISE', size: 'sm', customColor: '#E11D48', style: { letterSpacing: '0.2em', marginBottom: '3rem' } } },
                    ...['Brand Strategy & Positioning', 'Digital Product Design', 'Immersive Web Development', 'Art Direction & Photography'].map((srv, idx) => ({
                        id: `${id}-srv-${idx}`, type: 'Text' as const, props: { content: srv, size: 'lg' as const, style: { fontFamily: 'Playfair Display', fontSize: '3rem', padding: '2rem 0', borderBottom: '1px solid #27272A', transition: 'color 0.3s ease', cursor: 'pointer' } }
                    }))
                ]
            }
        ] as any[]
    };
}

function createAboutSplit(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'spacious',
            columns: { desktop: 2, mobile: 1 },
            columnGap: 'lg',
            verticalAlign: 'center',
            backgroundType: 'solid',
            animation: 'fadeIn'
        },
        elements: [
            {
                id: `${id}-img`,
                type: 'Image',
                props: { url: 'https://images.unsplash.com/photo-1542665952-14513db15293?auto=format&fit=crop&q=80&w=800', roundedCorners: 'inherit', style: { height: '600px', width: '100%', objectFit: 'cover' }, animation: 'revealOnScroll' }
            },
            {
                id: `${id}-txt`,
                type: 'Container',
                props: { style: { gap: '2rem', padding: '2rem' } },
                children: [
                    { id: `${id}-h`, type: 'Text', props: { content: 'The Studio', size: 'lg', style: { fontFamily: 'Playfair Display', fontSize: '3.5rem' } } },
                    { id: `${id}-p1`, type: 'Text', props: { content: 'Founded in 2018, Obsidian is an independent creative studio challenging the boundaries of digital and physical design.', size: 'md', style: { color: '#A1A1AA', fontSize: '1.25rem', lineHeight: '1.8' } } },
                    { id: `${id}-p2`, type: 'Text', props: { content: 'We believe in stripping away the unnecessary to reveal the essential truth of a brand. Our approach is deeply collaborative, slightly chaotic, and intensely focused on crafting work that outlasts trends.', size: 'md', style: { color: '#A1A1AA', fontSize: '1.25rem', lineHeight: '1.8' } } },
                    { id: `${id}-sig`, type: 'Text', props: { content: 'Eleanor Vance, Founder', size: 'md', style: { fontFamily: 'Playfair Display', fontStyle: 'italic', marginTop: '2rem', fontSize: '1.5rem', color: '#F4F4F5' } } }
                ]
            }
        ] as any[]
    };
}

function createBoldFooterCta(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero", // Acts as a giant CTA
        isLocked: false,
        layout: {
            width: 'full',
            padding: 'custom',
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
                props: { style: { padding: '10rem 2rem', alignItems: 'center', textAlign: 'center' } },
                children: [
                    { id: `${id}-t`, type: 'Text', props: { content: 'Got an idea?', size: 'sm', customColor: '#FDA4AF', style: { letterSpacing: '0.2em', marginBottom: '2rem' } } },
                    { id: `${id}-h`, type: 'Text', props: { content: 'Let\'s create', size: 'lg', style: { fontFamily: 'Playfair Display', fontSize: '8vw', lineHeight: '1', letterSpacing: '-0.02em', WebkitTextStroke: '2px #ffffff', color: 'transparent' } } },
                    { id: `${id}-h2`, type: 'Text', props: { content: 'something beautiful.', size: 'lg', style: { fontFamily: 'Playfair Display', fontSize: '8vw', lineHeight: '1', color: '#ffffff', letterSpacing: '-0.02em' } } },
                    { id: `${id}-b`, type: 'Button', props: { content: 'hello@obsidian.studio', variant: 'outline', size: 'lg', style: { marginTop: '4rem', borderColor: '#ffffff', color: '#ffffff', borderRadius: '0', padding: '1.5rem 3rem', fontSize: '1.25rem' } } }
                ]
            }
        ] as any[]
    };
}
