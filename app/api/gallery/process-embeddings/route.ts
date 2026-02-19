import { createClient } from "@/utils/supabase/server";
import { generateImageDescription, generateEmbedding } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: galleryImages, error: galleryError } = await supabase
      .from("gallery")
      .select("path")
      .eq("user_id", user.id);

    if (galleryError) {
      throw new Error(
        `Failed to fetch gallery images: ${galleryError.message}`
      );
    }

    if (!galleryImages || galleryImages.length === 0) {
      return NextResponse.json({ message: "No images in gallery" });
    }

    const { data: existingEmbeddings, error: embeddingsError } = await supabase
      .from("embeddings")
      .select("path")
      .eq("user_id", user.id);

    if (embeddingsError) {
      throw new Error(
        `Failed to fetch existing embeddings: ${embeddingsError.message}`
      );
    }

    const existingPaths = new Set(existingEmbeddings?.map((e) => e.path) || []);

    const missingImages = galleryImages.filter(
      (img) => !existingPaths.has(img.path)
    );

    if (missingImages.length === 0) {
      return NextResponse.json({ message: "All images have embeddings" });
    }

    console.log(`Processing ${missingImages.length} missing images...`);

    const results = [];

    for (const img of missingImages) {
      try {
        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from("images")
            .createSignedUrl(img.path, 60 * 5); // 5 minutes

        if (signedUrlError || !signedUrlData?.signedUrl) {
          console.error(
            `Failed to create signed URL for ${img.path}:`,
            signedUrlError
          );
          results.push({
            path: img.path,
            status: "error",
            error: "Failed to create signed URL",
          });
          continue;
        }

        const description = await generateImageDescription(
          signedUrlData.signedUrl
        );

        const embedding = await generateEmbedding(description);

        const { error: insertError } = await supabase
          .from("embeddings")
          .insert({
            path: img.path,
            user_id: user.id,
            content: description,
            embedding: embedding,
          });

        if (insertError) {
          console.error(
            `Failed to insert embedding for ${img.path}:`,
            insertError
          );
          results.push({
            path: img.path,
            status: "error",
            error: insertError.message,
          });
        } else {
          results.push({ path: img.path, status: "success" });
        }
      } catch (err: unknown) {
        console.error(`Error processing ${img.path}:`, err);
        results.push({
          path: img.path,
          status: "error",
          error: (err as Error).message,
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${results.length} images`,
      results,
    });
  } catch (error: unknown) {
    console.error("Error in process-embeddings:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
