"use client";

import React, { useState } from "react";
import { Search, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Template {
    id: string;
    name: string;
    category: string;
    description: string;
    preview: React.ReactNode;
    tags: string[];
}

// ─── CSS Mini-Website Previews ────────────────────────────────────────────────
// Each preview is a scaled-down rendition of the actual template's design tokens

function SaasPreview() {
    return (
        <div className="w-full h-full bg-[#020617] font-sans overflow-hidden relative flex flex-col">
            {/* Nav */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                    <div className="h-1.5 w-8 bg-white/80 rounded-full" />
                </div>
                <div className="flex gap-2">
                    <div className="h-1 w-5 bg-white/30 rounded-full" />
                    <div className="h-1 w-5 bg-white/30 rounded-full" />
                    <div className="h-4 w-8 bg-[#4F46E5] rounded px-1 flex items-center justify-center">
                        <div className="h-0.5 w-4 bg-white rounded-full" />
                    </div>
                </div>
            </div>
            {/* Hero */}
            <div className="flex-1 px-3 pt-2">
                <div className="h-1.5 w-20 bg-[#4F46E5]/40 rounded-full mb-2" />
                <div className="h-3 w-full bg-white/90 rounded-full mb-1" />
                <div className="h-3 w-3/4 bg-white/90 rounded-full mb-1" />
                <div className="h-2 w-full bg-white/25 rounded-full mb-1" />
                <div className="h-2 w-5/6 bg-white/25 rounded-full mb-3" />
                <div className="flex gap-1.5 mb-3">
                    <div className="h-5 w-14 bg-[#4F46E5] rounded flex items-center justify-center">
                        <div className="h-1 w-8 bg-white rounded-full" />
                    </div>
                    <div className="h-5 w-14 border border-white/20 rounded flex items-center justify-center">
                        <div className="h-1 w-8 bg-white/50 rounded-full" />
                    </div>
                </div>
                {/* App mockup */}
                <div className="w-full h-16 bg-[#0F172A] rounded-lg border border-[#1E293B] flex items-center justify-center overflow-hidden">
                    <div className="grid grid-cols-3 gap-1 w-full px-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 rounded bg-[#1E293B] p-1">
                                <div className="h-1 w-full bg-[#4F46E5]/60 rounded mb-1" />
                                <div className="h-0.5 w-3/4 bg-white/20 rounded" />
                                <div className="h-0.5 w-1/2 bg-white/20 rounded mt-0.5" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Feature dots */}
            <div className="grid grid-cols-3 gap-1 px-3 pb-3 mt-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-8 bg-[#0F172A] rounded border border-[#1E293B] p-1">
                        <div className="w-2 h-2 bg-[#4F46E5] rounded mb-1" />
                        <div className="h-0.5 w-full bg-white/30 rounded" />
                        <div className="h-0.5 w-2/3 bg-white/20 rounded mt-0.5" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function AgencyPreview() {
    return (
        <div className="w-full h-full bg-[#09090B] font-sans overflow-hidden flex flex-col">
            {/* Nav */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
                <div className="h-2 w-14 bg-white rounded-full" />
                <div className="h-4 w-8 bg-[#39FF14] rounded" />
            </div>
            {/* Hero */}
            <div className="flex-1 px-3 pt-1">
                <div className="h-5 w-full bg-white rounded-sm mb-1" />
                <div className="h-5 w-4/5 bg-white rounded-sm mb-1" />
                <div className="h-5 w-3/5 bg-[#39FF14] rounded-sm mb-3" />
                <div className="h-1.5 w-full bg-white/20 rounded mb-1" />
                <div className="h-1.5 w-4/5 bg-white/20 rounded mb-3" />
                <div className="h-5 w-16 bg-[#39FF14] rounded flex items-center justify-center">
                    <div className="h-1 w-8 bg-black rounded-full" />
                </div>
            </div>
            {/* Service grid */}
            <div className="grid grid-cols-2 gap-1 px-3 pb-3 mt-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 bg-white/5 border border-white/10 rounded p-1.5">
                        <div className="h-1 w-full bg-white/40 rounded mb-1" />
                        <div className="h-0.5 w-3/4 bg-white/20 rounded" />
                        <div className="h-0.5 w-1/2 bg-[#39FF14]/40 rounded mt-1" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function EcommercePreview() {
    const colors = ["bg-rose-300", "bg-amber-200", "bg-sky-300", "bg-emerald-200", "bg-violet-300", "bg-orange-200"];
    return (
        <div className="w-full h-full bg-white font-sans overflow-hidden flex flex-col">
            {/* Nav */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-gray-100">
                <div className="h-2 w-14 bg-gray-800 rounded-full" />
                <div className="flex gap-2 items-center">
                    <div className="h-1 w-5 bg-gray-300 rounded" />
                    <div className="h-1 w-5 bg-gray-300 rounded" />
                    <div className="h-4 w-4 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
                    </div>
                </div>
            </div>
            {/* Hero banner */}
            <div className="mx-3 mt-2 h-10 bg-gradient-to-r from-rose-50 to-pink-100 rounded-lg flex items-center px-2 gap-2">
                <div>
                    <div className="h-1.5 w-16 bg-rose-400 rounded mb-1" />
                    <div className="h-1 w-10 bg-gray-300 rounded" />
                </div>
                <div className="ml-auto h-6 w-6 bg-rose-200 rounded-full" />
            </div>
            {/* Product grid */}
            <div className="grid grid-cols-3 gap-1.5 px-3 pt-2 pb-3 flex-1">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col">
                        <div className={`${colors[i]} rounded-md flex-1 min-h-[32px] mb-1`} />
                        <div className="h-1 w-full bg-gray-200 rounded mb-0.5" />
                        <div className="h-1 w-8 bg-gray-800 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function RestaurantPreview() {
    return (
        <div className="w-full h-full bg-[#1A0A00] font-sans overflow-hidden flex flex-col relative">
            {/* Hero image */}
            <div className="h-24 bg-gradient-to-b from-[#8B4513]/60 to-[#1A0A00] relative flex items-end px-3 pb-2">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=60')] bg-cover bg-center opacity-50" />
                <div className="relative">
                    <div className="h-3 w-24 bg-[#D4AF37] rounded mb-1" />
                    <div className="h-1.5 w-16 bg-white/60 rounded" />
                </div>
            </div>
            {/* Menu items */}
            <div className="px-3 pt-2 flex-1">
                <div className="h-1.5 w-10 bg-[#D4AF37] rounded mb-2" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-[#3D1A00] rounded flex-shrink-0" />
                        <div className="flex-1">
                            <div className="h-1 w-3/4 bg-white/70 rounded mb-1" />
                            <div className="h-0.5 w-full bg-white/30 rounded" />
                        </div>
                        <div className="h-1.5 w-6 bg-[#D4AF37] rounded" />
                    </div>
                ))}
            </div>
            {/* Reserve CTA */}
            <div className="mx-3 mb-3 h-6 bg-[#D4AF37] rounded flex items-center justify-center">
                <div className="h-1 w-16 bg-black rounded" />
            </div>
        </div>
    );
}

function CreativePreview() {
    return (
        <div className="w-full h-full bg-[#F5F0EB] font-sans overflow-hidden flex flex-col">
            {/* Nav */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
                <div className="h-1.5 w-10 bg-gray-800 rounded-full" />
                <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-1 w-4 bg-gray-400 rounded" />
                    ))}
                </div>
            </div>
            {/* Hero */}
            <div className="px-3">
                <div className="h-8 w-full bg-gray-900 rounded-sm mb-1" />
                <div className="h-8 w-4/5 bg-gray-900 rounded-sm mb-1" />
                <div className="h-8 w-2/3 bg-[#E8673C] rounded-sm mb-3" />
            </div>
            {/* Work grid */}
            <div className="grid grid-cols-2 gap-1.5 px-3 flex-1 pb-3">
                <div className="bg-[#C8B4A0] rounded-md" />
                <div className="flex flex-col gap-1.5">
                    <div className="bg-gray-800 rounded-md flex-1" />
                    <div className="bg-[#E8673C] rounded-md flex-1" />
                </div>
                <div className="bg-[#E8E0D8] rounded-md border border-gray-200" />
                <div className="bg-gray-700 rounded-md" />
            </div>
        </div>
    );
}

function PersonalPreview() {
    return (
        <div className="w-full h-full bg-white font-sans overflow-hidden flex flex-col">
            {/* Nav */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-300" />
                <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-1 w-4 bg-gray-300 rounded" />
                    ))}
                </div>
            </div>
            {/* Profile */}
            <div className="flex flex-col items-center px-3 pt-2 pb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 mb-2" />
                <div className="h-2 w-20 bg-gray-800 rounded mb-1" />
                <div className="h-1.5 w-16 bg-violet-400 rounded mb-1" />
                <div className="h-1 w-24 bg-gray-300 rounded mb-1" />
                <div className="h-1 w-20 bg-gray-300 rounded" />
            </div>
            {/* Work samples */}
            <div className="grid grid-cols-3 gap-1 px-3 pb-3 flex-1">
                {["bg-violet-100", "bg-purple-200", "bg-indigo-100", "bg-violet-200", "bg-purple-100", "bg-indigo-200"].map((c, i) => (
                    <div key={i} className={`${c} rounded`} />
                ))}
            </div>
        </div>
    );
}

function BlankPreview() {
    return (
        <div className="w-full h-full bg-white font-sans overflow-hidden flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                </svg>
            </div>
            <div className="h-1.5 w-16 bg-gray-200 rounded" />
            <div className="h-1 w-10 bg-gray-100 rounded" />
            <div className="flex gap-1 mt-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-6 h-1 bg-gray-100 rounded border border-dashed border-gray-200" />
                ))}
            </div>
        </div>
    );
}

// ─── Template Definitions ─────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
    {
        id: "saas",
        name: "Velocity",
        category: "SaaS",
        description: "Dark modern SaaS landing page with pricing, features, and testimonials.",
        tags: ["SaaS", "Dark", "Startup"],
        preview: <SaasPreview />,
    },
    {
        id: "agency",
        name: "Kinetic",
        category: "Agency",
        description: "Bold digital agency site with neon accents and full-page sections.",
        tags: ["Agency", "Dark", "Creative"],
        preview: <AgencyPreview />,
    },
    {
        id: "ecommerce",
        name: "Boutique",
        category: "E-commerce",
        description: "Clean online store with product grid, cart, and promotions.",
        tags: ["Shop", "E-commerce", "Light"],
        preview: <EcommercePreview />,
    },
    {
        id: "restaurant",
        name: "Saveur",
        category: "Restaurant",
        description: "Atmospheric restaurant site with menu, reservations, and location.",
        tags: ["Restaurant", "Food", "Dark"],
        preview: <RestaurantPreview />,
    },
    {
        id: "creative",
        name: "Studio",
        category: "Portfolio",
        description: "Minimal creative portfolio with bold typography and work showcase.",
        tags: ["Portfolio", "Creative", "Light"],
        preview: <CreativePreview />,
    },
    {
        id: "personal",
        name: "Profile",
        category: "Personal",
        description: "Personal site with bio, skills, contact links, and project gallery.",
        tags: ["Personal", "Portfolio", "Minimal"],
        preview: <PersonalPreview />,
    },
    {
        id: "blank",
        name: "Blank Canvas",
        category: "Blank",
        description: "Start from scratch with an empty editor and full creative control.",
        tags: ["Blank", "Custom"],
        preview: <BlankPreview />,
    },
];

const CATEGORIES = ["All", "SaaS", "Agency", "E-commerce", "Restaurant", "Portfolio", "Personal", "Blank"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TemplatesClient({ user }: { user: { name: string; email: string } | null }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const router = useRouter();

    const filtered = TEMPLATES.filter((t) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            q === "" ||
            t.name.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q));
        const matchesCategory = activeCategory === "All" || t.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans pb-24">
            {/* Top bar */}
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
                <div className="mx-auto flex w-full items-center justify-between px-6 py-3 max-w-[1500px]">
                    <div className="flex items-center gap-5">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft size={15} />
                            Dashboard
                        </Link>
                        <span className="text-gray-200">|</span>
                        <span className="font-bold text-sm tracking-tight text-gray-900">
                            Choose a template
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-400 hidden md:block">{user.email}</span>
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/sign-in"
                                className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-[1500px] px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Start with a template
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Every template is fully editable in Nexora Studio. Pick one and make it yours.
                    </p>
                </div>

                {/* Search + filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-52 rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-8 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    activeCategory === cat
                                        ? "bg-gray-900 text-white shadow-sm"
                                        : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400 hover:text-gray-800"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map((tpl) => (
                            <div
                                key={tpl.id}
                                onClick={() => router.push(`/builder?template=${tpl.id}`)}
                                className="group cursor-pointer flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
                            >
                                {/* Preview window */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                                    {/* Browser chrome */}
                                    <div className="absolute top-0 inset-x-0 h-5 bg-gray-100 border-b border-gray-200 flex items-center px-2 gap-1 z-10">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        <div className="ml-2 flex-1 h-2 bg-gray-200 rounded-full" />
                                    </div>
                                    {/* Template preview */}
                                    <div className="absolute inset-0 top-5">
                                        {tpl.preview}
                                    </div>
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 bg-white text-gray-900 px-4 py-1.5 rounded-full font-semibold text-xs shadow-lg border border-gray-100">
                                            Use template
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3.5">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                                            {tpl.name}
                                        </h3>
                                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                                            {tpl.category}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                                        {tpl.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-base font-medium">No templates match your search.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                            className="mt-3 text-sm text-blue-600 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
