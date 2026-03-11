"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
            <div className="text-center max-w-md px-6">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Dashboard unavailable</h2>
                <p className="text-gray-400 text-sm mb-6">
                    We hit an error loading your projects. Please try again.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold text-sm hover:bg-cyan-400 transition"
                    >
                        Try again
                    </button>
                    <Link
                        href="/sign-in"
                        className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:text-white hover:border-gray-600 transition"
                    >
                        Sign in again
                    </Link>
                </div>
            </div>
        </div>
    );
}
