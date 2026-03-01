export type ElementType = 'Text' | 'Button' | 'Image' | 'Icon' | 'Container' | 'FeatureCard';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface ResponsiveValue<T> {
    desktop: T;
    tablet?: T;
    mobile?: T;
}

export interface AdvancedTokens {
    spacingScale: 'compact' | 'default' | 'spacious';
    shadowStyle: 'none' | 'soft' | 'glow' | 'harsh';
    buttonSystem: {
        roundness: 'sharp' | 'slight' | 'pill';
        hoverStyle: 'scale' | 'glow' | 'shadow' | 'none';
    };
    containerWidth: 'narrow' | 'standard' | 'wide' | 'fluid';
}

export interface DesignTokens {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
    };
    typography: {
        headingFont: string;
        bodyFont: string;
        baseSizeMultiplier: number;
    };
    spacing: "tight" | "comfortable" | "spacious";
    roundness: "sharp" | "slight" | "pill";
    shadows: "none" | "soft" | "harsh";
    advanced?: AdvancedTokens; // Phase 5 addition
}

export interface ElementProps {
    // Content
    content?: string;
    url?: string;
    openInNewTab?: boolean;
    altText?: string;

    // Style Overrides (If undefined, inherit from global tokens)
    customColor?: string;
    customBg?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    textAlign?: ResponsiveValue<'left' | 'center' | 'right'>;

    // Advanced Styles
    fullWidth?: boolean;
    roundedCorners?: 'inherit' | 'sharp' | 'slight' | 'pill' | 'full';
    animation?: 'none' | 'fadeIn' | 'slideUp' | 'slideLeft' | 'revealOnScroll' | 'staggerChildren';
    objectFit?: 'cover' | 'contain' | 'fill';
    overlayColor?: string;
    overlayOpacity?: number;
    style?: Record<string, string>; // Custom CSS value mappings (width, height, margin, padding, etc.)

    // Visibility
    hideOnDesktop?: boolean;
    hideOnMobile?: boolean;
}

export interface ElementNode {
    id: string;
    type: ElementType;
    props: ElementProps;
    children?: ElementNode[];
}

export interface SectionLayoutControls {
    width: 'contained' | 'full';
    padding: 'compact' | 'default' | 'spacious' | 'custom';
    columns: ResponsiveValue<1 | 2 | 3 | 4>;
    columnGap: 'none' | 'sm' | 'md' | 'lg';
    verticalAlign: 'top' | 'center' | 'bottom';
    reverseOnMobile?: boolean;
    backgroundType: 'transparent' | 'solid' | 'gradient' | 'image';
    backgroundImageUrl?: string; // Phase 4 carryover
    animation: 'none' | 'fadeIn' | 'slideUp' | 'slideLeft' | 'revealOnScroll' | 'staggerChildren';
}

export interface Section {
    id: string;
    type: "Hero" | "Features" | "CallToAction" | "Text" | string;
    isLocked: boolean;
    layout: SectionLayoutControls;
    // Legacy content string map (will be phased out)
    content?: Record<string, unknown>;
    // UX 3.0 Nested Elements Tree
    elements?: ElementNode[];
}

export interface PageData {
    id: string;
    title: string;
    slug: string;
    isHiddenInNav: boolean;
    seo: {
        metaTitle: string;
        metaDescription: string;
    };
    sections: Section[];
}

export interface AppStateSnapshot {
    websiteProps: {
        name: string;
        logoUrl?: string;
    };
    tokens: DesignTokens;
    pages: PageData[];
}
