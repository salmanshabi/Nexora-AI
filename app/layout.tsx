import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import SessionProvider from "./components/SessionProvider";
import NavAuth from "./components/NavAuth";
import LanguageToggle from "./components/LanguageToggle";
import NavLinks from "./components/NavLinks";
import FooterText from "./components/FooterText";
import { LanguageProvider } from "./context/LanguageContext";
import AnimatedBackground from "./components/AnimatedBackground";
import { ChatWidget } from "../components/chat-widget";
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
            <AnimatedBackground />
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
            <ChatWidget />
            <footer className="border-t border-gray-800 bg-gray-950 px-8 py-8 text-center text-sm text-gray-600">
              <FooterText />
            </footer>
          </SessionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
