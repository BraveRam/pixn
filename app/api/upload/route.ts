import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateImageDescription, generateEmbedding } from "@/lib/ai";

const MAX_IMAGES_PER_USER = 20;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "No files provided" },
                { status: 400 }
            );
        }

        // Check current image count
        const { count, error: countError } = await supabase
            .from("gallery")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);

        if (countError) {
            console.error("Count error:", countError);
            return NextResponse.json({ error: countError.message }, { status: 400 });
        }

        const currentCount = count || 0;
        const newCount = currentCount + files.length;

        if (newCount > MAX_IMAGES_PER_USER) {
            return NextResponse.json(
                {
                    error: `Image limit exceeded. You can only upload ${MAX_IMAGES_PER_USER} images in total. You currently have ${currentCount} images.`
                },
                { status: 400 }
            );
        }

        const uploadedImages = [];
        const embeddingsToInsert = [];

        for (const file of files) {
            const filePath = `${user.id}/${Date.now()}-${file.name}`;
            const { error } = await supabase.storage
                .from("images")
                .upload(filePath, file);

            if (error) {
                console.error("Upload error:", error);
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            // Generate AI metadata
            try {
                const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                    .from("images")
                    .createSignedUrl(filePath, 60 * 5);

                if (!signedUrlError && signedUrlData?.signedUrl) {
                    const description = await generateImageDescription(signedUrlData.signedUrl);
                    const embedding = await generateEmbedding(description);

                    console.log("Description:", description);
                    console.log("Embedding:", embedding);

                    embeddingsToInsert.push({
                        path: filePath,
                        user_id: user.id,
                        content: description,
                        embedding: embedding,
                    });
                } else {
                    console.error("Failed to generate signed URL for AI processing:", signedUrlError);
                }
            } catch (aiError) {
                console.error("AI processing failed for image:", file.name, aiError);
                // Continue with upload even if AI fails
            }

            uploadedImages.push({
                user_id: user.id,
                name: file.name,
                path: filePath,
                size: file.size,
            });
        }

        if (uploadedImages.length > 0) {
            const { error } = await supabase.from("gallery").insert(uploadedImages);
            if (error) {
                console.error("Database insert error:", error);
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            // Insert embeddings
            if (embeddingsToInsert.length > 0) {
                const { error: embeddingError } = await supabase.from("embeddings").insert(embeddingsToInsert);
                if (embeddingError) {
                    console.error("Failed to insert embeddings:", embeddingError);
                    // We don't fail the request here as the images are already uploaded and in gallery
                }
            }
        }

        return NextResponse.json(
            { success: true, uploaded: uploadedImages.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
