export type LanguageCode = 'en' | 'he' | 'ar';

export const translations = {
    en: {
        signIn: "Sign In",
        signOut: "Sign Out",
        
        // Landing Page
        heroTitle1: "Build websites with AI. ",
        heroSubtitle: "Describe your dream website and let AI build it for you in seconds. No coding required. Just your imagination.",
        inputPlaceholder: 'Describe your website...\ne.g. "A portfolio for Bloom Studio, a creative photography agency with a dark theme"',
        inputWaitPlaceholder: "Synthesizing magic...",
        
        // AI Analyzing Modal
        analyzingDesc: "Analyzing your description",
        analyzingBus: "Understanding your business...",
        analyzingAud: "Identifying target audience...",
        analyzingStyle: "Choosing the perfect style...",
        analyzingColor: "Selecting color palette...",
        analyzingPages: "Mapping out your pages...",
        analyzingFinal: "Preparing your questionnaire...",
        
        // Builder Chat Bar
        chatPlaceholder: "Ask AI to edit this page...",
        chatWaitPlaceholder: "Synthesizing magic...",
        applyChanges: "Apply Changes",
        discard: "Discard"
    },
    he: {
        signIn: "התחבר",
        signOut: "התנתק",
        
        // Landing Page
        heroTitle1: "בנה אתרי אינטרנט עם בינה מלאכותית. ",
        heroSubtitle: "תאר את אתר החלומות שלך ותן לבינה המלאכותית לבנות אותו עבורך בשניות. ללא צורך בקידוד. רק הדמיון שלך.",
        inputPlaceholder: 'תאר את האתר שלך...\nלדוגמה "תיק עבודות לסטודיו בלום, סוכנות צילום קריאייטיב עם נושא כהה"',
        inputWaitPlaceholder: "מסנתז קסם...",
        
        // AI Analyzing Modal
        analyzingDesc: "מנתח את התיאור שלך",
        analyzingBus: "מבין את העסק שלך...",
        analyzingAud: "מזהה קהל יעד...",
        analyzingStyle: "בוחר את הסגנון המושלם...",
        analyzingColor: "בוחר פלטת צבעים...",
        analyzingPages: "ממפה את הדפים שלך...",
        analyzingFinal: "מכין את השאלון שלך...",
        
        // Builder Chat Bar
        chatPlaceholder: "בקש מהבינה המלאכותית לערוך את הדף הזה...",
        chatWaitPlaceholder: "מסנתז קסם...",
        applyChanges: "החל שינויים",
        discard: "בטל"
    },
    ar: {
        signIn: "تسجيل الدخول",
        signOut: "تسجيل الخروج",
        
        // Landing Page
        heroTitle1: "قم ببناء مواقع الويب باستخدام الذكاء الاصطناعي. ",
        heroSubtitle: "صف موقع أحلامك ودع الذكاء الاصطناعي يبنيه لك في ثوان. لا حاجة للبرمجة. فقط خيالك.",
        inputPlaceholder: 'صف موقعك...\nعلى سبيل المثال "موقع شخصي لاستوديو بلوم، وكالة تصوير إبداعي بمظهر داكن"',
        inputWaitPlaceholder: "جاري تكوين السحر...",
        
        // AI Analyzing Modal
        analyzingDesc: "جاري تحليل وصفك",
        analyzingBus: "فهم عملك...",
        analyzingAud: "تحديد الجمهور المستهدف...",
        analyzingStyle: "اختيار الأسلوب المثالي...",
        analyzingColor: "تحديد لوحة الألوان...",
        analyzingPages: "رسم خرائط صفحاتك...",
        analyzingFinal: "إعداد الاستبيان الخاص بك...",
        
        // Builder Chat Bar
        chatPlaceholder: "اطلب من الذكاء الاصطناعي تعديل هذه الصفحة...",
        chatWaitPlaceholder: "جاري تكوين السحر...",
        applyChanges: "تطبيق التغييرات",
        discard: "إلغاء"
    }
};

export function getTranslation(lang: 'auto' | LanguageCode, key: keyof typeof translations['en']): string {
    const activeLang = lang === 'auto' ? 'en' : lang;
    return translations[activeLang]?.[key] || translations['en'][key];
}
