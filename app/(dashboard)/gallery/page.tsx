// app/dashboard/page.tsx
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Gallery from "./gallery";

export default function Page() {
  return (
    <div className="flex flex-col items-center gap-6 px-3 py-8 max-w-7xl mx-auto">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96 w-96">
            <Loader2 className="animate-spin text-white" />
          </div>
        }
      >
        <Gallery />
      </Suspense>
    </div>
  );
}
