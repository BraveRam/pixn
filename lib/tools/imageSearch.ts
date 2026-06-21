import { tool } from "ai";
import { z } from "zod";
import { searchUserImages } from "@/lib/search";
import type { createClient } from "@/utils/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

const MAX_RESULTS = 12;

/**
 * Builds the AI SDK tool the chat model uses to search the user's own gallery.
 * Bound per request to the authenticated Supabase client + userId. The model
 * reads the `results` descriptions (it cannot see images); the client renders
 * thumbnails from `images[].signedUrl`.
 */
export function createImageSearchTool(
  supabase: SupabaseServerClient,
  userId: string
) {
  return tool({
    description:
      "Search the user's OWN uploaded photo gallery by meaning/content " +
      "(e.g. 'sunset at the beach', 'my dog', 'birthday cake'). Use this " +
      "whenever the user asks to find, show, or ask questions about their " +
      "photos. Returns matching images with AI-written descriptions. You " +
      "cannot see the images, so rely on the descriptions to answer.",
    inputSchema: z.object({
      query: z
        .string()
        .min(1)
        .describe(
          "Natural-language description of the photos to find, e.g. 'sunset at the beach'."
        ),
    }),
    execute: async ({ query }) => {
      const images = await searchUserImages(supabase, userId, query, {
        matchCount: MAX_RESULTS,
      });

      return {
        query,
        count: images.length,
        // For the model: text-friendly, no URLs needed to reason about photos.
        results: images.map((img, index) => ({
          index: index + 1,
          name: img.name,
          description: img.content ?? "(no description available)",
          similarity: Number(img.similarity.toFixed(3)),
        })),
        // For the client renderer: signed URLs + metadata.
        images: images.map((img) => ({
          path: img.path,
          name: img.name,
          signedUrl: img.signedUrl,
          description: img.content,
        })),
      };
    },
  });
}
