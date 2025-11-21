import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-10">
      <div className="container mx-auto px-4">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 mx-auto max-w-7xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="break-inside-avoid mb-4">
              <div className="relative rounded-xl overflow-hidden bg-secondary/20">
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
