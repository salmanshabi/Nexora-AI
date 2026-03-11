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
