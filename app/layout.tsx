import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        <nav className="flex items-center justify-between border-b border-gray-800 bg-gray-950/80 px-8 py-4 backdrop-blur">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-8 w-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">
              {/* X crosshairs */}
              <line x1="7" y1="7" x2="25" y2="25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <line x1="25" y1="7" x2="7" y2="25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              {/* Glowing node dots at each tip */}
              <circle cx="7" cy="7" r="2.5" fill="currentColor" opacity="0.7"/>
              <circle cx="25" cy="7" r="2.5" fill="currentColor" opacity="0.7"/>
              <circle cx="7" cy="25" r="2.5" fill="currentColor" opacity="0.7"/>
              <circle cx="25" cy="25" r="2.5" fill="currentColor" opacity="0.7"/>
              {/* Center core */}
              <circle cx="16" cy="16" r="3.5" fill="currentColor"/>
              <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
            </svg>
            Nexora
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-gray-400 hover:text-cyan-400 transition">
              About
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-cyan-400 transition">
              Pricing
            </Link>
            <Link href="/sign-in" className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400 transition">
              Sign In
            </Link>
          </div>
        </nav>
        {children}
        <footer className="border-t border-gray-800 bg-gray-950 px-8 py-8 text-center text-sm text-gray-600">
          <p>&copy; 2025 Nexora. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
