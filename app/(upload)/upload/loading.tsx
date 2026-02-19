import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-10 flex flex-col items-center">
      <div className="w-full max-w-2xl px-4 space-y-8">
        <div className="text-center space-y-2">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-5 w-96 max-w-full mx-auto" />
        </div>
        <div className="bg-card border border-border rounded-3xl shadow-sm p-6 sm:p-10">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
