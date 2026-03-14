"use client";

import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import { Search, ChevronDown } from "lucide-react";

const countryCodes = [
  { code: "+1", country: "US", name: "United States" },
  { code: "+44", country: "UK", name: "United Kingdom" },
  { code: "+61", country: "AU", name: "Australia" },
  { code: "+91", country: "IN", name: "India" },
  { code: "+81", country: "JP", name: "Japan" },
  { code: "+49", country: "DE", name: "Germany" },
  { code: "+33", country: "FR", name: "France" },
  { code: "+86", country: "CN", name: "China" },
  { code: "+55", country: "BR", name: "Brazil" },
  { code: "+971", country: "AE", name: "United Arab Emirates" },
  { code: "+966", country: "SA", name: "Saudi Arabia" },
  { code: "+92", country: "PK", name: "Pakistan" },
  { code: "+20", country: "EG", name: "Egypt" },
  { code: "+234", country: "NG", name: "Nigeria" },
  { code: "+27", country: "ZA", name: "South Africa" },
  { code: "+82", country: "KR", name: "South Korea" },
  { code: "+39", country: "IT", name: "Italy" },
  { code: "+34", country: "ES", name: "Spain" },
  { code: "+7", country: "RU", name: "Russia" },
  { code: "+52", country: "MX", name: "Mexico" },
  { code: "+60", country: "MY", name: "Malaysia" },
  { code: "+65", country: "SG", name: "Singapore" },
  { code: "+31", country: "NL", name: "Netherlands" },
  { code: "+46", country: "SE", name: "Sweden" },
  { code: "+41", country: "CH", name: "Switzerland" },
  { code: "+972", country: "IL", name: "Israel" },
];

export default function SignUp() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang].signUp;

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countryCodes.filter(c =>
    c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
    c.code.includes(countrySearchQuery) ||
    c.country.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  const selectedCountry = countryCodes.find(c => c.code === selectedCountryCode) || countryCodes[0];

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;
  const passwordValid = hasUppercase && hasLowercase && hasNumber && hasMinLength;
  const passwordsMatch = password === confirmPassword;
  const showMismatch = confirmPassword.length > 0 && !passwordsMatch;

  const handleOauthSignIn = async (
    provider: "google" | "microsoft-entra-id" | "apple",
    callbackUrl: string
  ) => {
    setFormError("");
    try {
      await signIn(provider, { callbackUrl, redirect: true });
    } catch {
      setFormError("OAuth sign-in is unavailable right now. Please use email and password.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!passwordValid || !passwordsMatch) {
      setFormError("Please fix the errors before submitting.");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phoneElement = document.getElementById("phone") as HTMLInputElement;
    const phone = phoneElement ? phoneElement.value : "";

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          countryCode: selectedCountryCode,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "An error occurred during signup");
      }

      // Auto login on successful signup
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        throw new Error("Failed to auto-login after signup");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8"
      >
        {/* Header */}
        <h1 className="text-center text-2xl font-bold text-white">
          {t.heading} <span className="text-cyan-400">Nexora</span> {t.headingBrand}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          {t.sub}
        </p>

        {/* OAuth Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => void handleOauthSignIn("google", "/")}
            className="flex items-center justify-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-medium text-white hover:border-gray-600 transition-all duration-200"
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
            type="button"
            onClick={() => void handleOauthSignIn("microsoft-entra-id", "/")}
            className="flex items-center justify-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-medium text-white hover:border-gray-600 transition-all duration-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            {t.withMicrosoft}
          </button>

          <button
            type="button"
            onClick={() => void handleOauthSignIn("apple", "/")}
            className="flex items-center justify-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-medium text-white hover:border-gray-600 transition-all duration-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            {t.withApple}
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-700" />
          <span className="text-xs text-gray-500">{t.or}</span>
          <div className="h-px flex-1 bg-gray-700" />
        </div>

        {/* Sign Up Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {formError && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
              {formError}
            </div>
          )}
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-400">
                {t.firstName}
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                required
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-400">
                {t.lastName}
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                required
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              {t.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-400">
              {t.phone}
            </label>
            <div className="mt-1 flex gap-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="flex w-28 items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                >
                  <span>{selectedCountry.country} {selectedCountry.code}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isCountryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 mt-2 w-64 rounded-xl border border-gray-700 bg-gray-900 p-2 shadow-2xl"
                    >
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Search country or code..."
                          value={countrySearchQuery}
                          onChange={(e) => setCountrySearchQuery(e.target.value)}
                          className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div className="max-h-48 overflow-y-auto pr-1">
                        {filteredCountries.length === 0 ? (
                          <div className="p-3 text-center text-sm text-gray-500">No results found</div>
                        ) : (
                          filteredCountries.map((c) => (
                            <button
                              key={c.code + c.country}
                              type="button"
                              onClick={() => {
                                setSelectedCountryCode(c.code);
                                setIsCountryDropdownOpen(false);
                                setCountrySearchQuery("");
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${selectedCountryCode === c.code
                                ? "bg-cyan-500/10 text-cyan-400"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`}
                            >
                              <span className="truncate pr-2 text-left">{c.name} ({c.country})</span>
                              <span className={`shrink-0 ${selectedCountryCode === c.code ? "text-cyan-500 font-medium" : "text-gray-500"}`}>{c.code}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <input
                id="phone"
                type="tel"
                placeholder="123 456 7890"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              {t.password}
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
                  {hasNumber ? "✓" : "○"} {t.validNum}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">
              {t.confirmPassword}
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`mt-1 w-full rounded-lg border bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 ${showMismatch
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                }`}
            />
            {showMismatch && (
              <p className="mt-2 text-sm text-red-400">{t.mismatch}</p>
            )}
            {confirmPassword.length > 0 && passwordsMatch && (
              <p className="mt-2 text-sm text-green-400">{t.match}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all duration-200 ${isLoading ? "bg-cyan-500/50 text-black/50 cursor-not-allowed" : "bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"}`}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                className="h-5 w-5 rounded-full border-2 border-black/30 border-t-black"
              />
            ) : (
              t.button
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          {t.hasAccount}{" "}
          <Link href="/sign-in" className="text-cyan-400 hover:text-cyan-300 transition">
            {t.signIn}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
