/**
 * One-off admin backfill: regenerate the description + embedding for EVERY image
 * across ALL users, using the Supabase service-role key (bypasses RLS).
 *
 * Use this after switching the embedding model (e.g. gemini-embedding-001 ->
 * openai/text-embedding-3-small): old vectors are incompatible with new query
 * vectors, so every image must be re-embedded in the new model's space.
 *
 * It is idempotent and safe to re-run: each image's existing embedding is
 * deleted and re-inserted (path is globally unique: `{userId}/{uuid}-{name}`),
 * so there is no full-table wipe window.
 *
 * Required env (read from .env by `bun run`):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   <- Supabase dashboard: Project Settings > API
 *                                  (or `supabase projects api-keys`)
 *   AI_GATEWAY_API_KEY
 *
 * Run:  bun run scripts/reembed-all.ts
 */
import { createClient } from "@supabase/supabase-js";
import { generateImageDescription, generateEmbedding } from "../lib/ai";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env."
  );
  process.exit(1);
}
if (!process.env.AI_GATEWAY_API_KEY) {
  console.error("Missing AI_GATEWAY_API_KEY in env.");
  process.exit(1);
}

// Service-role client: bypasses RLS so we can read every user's gallery/storage
// and write every user's embeddings. NEVER expose this key to the browser.
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const CONCURRENCY = 4; // modest, to stay under AI provider rate limits
const SIGNED_URL_TTL = 60 * 5; // 5 min: long enough to fetch for description
const PAGE_SIZE = 1000;

type GalleryRow = { path: string; user_id: string };

async function reembedRow(row: GalleryRow): Promise<void> {
  const { data: signed, error: signErr } = await supabase.storage
    .from("images")
    .createSignedUrl(row.path, SIGNED_URL_TTL);
  if (signErr || !signed?.signedUrl) {
    throw new Error(`signed URL failed: ${signErr?.message ?? "unknown"}`);
  }

  const description = await generateImageDescription(signed.signedUrl);
  const embedding = await generateEmbedding(description);

  // Replace any existing embedding for this path, then insert the fresh one.
  const { error: delErr } = await supabase
    .from("embeddings")
    .delete()
    .eq("path", row.path);
  if (delErr) throw new Error(`delete failed: ${delErr.message}`);

  const { error: insErr } = await supabase.from("embeddings").insert({
    path: row.path,
    user_id: row.user_id,
    content: description,
    embedding,
  });
  if (insErr) throw new Error(`insert failed: ${insErr.message}`);
}

async function fetchAllGalleryRows(): Promise<GalleryRow[]> {
  const rows: GalleryRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("gallery")
      .select("path, user_id")
      .order("created_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`fetch gallery failed: ${error.message}`);
    if (!data || data.length === 0) break;
    rows.push(...(data as GalleryRow[]));
    if (data.length < PAGE_SIZE) break;
  }
  return rows;
}

async function main(): Promise<void> {
  const rows = await fetchAllGalleryRows();
  console.log(`Re-embedding ${rows.length} images across all users...`);

  let ok = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i += CONCURRENCY) {
    const batch = rows.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map(reembedRow));
    results.forEach((r, j) => {
      if (r.status === "fulfilled") {
        ok++;
      } else {
        failed++;
        const reason =
          r.reason instanceof Error ? r.reason.message : String(r.reason);
        console.error(`  ✗ ${batch[j].path}: ${reason}`);
      }
    });
    console.log(
      `  ${Math.min(i + CONCURRENCY, rows.length)}/${rows.length} (ok=${ok} failed=${failed})`
    );
  }

  console.log(`Done. ok=${ok} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});
