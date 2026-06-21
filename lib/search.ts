import type { createClient } from "@/utils/supabase/server";
import { generateEmbedding } from "@/lib/ai";

// The authenticated server-side Supabase client (callers own auth).
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
// Tuned for openai/text-embedding-3-small (relevant matches score ~0.3-0.5).
const DEFAULT_MATCH_THRESHOLD = 0.3;
const DEFAULT_MATCH_COUNT = 20;

interface MatchResult {
  id: string; // gallery/embeddings storage path
  similarity: number;
}

interface GalleryRow {
  path: string;
  name: string;
  size: number;
  favorite: boolean;
  user_id: string;
  created_at: string | null;
}

export interface SearchedImage extends GalleryRow {
  signedUrl: string;
  content: string | null; // AI-generated description from `embeddings.content`
  similarity: number;
}

export interface SearchUserImagesOptions {
  matchThreshold?: number;
  matchCount?: number;
}

/**
 * Semantic image search for a single user: embed the query, match it against the
 * user's `embeddings` vectors, join metadata + descriptions, and return images with
 * 30-day signed URLs ordered by similarity. Shared by the gallery search route and
 * the chat image-search tool.
 */
export async function searchUserImages(
  supabase: SupabaseServerClient,
  userId: string,
  query: string,
  opts: SearchUserImagesOptions = {}
): Promise<SearchedImage[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const embedding = await generateEmbedding(trimmed);

  const { data: matched, error: matchError } = await supabase.rpc(
    "match_embeddings",
    {
      query_embedding: embedding,
      match_threshold: opts.matchThreshold ?? DEFAULT_MATCH_THRESHOLD,
      match_count: opts.matchCount ?? DEFAULT_MATCH_COUNT,
      filter_user_id: userId,
    }
  );

  if (matchError) {
    throw new Error(`Failed to match embeddings: ${matchError.message}`);
  }

  const results = (matched ?? []) as MatchResult[];
  if (results.length === 0) return [];

  const paths = results.map((match) => match.id);
  const similarityByPath = new Map(results.map((m) => [m.id, m.similarity]));

  // Gallery metadata + embedding descriptions for the matched paths, in parallel.
  const [galleryResponse, embeddingsResponse] = await Promise.all([
    supabase
      .from("gallery")
      .select("path, name, size, favorite, user_id, created_at")
      .in("path", paths)
      .eq("user_id", userId),
    supabase
      .from("embeddings")
      .select("path, content")
      .in("path", paths)
      .eq("user_id", userId),
  ]);

  if (galleryResponse.error || !galleryResponse.data) return [];

  const galleryRows = galleryResponse.data as GalleryRow[];
  const contentByPath = new Map(
    ((embeddingsResponse.data ?? []) as { path: string; content: string | null }[]).map(
      (row) => [row.path, row.content]
    )
  );

  const signed = await Promise.all(
    galleryRows.map(async (img) => {
      const { data } = await supabase.storage
        .from("images")
        .createSignedUrl(img.path, SIGNED_URL_TTL_SECONDS);
      if (!data?.signedUrl) return null;
      return {
        ...img,
        signedUrl: data.signedUrl,
        content: contentByPath.get(img.path) ?? null,
        similarity: similarityByPath.get(img.path) ?? 0,
      } satisfies SearchedImage;
    })
  );

  return signed
    .filter((img): img is SearchedImage => img !== null)
    .sort((a, b) => paths.indexOf(a.path) - paths.indexOf(b.path));
}
