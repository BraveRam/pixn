import { generateObject, embedMany, gateway } from "ai";
import z from "zod";

const descriptionSchema = z.object({
  description: z.string().min(10).max(300),
});

export const generateImageDescription = async (
  imageUrl: string
): Promise<string> => {
  try {
    const { object } = await generateObject({
      model: gateway("google/gemini-2.0-flash"),
      schema: descriptionSchema,
      messages: [
        {
          role: "system",
          content:
            "You are a description writer professional from the image given - the length of the description should be between 10 and 300 characters",
        },
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
