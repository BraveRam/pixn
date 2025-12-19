import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, embedMany } from "ai";
import z from "zod";

const apiKey = process.env.GEMINI_API_KEY;

const google = createGoogleGenerativeAI({
  apiKey,
});

const descriptionSchema = z.object({
  description: z.string().min(10).max(300),
});

export const generateImageDescription = async (
  imageUrl: string
): Promise<string> => {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
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
      model: google.textEmbeddingModel("gemini-embedding-001"),
      values: [text],
      providerOptions: {
        google: {
          outputDimensionality: 1536,
          taskType: "SEMANTIC_SIMILARITY",
        },
      },
    });
    return embeddings[0];
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
};
