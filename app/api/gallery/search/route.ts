import { createClient } from "@/utils/supabase/server";
import { generateEmbedding } from "@/lib/ai";
import { NextResponse } from "next/server";

interface MatchResult {
  id: string;
  similarity: number;
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await generateEmbedding(query);

    const { data: matchedResults, error: matchError } = await supabase.rpc(
      "match_embeddings",
      {
        query_embedding: embedding,
        // Tuned for openai/text-embedding-3-small: relevant matches score
        // ~0.3-0.5 cosine — much lower than Gemini's SEMANTIC_SIMILARITY range,
        // so the old 0.75 cutoff filtered out every result. Lower if too strict.
        match_threshold: 0.3,
        match_count: 20,
        filter_user_id: user.id,
      }
    );

    if (matchError) {
      return NextResponse.json(
        { error: "Error matching embeddings" },
        { status: 500 }
      );
    }

    if (!matchedResults || matchedResults.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const typedResults = matchedResults as MatchResult[];
    const paths = typedResults.map((match) => match.id);

    const { data: images, error: galleryError } = await supabase
      .from("gallery")
      .select("path, name, size, favorite, user_id, created_at")
      .in("path", paths)
      .eq("user_id", user.id);

    if (galleryError) {
      return NextResponse.json({ results: [] });
    }

    if (!images || images.length === 0) {
      return NextResponse.json({ results: [] });
    }

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

    const validImages = signedImages.filter((img) => img.signedUrl);

    const sortedImages = validImages.sort((a, b) => {
      return paths.indexOf(a.path) - paths.indexOf(b.path);
    });

    return NextResponse.json({ results: sortedImages });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
