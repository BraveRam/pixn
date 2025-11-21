import { Skeleton } from "@/components/ui/skeleton";

export default function GallerySkeleton() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-10">
            <div className="container mx-auto px-4">
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 mx-auto max-w-7xl">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="break-inside-avoid mb-4">
                            <div className="relative rounded-xl overflow-hidden bg-secondary/20">
                                {/* Use deterministic heights based on index to avoid hydration mismatch */}
                                <Skeleton
                                    className="w-full"
                                    style={{ height: `${(i % 3 + 2) * 100 + (i % 2) * 50}px` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
