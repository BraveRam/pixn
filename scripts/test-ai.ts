import { generateImageDescription, generateEmbedding } from "../lib/ai";
import { config } from "dotenv";

config();

async function main() {
    try {
        console.log("Testing Image Description...");
        // Use a stable public image
        const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg";
        const description = await generateImageDescription(imageUrl);
        console.log("Description:", description);

        console.log("\nTesting Embedding Generation...");
        const embedding = await generateEmbedding(description);
        console.log("Embedding length:", embedding.length);
        console.log("First 5 values:", embedding.slice(0, 5));

    } catch (error) {
        console.error("Error:", error);
    }
}

main();
