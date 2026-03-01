# i18n Hebrew & Arabic Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire the existing language toggle to actually switch the entire website UI between English, Hebrew (RTL), and Arabic (RTL).

**Architecture:** A React Context (`LanguageContext`) holds the active language globally and updates `document.documentElement.lang` + `document.documentElement.dir` via `useEffect`. All string content lives in `app/translations/index.ts`. Each page/component reads from context via a `useLanguage` hook.

**Tech Stack:** Next.js App Router, React Context API, TypeScript — zero new dependencies.

---

### Task 1: Create LanguageContext

**Files:**
- Create: `nexora/app/context/LanguageContext.tsx`

**Step 1: Create the file**

```tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Lang = "en" | "he" | "ar";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
```

**Step 2: Verify file created at `nexora/app/context/LanguageContext.tsx`**

---

### Task 2: Create translations file

**Files:**
- Create: `nexora/app/translations/index.ts`

**Step 1: Create the file with all strings for en/he/ar**

```ts
export const translations = {
  en: {
    nav: { about: "About", pricing: "Pricing" },
    auth: { signIn: "Sign In", signOut: "Sign Out" },
    footer: { rights: "© 2025 Nexora. All rights reserved." },
    home: {
      headline: "Build websites with AI.",
      subtitle:
        "Describe your dream website and let AI build it for you in seconds.\nNo coding required. Just your imagination.",
      placeholder:
        'Describe your website...\ne.g. "A portfolio for Bloom Studio, a creative photography agency with a dark theme"',
      analyzingDescription: "Analyzing your description",
      analyzingBusiness: "Analyzing your business",
      tags: [
        { label: "Portfolio", icon: "🖼️" },
        { label: "Landing Page", icon: "🚀" },
        { label: "Online Store", icon: "🛒" },
        { label: "Blog", icon: "✍️" },
        { label: "Restaurant", icon: "🍽️" },
      ],
      questions: [
        {
          id: "businessName",
          question: "What is your business or project name?",
          placeholder: "e.g. Bloom Studio",
        },
        {
          id: "businessDescription",
          question: "Describe your business in a few words",
          placeholder:
            "e.g. A boutique coffee shop in downtown Austin specializing in single-origin beans",
          textarea: true,
        },
        {
          id: "audienceGender",
          question: "Who is your target audience?",
          subtitle: "Select all that apply",
          options: ["Men", "Women", "Teens", "Children", "Elderly", "Everyone"],
          multi: true,
        },
        {
          id: "audienceAge",
          question: "What age range are you targeting?",
          options: [
            "Under 18",
            "18–24",
            "25–34",
            "35–44",
            "45–54",
            "55+",
            "All Ages",
          ],
          multi: true,
        },
        {
          id: "style",
          question: "What style or vibe do you want?",
          options: [
            "Minimal",
            "Bold",
            "Elegant",
            "Playful",
            "Corporate",
            "Futuristic",
          ],
        },
        {
          id: "colors",
          question: "Pick a color palette",
          colorPalette: true,
          options: [
            "Ocean",
            "Sunset",
            "Forest",
            "Midnight",
            "Berry",
            "Minimal",
            "Warm",
            "Neon",
            "Earth",
            "Pastel",
            "Monochrome",
            "Candy",
          ],
        },
        {
          id: "pages",
          question: "What pages do you need?",
          options: [
            "Home",
            "About",
            "Pricing",
            "Contact",
            "Blog",
            "Gallery",
            "Shop",
            "FAQ",
          ],
          multi: true,
        },
      ],
      messages: {
        readingDescription: "Reading your description...",
        analyzingImages: "Analyzing uploaded images...",
        processingCamera: "Processing camera captures...",
        scanningDocs: "Scanning attached documents...",
        extractingInsights: "Extracting insights from linked pages...",
        readingGDrive: "Reading Google Drive files...",
        extractingFiles: "Extracting insights from files...",
        understandingVision: "Understanding your vision...",
        identifyingAudience: "Identifying target audience...",
        choosingStyle: "Choosing the perfect style...",
        selectingPalette: "Selecting color palette...",
        mappingPages: "Mapping out your pages...",
        preparingQuestionnaire: "Preparing your questionnaire...",
        understandingBusiness: "Understanding your business...",
        finalizingSuggestions: "Finalizing suggestions...",
      },
    },
    about: {
      heading: "About",
      subtitle:
        "Nexora is an AI-powered website builder that lets anyone create stunning, professional websites in minutes — no coding required. Just describe what you want, and our AI builds it for you.",
      howItWorks: "How It Works",
      steps: [
        {
          step: "01",
          title: "Describe Your Vision",
          desc: "Tell the AI what kind of website you want. A portfolio, a landing page, an online store — anything.",
        },
        {
          step: "02",
          title: "AI Generates It",
          desc: "Nexora's AI instantly builds your website with professional layouts, content, and styling.",
        },
        {
          step: "03",
          title: "Customize & Launch",
          desc: "Tweak anything you want with simple controls, then publish your site to the world.",
        },
      ],
      ourMission: "Our Mission",
      missionText:
        "To make website creation accessible to everyone. Whether you're a startup founder, a freelancer, or a small business owner — you shouldn't need to code to have a great website.",
      whyNexora: "Why Nexora?",
      values: [
        {
          icon: "🤖",
          title: "AI-Powered",
          desc: "Our AI understands your needs and generates websites tailored to your brand and goals.",
        },
        {
          icon: "⚡",
          title: "Lightning Fast",
          desc: "Go from idea to live website in minutes, not weeks. No waiting for developers.",
        },
        {
          icon: "🎨",
          title: "No Code Needed",
          desc: "Just describe what you want in plain language. The AI handles the design and code.",
        },
      ],
      stats: [
        { number: "10K+", label: "Websites Built" },
        { number: "50+", label: "Countries" },
        { number: "<60s", label: "Avg Build Time" },
      ],
      cta: {
        heading: "Ready to build your website?",
        sub: "Let AI do the heavy lifting. Your website is one prompt away.",
        button: "Get Started Free",
      },
    },
    pricing: {
      heading: "Pricing",
      sub: "Simple, transparent pricing. Coming soon.",
    },
    signIn: {
      heading: "Sign in to",
      sub: "Welcome back. Choose your preferred sign-in method.",
      withGoogle: "Continue with Google",
      withMicrosoft: "Continue with Microsoft",
      or: "OR",
      email: "Email",
      password: "Password",
      button: "Sign In",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
    },
    signUp: {
      heading: "Create your",
      headingBrand: "account",
      sub: "Get started for free. No credit card required.",
      withGoogle: "Continue with Google",
      withMicrosoft: "Continue with Microsoft",
      or: "OR",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password",
      validMin: "8+ characters",
      validUpper: "Uppercase letter",
      validLower: "Lowercase letter",
      validNum: "Number",
      mismatch: "Passwords do not match. Please try again.",
      match: "✓ Passwords match",
      button: "Create Account",
      hasAccount: "Already have an account?",
      signIn: "Sign in",
    },
  },
  he: {
    nav: { about: "אודות", pricing: "תמחור" },
    auth: { signIn: "התחברות", signOut: "התנתקות" },
    footer: { rights: "© 2025 Nexora. כל הזכויות שמורות." },
    home: {
      headline: "בנה אתרים עם AI.",
      subtitle:
        "תאר את אתר החלומות שלך ותן ל-AI לבנות אותו תוך שניות.\nללא קידוד. רק הדמיון שלך.",
      placeholder: "תאר את האתר שלך...\nלדוגמה: \"פורטפוליו ל-Bloom Studio, סוכנות צילום יצירתית עם ערכת צבעים כהה\"",
      analyzingDescription: "מנתח את התיאור שלך",
      analyzingBusiness: "מנתח את העסק שלך",
      tags: [
        { label: "פורטפוליו", icon: "🖼️" },
        { label: "דף נחיתה", icon: "🚀" },
        { label: "חנות אונליין", icon: "🛒" },
        { label: "בלוג", icon: "✍️" },
        { label: "מסעדה", icon: "🍽️" },
      ],
      questions: [
        {
          id: "businessName",
          question: "מה שם העסק או הפרויקט שלך?",
          placeholder: "לדוגמה: Bloom Studio",
        },
        {
          id: "businessDescription",
          question: "תאר את העסק שלך במספר מילים",
          placeholder: "לדוגמה: בית קפה בוטיק במרכז תל אביב המתמחה בקפה מקור יחיד",
          textarea: true,
        },
        {
          id: "audienceGender",
          question: "מי קהל היעד שלך?",
          subtitle: "בחר את כל המתאים",
          options: ["גברים", "נשים", "בני נוער", "ילדים", "קשישים", "כולם"],
          multi: true,
        },
        {
          id: "audienceAge",
          question: "לאיזה טווח גיל אתה פונה?",
          options: [
            "מתחת ל-18",
            "18–24",
            "25–34",
            "35–44",
            "45–54",
            "55+",
            "כל הגילאים",
          ],
          multi: true,
        },
        {
          id: "style",
          question: "איזה סגנון או אווירה אתה רוצה?",
          options: [
            "מינימלי",
            "נועז",
            "אלגנטי",
            "משובב",
            "ארגוני",
            "עתידני",
          ],
        },
        {
          id: "colors",
          question: "בחר פלטת צבעים",
          colorPalette: true,
          options: [
            "אוקיינוס",
            "שקיעה",
            "יער",
            "חצות",
            "פירות יער",
            "מינימלי",
            "חמים",
            "ניאון",
            "אדמה",
            "פסטל",
            "מונוכרום",
            "ממתק",
          ],
        },
        {
          id: "pages",
          question: "אילו עמודים אתה צריך?",
          options: [
            "בית",
            "אודות",
            "תמחור",
            "צור קשר",
            "בלוג",
            "גלריה",
            "חנות",
            "שאלות נפוצות",
          ],
          multi: true,
        },
      ],
      messages: {
        readingDescription: "קורא את התיאור שלך...",
        analyzingImages: "מנתח תמונות שהועלו...",
        processingCamera: "מעבד צילומי מצלמה...",
        scanningDocs: "סורק מסמכים מצורפים...",
        extractingInsights: "מחלץ תובנות מדפים מקושרים...",
        readingGDrive: "קורא קבצים מ-Google Drive...",
        extractingFiles: "מחלץ תובנות מקבצים...",
        understandingVision: "מבין את החזון שלך...",
        identifyingAudience: "מזהה קהל יעד...",
        choosingStyle: "בוחר את הסגנון המושלם...",
        selectingPalette: "בוחר פלטת צבעים...",
        mappingPages: "ממפה את העמודים שלך...",
        preparingQuestionnaire: "מכין את השאלון שלך...",
        understandingBusiness: "מבין את העסק שלך...",
        finalizingSuggestions: "מסיים הצעות...",
      },
    },
    about: {
      heading: "אודות",
      subtitle:
        "Nexora הוא בונה אתרים מבוסס בינה מלאכותית שמאפשר לכל אחד ליצור אתרים מדהימים ומקצועיים תוך דקות – ללא קידוד. פשוט תאר מה אתה רוצה, והבינה המלאכותית שלנו תבנה אותו עבורך.",
      howItWorks: "איך זה עובד",
      steps: [
        {
          step: "01",
          title: "תאר את החזון שלך",
          desc: "ספר ל-AI איזה סוג אתר אתה רוצה. פורטפוליו, דף נחיתה, חנות אונליין — כל דבר.",
        },
        {
          step: "02",
          title: "ה-AI מייצר אותו",
          desc: "Nexora AI בונה מיד את האתר שלך עם פריסות, תוכן ועיצוב מקצועיים.",
        },
        {
          step: "03",
          title: "התאם אישית והשק",
          desc: "שנה כל מה שתרצה עם פקדים פשוטים, ואז פרסם את האתר שלך לעולם.",
        },
      ],
      ourMission: "המשימה שלנו",
      missionText:
        "להנגיש יצירת אתרים לכולם. בין אם אתה מייסד סטארטאפ, פרילנסר, או בעל עסק קטן – אתה לא צריך לדעת לקודד כדי שיהיה לך אתר מעולה.",
      whyNexora: "למה Nexora?",
      values: [
        {
          icon: "🤖",
          title: "מבוסס AI",
          desc: "ה-AI שלנו מבין את הצרכים שלך ויוצר אתרים המותאמים למותג ולמטרות שלך.",
        },
        {
          icon: "⚡",
          title: "מהיר כברק",
          desc: "מרעיון לאתר חי תוך דקות, לא שבועות. ללא המתנה למפתחים.",
        },
        {
          icon: "🎨",
          title: "ללא קוד",
          desc: "פשוט תאר מה אתה רוצה בשפה פשוטה. ה-AI מטפל בעיצוב ובקוד.",
        },
      ],
      stats: [
        { number: "10K+", label: "אתרים שנבנו" },
        { number: "50+", label: "מדינות" },
        { number: "<60s", label: "זמן בנייה ממוצע" },
      ],
      cta: {
        heading: "מוכן לבנות את האתר שלך?",
        sub: "תן ל-AI לעשות את העבודה הכבדה. האתר שלך במרחק פרומפט אחד.",
        button: "התחל בחינם",
      },
    },
    pricing: {
      heading: "תמחור",
      sub: "תמחור פשוט ושקוף. בקרוב.",
    },
    signIn: {
      heading: "התחבר ל",
      sub: "ברוך שובך. בחר את שיטת ההתחברות המועדפת עליך.",
      withGoogle: "המשך עם Google",
      withMicrosoft: "המשך עם Microsoft",
      or: "או",
      email: "אימייל",
      password: "סיסמה",
      button: "התחבר",
      noAccount: "אין לך חשבון?",
      signUp: "הירשם",
    },
    signUp: {
      heading: "צור את חשבון",
      headingBrand: "שלך",
      sub: "התחל בחינם. לא נדרש כרטיס אשראי.",
      withGoogle: "המשך עם Google",
      withMicrosoft: "המשך עם Microsoft",
      or: "או",
      firstName: "שם פרטי",
      lastName: "שם משפחה",
      email: "אימייל",
      phone: "מספר טלפון",
      password: "סיסמה",
      confirmPassword: "אישור סיסמה",
      validMin: "8+ תווים",
      validUpper: "אות גדולה",
      validLower: "אות קטנה",
      validNum: "ספרה",
      mismatch: "הסיסמאות אינן תואמות. נסה שוב.",
      match: "✓ הסיסמאות תואמות",
      button: "צור חשבון",
      hasAccount: "כבר יש לך חשבון?",
      signIn: "התחבר",
    },
  },
  ar: {
    nav: { about: "من نحن", pricing: "الأسعار" },
    auth: { signIn: "تسجيل الدخول", signOut: "تسجيل الخروج" },
    footer: { rights: "© 2025 Nexora. جميع الحقوق محفوظة." },
    home: {
      headline: "أنشئ مواقع ويب بالذكاء الاصطناعي.",
      subtitle:
        "صف موقع أحلامك ودع الذكاء الاصطناعي يبنيه في ثوانٍ.\nلا حاجة للبرمجة. فقط خيالك.",
      placeholder: "صف موقعك الإلكتروني...\nمثال: \"موقع معرض أعمال لـ Bloom Studio، وكالة تصوير إبداعية بتصميم داكن\"",
      analyzingDescription: "جارٍ تحليل وصفك",
      analyzingBusiness: "جارٍ تحليل عملك",
      tags: [
        { label: "معرض أعمال", icon: "🖼️" },
        { label: "صفحة هبوط", icon: "🚀" },
        { label: "متجر إلكتروني", icon: "🛒" },
        { label: "مدونة", icon: "✍️" },
        { label: "مطعم", icon: "🍽️" },
      ],
      questions: [
        {
          id: "businessName",
          question: "ما اسم عملك أو مشروعك؟",
          placeholder: "مثال: Bloom Studio",
        },
        {
          id: "businessDescription",
          question: "صف عملك في몇 كلمات",
          placeholder: "مثال: مقهى متخصص في وسط المدينة يتخصص في القهوة أحادية الأصل",
          textarea: true,
        },
        {
          id: "audienceGender",
          question: "من هو جمهورك المستهدف؟",
          subtitle: "اختر كل ما ينطبق",
          options: ["رجال", "نساء", "مراهقون", "أطفال", "كبار السن", "الجميع"],
          multi: true,
        },
        {
          id: "audienceAge",
          question: "ما الفئة العمرية التي تستهدفها؟",
          options: [
            "أقل من 18",
            "18–24",
            "25–34",
            "35–44",
            "45–54",
            "55+",
            "جميع الأعمار",
          ],
          multi: true,
        },
        {
          id: "style",
          question: "ما النمط أو الأجواء التي تريدها؟",
          options: [
            "بسيط",
            "جريء",
            "أنيق",
            "مرح",
            "مؤسسي",
            "مستقبلي",
          ],
        },
        {
          id: "colors",
          question: "اختر لوحة الألوان",
          colorPalette: true,
          options: [
            "المحيط",
            "الغروب",
            "الغابة",
            "منتصف الليل",
            "التوت",
            "بسيط",
            "دافئ",
            "نيون",
            "ترابي",
            "باستيل",
            "أحادي اللون",
            "حلوى",
          ],
        },
        {
          id: "pages",
          question: "ما الصفحات التي تحتاجها؟",
          options: [
            "الرئيسية",
            "من نحن",
            "الأسعار",
            "اتصل بنا",
            "مدونة",
            "معرض",
            "متجر",
            "الأسئلة الشائعة",
          ],
          multi: true,
        },
      ],
      messages: {
        readingDescription: "جارٍ قراءة وصفك...",
        analyzingImages: "جارٍ تحليل الصور المرفوعة...",
        processingCamera: "جارٍ معالجة صور الكاميرا...",
        scanningDocs: "جارٍ مسح المستندات المرفقة...",
        extractingInsights: "جارٍ استخراج الأفكار من الصفحات المرتبطة...",
        readingGDrive: "جارٍ قراءة ملفات Google Drive...",
        extractingFiles: "جارٍ استخراج الأفكار من الملفات...",
        understandingVision: "جارٍ فهم رؤيتك...",
        identifyingAudience: "جارٍ تحديد الجمهور المستهدف...",
        choosingStyle: "جارٍ اختيار النمط المثالي...",
        selectingPalette: "جارٍ اختيار لوحة الألوان...",
        mappingPages: "جارٍ تخطيط صفحاتك...",
        preparingQuestionnaire: "جارٍ تجهيز استبيانك...",
        understandingBusiness: "جارٍ فهم عملك...",
        finalizingSuggestions: "جارٍ الانتهاء من الاقتراحات...",
      },
    },
    about: {
      heading: "عن",
      subtitle:
        "Nexora هو منشئ مواقع يعمل بالذكاء الاصطناعي يتيح لأي شخص إنشاء مواقع رائعة واحترافية في دقائق — بدون أي برمجة. فقط صف ما تريده وسيبنيه ذكاؤنا الاصطناعي لك.",
      howItWorks: "كيف يعمل",
      steps: [
        {
          step: "01",
          title: "صف رؤيتك",
          desc: "أخبر الذكاء الاصطناعي بنوع الموقع الذي تريده. معرض أعمال، صفحة هبوط، متجر — أي شيء.",
        },
        {
          step: "02",
          title: "الذكاء الاصطناعي ينشئه",
          desc: "يبني Nexora AI موقعك فوراً بتصاميم ومحتوى احترافي.",
        },
        {
          step: "03",
          title: "خصص وأطلق",
          desc: "عدّل ما تريد بعناصر تحكم بسيطة، ثم انشر موقعك للعالم.",
        },
      ],
      ourMission: "مهمتنا",
      missionText:
        "جعل إنشاء المواقع متاحاً للجميع. سواء كنت مؤسس شركة ناشئة، أو مستقلاً، أو صاحب عمل صغير — لا ينبغي أن تحتاج إلى البرمجة لامتلاك موقع رائع.",
      whyNexora: "لماذا Nexora؟",
      values: [
        {
          icon: "🤖",
          title: "مدعوم بالذكاء الاصطناعي",
          desc: "يفهم ذكاؤنا الاصطناعي احتياجاتك وينشئ مواقع مصممة خصيصاً لعلامتك التجارية.",
        },
        {
          icon: "⚡",
          title: "سريع البرق",
          desc: "من الفكرة إلى موقع مباشر في دقائق وليس أسابيع. لا انتظار للمطورين.",
        },
        {
          icon: "🎨",
          title: "بدون برمجة",
          desc: "فقط صف ما تريده بلغة عادية. يتولى الذكاء الاصطناعي التصميم والكود.",
        },
      ],
      stats: [
        { number: "10K+", label: "مواقع تم بناؤها" },
        { number: "50+", label: "دول" },
        { number: "<60s", label: "متوسط وقت البناء" },
      ],
      cta: {
        heading: "هل أنت مستعد لبناء موقعك؟",
        sub: "دع الذكاء الاصطناعي يقوم بالعمل الشاق. موقعك على بعد خطوة.",
        button: "ابدأ مجاناً",
      },
    },
    pricing: {
      heading: "الأسعار",
      sub: "تسعير بسيط وشفاف. قريباً.",
    },
    signIn: {
      heading: "تسجيل الدخول إلى",
      sub: "مرحباً بعودتك. اختر طريقة تسجيل الدخول المفضلة لديك.",
      withGoogle: "المتابعة مع Google",
      withMicrosoft: "المتابعة مع Microsoft",
      or: "أو",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      button: "تسجيل الدخول",
      noAccount: "ليس لديك حساب؟",
      signUp: "إنشاء حساب",
    },
    signUp: {
      heading: "أنشئ حساب",
      headingBrand: "الخاص بك",
      sub: "ابدأ مجاناً. لا حاجة لبطاقة ائتمان.",
      withGoogle: "المتابعة مع Google",
      withMicrosoft: "المتابعة مع Microsoft",
      or: "أو",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      validMin: "8+ أحرف",
      validUpper: "حرف كبير",
      validLower: "حرف صغير",
      validNum: "رقم",
      mismatch: "كلمات المرور غير متطابقة. يرجى المحاولة مرة أخرى.",
      match: "✓ كلمات المرور متطابقة",
      button: "إنشاء حساب",
      hasAccount: "هل لديك حساب بالفعل؟",
      signIn: "تسجيل الدخول",
    },
  },
} as const;

export type Translations = typeof translations;
```

**Step 2: Verify file saved correctly**

---

### Task 3: Wire LanguageProvider into layout.tsx

**Files:**
- Modify: `nexora/app/layout.tsx`

The challenge: `layout.tsx` is a Server Component. Nav links "About"/"Pricing" must become a client component to read from context.

**Step 1: Create `NavLinks` client component**

Create `nexora/app/components/NavLinks.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function NavLinks() {
  const { lang } = useLanguage();
  const t = translations[lang].nav;
  return (
    <>
      <Link href="/about" className="text-gray-400 hover:text-cyan-400 transition">
        {t.about}
      </Link>
      <Link href="/pricing" className="text-gray-400 hover:text-cyan-400 transition">
        {t.pricing}
      </Link>
    </>
  );
}
```

**Step 2: Create `FooterText` client component**

Create `nexora/app/components/FooterText.tsx`:

```tsx
"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function FooterText() {
  const { lang } = useLanguage();
  return <p>{translations[lang].footer.rights}</p>;
}
```

**Step 3: Update `layout.tsx`**

Replace the full content of `nexora/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import SessionProvider from "./components/SessionProvider";
import NavAuth from "./components/NavAuth";
import LanguageToggle from "./components/LanguageToggle";
import NavLinks from "./components/NavLinks";
import FooterText from "./components/FooterText";
import { LanguageProvider } from "./context/LanguageContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexora",
  description: "Your all-in-one platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased bg-gray-950 text-white`}
      >
        <LanguageProvider>
          <SessionProvider>
            <nav className="relative z-50 flex items-center justify-between px-8 py-6 bg-transparent">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-8 w-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">
                  <line x1="7" y1="7" x2="25" y2="25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <line x1="25" y1="7" x2="7" y2="25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="7" cy="7" r="2.5" fill="currentColor" opacity="0.7" />
                  <circle cx="25" cy="7" r="2.5" fill="currentColor" opacity="0.7" />
                  <circle cx="7" cy="25" r="2.5" fill="currentColor" opacity="0.7" />
                  <circle cx="25" cy="25" r="2.5" fill="currentColor" opacity="0.7" />
                  <circle cx="16" cy="16" r="3.5" fill="currentColor" />
                  <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                </svg>
                Nexora
              </Link>
              <div className="flex items-center gap-6">
                <NavLinks />
                <LanguageToggle />
                <NavAuth />
              </div>
            </nav>
            {children}
            <footer className="border-t border-gray-800 bg-gray-950 px-8 py-8 text-center text-sm text-gray-600">
              <FooterText />
            </footer>
          </SessionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
```

---

### Task 4: Update LanguageToggle to use context

**Files:**
- Modify: `nexora/app/components/LanguageToggle.tsx`

Replace full content:

```tsx
"use client";

import { motion } from "framer-motion";
import { useLanguage, type Lang } from "@/app/context/LanguageContext";

const languages: { code: Lang; label: string; title: string }[] = [
  { code: "en", label: "Eng", title: "English" },
  { code: "he", label: "עב", title: "עברית" },
  { code: "ar", label: "ع", title: "العربية" },
];

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center bg-gray-900/50 backdrop-blur rounded-full p-1 border border-gray-800">
      {languages.map((language) => {
        const isActive = lang === language.code;
        return (
          <button
            key={language.code}
            onClick={() => setLang(language.code)}
            className={`relative text-sm font-medium px-4 py-1.5 rounded-full transition-colors duration-300 ${
              isActive
                ? "text-black"
                : "text-gray-400 transition-all hover:text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]"
            }`}
            title={language.title}
          >
            {isActive && (
              <motion.div
                layoutId="activeLang"
                className="absolute inset-0 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{language.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

---

### Task 5: Update NavAuth to use translations

**Files:**
- Modify: `nexora/app/components/NavAuth.tsx`

Replace full content:

```tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function NavAuth() {
  const { data: session, status } = useSession();
  const { lang } = useLanguage();
  const t = translations[lang].auth;

  if (status === "loading") {
    return <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-800" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="hidden text-sm text-gray-300 sm:inline">
          {session.user.name}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 hover:border-red-500 hover:text-red-400 transition-all duration-200"
        >
          {t.signOut}
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/sign-in"
      className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400 transition"
    >
      {t.signIn}
    </Link>
  );
}
```

---

### Task 6: Update home page (page.tsx)

**Files:**
- Modify: `nexora/app/page.tsx`

The home page has many hardcoded strings. The key changes:
1. Add `useLanguage` hook and get `t = translations[lang].home`
2. Replace hardcoded `const tags = [...]` with `t.tags` (use them as display-only; keep original English prompts for AI)
3. Replace hardcoded `const questions = [...]` with `t.questions`
4. Replace hardcoded headline, subtitle, placeholder, analyzing messages, and `paletteMap`

**Note about tags:** Tags have translated labels but the `prompts` array is only in English (used to seed the textarea for AI generation). Keep the prompts hardcoded in English and only use `t.tags` for the displayed label.

**Step 1: At the top of the component (after imports), add:**

```tsx
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
```

**Step 2: Inside the `Home()` component body, before the return, add:**

```tsx
const { lang } = useLanguage();
const t = translations[lang].home;
```

**Step 3: Replace the hardcoded `const questions = [...]` block (lines 67-122) with:**

```tsx
const questions = t.questions;
```

**Step 4: Replace the hardcoded `tags` usage in JSX**

The tags in JSX use `tag.label` and `tag.icon`. Replace the `tags.map(...)` JSX to use `t.tags` for labels/icons but keep the English prompts for the typePrompt call. Since the prompts are only in English in the translations, define a separate `tagPrompts` const before the component:

```tsx
// Keep at module level (not inside component), these seed the AI prompt in English
const tagPrompts: Record<string, string[]> = {
  Portfolio: [
    "A modern portfolio website for a photographer with a dark theme, full-screen gallery, and contact form",
    "A creative portfolio for a graphic designer with animated transitions, case studies, and a minimal layout",
    "A freelance developer portfolio with project showcases, tech stack badges, testimonials, and a blog section",
    "An artist portfolio with a masonry grid gallery, about page, exhibition timeline, and commission request form",
  ],
  "Landing Page": [
    "A sleek landing page for a tech startup with a hero section, feature highlights, pricing table, and signup form",
    "A product launch page for a fitness app with app screenshots, user reviews, download buttons, and a FAQ section",
    "A coming soon page for a new AI tool with an email waitlist, countdown timer, and feature preview cards",
    "A landing page for an online course platform with instructor bios, curriculum overview, and enrollment CTA",
  ],
  "Online Store": [
    "An online store for handmade jewelry with product grids, shopping cart, filters, and a clean checkout flow",
    "A streetwear clothing shop with lookbook gallery, size guide, wishlist feature, and new arrivals section",
    "A specialty coffee store with subscription plans, product reviews, brewing guides, and gift card options",
    "A vintage furniture store with category filters, room inspiration gallery, delivery info, and customer stories",
  ],
  Blog: [
    "A minimal blog for a travel writer with featured posts, categories, dark mode, and a newsletter signup",
    "A tech blog with syntax-highlighted code snippets, author profiles, reading time estimates, and search functionality",
    "A food blog with recipe cards, ingredient lists, cooking time filters, and a print-friendly layout",
    "A personal journal blog with mood-based tags, photo entries, archive calendar, and a clean reading experience",
  ],
  Restaurant: [
    "A restaurant website with a hero image, interactive menu, reservation booking, and customer reviews",
    "A sushi bar website with a visual menu, chef's story section, online ordering, and Instagram feed integration",
    "A pizza delivery site with a build-your-own pizza tool, combo deals, live order tracking, and loyalty rewards",
    "A fine dining website with tasting menu previews, wine pairing suggestions, private event booking, and a virtual tour",
  ],
};

// English tag keys for prompts lookup (consistent across locales)
const tagKeys = ["Portfolio", "Landing Page", "Online Store", "Blog", "Restaurant"];
```

**Step 5: Replace the tag JSX in the render:**

Find the `.map((tag) => { ... typePrompt(random) ... })` block and replace with:

```tsx
{t.tags.map((tag, idx) => {
  const englishKey = tagKeys[idx];
  const prompts = tagPrompts[englishKey] ?? [];
  return (
    <motion.span
      key={tag.label}
      onClick={() => {
        const random = prompts[Math.floor(Math.random() * prompts.length)];
        if (random) typePrompt(random);
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs backdrop-blur transition-all duration-300 border-gray-700 bg-gray-900/50 text-gray-400 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
    >
      <span>{tag.icon}</span>
      {tag.label}
    </motion.span>
  );
})}
```

**Step 6: Replace headline, subtitle, placeholder in JSX**

```tsx
// Replace "Build websites with AI." with:
{t.headline}{" "}
<span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
  Nexora
</span>

// Replace subtitle paragraph text with:
{t.subtitle}

// Replace textarea placeholder with:
placeholder={t.placeholder}
```

**Step 7: Replace hardcoded analyzing messages**

In `handleGenerate`, replace the hardcoded `messages` array:
```tsx
const messages = [
  t.messages.readingDescription,
  ...(hasImages ? [t.messages.analyzingImages] : []),
  ...(hasCamera ? [t.messages.processingCamera] : []),
  ...(hasDocs ? [t.messages.scanningDocs] : []),
  ...(hasUrls ? [t.messages.extractingInsights] : []),
  ...(hasGDrive ? [t.messages.readingGDrive] : []),
  ...(hasFiles ? [t.messages.extractingFiles] : []),
  t.messages.understandingVision,
  t.messages.identifyingAudience,
  t.messages.choosingStyle,
  t.messages.selectingPalette,
  t.messages.mappingPages,
  t.messages.preparingQuestionnaire,
];
```

In `handleNext` (the businessDescription analyze block), replace messages:
```tsx
const messages = [
  t.messages.readingDescription,
  t.messages.understandingBusiness,
  t.messages.identifyingAudience,
  t.messages.choosingStyle,
  t.messages.selectingPalette,
  t.messages.mappingPages,
  t.messages.finalizingSuggestions,
];
```

**Step 8: Replace JSX analyzing labels**

```tsx
// "Analyzing your description" span:
{t.analyzingDescription}

// "Analyzing your business" h3:
{t.analyzingBusiness}
```

---

### Task 7: Update about/page.tsx

**Files:**
- Modify: `nexora/app/about/page.tsx`

Add `"use client"` directive is already there. Replace with:

```tsx
"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function About() {
  const { lang } = useLanguage();
  const t = translations[lang].about;

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-5xl font-bold text-white"
        >
          {t.heading} <span className="text-cyan-400">Nexora</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-6 max-w-2xl text-lg text-gray-400"
        >
          {t.subtitle}
        </motion.p>
      </section>

      {/* How It Works */}
      <section className="border-t border-gray-800 bg-gray-900/50 px-8 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold text-white"
          >
            {t.howItWorks}
          </motion.h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {t.steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center"
              >
                <span className="text-sm font-bold text-cyan-400">{item.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-gray-800 px-8 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold text-white"
          >
            {t.ourMission}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-6 text-center text-lg text-gray-400"
          >
            {t.missionText}
          </motion.p>
        </div>
      </section>

      {/* Why Nexora */}
      <section className="border-t border-gray-800 bg-gray-900/50 px-8 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="text-center text-3xl font-bold text-white"
          >
            {t.whyNexora}
          </motion.h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {t.values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center"
              >
                <div className="text-4xl">{value.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-white">{value.title}</h3>
                <p className="mt-2 text-gray-500">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-800 px-8 py-20">
        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
          {t.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-cyan-400">{stat.number}</p>
              <p className="mt-2 text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800 bg-gray-900/50 px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-3xl font-bold text-white">{t.cta.heading}</h2>
          <p className="mt-4 text-gray-400">{t.cta.sub}</p>
          <a
            href="/sign-up"
            className="mt-8 rounded-lg bg-cyan-500 px-8 py-3 font-semibold text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-200"
          >
            {t.cta.button}
          </a>
        </motion.div>
      </section>
    </div>
  );
}
```

---

### Task 8: Update pricing/page.tsx

**Files:**
- Modify: `nexora/app/pricing/page.tsx`

Replace full content:

```tsx
"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function Pricing() {
  const { lang } = useLanguage();
  const t = translations[lang].pricing;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950">
      <h1 className="text-4xl font-bold text-white">{t.heading}</h1>
      <p className="mt-4 text-lg text-gray-400">{t.sub}</p>
    </div>
  );
}
```

---

### Task 9: Update sign-in/page.tsx

**Files:**
- Modify: `nexora/app/sign-in/page.tsx`

Replace full content:

```tsx
"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function SignIn() {
  const { lang } = useLanguage();
  const t = translations[lang].signIn;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8"
      >
        <h1 className="text-center text-2xl font-bold text-white">
          {t.heading} <span className="text-cyan-400">Nexora</span>
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">{t.sub}</p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-medium text-white hover:border-gray-600 hover:bg-gray-750 transition-all duration-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t.withGoogle}
          </button>
          <button
            onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-medium text-white hover:border-gray-600 hover:bg-gray-750 transition-all duration-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            {t.withMicrosoft}
          </button>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-700" />
          <span className="text-xs text-gray-500">{t.or}</span>
          <div className="h-px flex-1 bg-gray-700" />
        </div>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              {t.email}
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              {t.password}
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-200"
          >
            {t.button}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {t.noAccount}{" "}
          <Link href="/sign-up" className="text-cyan-400 hover:text-cyan-300 transition">
            {t.signUp}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
```

---

### Task 10: Update sign-up/page.tsx

**Files:**
- Modify: `nexora/app/sign-up/page.tsx`

Add imports and hook at top of component, then replace all hardcoded strings with translation keys.

**Step 1: Add imports after existing imports:**

```tsx
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
```

**Step 2: Inside `SignUp()`, add after existing state declarations:**

```tsx
const { lang } = useLanguage();
const t = translations[lang].signUp;
```

**Step 3: Replace all hardcoded text strings in JSX:**

- `"Create your"` → `{t.heading}`
- `"account"` (after Nexora span) → `{t.headingBrand}`
- `"Get started for free. No credit card required."` → `{t.sub}`
- `"Continue with Google"` (both occurrences) → `{t.withGoogle}`
- `"Continue with Microsoft"` (both occurrences) → `{t.withMicrosoft}`
- `"OR"` → `{t.or}`
- `"First Name"` → `{t.firstName}`
- `"Last Name"` → `{t.lastName}`
- `"Email"` → `{t.email}`
- `"Phone Number"` → `{t.phone}`
- `"Password"` (label) → `{t.password}`
- `"Confirm Password"` → `{t.confirmPassword}`
- `"8+ characters"` → `{t.validMin}`
- `"Uppercase letter"` → `{t.validUpper}`
- `"Lowercase letter"` → `{t.validLower}`
- `"Number"` → `{t.validNum}`
- `"Passwords do not match. Please try again."` → `{t.mismatch}`
- `"✓ Passwords match"` → `{t.match}`
- `"Create Account"` → `{t.button}`
- `"Already have an account?"` → `{t.hasAccount}`
- `"Sign in"` (link) → `{t.signIn}`

---

### Task 11: Verify everything works

**Step 1:** Run the dev server:
```bash
cd nexora && npm run dev
```

**Step 2:** Open `http://localhost:3000` and toggle between Eng / עב / ע

**Expected behavior:**
- Switching to עב: page flips to RTL, all UI text switches to Hebrew
- Switching to ع: page flips to RTL, all UI text switches to Arabic
- Nav links, footer, hero, about page, pricing page, sign-in/sign-up all update
- The animated language pill slides correctly
- Browser `document.dir` and `document.lang` update on switch

**Step 3:** Check the About page at `/about`, Pricing at `/pricing`, Sign-in at `/sign-in`, Sign-up at `/sign-up`
