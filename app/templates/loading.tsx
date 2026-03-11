export default function TemplatesLoading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar skeleton */}
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
                <div className="mx-auto flex w-full items-center justify-between px-8 py-4 max-w-[1600px]">
                    <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                </div>
            </nav>

            <main className="mx-auto max-w-[1400px] px-8 py-10 mt-4">
                {/* Search skeleton */}
                <div className="flex gap-6 mb-12">
                    <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-10 flex-1 bg-gray-100 rounded-lg animate-pulse" />
                </div>

                {/* Grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-4">
                            <div
                                className="aspect-[4/4.5] w-full bg-gray-100 rounded-sm animate-pulse"
                                style={{ animationDelay: `${i * 80}ms` }}
                            />
                            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
