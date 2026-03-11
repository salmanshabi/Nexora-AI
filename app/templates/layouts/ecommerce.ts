import { v4 as uuidv4 } from 'uuid';
import { AppStateSnapshot, Section } from '../../builder/store/types';

export const getEcommerceTemplate = (): Partial<AppStateSnapshot> => {
    return {
        pages: [{
            id: "home",
            title: "Home",
            slug: "/",
            isHiddenInNav: false,
            seo: { metaTitle: "Aura | Skincare Essentials", metaDescription: "Clean, conscious skincare." },
            sections: [
                createPromoBar(),
                createShopHero(),
                createCategoryRow(),
                createProductGrid(),
                createUgcGrid(),
                createNewsletterFooter()
            ]
        }],
        tokens: {
            colors: { primary: "#000000", secondary: "#FECDD3", background: "#FFFFFF", text: "#171717" },
            typography: { headingFont: "Helvetica Neue", bodyFont: "Inter", baseSizeMultiplier: 1.0 },
            spacing: "comfortable", roundness: "sharp", shadows: "soft",
            advanced: { spacingScale: 'default', shadowStyle: 'soft', buttonSystem: { roundness: 'sharp', hoverStyle: 'shadow' }, containerWidth: 'fluid' }
        }
    };
};

function createPromoBar(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero", // Using Hero purely as a structural container
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
                props: { style: { padding: '0.5rem', textAlign: 'center' } },
                children: [
                    { id: `${id}-txt`, type: 'Text', props: { content: 'Free standard shipping on all orders over $50.', size: 'sm', customColor: '#ffffff', style: { letterSpacing: '0.05em' } } }
                ]
            }
        ] as any[]
    };
}

function createShopHero(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero",
        isLocked: false,
        layout: {
            width: 'full',
            padding: 'custom',
            columns: { desktop: 2, mobile: 1 },
            columnGap: 'none',
            verticalAlign: 'center',
            backgroundType: 'solid',
            animation: 'fadeIn'
        },
        elements: [
            {
                id: `${id}-txt`,
                type: 'Container',
                props: { style: { padding: '4rem 10%', gap: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
                children: [
                    { id: `${id}-h`, type: 'Text', props: { content: 'The Summer Collection', size: 'lg', style: { fontFamily: 'Helvetica Neue', fontSize: '4.5rem', fontWeight: '500', lineHeight: '1.1', letterSpacing: '-0.03em' } } },
                    { id: `${id}-p`, type: 'Text', props: { content: 'Protect and hydrate your skin all season long with our award-winning SPF and lightweight moisturizers.', size: 'md', customColor: '#525252', style: { fontSize: '1.25rem', lineHeight: '1.6' } } },
                    { id: `${id}-b`, type: 'Button', props: { content: 'Shop the Collection', variant: 'primary', size: 'lg', style: { backgroundColor: '#000000', color: '#ffffff', width: 'fit-content', marginTop: '1rem', padding: '1rem 2rem' } } }
                ]
            },
            {
                id: `${id}-img`,
                type: 'Image',
                props: { url: 'https://images.unsplash.com/photo-1615397323166-4cb46564619a?auto=format&fit=crop&q=80&w=2000', roundedCorners: 'inherit', style: { height: '80vh', width: '100%', objectFit: 'cover' }, animation: 'slideLeft' }
            }
        ] as any[]
    };
}

function createCategoryRow(): Section {
    const id = uuidv4();
    const categories = [
        { name: 'Cleansers', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400' },
        { name: 'Serums', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400' },
        { name: 'Moisturizers', img: 'https://images.unsplash.com/photo-1570194065650-d29fe8e663ce?auto=format&fit=crop&q=80&w=400' },
        { name: 'Suncare', img: 'https://images.unsplash.com/photo-1556228720-192a6af4e865?auto=format&fit=crop&q=80&w=400' }
    ];

    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'spacious',
            columns: { desktop: 4, tablet: 2, mobile: 2 },
            columnGap: 'md',
            verticalAlign: 'top',
            backgroundType: 'transparent',
            animation: 'staggerChildren'
        },
        elements: categories.map((cat, idx) => ({
            id: `${id}-cat-${idx}`,
            type: 'Container',
            props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer' } },
            children: [
                { id: `${id}-img-${idx}`, type: 'Image', props: { url: cat.img, roundedCorners: 'full', style: { width: '160px', height: '160px', objectFit: 'cover' }, animation: 'revealOnScroll' } },
                { id: `${id}-txt-${idx}`, type: 'Text', props: { content: cat.name, size: 'md', style: { fontWeight: '500', fontSize: '1.1rem' } } }
            ]
        })) as any[]
    };
}

function createProductGrid(): Section {
    const id = uuidv4();
    const products = [
        { name: 'Daily Hydration Serum', price: '$48', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600' },
        { name: 'Purifying Clay Mask', price: '$32', img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600' },
        { name: 'Vitamin C Brightening Drops', price: '$65', img: 'https://images.unsplash.com/photo-1570194065650-d29fe8e663ce?auto=format&fit=crop&q=80&w=600' },
        { name: 'SPF 50 Mineral Drops', price: '$38', img: 'https://images.unsplash.com/photo-1556228720-192a6af4e865?auto=format&fit=crop&q=80&w=600' }
    ];

    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'custom',
            columns: { desktop: 4, tablet: 2, mobile: 1 },
            columnGap: 'md',
            verticalAlign: 'top',
            backgroundType: 'transparent',
            animation: 'staggerChildren'
        },
        elements: [
            {
                id: `${id}-head`, type: 'Container', props: { style: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' } }, children: [
                    { id: `${id}-th`, type: 'Text', props: { content: 'Best Sellers', size: 'lg', style: { fontSize: '2.5rem', fontWeight: '500' } } },
                    { id: `${id}-tl`, type: 'Text', props: { content: 'Shop All ->', size: 'md', style: { textDecoration: 'underline', cursor: 'pointer' } } }
                ]
            },
            ...products.map((prod, idx) => ({
                id: `${id}-prod-${idx}`,
                type: 'FeatureCard',
                props: { customBg: '#ffffff', roundedCorners: 'inherit', style: { padding: '0', border: 'none' } },
                children: [
                    { id: `${id}-pimg-${idx}`, type: 'Image', props: { url: prod.img, roundedCorners: 'inherit', style: { width: '100%', height: '350px', objectFit: 'cover', marginBottom: '1rem', backgroundColor: '#FAFAFA' } } },
                    {
                        id: `${id}-pbox-${idx}`, type: 'Container', props: { style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' } }, children: [
                            { id: `${id}-pn-${idx}`, type: 'Text', props: { content: prod.name, size: 'md', style: { fontWeight: '500' } } },
                            { id: `${id}-pp-${idx}`, type: 'Text', props: { content: prod.price, size: 'md', style: { fontWeight: '400', color: '#525252' } } }
                        ]
                    },
                    { id: `${id}-pbtn-${idx}`, type: 'Button', props: { content: 'Add to Cart', variant: 'outline', size: 'sm', style: { width: '100%', marginTop: '1rem', borderColor: '#E5E5E5' } } }
                ]
            }))
        ] as any[]
    };
}

function createUgcGrid(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'spacious',
            columns: { desktop: 4, tablet: 3, mobile: 2 },
            columnGap: 'sm',
            verticalAlign: 'center',
            backgroundType: 'transparent',
            animation: 'fadeIn'
        },
        elements: [
            { id: `${id}-h`, type: 'Container', props: { style: { gridColumn: '1 / -1', textAlign: 'center', marginBottom: '2rem' } }, children: [{ id: `${id}-ht`, type: 'Text', props: { content: '@AURA_SKINCARE', size: 'md', style: { letterSpacing: '0.1em', fontWeight: '500' } } }] },
            { id: `${id}-u1`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1512496015851-a1dc8f411f53?auto=format&fit=crop&q=80&w=400', roundedCorners: 'inherit', style: { aspectRatio: '1/1', objectFit: 'cover', width: '100%' } } },
            { id: `${id}-u2`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80&w=400', roundedCorners: 'inherit', style: { aspectRatio: '1/1', objectFit: 'cover', width: '100%' } } },
            { id: `${id}-u3`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400', roundedCorners: 'inherit', style: { aspectRatio: '1/1', objectFit: 'cover', width: '100%' } } },
            { id: `${id}-u4`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=400', roundedCorners: 'inherit', style: { aspectRatio: '1/1', objectFit: 'cover', width: '100%' } } },
            { id: `${id}-u5`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1580870058864-44281358fd90?auto=format&fit=crop&q=80&w=400', roundedCorners: 'inherit', style: { aspectRatio: '1/1', objectFit: 'cover', width: '100%' } } }

        ] as any[]
    };
}

function createNewsletterFooter(): Section {
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
            backgroundType: 'solid',
            animation: 'fadeIn'
        },
        elements: [
            {
                id: `${id}-wrap`,
                type: 'Container',
                props: { style: { padding: '6rem 2rem', alignItems: 'center', textAlign: 'center' } },
                children: [
                    { id: `${id}-h`, type: 'Text', props: { content: 'Join the club.', size: 'lg', style: { fontSize: '3rem', fontWeight: '500', color: '#ffffff', marginBottom: '1rem' } } },
                    { id: `${id}-p`, type: 'Text', props: { content: 'Sign up for emails to get 10% off your first order, plus early access to new drops.', size: 'md', customColor: '#A3A3A3', style: { marginBottom: '3rem', maxWidth: '600px' } } },
                    {
                        id: `${id}-form`, type: 'Container', props: { style: { flexDirection: 'row', width: '100%', maxWidth: '400px', borderBottom: '1px solid #404040', paddingBottom: '0.5rem', justifyContent: 'space-between' } }, children: [
                            { id: `${id}-inp`, type: 'Text', props: { content: 'Email address', size: 'md', customColor: '#737373' } },
                            { id: `${id}-btn`, type: 'Text', props: { content: '->', size: 'md', customColor: '#ffffff' } }
                        ]
                    }
                ]
            }
        ] as any[]
    };
}
