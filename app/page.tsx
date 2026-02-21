"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import type { Attachment } from "@/types/attachments";
import AttachmentDropdown from "@/app/components/AttachmentDropdown";
import AttachmentPreview from "@/app/components/AttachmentPreview";
import CameraCapture from "@/app/components/CameraCapture";
import UrlInput from "@/app/components/UrlInput";
import GoogleDrivePicker from "@/app/components/GoogleDrivePicker";

const tags = [
  {
    label: "Portfolio",
    icon: "🖼️",
    prompts: [
      "A modern portfolio website for a photographer with a dark theme, full-screen gallery, and contact form",
      "A creative portfolio for a graphic designer with animated transitions, case studies, and a minimal layout",
      "A freelance developer portfolio with project showcases, tech stack badges, testimonials, and a blog section",
      "An artist portfolio with a masonry grid gallery, about page, exhibition timeline, and commission request form",
    ],
  },
  {
    label: "Landing Page",
    icon: "🚀",
    prompts: [
      "A sleek landing page for a tech startup with a hero section, feature highlights, pricing table, and signup form",
      "A product launch page for a fitness app with app screenshots, user reviews, download buttons, and a FAQ section",
      "A coming soon page for a new AI tool with an email waitlist, countdown timer, and feature preview cards",
      "A landing page for an online course platform with instructor bios, curriculum overview, and enrollment CTA",
    ],
  },
  {
    label: "Online Store",
    icon: "🛒",
    prompts: [
      "An online store for handmade jewelry with product grids, shopping cart, filters, and a clean checkout flow",
      "A streetwear clothing shop with lookbook gallery, size guide, wishlist feature, and new arrivals section",
      "A specialty coffee store with subscription plans, product reviews, brewing guides, and gift card options",
      "A vintage furniture store with category filters, room inspiration gallery, delivery info, and customer stories",
    ],
  },
  {
    label: "Blog",
    icon: "✍️",
    prompts: [
      "A minimal blog for a travel writer with featured posts, categories, dark mode, and a newsletter signup",
      "A tech blog with syntax-highlighted code snippets, author profiles, reading time estimates, and search functionality",
      "A food blog with recipe cards, ingredient lists, cooking time filters, and a print-friendly layout",
      "A personal journal blog with mood-based tags, photo entries, archive calendar, and a clean reading experience",
    ],
  },
  {
    label: "Restaurant",
    icon: "🍽️",
    prompts: [
      "A restaurant website with a hero image, interactive menu, reservation booking, and customer reviews",
      "A sushi bar website with a visual menu, chef's story section, online ordering, and Instagram feed integration",
      "A pizza delivery site with a build-your-own pizza tool, combo deals, live order tracking, and loyalty rewards",
      "A fine dining website with tasting menu previews, wine pairing suggestions, private event booking, and a virtual tour",
    ],
  },
];

const questions = [
  {
    id: "businessName",
    question: "What is your business or project name?",
    placeholder: "e.g. Bloom Studio",
  },
  {
    id: "businessDescription",
    question: "Describe your business in a few words",
    placeholder: "e.g. A boutique coffee shop in downtown Austin specializing in single-origin beans",
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
    options: ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+", "All Ages"],
    multi: true,
  },
  {
    id: "style",
    question: "What style or vibe do you want?",
    options: ["Minimal", "Bold", "Elegant", "Playful", "Corporate", "Futuristic"],
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
    options: ["Home", "About", "Pricing", "Contact", "Blog", "Gallery", "Shop", "FAQ"],
    multi: true,
  },
];

const paletteMap: Record<string, [string, string, string]> = {
  Ocean: ["#0ea5e9", "#06b6d4", "#1e3a5f"],
  Sunset: ["#f97316", "#ef4444", "#fbbf24"],
  Forest: ["#22c55e", "#15803d", "#365314"],
  Midnight: ["#1e1b4b", "#3b82f6", "#6366f1"],
  Berry: ["#a855f7", "#ec4899", "#7c3aed"],
  Minimal: ["#f8fafc", "#94a3b8", "#1e293b"],
  Warm: ["#dc2626", "#f97316", "#fde68a"],
  Neon: ["#06b6d4", "#a855f7", "#22d3ee"],
  Earth: ["#92400e", "#d97706", "#78716c"],
  Pastel: ["#fca5a5", "#93c5fd", "#d9f99d"],
  Monochrome: ["#ffffff", "#6b7280", "#111827"],
  Candy: ["#f472b6", "#c084fc", "#67e8f9"],
};

// Smart analyzer: pre-fills questionnaire based on business description
function analyzeDescription(desc: string): Record<string, string> {
  const d = desc.toLowerCase();
  const result: Record<string, string> = {};

  // --- Audience Gender ---
  const genderKeywords: Record<string, string[]> = {
    Men: ["men", "male", "gentleman", "barber", "grooming", "menswear"],
    Women: ["women", "female", "lady", "salon", "beauty", "bridal", "maternity", "womenswear"],
    Teens: ["teen", "youth", "young", "student", "college", "university", "gen z"],
    Children: ["kid", "child", "baby", "toddler", "nursery", "daycare", "toy", "playground"],
    Elderly: ["senior", "elderly", "retire", "aged care", "nursing home"],
  };
  const matchedGenders: string[] = [];
  for (const [gender, keywords] of Object.entries(genderKeywords)) {
    if (keywords.some((kw) => d.includes(kw))) matchedGenders.push(gender);
  }
  result.audienceGender = matchedGenders.length > 0 ? matchedGenders.join(", ") : "Everyone";

  // --- Audience Age ---
  const ageKeywords: Record<string, string[]> = {
    "Under 18": ["kid", "child", "teen", "school", "toy", "baby", "toddler"],
    "18–24": ["college", "university", "student", "gen z", "young adult"],
    "25–34": ["startup", "freelanc", "young professional", "millennial"],
    "35–44": ["family", "parent", "mid-career", "corporate"],
    "45–54": ["executive", "senior professional", "established"],
    "55+": ["senior", "retire", "elderly", "aged"],
  };
  const matchedAges: string[] = [];
  for (const [age, keywords] of Object.entries(ageKeywords)) {
    if (keywords.some((kw) => d.includes(kw))) matchedAges.push(age);
  }
  result.audienceAge = matchedAges.length > 0 ? matchedAges.join(", ") : "All Ages";

  // --- Style ---
  if (/luxur|premium|high.?end|fine dining|boutique|exclusive/i.test(d)) result.style = "Elegant";
  else if (/tech|ai|software|saas|app|digital|cyber|crypto/i.test(d)) result.style = "Futuristic";
  else if (/fun|game|party|play|entertainment|comic|cartoon/i.test(d)) result.style = "Playful";
  else if (/bold|extreme|sport|adventure|fitness|gym|street/i.test(d)) result.style = "Bold";
  else if (/law|finance|consult|accounting|insurance|enterprise|corporate/i.test(d)) result.style = "Corporate";
  else result.style = "Minimal";

  // --- Colors ---
  if (/nature|garden|organic|farm|plant|eco|vegan|green/i.test(d)) result.colors = "Forest";
  else if (/ocean|sea|marine|aqua|surf|beach|water|swim/i.test(d)) result.colors = "Ocean";
  else if (/luxur|premium|elegant|fine|wine|gold/i.test(d)) result.colors = "Midnight";
  else if (/tech|ai|software|saas|cyber|neon|digital/i.test(d)) result.colors = "Neon";
  else if (/kid|child|baby|toy|candy|sweet|dessert|bakery|cake/i.test(d)) result.colors = "Candy";
  else if (/coffee|wood|leather|vintage|rustic|craft/i.test(d)) result.colors = "Earth";
  else if (/beauty|salon|spa|wellness|yoga|pastel/i.test(d)) result.colors = "Pastel";
  else if (/food|restaurant|pizza|burger|bbq|grill|spice/i.test(d)) result.colors = "Warm";
  else if (/fashion|model|photo|art|creative|design/i.test(d)) result.colors = "Berry";
  else if (/clean|minimal|simple|modern|agency/i.test(d)) result.colors = "Monochrome";
  else result.colors = "Minimal";

  // --- Pages ---
  const pageKeywords: Record<string, string[]> = {
    Home: ["home"],
    About: ["about", "story", "team", "who we are"],
    Pricing: ["pricing", "price", "plan", "subscription", "package", "cost"],
    Contact: ["contact", "reach", "support", "help"],
    Blog: ["blog", "article", "news", "post", "journal", "write"],
    Gallery: ["gallery", "portfolio", "photo", "image", "work", "project", "showcase"],
    Shop: ["shop", "store", "buy", "product", "ecommerce", "e-commerce", "sell", "order", "cart"],
    FAQ: ["faq", "question", "help", "support"],
  };
  const matchedPages = ["Home"]; // Always include Home
  for (const [page, keywords] of Object.entries(pageKeywords)) {
    if (page === "Home") continue;
    if (keywords.some((kw) => d.includes(kw))) matchedPages.push(page);
  }
  // Smart defaults: always add About & Contact if nothing specific was found
  if (matchedPages.length <= 1) {
    matchedPages.push("About", "Contact");
    // Add Shop if it's a store
    if (/store|shop|sell|product|ecommerce/i.test(d)) matchedPages.push("Shop", "Pricing");
    // Add Gallery if creative
    if (/photo|portfolio|art|design|architect/i.test(d)) matchedPages.push("Gallery");
    // Add Blog if content-focused
    if (/blog|write|journal|news/i.test(d)) matchedPages.push("Blog");
    // Add Pricing if service-based
    if (/service|agency|consult|freelanc|plan/i.test(d)) matchedPages.push("Pricing");
  }
  // Deduplicate
  result.pages = [...new Set(matchedPages)].join(", ");

  return result;
}

export default function Home() {
  const [promptText, setPromptText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [aiPrefilled, setAiPrefilled] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeMessage, setAnalyzeMessage] = useState("");
  const [isBarAnalyzing, setIsBarAnalyzing] = useState(false);
  const [barAnalyzeMessage, setBarAnalyzeMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachDropdown, setShowAttachDropdown] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showGDrive, setShowGDrive] = useState(false);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);
  const analyzeTimer = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const attachBtnRef = useRef<HTMLButtonElement>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const typePrompt = useCallback((text: string) => {
    if (typingRef.current) clearInterval(typingRef.current);
    setPromptText("");
    setIsTyping(true);

    let i = 0;
    typingRef.current = setInterval(() => {
      i++;
      setPromptText(text.slice(0, i));
      if (i >= text.length) {
        if (typingRef.current) clearInterval(typingRef.current);
        setIsTyping(false);
      }
    }, 30);
  }, []);

  useEffect(() => {
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      if (analyzeTimer.current) clearTimeout(analyzeTimer.current);
      // Clean up blob preview URLs (don't revoke external URLs like gdrive thumbnails)
      attachments.forEach((a) => { if (a.preview?.startsWith("blob:")) URL.revokeObjectURL(a.preview); });
    };
  }, []);

  // File attachment handlers
  const handleFileSelect = (files: FileList | null, allowedTypes?: string[]) => {
    if (!files) return;
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const defaultAllowed = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml", "application/pdf", "text/plain", "text/csv", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const allowed = allowedTypes ?? defaultAllowed;

    const newAttachments: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      if (attachments.length + newAttachments.length >= maxFiles) break;
      const file = files[i];
      if (file.size > maxSize) continue;
      if (!allowed.some((t) => file.type === t || file.type.startsWith("image/"))) continue;

      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
      newAttachments.push({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        preview,
        source: "local",
        file,
      });
    }
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed?.preview?.startsWith("blob:")) URL.revokeObjectURL(removed.preview);
      return prev.filter((a) => a.id !== id);
    });
  };

  // Check if the current step has a valid answer
  const canAdvance = () => {
    if (isAnalyzing) return false;
    const q = questions[currentStep];
    if (q.multi) return selectedMulti.length > 0;
    return !!answers[q.id]?.trim();
  };

  // Press Enter to advance to the next step
  useEffect(() => {
    if (!showQuestions) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in the textarea (Enter = new line there)
      const q = questions[currentStep];
      if (q.textarea && e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Enter" && canAdvance()) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleGenerate = () => {
    if (!promptText.trim() || isBarAnalyzing) return;

    setIsBarAnalyzing(true);

    const hasFiles = attachments.length > 0;
    const hasImages = attachments.some((a) => a.type.startsWith("image/"));
    const hasDocs = attachments.some((a) => !a.type.startsWith("image/") && a.source !== "url");
    const hasUrls = attachments.some((a) => a.source === "url");
    const hasGDrive = attachments.some((a) => a.source === "gdrive");
    const hasCamera = attachments.some((a) => a.source === "camera");

    const messages = [
      "Reading your description...",
      ...(hasImages ? ["Analyzing uploaded images..."] : []),
      ...(hasCamera ? ["Processing camera captures..."] : []),
      ...(hasDocs ? ["Scanning attached documents..."] : []),
      ...(hasUrls ? ["Extracting insights from linked pages..."] : []),
      ...(hasGDrive ? ["Reading Google Drive files..."] : []),
      ...(hasFiles ? ["Extracting insights from files..."] : []),
      "Understanding your vision...",
      "Identifying target audience...",
      "Choosing the perfect style...",
      "Selecting color palette...",
      "Mapping out your pages...",
      "Preparing your questionnaire...",
    ];

    let msgIndex = 0;
    setBarAnalyzeMessage(messages[0]);
    const msgInterval = setInterval(() => {
      msgIndex++;
      if (msgIndex < messages.length) {
        setBarAnalyzeMessage(messages[msgIndex]);
      }
    }, 800);

    const delay = 5000 + Math.random() * 2000;
    analyzeTimer.current = setTimeout(() => {
      clearInterval(msgInterval);

      // Run AI analyzer on the prompt bar text to pre-fill answers
      const suggested = analyzeDescription(promptText);
      const prefilledKeys = new Set<string>();
      const prefilled: Record<string, string> = {};
      for (const [key, value] of Object.entries(suggested)) {
        prefilled[key] = value;
        prefilledKeys.add(key);
      }

      setIsBarAnalyzing(false);
      setBarAnalyzeMessage("");
      setShowQuestions(true);
      setCurrentStep(0);
      setAnswers(prefilled);
      setSelectedMulti([]);
      setAiPrefilled(prefilledKeys);
    }, delay);
  };

  // Shared logic to move to the next step
  const goToNextStep = useCallback((fromStep: number, updatedAnswers: Record<string, string>) => {
    if (fromStep < questions.length - 1) {
      const nextStep = fromStep + 1;
      const nextQ = questions[nextStep];
      if (nextQ.multi && updatedAnswers[nextQ.id]) {
        setSelectedMulti(updatedAnswers[nextQ.id].split(", "));
      } else if (nextQ.multi) {
        setSelectedMulti([]);
      }
      setCurrentStep(nextStep);
    } else {
      setShowQuestions(false);
    }
  }, []);

  const handleNext = () => {
    if (!canAdvance()) return;
    const q = questions[currentStep];
    let updatedAnswers = q.multi
      ? { ...answers, [q.id]: selectedMulti.join(", ") }
      : answers;
    if (q.multi) setAnswers(updatedAnswers);

    // When leaving the business description step, show analyzing animation
    if (q.id === "businessDescription" && updatedAnswers.businessDescription?.trim()) {
      setIsAnalyzing(true);

      const messages = [
        "Reading your description...",
        "Understanding your business...",
        "Identifying target audience...",
        "Choosing the perfect style...",
        "Selecting color palette...",
        "Mapping out your pages...",
        "Finalizing suggestions...",
      ];

      // Cycle through messages
      let msgIndex = 0;
      setAnalyzeMessage(messages[0]);
      const msgInterval = setInterval(() => {
        msgIndex++;
        if (msgIndex < messages.length) {
          setAnalyzeMessage(messages[msgIndex]);
        }
      }, 800);

      // Random delay between 5-7 seconds
      const delay = 5000 + Math.random() * 2000;
      analyzeTimer.current = setTimeout(() => {
        clearInterval(msgInterval);

        // Combine prompt bar text + business description for better analysis
        const combinedText = `${promptText} ${updatedAnswers.businessDescription}`;
        const suggested = analyzeDescription(combinedText);
        const newPrefilled = new Set(aiPrefilled);
        for (const [key, value] of Object.entries(suggested)) {
          if (!updatedAnswers[key] || aiPrefilled.has(key)) {
            updatedAnswers = { ...updatedAnswers, [key]: value };
            newPrefilled.add(key);
          }
        }
        setAnswers(updatedAnswers);
        setAiPrefilled(newPrefilled);
        setIsAnalyzing(false);
        setAnalyzeMessage("");
        goToNextStep(currentStep, updatedAnswers);
      }, delay);

      return;
    }

    goToNextStep(currentStep, updatedAnswers);
  };

  // Mark a step as manually edited (removes AI badge)
  const markAsEdited = (stepId: string) => {
    if (aiPrefilled.has(stepId)) {
      setAiPrefilled((prev) => {
        const next = new Set(prev);
        next.delete(stepId);
        return next;
      });
    }
  };

  // Auto-advance for single-select options
  const handleSingleSelect = (option: string) => {
    markAsEdited(currentQuestion.id);
    const updatedAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(updatedAnswers);
    // Small delay so user sees their selection highlight
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      goToNextStep(currentStep, updatedAnswers);
    }, 300);
  };

  // Auto-advance for "Everyone" / "All Ages" select-all options
  const handleSelectAll = (option: string) => {
    markAsEdited(currentQuestion.id);
    const updatedAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(updatedAnswers);
    setSelectedMulti([option]);
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      goToNextStep(currentStep, updatedAnswers);
    }, 300);
  };

  // Multi-select — no auto-advance, user clicks arrow to proceed
  const handleMultiSelect = (option: string) => {
    markAsEdited(currentQuestion.id);
    setSelectedMulti((prev) => {
      const filtered = prev.filter((o) => o !== "Everyone" && o !== "All Ages");
      return filtered.includes(option)
        ? filtered.filter((o) => o !== option)
        : [...filtered, option];
    });
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const prevQ = questions[prevStep];
      // Restore multi-select state when going back
      if (prevQ.multi && answers[prevQ.id]) {
        setSelectedMulti(answers[prevQ.id].split(", "));
      } else {
        setSelectedMulti([]);
      }
      setCurrentStep(prevStep);
    } else {
      setShowQuestions(false);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-8 py-32 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-6xl font-bold text-white"
        >
          Build websites with AI.{" "}
          <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            Nexora
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-6 max-w-lg text-xl text-gray-400"
        >
          Describe your dream website and let AI build it for you in seconds.
          No coding required. Just your imagination.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 flex gap-4"
        >
          <a
            href="/sign-in"
            className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-200"
          >
            Get Started Free
          </a>
          <a
            href="/about"
            className="rounded-lg border border-gray-700 px-6 py-3 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-200"
          >
            Learn More
          </a>
        </motion.div>

        {/* AI Prompt Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-14 w-full max-w-4xl px-4"
        >
          <div className={`relative rounded-2xl border bg-gray-900 p-2 transition-all duration-300 ${
            isBarAnalyzing
              ? "border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
              : "border-gray-700 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
          }`}>
            {isBarAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-6 px-5">
                <div className="flex items-center gap-4">
                  {/* Spinning sparkle */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                    </svg>
                  </motion.div>

                  <div className="flex flex-col">
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-sm font-semibold text-white"
                    >
                      Analyzing your description
                    </motion.span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={barAnalyzeMessage}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.25 }}
                        className="text-xs text-cyan-400/70 mt-0.5"
                      >
                        {barAnalyzeMessage}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Progress dots */}
                  <div className="flex gap-1 ml-auto">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="h-1.5 w-1.5 rounded-full bg-cyan-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Animated progress bar */}
                <div className="mt-4 w-full h-1 rounded-full bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "easeInOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                  />
                </div>
              </div>
            ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFileSelect(e.dataTransfer.files);
              }}
            >
              {/* Attached files preview */}
              <AttachmentPreview attachments={attachments} onRemove={removeAttachment} />

              {/* URL input bar (shown when URL option is selected) */}
              <UrlInput
                isOpen={showUrlInput}
                onClose={() => setShowUrlInput(false)}
                onAttach={(attachment) => {
                  setAttachments((prev) => [...prev, attachment]);
                  setShowUrlInput(false);
                }}
              />

              {/* Hidden file inputs — separate for photos vs documents */}
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                onChange={(e) => {
                  handleFileSelect(e.target.files, ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"]);
                  e.target.value = "";
                }}
                className="hidden"
              />
              <input
                ref={docInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.csv"
                onChange={(e) => {
                  handleFileSelect(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />

              <div className="flex items-end gap-3 px-5 py-3">
                {/* Attachment dropdown button + menu (left side) */}
                <div className="relative">
                  <button
                    ref={attachBtnRef}
                    onClick={() => setShowAttachDropdown((prev) => !prev)}
                    className={`mb-1 shrink-0 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                      showAttachDropdown
                        ? "border-cyan-400/60 text-cyan-300 bg-cyan-500/15 shadow-[0_0_16px_rgba(34,211,238,0.25),inset_0_0_8px_rgba(34,211,238,0.1)]"
                        : "border-gray-600/50 text-gray-400 bg-gray-800/60 hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/5 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                    }`}
                    title="Attach files, photos, or links"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4.5 w-4.5 transition-transform duration-300 ease-out ${showAttachDropdown ? "rotate-45" : ""}`}>
                      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                    </svg>
                  </button>
                  <AttachmentDropdown
                    isOpen={showAttachDropdown}
                    onClose={() => setShowAttachDropdown(false)}
                    onSelectPhoto={() => imageInputRef.current?.click()}
                    onSelectFile={() => docInputRef.current?.click()}
                    onSelectGDrive={() => setShowGDrive(true)}
                    onSelectUrl={() => setShowUrlInput(true)}
                    onSelectCamera={() => setShowCamera(true)}
                    buttonRef={attachBtnRef}
                  />
                </div>

                {/* Sparkle icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mb-1 h-6 w-6 shrink-0 text-cyan-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                  />
                </svg>

                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={promptText}
                  onChange={(e) => {
                    if (!isTyping) setPromptText(e.target.value);
                  }}
                  placeholder="Describe your website...&#10;e.g. &quot;A portfolio for a photographer with a dark theme and gallery section&quot;"
                  className="w-full resize-none bg-transparent text-base text-white placeholder-gray-500 outline-none leading-relaxed"
                />

                <button
                  onClick={handleGenerate}
                  className="mb-1 shrink-0 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-200"
                >
                  Generate
                </button>
              </div>
            </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {tags.map((tag) => {
              const isActive = activeTag === tag.label;
              return (
                <motion.span
                  key={tag.label}
                  onClick={() => {
                    setActiveTag(tag.label);
                    const random = tag.prompts[Math.floor(Math.random() * tag.prompts.length)];
                    typePrompt(random);
                  }}
                  animate={{
                    scale: isActive ? 1.15 : 1,
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-xs backdrop-blur transition-colors duration-200 ${
                    isActive
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                      : "border-gray-700 bg-gray-900/50 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400"
                  }`}
                >
                  <span>{tag.icon}</span>
                  {tag.label}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Questions Modal */}
      <AnimatePresence>
        {showQuestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-8"
            >
              {/* Progress bar */}
              <div className="mb-6 flex gap-1.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= currentStep ? "bg-cyan-500" : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>

              {/* AI Analyzing Overlay */}
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  {/* Spinning sparkle icon */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                    </svg>
                  </motion.div>

                  {/* Pulsing title */}
                  <motion.h3
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-lg font-semibold text-white mb-3"
                  >
                    Analyzing your business
                  </motion.h3>

                  {/* Cycling status messages */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={analyzeMessage}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm text-cyan-400/70"
                    >
                      {analyzeMessage}
                    </motion.p>
                  </AnimatePresence>

                  {/* Progress dots */}
                  <div className="mt-6 flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="h-2 w-2 rounded-full bg-cyan-400"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step counter */}
              {!isAnalyzing && (
              <p className="text-xs text-gray-500 mb-2">
                Step {currentStep + 1} of {questions.length}
              </p>
              )}

              {/* Question */}
              {!isAnalyzing && <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-white">
                    {currentQuestion.question}
                  </h3>

                  {/* AI suggested badge */}
                  {aiPrefilled.has(currentQuestion.id) && answers[currentQuestion.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-cyan-400">
                        <path d="M15.98 1.804a1 1 0 0 0-1.784 0l-.009.02a6.092 6.092 0 0 1-1.536 2.107l-6.87 6.87a25 25 0 0 0-2.92-.94l-.04-.01a1 1 0 0 0-.83 1.594l2.297 3.443a1 1 0 0 0 1.272.316l.04-.02a25 25 0 0 0 2.724-1.592l6.87-6.87a6.09 6.09 0 0 1 2.108-1.536l.02-.009a1 1 0 0 0 0-1.784l-.02-.009a6.09 6.09 0 0 1-2.107-1.536l-.009-.02ZM6.5 17a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                      </svg>
                      <span className="text-[11px] font-medium text-cyan-400/80">
                        AI suggested — feel free to edit
                      </span>
                    </motion.div>
                  )}

                  <div className="mt-6">
                    {/* Text input */}
                    {currentQuestion.placeholder && !currentQuestion.options && !currentQuestion.textarea && (
                      <input
                        type="text"
                        placeholder={currentQuestion.placeholder}
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) => {
                          markAsEdited(currentQuestion.id);
                          setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
                        }}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                      />
                    )}

                    {/* Textarea input */}
                    {currentQuestion.textarea && (
                      <textarea
                        rows={3}
                        placeholder={currentQuestion.placeholder}
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) => {
                          markAsEdited(currentQuestion.id);
                          setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
                        }}
                        className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 leading-relaxed"
                      />
                    )}

                    {/* Single select options — auto-advances */}
                    {currentQuestion.options && !currentQuestion.multi && !currentQuestion.colorPalette && (
                      <div className="grid grid-cols-3 gap-2">
                        {currentQuestion.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleSingleSelect(option)}
                            className={`rounded-lg border px-4 py-2.5 text-sm transition-all duration-200 ${
                              answers[currentQuestion.id] === option
                                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                                : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Color palette single-select — auto-advances */}
                    {currentQuestion.options && currentQuestion.colorPalette && (
                      <div className="grid grid-cols-3 gap-3">
                        {currentQuestion.options.map((palette) => {
                          const isSelected = answers[currentQuestion.id] === palette;
                          const colors = paletteMap[palette] || ["#888", "#888", "#888"];
                          return (
                            <button
                              key={palette}
                              onClick={() => {
                                markAsEdited(currentQuestion.id);
                                setAnswers({ ...answers, [currentQuestion.id]: palette });
                              }}
                              className={`group relative flex flex-col items-center gap-2.5 rounded-xl border p-3.5 transition-all duration-200 ${
                                isSelected
                                  ? "border-cyan-500 bg-cyan-500/5 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                              }`}
                            >
                              <div className="flex gap-1.5">
                                {colors.map((hex, i) => (
                                  <div
                                    key={i}
                                    className={`h-7 w-7 rounded-full transition-all duration-200 ${
                                      isSelected ? "scale-110" : "group-hover:scale-105"
                                    }`}
                                    style={{
                                      backgroundColor: hex,
                                      boxShadow: isSelected
                                        ? `0 0 12px ${hex}80`
                                        : `0 0 6px ${hex}30`,
                                    }}
                                  />
                                ))}
                              </div>
                              <span
                                className={`text-xs font-medium transition-colors duration-200 ${
                                  isSelected ? "text-cyan-400" : "text-gray-500"
                                }`}
                              >
                                {palette}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Multi select options (non-color) */}
                    {currentQuestion.options && currentQuestion.multi && (
                      <>
                        <p className="mb-3 text-xs text-gray-500">
                          {currentQuestion.subtitle || "Select all that apply"}
                        </p>
                        <div className={`grid gap-2 ${
                          currentQuestion.id === "pages" ? "grid-cols-4" : "grid-cols-3"
                        }`}>
                          {currentQuestion.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                const isSelectAll = option === "Everyone" || option === "All Ages";
                                if (isSelectAll) {
                                  handleSelectAll(option);
                                } else {
                                  handleMultiSelect(option);
                                }
                              }}
                              className={`rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 ${
                                selectedMulti.includes(option)
                                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                                  : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                  </div>
                </motion.div>
              </AnimatePresence>}

              {/* Buttons */}
              {!isAnalyzing && <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-200"
                >
                  {currentStep === 0 ? "Cancel" : "Back"}
                </button>
                <motion.button
                  onClick={handleNext}
                  whileHover={canAdvance() ? { scale: 1.1 } : {}}
                  whileTap={canAdvance() ? { scale: 0.9 } : {}}
                  className={`group relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                    canAdvance()
                      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
                      : "border-gray-700 bg-gray-800/50 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {/* Outer glow ring */}
                  <span className={`absolute inset-0 rounded-full border scale-110 transition-all duration-300 ${
                    canAdvance()
                      ? "border-cyan-400/20 group-hover:scale-125 group-hover:border-cyan-400/40"
                      : "border-gray-700/20"
                  }`} />
                  {currentStep === questions.length - 1 ? (
                    /* Rocket icon for final step */
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                      <path d="M15.98 1.804a1 1 0 0 0-1.784 0l-.009.02a6.092 6.092 0 0 1-1.536 2.107l-6.87 6.87a25 25 0 0 0-2.92-.94l-.04-.01a1 1 0 0 0-.83 1.594l2.297 3.443a1 1 0 0 0 1.272.316l.04-.02a25 25 0 0 0 2.724-1.592l6.87-6.87a6.09 6.09 0 0 1 2.108-1.536l.02-.009a1 1 0 0 0 0-1.784l-.02-.009a6.09 6.09 0 0 1-2.107-1.536l-.009-.02ZM6.5 17a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM3.5 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM2 17.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                  ) : (
                    /* Arrow icon for other steps */
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                    </svg>
                  )}
                </motion.button>
              </div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="border-t border-gray-800 bg-gray-900/50 px-8 py-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold text-white"
        >
          Why choose Nexora?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-4 text-center text-lg text-gray-500"
        >
          The fastest way to go from idea to live website.
        </motion.p>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3">
          {[
            {
              icon: "🤖",
              title: "AI-Powered",
              desc: "Just describe what you want. Our AI designs and builds your site instantly.",
              hoverBorder: "hover:border-cyan-500/50",
              hoverShadow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]",
            },
            {
              icon: "⚡",
              title: "Ready in Seconds",
              desc: "No drag-and-drop. No templates. Just tell the AI and your site is live.",
              hoverBorder: "hover:border-purple-500/50",
              hoverShadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
            },
            {
              icon: "🎨",
              title: "Fully Customizable",
              desc: "Tweak colors, layouts, and content with simple controls after generation.",
              hoverBorder: "hover:border-pink-500/50",
              hoverShadow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className={`rounded-xl border border-gray-800 bg-gray-900 p-8 ${feature.hoverBorder} ${feature.hoverShadow} transition-all duration-200 cursor-pointer`}
            >
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Camera Capture Modal */}
      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={(attachment) => {
          setAttachments((prev) => [...prev, attachment]);
        }}
      />

      {/* Google Drive Picker */}
      <GoogleDrivePicker
        isOpen={showGDrive}
        onClose={() => setShowGDrive(false)}
        onSelect={(newAttachments) => {
          setAttachments((prev) => [...prev, ...newAttachments]);
        }}
      />
    </div>
  );
}
