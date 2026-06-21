// Shape of the `searchImages` tool output, shared between the chat page and the
// image-results grid. Kept as a plain interface (no `ai` import) to avoid the
// `ai` / `@ai-sdk/react` UIMessage version skew when narrowing tool parts.

export interface ImageSearchResultImage {
  path: string;
  name: string;
  signedUrl: string;
  description: string | null;
}

export interface ImageSearchToolOutput {
  query: string;
  count: number;
  results: {
    index: number;
    name: string;
    description: string;
    similarity: number;
  }[];
  images: ImageSearchResultImage[];
}
