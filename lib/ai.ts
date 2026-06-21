import { generateObject, embedMany, gateway } from "ai";
import z from "zod";

const descriptionSchema = z.object({
  description: z.string().min(10).max(600),
});

export const generateImageDescription = async (
  imageUrl: string
): Promise<string> => {
  try {
    const { object } = await generateObject({
      model: gateway("google/gemini-2.5-flash-lite"),
      schema: descriptionSchema,
      system:
        "You are a professional image description writer. Write a concise description of the given image, between 10 and 500 characters.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Create a description for this image",
            },
            {
              type: "image",
              image: new URL(imageUrl),
            },
          ],
        },
      ],
    });
    return object.description;
  } catch (error) {
    console.error("Error generating image description:", error);
    throw error;
  }
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const { embeddings } = await embedMany({
      model: "openai/text-embedding-3-small",
      values: [text],
      providerOptions: {
        // Explicit 1536 to match the `embeddings.embedding` vector(1536) column.
        // This is also the model default, so it can be dropped if it ever errors.
        openai: {
          dimensions: 1536,
        },
      },
    });
    return embeddings[0];
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
};
