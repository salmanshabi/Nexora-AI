"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function FooterText() {
  const { lang } = useLanguage();
  return <p>{translations[lang].footer.rights}</p>;
}
