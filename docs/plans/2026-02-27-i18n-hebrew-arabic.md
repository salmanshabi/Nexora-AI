# i18n Hebrew & Arabic Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire up the existing language toggle so switching to Hebrew or Arabic actually translates all page content and flips the layout direction to RTL.

**Architecture:** A React Context (`LanguageContext`) holds the active language globally. A single translations file (`translations/index.ts`) stores all strings for `en`, `he`, and `ar`. Every page/component reads translated strings via a `useTranslation` hook. RTL is handled by setting `document.documentElement.dir` and `document.documentElement.lang` in a `useEffect` inside the provider.

**Tech Stack:** Next.js 15 App Router, React Context, TypeScript, Tailwind CSS (RTL variant via dir attribute on html element)

---

### Task 1: Create LanguageContext

**Files:**
- Create: `nexora/app/context/LanguageContext.tsx`

**Step 1: Create the file**

```tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "he" | "ar";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const dir = lang === "en" ? "ltr" : "rtl";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
```

**Step 2: Verify file exists**

```bash
ls nexora/app/context/LanguageContext.tsx
```

---

### Task 2: Create translations file

**Files:**
- Create: `nexora/app/translations/index.ts`

**Step 1: Create the file with all strings**

```ts
export const translations = {
  en: {
    nav: {
      about: "About",
      pricing: "Pricing",
    },
    footer: {
      rights: "© 2025 Nexora. All rights reserved.",
    },
    home: {
      placeholder: "Describe your website...",
      send: "Send",
      tagPortfolio: "Portfolio",
      tagLanding: "Landing Page",
      tagEcommerce: "E-Commerce",
      tagBlog: "Blog",
      tagBusiness: "Business",
      tagEvent: "Event",
    },
    about: {
      heroTitle: "About",
      heroSubtitle:
        "Nexora is an AI-powered website builder that lets anyone create stunning, professional websites in minutes — no coding required. Just describe what you want, and our AI builds it for you.",
      howItWorksTitle: "How It Works",
      step01Title: "Describe Your Vision",
      step01Desc:
        "Tell the AI what kind of website you want. A portfolio, a landing page, an online store — anything.",
      step02Title: "AI Generates It",
      step02Desc:
        "Nexora's AI instantly builds your website with professional layouts, content, and styling.",
      step03Title: "Customize & Launch",
      step03Desc:
        "Tweak anything you want with simple controls, then publish your site to the world.",
      missionTitle: "Our Mission",
      missionDesc:
        "To make website creation accessible to everyone. Whether you're a startup founder, a freelancer, or a small business owner — you shouldn't need to code to have a great website.",
      whyTitle: "Why Nexora?",
      why1Title: "AI-Powered",
      why1Desc:
        "Our AI understands your needs and generates websites tailored to your brand and goals.",
      why2Title: "Lightning Fast",
      why2Desc:
        "Go from idea to live website in minutes, not weeks. No waiting for developers.",
      why3Title: "No Code Needed",
      why3Desc:
        "Just describe what you want in plain language. The AI handles the design and code.",
      stat1Label: "Websites Built",
      stat2Label: "Countries",
      stat3Label: "Avg Build Time",
      ctaTitle: "Ready to build your website?",
      ctaSubtitle: "Let AI do the heavy lifting. Your website is one prompt away.",
      ctaButton: "Get Started Free",
    },
    pricing: {
      title: "Pricing",
      subtitle: "Simple, transparent pricing. Coming soon.",
    },
    signIn: {
      title: "Sign in to",
      subtitle: "Welcome back. Choose your preferred sign-in method.",
      continueGoogle: "Continue with Google",
      continueMicrosoft: "Continue with Microsoft",
      or: "OR",
      emailLabel: "Email",
      passwordLabel: "Password",
      submitButton: "Sign In",
      noAccount: "Don't have an account?",
      signUpLink: "Sign up",
    },
    signUp: {
      title: "Create your",
      titleSuffix: "account",
      subtitle: "Get started for free. No credit card required.",
      continueGoogle: "Continue with Google",
      continueMicrosoft: "Continue with Microsoft",
      or: "OR",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      emailLabel: "Email",
      phoneLabel: "Phone Number",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      submitButton: "Create Account",
      hasAccount: "Already have an account?",
      signInLink: "Sign in",
      validMin: "8+ characters",
      validUpper: "Uppercase letter",
      validLower: "Lowercase letter",
      validNumber: "Number",
      mismatch: "Passwords do not match. Please try again.",
      match: "Passwords match",
    },
    navAuth: {
      signIn: "Sign In",
      signOut: "Sign Out",
    },
  },

  he: {
    nav: {
      about: "אודות",
      pricing: "תמחור",
    },
    footer: {
      rights: "© 2025 Nexora. כל הזכויות שמורות.",
    },
    home: {
      placeholder: "תאר את האתר שלך...",
      send: "שלח",
      tagPortfolio: "פורטפוליו",
      tagLanding: "דף נחיתה",
      tagEcommerce: "חנות מקוונת",
      tagBlog: "בלוג",
      tagBusiness: "עסקים",
      tagEvent: "אירוע",
    },
    about: {
      heroTitle: "אודות",
      heroSubtitle:
        "Nexora היא בונה אתרים מבוסס בינה מלאכותית שמאפשרת לכל אחד ליצור אתרים מקצועיים ומרהיבים תוך דקות — ללא צורך בקידוד. פשוט תאר מה אתה רוצה, והבינה המלאכותית שלנו תבנה אותו עבורך.",
      howItWorksTitle: "איך זה עובד",
      step01Title: "תאר את החזון שלך",
      step01Desc:
        "ספר לבינה המלאכותית איזה סוג אתר אתה רוצה. פורטפוליו, דף נחיתה, חנות מקוונת — כל דבר.",
      step02Title: "הבינה המלאכותית בונה אותו",
      step02Desc:
        "הבינה המלאכותית של Nexora בונה את האתר שלך מיד עם פריסות מקצועיות, תוכן ועיצוב.",
      step03Title: "התאמה ופרסום",
      step03Desc:
        "שנה כל מה שתרצה עם פקדים פשוטים, ואז פרסם את האתר שלך לעולם.",
      missionTitle: "המשימה שלנו",
      missionDesc:
        "להנגיש את יצירת האתרים לכולם. בין אם אתה מייסד סטארטאפ, פרילנסר, או בעל עסק קטן — אתה לא צריך לדעת לתכנת כדי שיהיה לך אתר מעולה.",
      whyTitle: "למה Nexora?",
      why1Title: "מבוסס בינה מלאכותית",
      why1Desc:
        "הבינה המלאכותית שלנו מבינה את הצרכים שלך ויוצרת אתרים המותאמים למותג ולמטרות שלך.",
      why2Title: "מהיר במיוחד",
      why2Desc:
        "מרעיון לאתר חי תוך דקות, לא שבועות. אין צורך להמתין למפתחים.",
      why3Title: "ללא קוד",
      why3Desc:
        "פשוט תאר מה אתה רוצה בשפה פשוטה. הבינה המלאכותית מטפלת בעיצוב ובקוד.",
      stat1Label: "אתרים שנבנו",
      stat2Label: "מדינות",
      stat3Label: "זמן בנייה ממוצע",
      ctaTitle: "מוכן לבנות את האתר שלך?",
      ctaSubtitle: "תן לבינה המלאכותית לעשות את העבודה הכבדה. האתר שלך במרחק פרומפט אחד.",
      ctaButton: "התחל בחינם",
    },
    pricing: {
      title: "תמחור",
      subtitle: "תמחור פשוט ושקוף. בקרוב.",
    },
    signIn: {
      title: "התחבר ל",
      subtitle: "ברוך שובך. בחר את שיטת ההתחברות המועדפת עליך.",
      continueGoogle: "המשך עם Google",
      continueMicrosoft: "המשך עם Microsoft",
      or: "או",
      emailLabel: "אימייל",
      passwordLabel: "סיסמה",
      submitButton: "כניסה",
      noAccount: "אין לך חשבון?",
      signUpLink: "הירשם",
    },
    signUp: {
      title: "צור את חשבון",
      titleSuffix: "שלך",
      subtitle: "התחל בחינם. ללא צורך בכרטיס אשראי.",
      continueGoogle: "המשך עם Google",
      continueMicrosoft: "המשך עם Microsoft",
      or: "או",
      firstNameLabel: "שם פרטי",
      lastNameLabel: "שם משפחה",
      emailLabel: "אימייל",
      phoneLabel: "מספר טלפון",
      passwordLabel: "סיסמה",
      confirmPasswordLabel: "אימות סיסמה",
      submitButton: "יצירת חשבון",
      hasAccount: "כבר יש לך חשבון?",
      signInLink: "כניסה",
      validMin: "8+ תווים",
      validUpper: "אות גדולה באנגלית",
      validLower: "אות קטנה באנגלית",
      validNumber: "מספר",
      mismatch: "הסיסמאות אינן תואמות. אנא נסה שוב.",
      match: "הסיסמאות תואמות",
    },
    navAuth: {
      signIn: "כניסה",
      signOut: "יציאה",
    },
  },

  ar: {
    nav: {
      about: "من نحن",
      pricing: "الأسعار",
    },
    footer: {
      rights: "© 2025 Nexora. جميع الحقوق محفوظة.",
    },
    home: {
      placeholder: "صف موقعك الإلكتروني...",
      send: "إرسال",
      tagPortfolio: "معرض أعمال",
      tagLanding: "صفحة هبوط",
      tagEcommerce: "متجر إلكتروني",
      tagBlog: "مدونة",
      tagBusiness: "أعمال",
      tagEvent: "فعالية",
    },
    about: {
      heroTitle: "من نحن",
      heroSubtitle:
        "Nexora منصة لبناء المواقع الإلكترونية بالذكاء الاصطناعي تتيح لأي شخص إنشاء مواقع احترافية ومذهلة في دقائق — دون الحاجة إلى البرمجة. فقط صف ما تريد، وسيبنيه الذكاء الاصطناعي لك.",
      howItWorksTitle: "كيف يعمل",
      step01Title: "صف رؤيتك",
      step01Desc:
        "أخبر الذكاء الاصطناعي بنوع الموقع الذي تريده. معرض أعمال، صفحة هبوط، متجر إلكتروني — أي شيء.",
      step02Title: "الذكاء الاصطناعي يبنيه",
      step02Desc:
        "يبني الذكاء الاصطناعي في Nexora موقعك فوراً بتصاميم احترافية ومحتوى وأسلوب مميز.",
      step03Title: "تخصيص وإطلاق",
      step03Desc:
        "عدّل ما تشاء بأدوات بسيطة، ثم انشر موقعك للعالم.",
      missionTitle: "مهمتنا",
      missionDesc:
        "جعل إنشاء المواقع في متناول الجميع. سواء كنت مؤسس شركة ناشئة، أو مستقلاً، أو صاحب عمل صغير — لا ينبغي أن تحتاج إلى البرمجة لامتلاك موقع رائع.",
      whyTitle: "لماذا Nexora؟",
      why1Title: "مدعوم بالذكاء الاصطناعي",
      why1Desc:
        "يفهم ذكاؤنا الاصطناعي احتياجاتك وينشئ مواقع مخصصة لعلامتك التجارية وأهدافك.",
      why2Title: "سريع البرق",
      why2Desc:
        "من الفكرة إلى موقع حي في دقائق، لا أسابيع. لا انتظار للمطورين.",
      why3Title: "لا حاجة للكود",
      why3Desc:
        "فقط صف ما تريد بلغة بسيطة. الذكاء الاصطناعي يتولى التصميم والكود.",
      stat1Label: "موقع تم بناؤه",
      stat2Label: "دولة",
      stat3Label: "متوسط وقت البناء",
      ctaTitle: "هل أنت مستعد لبناء موقعك؟",
      ctaSubtitle: "دع الذكاء الاصطناعي يتولى العمل الشاق. موقعك على بُعد رسالة واحدة.",
      ctaButton: "ابدأ مجاناً",
    },
    pricing: {
      title: "الأسعار",
      subtitle: "أسعار بسيطة وشفافة. قريباً.",
    },
    signIn: {
      title: "تسجيل الدخول إلى",
      subtitle: "أهلاً بعودتك. اختر طريقة تسجيل الدخول المفضلة لديك.",
      continueGoogle: "المتابعة مع Google",
      continueMicrosoft: "المتابعة مع Microsoft",
      or: "أو",
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      submitButton: "تسجيل الدخول",
      noAccount: "ليس لديك حساب؟",
      signUpLink: "إنشاء حساب",
    },
    signUp: {
      title: "إنشاء حساب",
      titleSuffix: "Nexora",
      subtitle: "ابدأ مجاناً. لا حاجة لبطاقة ائتمان.",
      continueGoogle: "المتابعة مع Google",
      continueMicrosoft: "المتابعة مع Microsoft",
      or: "أو",
      firstNameLabel: "الاسم الأول",
      lastNameLabel: "اسم العائلة",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "رقم الهاتف",
      passwordLabel: "كلمة المرور",
      confirmPasswordLabel: "تأكيد كلمة المرور",
      submitButton: "إنشاء الحساب",
      hasAccount: "لديك حساب بالفعل؟",
      signInLink: "تسجيل الدخول",
      validMin: "8+ أحرف",
      validUpper: "حرف كبير",
      validLower: "حرف صغير",
      validNumber: "رقم",
      mismatch: "كلمتا المرور غير متطابقتين. حاول مرة أخرى.",
      match: "كلمتا المرور متطابقتان",
    },
    navAuth: {
      signIn: "تسجيل الدخول",
      signOut: "تسجيل الخروج",
    },
  },
} as const;

export type Translations = typeof translations;
export type TranslationKey = keyof Translations["en"];
```

**Step 2: Verify file exists**

```bash
ls nexora/app/translations/index.ts
```

---

### Task 3: Update LanguageToggle to use context

**Files:**
- Modify: `nexora/app/components/LanguageToggle.tsx`

**Step 1: Replace local state with context**

Replace the entire file content with:

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

### Task 4: Update layout.tsx

**Files:**
- Modify: `nexora/app/layout.tsx`
- Create: `nexora/app/components/NavLinks.tsx`

**Step 1: Create NavLinks client component**

```tsx
// nexora/app/components/NavLinks.tsx
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

**Step 2: Update layout.tsx**

Replace the entire layout.tsx with:

```tsx
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import SessionProvider from "./components/SessionProvider";
import NavAuth from "./components/NavAuth";
import LanguageToggle from "./components/LanguageToggle";
import NavLinks from "./components/NavLinks";
import { LanguageProvider } from "./context/LanguageContext";
import FooterText from "./components/FooterText";
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
      <body className={`${outfit.variable} font-sans antialiased bg-gray-950 text-white`}>
        <SessionProvider>
          <LanguageProvider>
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
            <FooterText />
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
```

**Step 3: Create FooterText client component**

```tsx
// nexora/app/components/FooterText.tsx
"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function FooterText() {
  const { lang } = useLanguage();
  const t = translations[lang].footer;

  return (
    <footer className="border-t border-gray-800 bg-gray-950 px-8 py-8 text-center text-sm text-gray-600">
      <p>{t.rights}</p>
    </footer>
  );
}
```

---

### Task 5: Update NavAuth.tsx

**Files:**
- Modify: `nexora/app/components/NavAuth.tsx`

**Step 1: Add translation to NavAuth**

Replace with:

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
  const t = translations[lang].navAuth;

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

### Task 6: Update about/page.tsx

**Files:**
- Modify: `nexora/app/about/page.tsx`

**Step 1: Add `"use client"` and consume translations**

Add `"use client"` at the top and wire up `useLanguage` + translations. Replace inline hardcoded strings with `t.about.*` keys.

Key changes:
- Import `useLanguage` from `@/app/context/LanguageContext`
- Import `translations` from `@/app/translations`
- Use `const { lang } = useLanguage(); const t = translations[lang].about;`
- Replace every hardcoded string with the corresponding `t.*` key

Full replacement:

```tsx
"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function About() {
  const { lang } = useLanguage();
  const t = translations[lang].about;

  const steps = [
    { step: "01", title: t.step01Title, desc: t.step01Desc },
    { step: "02", title: t.step02Title, desc: t.step02Desc },
    { step: "03", title: t.step03Title, desc: t.step03Desc },
  ];

  const values = [
    { icon: "🤖", title: t.why1Title, desc: t.why1Desc },
    { icon: "⚡", title: t.why2Title, desc: t.why2Desc },
    { icon: "🎨", title: t.why3Title, desc: t.why3Desc },
  ];

  const stats = [
    { number: "10K+", label: t.stat1Label },
    { number: "50+", label: t.stat2Label },
    { number: "<60s", label: t.stat3Label },
  ];

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
          {t.heroTitle} <span className="text-cyan-400">Nexora</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-6 max-w-2xl text-lg text-gray-400"
        >
          {t.heroSubtitle}
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
            {t.howItWorksTitle}
          </motion.h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((item, i) => (
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
            {t.missionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-6 text-center text-lg text-gray-400"
          >
            {t.missionDesc}
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
            {t.whyTitle}
          </motion.h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((value, i) => (
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
          {stats.map((stat, i) => (
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
          <h2 className="text-3xl font-bold text-white">{t.ctaTitle}</h2>
          <p className="mt-4 text-gray-400">{t.ctaSubtitle}</p>
          <a
            href="/sign-up"
            className="mt-8 rounded-lg bg-cyan-500 px-8 py-3 font-semibold text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-200"
          >
            {t.ctaButton}
          </a>
        </motion.div>
      </section>
    </div>
  );
}
```

---

### Task 7: Update pricing/page.tsx

**Files:**
- Modify: `nexora/app/pricing/page.tsx`

**Step 1: Replace with translated version**

```tsx
"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function Pricing() {
  const { lang } = useLanguage();
  const t = translations[lang].pricing;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950">
      <h1 className="text-4xl font-bold text-white">{t.title}</h1>
      <p className="mt-4 text-lg text-gray-400">{t.subtitle}</p>
    </div>
  );
}
```

---

### Task 8: Update sign-in/page.tsx

**Files:**
- Modify: `nexora/app/sign-in/page.tsx`

**Step 1: Replace with translated version**

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
          {t.title} <span className="text-cyan-400">Nexora</span>
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">{t.subtitle}</p>

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
            {t.continueGoogle}
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
            {t.continueMicrosoft}
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
              {t.emailLabel}
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
              {t.passwordLabel}
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
            {t.submitButton}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {t.noAccount}{" "}
          <Link href="/sign-up" className="text-cyan-400 hover:text-cyan-300 transition">
            {t.signUpLink}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
```

---

### Task 9: Update sign-up/page.tsx

**Files:**
- Modify: `nexora/app/sign-up/page.tsx`

**Step 1: Add useLanguage and wire up all form strings**

Add imports for `useLanguage` and `translations`. Replace every hardcoded string with `t.signUp.*`. Keep all existing password validation logic unchanged.

Key replacements:
- `"Create your"` → `{t.title}`
- `"account"` → `{t.titleSuffix}` (after Nexora span)
- Form labels, button text, footer text, validation messages

```tsx
"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "AU" },
  { code: "+91", country: "IN" },
  { code: "+81", country: "JP" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+86", country: "CN" },
  { code: "+55", country: "BR" },
  { code: "+971", country: "AE" },
  { code: "+966", country: "SA" },
  { code: "+92", country: "PK" },
  { code: "+20", country: "EG" },
  { code: "+234", country: "NG" },
  { code: "+27", country: "ZA" },
  { code: "+82", country: "KR" },
  { code: "+39", country: "IT" },
  { code: "+34", country: "ES" },
  { code: "+7", country: "RU" },
  { code: "+52", country: "MX" },
  { code: "+60", country: "MY" },
  { code: "+65", country: "SG" },
  { code: "+31", country: "NL" },
  { code: "+46", country: "SE" },
  { code: "+41", country: "CH" },
];

export default function SignUp() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { lang } = useLanguage();
  const t = translations[lang].signUp;

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;
  const passwordValid = hasUppercase && hasLowercase && hasNumber && hasMinLength;
  const passwordsMatch = password === confirmPassword;
  const showMismatch = confirmPassword.length > 0 && !passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8"
      >
        <h1 className="text-center text-2xl font-bold text-white">
          {t.title} <span className="text-cyan-400">Nexora</span> {t.titleSuffix}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">{t.subtitle}</p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-medium text-white hover:border-gray-600 transition-all duration-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t.continueGoogle}
          </button>

          <button
            onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-medium text-white hover:border-gray-600 transition-all duration-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            {t.continueMicrosoft}
          </button>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-700" />
          <span className="text-xs text-gray-500">{t.or}</span>
          <div className="h-px flex-1 bg-gray-700" />
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-400">
                {t.firstNameLabel}
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-400">
                {t.lastNameLabel}
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              {t.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-400">
              {t.phoneLabel}
            </label>
            <div className="mt-1 flex gap-2">
              <select
                defaultValue="+1"
                className="w-28 rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
              >
                {countryCodes.map((c) => (
                  <option key={c.code + c.country} value={c.code}>
                    {c.country} {c.code}
                  </option>
                ))}
              </select>
              <input
                id="phone"
                type="tel"
                placeholder="123 456 7890"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              {t.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
            />
            {password.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                <span className={hasMinLength ? "text-green-400" : "text-gray-500"}>
                  {hasMinLength ? "✓" : "○"} {t.validMin}
                </span>
                <span className={hasUppercase ? "text-green-400" : "text-gray-500"}>
                  {hasUppercase ? "✓" : "○"} {t.validUpper}
                </span>
                <span className={hasLowercase ? "text-green-400" : "text-gray-500"}>
                  {hasLowercase ? "✓" : "○"} {t.validLower}
                </span>
                <span className={hasNumber ? "text-green-400" : "text-gray-500"}>
                  {hasNumber ? "✓" : "○"} {t.validNumber}
                </span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">
              {t.confirmPasswordLabel}
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`mt-1 w-full rounded-lg border bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 ${
                showMismatch
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              }`}
            />
            {showMismatch && (
              <p className="mt-2 text-sm text-red-400">{t.mismatch}</p>
            )}
            {confirmPassword.length > 0 && passwordsMatch && (
              <p className="mt-2 text-sm text-green-400">✓ {t.match}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!passwordValid || !passwordsMatch}
            className="mt-2 w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.submitButton}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {t.hasAccount}{" "}
          <Link href="/sign-in" className="text-cyan-400 hover:text-cyan-300 transition">
            {t.signInLink}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
```

---

### Task 10: Update home page (page.tsx)

**Files:**
- Modify: `nexora/app/page.tsx`

**Step 1: Add translation to the home page**

The home page is large. The key translatable strings are:
- Input placeholder text
- Tag labels (Portfolio, Landing Page, E-Commerce, Blog, Business, Event)
- The send button aria-label

Add imports at top:
```tsx
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
```

Inside component, before return:
```tsx
const { lang } = useLanguage();
const t = translations[lang].home;
```

Then replace:
- `placeholder="Describe your website..."` → `placeholder={t.placeholder}`
- Each tag label string → the corresponding `t.tag*` key

The tag labels in the `tags` array are defined as data at the top of the file. Since they need to be dynamic, move the labels to use translations. The `tags` array has `label` fields like `"Portfolio"`, `"Landing Page"`, etc. — map these to translation keys.

Add a `tagKey` field to each tag:
```tsx
{ tagKey: "tagPortfolio" as const, label: t.tagPortfolio, icon: "🖼️", prompts: [...] }
```

Then use `item.label` in the JSX (which was already the case).

---

### Task 11: Verify the build

**Step 1: Run the dev server**

```bash
cd nexora && npm run dev
```

**Step 2: Check for TypeScript errors**

```bash
cd nexora && npx tsc --noEmit
```

Expected: no errors

**Step 3: Manual verification checklist**

- [ ] Toggle to Hebrew → all nav, footer, home, about, pricing text changes to Hebrew
- [ ] Toggle to Arabic → same for Arabic
- [ ] Page `dir` attribute flips to `rtl` for Hebrew and Arabic (check in browser DevTools → Elements → `<html dir="rtl">`)
- [ ] Toggle back to English → everything reverts
- [ ] Sign-in page translates correctly
- [ ] Sign-up validation messages translate correctly
