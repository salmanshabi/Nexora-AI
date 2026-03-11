import { v4 as uuidv4 } from 'uuid';
import { AppStateSnapshot } from '../builder/store/types';

import { getSaasTemplate } from './layouts/saas';
import { getCreativeTemplate } from './layouts/creative';
import { getEcommerceTemplate } from './layouts/ecommerce';
import { getRestaurantTemplate } from './layouts/restaurant';
import { getAgencyTemplate } from './layouts/agency';
import { getPersonalTemplate } from './layouts/personal';

export const getTemplateState = (templateId: string): Partial<AppStateSnapshot> | null => {
    // Blank Canvas Fallback
    if (templateId === 'blank') {
        const id = uuidv4();
        return {
            pages: [{
                id: "home",
                title: "Home",
                slug: "/",
                isHiddenInNav: false,
                seo: { metaTitle: "Home", metaDescription: "" },
                sections: [{
                    id: `hero-${id}`,
                    type: "Hero",
                    isLocked: false,
                    layout: {
                        width: 'contained',
                        padding: 'default',
                        columns: { desktop: 1 },
                        columnGap: 'md',
                        verticalAlign: 'center',
                        backgroundType: 'transparent',
                        animation: 'none'
                    },
                    content: { title: "Start Exploring", subtitle: "", buttonText: "" },
                    elements: []
                }]
            }]
        };
    }

    // Map Template IDs to Layout Generators
    if (templateId === 'landing-1' || templateId === 'inspire-1' || templateId === 'saas') {
        return getSaasTemplate();
    }

    if (templateId === 'portfolio-1' || templateId === 'inspire-3' || templateId === 'creative') {
        return getCreativeTemplate();
    }

    if (templateId === 'ecommerce-1' || templateId === 'inspire-2' || templateId === 'store' || templateId === 'ecommerce') {
        return getEcommerceTemplate();
    }

    if (templateId === 'restaurant') {
        return getRestaurantTemplate();
    }

    if (templateId === 'agency') {
        return getAgencyTemplate();
    }

    if (templateId === 'personal') {
        return getPersonalTemplate();
    }

    return null;
};
