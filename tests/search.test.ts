import { test, expect, mock } from "bun:test";

// Mock the embedding call before importing the module under test (dynamic import
// below ensures the mock is registered first).
mock.module("@/lib/ai", () => ({
  generateEmbedding: async () => new Array(1536).fill(0),
}));

const { searchUserImages } = await import("@/lib/search");

type Response<T> = { data: T; error: { message: string } | null };

const makeQueryBuilder = <T>(response: Response<T>) => {
  const builder = {
    select: () => builder,
    in: () => builder,
    eq: () => Promise.resolve(response),
  };
  return builder;
};

interface MockConfig {
  matched: { id: string; similarity: number }[];
  gallery: Response<Record<string, unknown>[]>;
  embeddings: Response<{ path: string; content: string | null }[]>;
}

const makeSupabase = (config: MockConfig) => ({
  rpc: async () => ({ data: config.matched, error: null }),
  from: (table: string) =>
    makeQueryBuilder(table === "gallery" ? config.gallery : config.embeddings),
  storage: {
    from: () => ({
      createSignedUrl: async (path: string) => ({
        data: { signedUrl: `signed:${path}` },
        error: null,
      }),
    }),
  },
});

const galleryRow = (path: string) => ({
  path,
  name: `${path}.jpg`,
  size: 100,
  favorite: false,
  user_id: "user-1",
  created_at: null,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asClient = (s: unknown) => s as any;

test("returns empty array for a blank query without calling the database", async () => {
  const supabase = makeSupabase({
    matched: [{ id: "p1", similarity: 0.5 }],
    gallery: { data: [galleryRow("p1")], error: null },
    embeddings: { data: [], error: null },
  });

  const result = await searchUserImages(asClient(supabase), "user-1", "   ");

  expect(result).toEqual([]);
});

test("orders results by RPC similarity order and maps descriptions + signed URLs", async () => {
  const supabase = makeSupabase({
    // RPC returns p2 before p1 (higher similarity first).
    matched: [
      { id: "p2", similarity: 0.5 },
      { id: "p1", similarity: 0.4 },
    ],
    // Gallery returns rows in a different order.
    gallery: { data: [galleryRow("p1"), galleryRow("p2")], error: null },
    embeddings: {
      data: [
        { path: "p1", content: "desc one" },
        { path: "p2", content: "desc two" },
      ],
      error: null,
    },
  });

  const result = await searchUserImages(asClient(supabase), "user-1", "beach");

  expect(result.map((r) => r.path)).toEqual(["p2", "p1"]);
  expect(result[0].content).toBe("desc two");
  expect(result[0].signedUrl).toBe("signed:p2");
  expect(result[0].similarity).toBe(0.5);
  expect(result[1].content).toBe("desc one");
});

test("returns empty array when no embeddings match", async () => {
  const supabase = makeSupabase({
    matched: [],
    gallery: { data: [], error: null },
    embeddings: { data: [], error: null },
  });

  const result = await searchUserImages(asClient(supabase), "user-1", "nothing");

  expect(result).toEqual([]);
});
