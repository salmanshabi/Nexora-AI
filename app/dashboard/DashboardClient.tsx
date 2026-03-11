"use client";

import { motion } from "framer-motion";
import { Plus, Settings, LogOut, Layout, MoreVertical } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface Project {
    id: string;
    name: string;
    updatedAt: Date;
}

export default function DashboardClient({ user, projects }: { user: { name: string, email: string }, projects: Project[] }) {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-black font-bold">
                            N
                        </div>
                        <span className="text-xl font-bold tracking-tight">Nexora <span className="text-cyan-400">Dashboard</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden text-sm md:block text-gray-400">
                            {user.email}
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 hover:text-white transition hover:bg-gray-700"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                            Welcome back, <span className="text-cyan-400">{user.name.split(" ")[0]}</span>!
                        </h1>
                        <p className="text-gray-400">Manage your websites and builder projects.</p>
                    </div>
                    <Link href="/templates">
                        <button className="flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-black shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300 transform hover:-translate-y-0.5">
                            <Plus className="h-5 w-5" />
                            Create New Website
                        </button>
                    </Link>
                </motion.div>

                {projects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center justify-center rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm px-6 py-24 text-center shadow-lg"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 mb-6 border border-gray-700">
                            <Layout className="h-8 w-8 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
                        <p className="text-gray-400 max-w-sm mb-8">
                            You haven't created any websites. Start building your first Nexora AI powered site now.
                        </p>
                        <Link href="/templates">
                            <button className="rounded-lg bg-white/10 px-5 py-2.5 font-medium text-white hover:bg-white/20 transition backdrop-blur-sm border border-white/5">
                                Start Building
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative flex flex-col justify-between rounded-xl border border-gray-800 bg-gray-900 p-6 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                        <Layout className="h-6 w-6" />
                                    </div>
                                    <button className="text-gray-500 hover:text-white transition">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Last edited {new Date(project.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
