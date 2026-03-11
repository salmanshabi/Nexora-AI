export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-gray-950">
            {/* Navbar skeleton */}
            <nav className="border-b border-gray-800 bg-gray-900/50">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="h-8 w-40 bg-gray-800 rounded animate-pulse" />
                    <div className="h-9 w-24 bg-gray-800 rounded-lg animate-pulse" />
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Header skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <div className="space-y-2">
                        <div className="h-8 w-72 bg-gray-800 rounded animate-pulse" />
                        <div className="h-4 w-56 bg-gray-800/60 rounded animate-pulse" />
                    </div>
                    <div className="h-12 w-44 bg-gray-800 rounded-lg animate-pulse" />
                </div>

                {/* Projects grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-gray-800 bg-gray-900 p-6 animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="h-12 w-12 rounded-lg bg-gray-800 mb-8" />
                            <div className="space-y-2">
                                <div className="h-5 w-3/4 bg-gray-800 rounded" />
                                <div className="h-3 w-1/2 bg-gray-800/60 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
