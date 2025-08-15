// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server";
import ImageList from "./ImageList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Images, Loader2 } from "lucide-react";
import { Suspense } from "react";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.storage.from("images").list(user?.id, {
    limit: 100,
    offset: 0,
    sortBy: { column: "created_at", order: "desc" },
  });

  const signedUrlsRes = await supabase.storage.from("images").createSignedUrls(
    data?.map((file) => `${user?.id}/${file.name}`) || [],
    60 * 60 * 24 * 30 // 30 days
  );

  const images = (signedUrlsRes.data || [])
    .filter((img) => img.path !== null)
    .map((img) => ({
      ...img,
      path: img.path!,
      favorite: false,
    }));

  return (
    <div className="flex flex-col items-center gap-6 px-3 py-8 max-w-7xl mx-auto">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96 w-96">
            <Loader2 className="animate-spin text-white" />
          </div>
        }
      >
        {images.length === 0 ? (
          <div className="text-center space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              You haven’t uploaded any images yet.
            </h2>
            <Link href="/upload" prefetch>
              <Button className="text-base">Upload Images</Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-center mb-8">
              <span className="flex items-center justify-center gap-2">
                <Images />
                Gallery
              </span>
            </h1>
            <ImageList images={images} />
          </>
        )}
      </Suspense>
    </div>
  );
}
