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
