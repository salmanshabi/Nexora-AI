"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, CreditCard, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function NavAuth() {
  const { data: session, status } = useSession();
  const { lang } = useLanguage();
  const t = translations[lang].auth;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-800" />;
  }

  if (session?.user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 rounded-lg border border-transparent p-1 transition-all hover:border-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="hidden text-sm font-medium text-gray-300 sm:inline transition-colors hover:text-white">
            {session.user.name}
          </span>
          <ChevronDown
            className={`hidden sm:block h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 w-56 transform overflow-hidden rounded-xl border border-gray-800 bg-gray-950 p-1 shadow-2xl z-50 origin-top-right"
            >
              <div className="px-3 py-2 border-b border-gray-800/50 mb-1">
                <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
              </div>

              <div className="space-y-0.5">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-cyan-400 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t.dashboard}
                </Link>

                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-cyan-400 transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  {t.subscription}
                </Link>

                <button
                  className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-gray-900 hover:text-gray-200 transition-colors cursor-not-allowed opacity-50"
                  disabled
                >
                  <Settings className="h-4 w-4" />
                  {t.settings}
                </button>
              </div>

              <div className="mt-1 border-t border-gray-800/50 pt-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  {t.signOut}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
