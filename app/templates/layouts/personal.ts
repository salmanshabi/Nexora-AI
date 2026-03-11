import { v4 as uuidv4 } from 'uuid';
import { AppStateSnapshot, Section } from '../../builder/store/types';

export const getPersonalTemplate = (): Partial<AppStateSnapshot> => {
    return {
        pages: [{
            id: "home",
            title: "Home",
            slug: "/",
            isHiddenInNav: false,
            seo: { metaTitle: "Luminary | Personal Brand", metaDescription: "Helping leaders build better companies." },
            sections: [
                createPersonalHero(),
                createAsSeenOn(),
                createBioSplit(),
                createBooksGrid(),
                createTestimonialBlock(),
                createNewsletterCapture()
            ]
        }],
        tokens: {
            colors: { primary: "#2563EB", secondary: "#93C5FD", background: "#F8FAFC", text: "#0F172A" },
            typography: { headingFont: "Merriweather", bodyFont: "Open Sans", baseSizeMultiplier: 1.0 },
            spacing: "comfortable", roundness: "pill", shadows: "soft",
            advanced: { spacingScale: 'default', shadowStyle: 'soft', buttonSystem: { roundness: 'pill', hoverStyle: 'scale' }, containerWidth: 'standard' }
        }
    };
};

function createPersonalHero(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'spacious',
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
                props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '800px', margin: '0 auto', gap: '2rem', marginTop: '4rem' } },
                children: [
                    { id: `${id}-img`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400', roundedCorners: 'full', style: { width: '160px', height: '160px', objectFit: 'cover', border: '4px solid #ffffff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }, animation: 'slideUp' } },
                    { id: `${id}-h`, type: 'Text', props: { content: 'Helping leaders build better companies.', size: 'lg', style: { fontFamily: 'Merriweather', fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1.2', color: '#0F172A' }, animation: 'slideUp' } },
                    { id: `${id}-p`, type: 'Text', props: { content: 'Bestselling author, executive coach, and investor. Join 50,000+ subscribers reading my weekly insights on leadership and growth.', size: 'md', customColor: '#475569', style: { fontSize: '1.25rem', lineHeight: '1.6' }, animation: 'slideUp' } },
                    {
                        id: `${id}-form`, type: 'Container', props: { style: { flexDirection: 'row', gap: '1rem', width: '100%', maxWidth: '500px', marginTop: '1rem' }, animation: 'slideUp' }, children: [
                            { id: `${id}-inp`, type: 'Button', props: { content: 'Enter your email address', variant: 'outline', size: 'lg', style: { flex: '1', textAlign: 'left', color: '#94A3B8', backgroundColor: '#ffffff', border: '1px solid #E2E8F0' } } },
                            { id: `${id}-btn`, type: 'Button', props: { content: 'Subscribe', variant: 'primary', size: 'lg', style: { backgroundColor: '#2563EB', color: '#ffffff' } } }
                        ]
                    }
                ]
            }
        ] as any[]
    };
}

function createAsSeenOn(): Section {
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
                props: { style: { padding: '4rem 0', textAlign: 'center', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', marginTop: '4rem' } },
                children: [
                    { id: `${id}-t`, type: 'Text', props: { content: 'AS FEATURED IN', size: 'sm', customColor: '#64748B', style: { letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '2rem' } } },
                    {
                        id: `${id}-logos`, type: 'Container', props: { style: { flexDirection: 'row', gap: '4rem', justifyContent: 'center', flexWrap: 'wrap', opacity: '0.6' } }, children: [
                            { id: `${id}-l1`, type: 'Text', props: { content: 'Forbes', size: 'lg', style: { fontFamily: 'Merriweather', fontWeight: 'bold', fontSize: '1.5rem', userSelect: 'none' } } },
                            { id: `${id}-l2`, type: 'Text', props: { content: 'TechCrunch', size: 'lg', style: { fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '-0.05em', userSelect: 'none' } } },
                            { id: `${id}-l3`, type: 'Text', props: { content: 'THE WALL STREET JOURNAL.', size: 'lg', style: { fontFamily: 'Merriweather', fontSize: '1.2rem', userSelect: 'none' } } },
                            { id: `${id}-l4`, type: 'Text', props: { content: 'WIRED', size: 'lg', style: { fontWeight: '900', letterSpacing: '0.1em', fontSize: '1.5rem', userSelect: 'none' } } }
                        ]
                    }
                ]
            }
        ] as any[]
    };
}

function createBioSplit(): Section {
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
            verticalAlign: 'top',
            backgroundType: 'transparent',
            animation: 'revealOnScroll'
        },
        elements: [
            {
                id: `${id}-txt`,
                type: 'Container',
                props: { style: { gap: '1.5rem', marginTop: '2rem', paddingRight: '2rem' } },
                children: [
                    { id: `${id}-h`, type: 'Text', props: { content: 'Hi, I\'m David.', size: 'lg', style: { fontFamily: 'Merriweather', fontSize: '2.5rem', fontWeight: 'bold', color: '#0F172A' } } },
                    { id: `${id}-p1`, type: 'Text', props: { content: 'For the last 15 years, I\'ve sat across the table from hundreds of founders, CEOs, and executive teams, helping them navigate the hardest parts of scaling a company.', size: 'md', style: { fontSize: '1.1rem', lineHeight: '1.8', color: '#334155' } } },
                    { id: `${id}-p2`, type: 'Text', props: { content: 'My philosophy is simple: businesses don\'t grow, people do. If you want to build a better company, you have to start by building better leaders.', size: 'md', style: { fontSize: '1.1rem', lineHeight: '1.8', color: '#334155', fontWeight: '600' } } },
                    { id: `${id}-p3`, type: 'Text', props: { content: 'Through my books, courses, and private advisory practice, I share the frameworks and mental models that actually work in the real world.', size: 'md', style: { fontSize: '1.1rem', lineHeight: '1.8', color: '#334155' } } },
                    { id: `${id}-sig`, type: 'Text', props: { content: 'David Reynolds', size: 'md', style: { fontFamily: 'Merriweather', fontStyle: 'italic', fontSize: '1.5rem', marginTop: '2rem', color: '#2563EB' } } }
                ]
            },
            {
                id: `${id}-img`,
                type: 'Image',
                props: { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1200', roundedCorners: 'slight', style: { height: '600px', width: '100%', objectFit: 'cover' } }
            }
        ] as any[]
    };
}

function createBooksGrid(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Features",
        isLocked: false,
        layout: {
            width: 'contained',
            padding: 'spacious',
            columns: { desktop: 2, mobile: 1 },
            columnGap: 'lg',
            verticalAlign: 'top',
            backgroundType: 'solid', // slightly off-white contrast
            animation: 'staggerChildren'
        },
        elements: [
            {
                id: `${id}-h`, type: 'Container', props: { style: { gridColumn: '1 / -1', textAlign: 'center', marginBottom: '3rem' } }, children: [
                    { id: `${id}-ht`, type: 'Text', props: { content: 'LATEST BOOKS', size: 'sm', customColor: '#2563EB', style: { letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '1rem' } } },
                    { id: `${id}-hm`, type: 'Text', props: { content: 'Read by over 1M leaders', size: 'lg', style: { fontFamily: 'Merriweather', fontSize: '2.5rem', fontWeight: 'bold' } } }
                ]
            },
            {
                id: `${id}-b1`, type: 'Container', props: { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' } }, children: [
                    { id: `${id}-b1i`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800', roundedCorners: 'slight', style: { width: '100%', height: '400px', objectFit: 'cover' }, animation: 'revealOnScroll' } },
                    { id: `${id}-b1h`, type: 'Text', props: { content: 'The Scale Mindset', size: 'lg', style: { fontFamily: 'Merriweather', fontSize: '1.8rem', fontWeight: 'bold' } } },
                    { id: `${id}-b1stars`, type: 'Text', props: { content: '★★★★★ 4.9 on Amazon', size: 'sm', customColor: '#D97706', style: { fontWeight: 'bold' } } },
                    { id: `${id}-b1btn`, type: 'Button', props: { content: 'Buy on Amazon', variant: 'outline', size: 'md', style: { width: 'fit-content' } } }
                ]
            },
            {
                id: `${id}-b2`, type: 'Container', props: { style: { display: 'flex', flexDirection: 'column', gap: '1.5rem' } }, children: [
                    { id: `${id}-b2i`, type: 'Image', props: { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800', roundedCorners: 'slight', style: { width: '100%', height: '400px', objectFit: 'cover' }, animation: 'revealOnScroll' } },
                    { id: `${id}-b2h`, type: 'Text', props: { content: 'Leading Through Chaos', size: 'lg', style: { fontFamily: 'Merriweather', fontSize: '1.8rem', fontWeight: 'bold' } } },
                    { id: `${id}-b2stars`, type: 'Text', props: { content: '★★★★★ 4.8 on Amazon', size: 'sm', customColor: '#D97706', style: { fontWeight: 'bold' } } },
                    { id: `${id}-b2btn`, type: 'Button', props: { content: 'Buy on Amazon', variant: 'outline', size: 'md', style: { width: 'fit-content' } } }
                ]
            }
        ] as any[]
    };
}

function createTestimonialBlock(): Section {
    const id = uuidv4();
    return {
        id,
        type: "Hero", // Single large quote
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
                id: `${id}-w`,
                type: 'Container',
                props: { style: { padding: '8rem 4rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto' } },
                children: [
                    { id: `${id}-q`, type: 'Text', props: { content: '"', size: 'lg', customColor: '#93C5FD', style: { fontFamily: 'Merriweather', fontSize: '6rem', lineHeight: '0', height: '3rem' } } },
                    { id: `${id}-txt`, type: 'Text', props: { content: 'David\'s frameworks fundamentally changed how our executive team operates. We went from burning cash and missing targets to our first profitable quarter in just 6 months. He is the real deal.', size: 'lg', style: { fontFamily: 'Merriweather', fontSize: '2rem', lineHeight: '1.6', color: '#0F172A', marginBottom: '2rem' } } },
                    { id: `${id}-name`, type: 'Text', props: { content: 'Jessica Chen', size: 'md', style: { fontWeight: 'bold', fontSize: '1.1rem' } } },
                    { id: `${id}-title`, type: 'Text', props: { content: 'CEO at FinTech Innovators', size: 'sm', customColor: '#64748B' } }
                ]
            }
        ] as any[]
    };
}

function createNewsletterCapture(): Section {
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
            backgroundType: 'solid',
            animation: 'fadeIn'
        },
        elements: [
            {
                id: `${id}-w`,
                type: 'Container',
                props: { style: { padding: '6rem 2rem', alignItems: 'center', textAlign: 'center', maxWidth: '800px', margin: '0 auto' } },
                children: [
                    { id: `${id}-h`, type: 'Text', props: { content: 'Join 50,000+ Leaders', size: 'lg', style: { fontFamily: 'Merriweather', fontSize: '3rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1rem' } } },
                    { id: `${id}-p`, type: 'Text', props: { content: 'Get my most potent insights delivered to your inbox every Sunday morning. No spam, ever.', size: 'md', customColor: '#94A3B8', style: { fontSize: '1.25rem', marginBottom: '3rem' } } },
                    {
                        id: `${id}-form`, type: 'Container', props: { style: { flexDirection: 'row', gap: '1rem', width: '100%', maxWidth: '600px', justifyContent: 'center' } }, children: [
                            { id: `${id}-inp`, type: 'Button', props: { content: 'Enter your email address', variant: 'outline', size: 'lg', style: { flex: '1', textAlign: 'left', color: '#94A3B8', backgroundColor: '#1E293B', borderColor: '#334155', height: '3.5rem' } } },
                            { id: `${id}-btn`, type: 'Button', props: { content: 'Subscribe', variant: 'primary', size: 'lg', style: { backgroundColor: '#2563EB', color: '#ffffff', height: '3.5rem', padding: '0 2rem' } } }
                        ]
                    }
                ]
            }
        ] as any[]
    };
}
