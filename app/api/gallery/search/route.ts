import { createClient } from "@/utils/supabase/server";
import { generateEmbedding } from "@/lib/ai";
import { NextResponse } from "next/server";

// Type for the match_embeddings function response
interface MatchResult {
    id: string;      // Image path (text)
    similarity: number;
}

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Generate embedding for the query
        const embedding = await generateEmbedding(query);

        // 2. Call RPC function to match embeddings
        // Function returns: { id: text, similarity: float }[]
        const { data: matchedResults, error: matchError } = await supabase.rpc(
            "match_embeddings",
            {
                query_embedding: embedding,
                match_threshold: 0.75, // Adjust threshold as needed
                match_count: 20,
                filter_user_id: user.id,
            }
        );

        if (matchError) {
            return NextResponse.json({ error: "Error matching embeddings" }, { status: 500 });
        }

        if (!matchedResults || matchedResults.length === 0) {
            return NextResponse.json({ results: [] });
        }

        // Extract paths from the matched results
        const typedResults = matchedResults as MatchResult[];
        const paths = typedResults.map((match) => match.id);

        // 3. Fetch image metadata from gallery
        const { data: images, error: galleryError } = await supabase
            .from("gallery")
            .select("path, name, size, favorite, user_id, created_at")
            .in("path", paths);

        if (galleryError) {
            return NextResponse.json({ results: [] });
        }

        if (!images || images.length === 0) {
            return NextResponse.json({ results: [] });
        }

        // 4. Generate signed URLs for the images
        const signedImages = await Promise.all(
            images.map(async (img) => {
                const { data } = await supabase.storage
                    .from("images")
                    .createSignedUrl(img.path, 60 * 60 * 24 * 30); // 30 days
                return {
                    ...img,
                    signedUrl: data?.signedUrl || null,
                };
            })
        );

        // Filter out images without signed URLs
        const validImages = signedImages.filter((img) => img.signedUrl);

        // Sort results based on similarity score (order from match_embeddings)
        // Preserve the ranking returned by the database function
        const sortedImages = validImages.sort((a, b) => {
            return paths.indexOf(a.path) - paths.indexOf(b.path);
        });

        return NextResponse.json({ results: sortedImages });

    } catch (error: unknown) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
