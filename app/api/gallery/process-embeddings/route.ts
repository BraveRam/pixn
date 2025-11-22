import { createClient } from "@/utils/supabase/server";
import { generateImageDescription, generateEmbedding } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    try {
        // 1. Fetch all images from gallery
        const { data: galleryImages, error: galleryError } = await supabase
            .from("gallery")
            .select("path");

        if (galleryError) {
            throw new Error(`Failed to fetch gallery images: ${galleryError.message}`);
        }

        if (!galleryImages || galleryImages.length === 0) {
            return NextResponse.json({ message: "No images in gallery" });
        }

        // 2. Fetch existing embeddings (ids)
        const { data: existingEmbeddings, error: embeddingsError } = await supabase
            .from("embeddings")
            .select("id");

        if (embeddingsError) {
            throw new Error(`Failed to fetch existing embeddings: ${embeddingsError.message}`);
        }

        const existingIds = new Set(existingEmbeddings?.map((e) => e.id) || []);

        // 3. Identify missing images
        const missingImages = galleryImages.filter((img) => !existingIds.has(img.path));

        if (missingImages.length === 0) {
            return NextResponse.json({ message: "All images have embeddings" });
        }

        console.log(`Processing ${missingImages.length} missing images...`);

        const results = [];

        // 4. Process each missing image
        for (const img of missingImages) {
            try {
                // Generate signed URL for AI to access
                const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                    .from("images")
                    .createSignedUrl(img.path, 60 * 5); // 5 minutes

                if (signedUrlError || !signedUrlData?.signedUrl) {
                    console.error(`Failed to create signed URL for ${img.path}:`, signedUrlError);
                    results.push({ path: img.path, status: "error", error: "Failed to create signed URL" });
                    continue;
                }

                // Generate description
                const description = await generateImageDescription(signedUrlData.signedUrl);

                // Generate embedding
                const embedding = await generateEmbedding(description);

                // Insert into embeddings table
                const { error: insertError } = await supabase
                    .from("embeddings")
                    .insert({
                        path: img.path,
                        content: description,
                        embedding: embedding,
                    });

                if (insertError) {
                    console.error(`Failed to insert embedding for ${img.path}:`, insertError);
                    results.push({ path: img.path, status: "error", error: insertError.message });
                } else {
                    results.push({ path: img.path, status: "success" });
                }

            } catch (err: unknown) {
                console.error(`Error processing ${img.path}:`, err);
                results.push({ path: img.path, status: "error", error: (err as Error).message });
            }
        }

        return NextResponse.json({
            message: `Processed ${results.length} images`,
            results,
        });

    } catch (error: unknown) {
        console.error("Error in process-embeddings:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
