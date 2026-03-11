import { v4 as uuidv4 } from 'uuid';
import { AppStateSnapshot, Section } from '../../builder/store/types';

export const getRestaurantTemplate = (): Partial<AppStateSnapshot> => {
    return {
        pages: [{
            id: "home",
            title: "Home",
            slug: "/",
            isHiddenInNav: false,
            seo: { metaTitle: "Ember | Woodfired Dining", metaDescription: "A taste of tradition." },
            sections: [
                createRestaurantHero(),
                createAboutIntro(),
                createMenuHighlights(),
                createImageGallery(),
                createReservationFooter()
            ]
        }],
        tokens: {
            colors: { primary: "#D97706", secondary: "#FBBF24", background: "#1C1917", text: "#F5F5F4" },
            typography: { headingFont: "Cormorant Garamond", bodyFont: "Lato", baseSizeMultiplier: 1.0 },
            spacing: "comfortable", roundness: "sharp", shadows: "soft",
            advanced: { spacingScale: 'default', shadowStyle: 'soft', buttonSystem: { roundness: 'sharp', hoverStyle: 'scale' }, containerWidth: 'standard' }
        }
    };
};

function createRestaurantHero(): Section {
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
            backgroundImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2500',
            animation: 'fadeIn'
        },
        elements: [
            {
                id: `${id}-overlay`,
                type: 'Container',
                props: { style: { height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7))', padding: '2rem', textAlign: 'center' }, animation: 'slideUp' },
                children: [
                    { id: `${id}-t1`, type: 'Text', props: { content: 'EST. 1998', size: 'sm', customColor: '#D97706', style: { letterSpacing: '0.2em', marginBottom: '1rem', fontWeight: 'bold' } } },
                    { id: `${id}-h`, type: 'Text', props: { content: 'A Taste of Tradition.', size: 'lg', style: { fontFamily: 'Cormorant Garamond', fontSize: '5rem', lineHeight: '1', color: '#ffffff', marginBottom: '2rem' } } },
                    { id: `${id}-b`, type: 'Button', props: { content: 'Book a Table', variant: 'primary', size: 'lg', style: { backgroundColor: '#D97706', color: '#ffffff', padding: '1rem 3rem', letterSpacing: '0.1em' } } }
                ]
            }
        ] as any[]
    };
}

function createAboutIntro(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'custom',
            columns: { desktop: 1 },
            columnGap: 'none',
            verticalAlign: 'center',
            backgroundType: 'transparent',
            animation: 'revealOnScroll'
        },
        elements: [
            {
                id: `${id}-wrap`,
                type: 'Container',
                props: { style: { padding: '8rem 2rem 6rem 2rem', alignItems: 'center', textAlign: 'center', maxWidth: '800px', margin: '0 auto' } },
                children: [
                    { id: `${id}-sub`, type: 'Text', props: { content: 'OUR STORY', size: 'sm', customColor: '#D97706', style: { letterSpacing: '0.2em', marginBottom: '2rem' } } },
                    { id: `${id}-h`, type: 'Text', props: { content: 'Fire, Wood, and Time.', size: 'lg', style: { fontFamily: 'Cormorant Garamond', fontSize: '3.5rem', marginBottom: '2rem', lineHeight: '1.2' } } },
                    { id: `${id}-p`, type: 'Text', props: { content: 'At Ember, we believe in the primal connection between food and fire. Everything on our menu is kissed by smoke, roasted over hardwood embers, and prepared with a reverence for local ingredients.', size: 'md', customColor: '#A8A29E', style: { fontSize: '1.25rem', lineHeight: '1.8' } } },
                    { id: `${id}-i`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800', roundedCorners: 'inherit', style: { width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginTop: '3rem' } } }
                ]
            }
        ] as any[]
    };
}

function createMenuHighlights(): Section {
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
                id: `${id}-head`, type: 'Container', props: { style: { gridColumn: '1 / -1', textAlign: 'center', marginBottom: '4rem' } }, children: [
                    { id: `${id}-t`, type: 'Text', props: { content: 'SEASONAL HIGHLIGHTS', size: 'sm', customColor: '#D97706', style: { letterSpacing: '0.2em', marginBottom: '1rem' } } },
                    { id: `${id}-h`, type: 'Text', props: { content: 'From the Hearth', size: 'md', style: { fontFamily: 'Cormorant Garamond', fontSize: '3rem' } } }
                ]
            },
            ...[
                { n: 'Charred Octopus', p: '$24', d: 'Smoked paprika, crushed potatoes, salsa verde.' },
                { n: 'Wood-Fired Ribeye', p: '$65', d: 'Bone-in, aged 45 days, black garlic butter.' },
                { n: 'Hearth Roasted Carrots', p: '$16', d: 'Whipped ricotta, spiced honey, pistachios.' },
                { n: 'Smoked Chocolate Tart', p: '$14', d: 'Sea salt, toasted marshmallow ice cream.' }
            ].map((item, idx) => ({
                id: `${id}-menu-${idx}`,
                type: 'Container' as const,
                props: { style: { marginBottom: '2rem', borderBottom: '1px solid #44403C', paddingBottom: '1.5rem' } },
                children: [
                    {
                        id: `${id}-row-${idx}`, type: 'Container' as const, props: { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' } }, children: [
                            { id: `${id}-n-${idx}`, type: 'Text' as const, props: { content: item.n, size: 'md' as const, style: { fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', fontWeight: 'bold' } } },
                            { id: `${id}-p-${idx}`, type: 'Text' as const, props: { content: item.p, size: 'md' as const, customColor: '#D97706', style: { fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', fontWeight: 'bold' } } }
                        ]
                    },
                    { id: `${id}-d-${idx}`, type: 'Text' as const, props: { content: item.d, size: 'sm' as const, customColor: '#A8A29E', style: { fontStyle: 'italic' } } }
                ]
            }))
        ] as any[]
    };
}

function createImageGallery(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'full',
            padding: 'custom',
            columns: { desktop: 4, tablet: 2, mobile: 1 },
            columnGap: 'none',
            verticalAlign: 'center',
            backgroundType: 'transparent',
            animation: 'fadeIn'
        },
        elements: [
            { id: `${id}-i1`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800', roundedCorners: 'inherit', style: { height: '400px', width: '100%', objectFit: 'cover', transition: 'transform 0.5s' } } },
            { id: `${id}-i2`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800', roundedCorners: 'inherit', style: { height: '400px', width: '100%', objectFit: 'cover', transition: 'transform 0.5s' } } },
            { id: `${id}-i3`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800', roundedCorners: 'inherit', style: { height: '400px', width: '100%', objectFit: 'cover', transition: 'transform 0.5s' } } },
            { id: `${id}-i4`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800', roundedCorners: 'inherit', style: { height: '400px', width: '100%', objectFit: 'cover', transition: 'transform 0.5s' } } }
        ] as any[]
    };
}

function createReservationFooter(): Section {
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
            backgroundType: 'transparent',
            animation: 'fadeIn'
        },
        elements: [
            {
                id: `${id}-left`,
                type: 'Container',
                props: { style: { padding: '4rem 2rem', backgroundColor: '#292524', border: '1px solid #44403C' } },
                children: [
                    { id: `${id}-lh`, type: 'Text', props: { content: 'Join Us', size: 'lg', style: { fontFamily: 'Cormorant Garamond', fontSize: '3rem', marginBottom: '1rem' } } },
                    { id: `${id}-lp`, type: 'Text', props: { content: 'We accept reservations up to 30 days in advance. For parties larger than 6, please call us directly.', size: 'md', customColor: '#A8A29E', style: { marginBottom: '2rem' } } },
                    { id: `${id}-lb`, type: 'Button', props: { content: 'Find a Table', variant: 'primary', size: 'lg', style: { backgroundColor: '#D97706', color: '#ffffff', width: '100%' } } }
                ]
            },
            {
                id: `${id}-right`,
                type: 'Container',
                props: { style: { padding: '4rem 2rem', gap: '2rem' } },
                children: [
                    {
                        id: `${id}-r1`, type: 'Container', props: { style: {} }, children: [
                            { id: `${id}-rh1`, type: 'Text', props: { content: 'LOCATION', size: 'sm', customColor: '#D97706', style: { letterSpacing: '0.1em', marginBottom: '0.5rem', fontWeight: 'bold' } } },
                            { id: `${id}-rp1`, type: 'Text', props: { content: '123 Firelight Alley\nPortland, OR 97205', size: 'md', style: { whiteSpace: 'pre-line' } } }
                        ]
                    },
                    {
                        id: `${id}-r2`, type: 'Container', props: { style: {} }, children: [
                            { id: `${id}-rh2`, type: 'Text', props: { content: 'HOURS', size: 'sm', customColor: '#D97706', style: { letterSpacing: '0.1em', marginBottom: '0.5rem', fontWeight: 'bold' } } },
                            { id: `${id}-rp2`, type: 'Text', props: { content: 'Tue - Thu: 5pm - 10pm\nFri - Sat: 5pm - 11pm\nSun: 4pm - 9pm', size: 'md', style: { whiteSpace: 'pre-line' } } }
                        ]
                    }
                ]
            }
        ] as any[]
    };
}
