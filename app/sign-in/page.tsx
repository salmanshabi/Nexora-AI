"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang].signIn;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setFormError("Invalid email or password. Please try again.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            type="button"
            onClick={() => void handleOauthSignIn("google", "/dashboard")}
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
            onClick={() => void handleOauthSignIn("microsoft-entra-id", "/dashboard")}
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
            onClick={() => void handleOauthSignIn("apple", "/dashboard")}
            className="flex items-center justify-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-medium text-white hover:border-gray-600 transition-all duration-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            {t.withApple}
          </button>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-700" />
          <span className="text-xs text-gray-500">{t.or}</span>
          <div className="h-px flex-1 bg-gray-700" />
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {formError && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {formError}
            </div>
          )}

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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              {t.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all duration-200 ${
              isLoading
                ? "bg-cyan-500/50 text-black/50 cursor-not-allowed"
                : "bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            }`}
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
