import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  gateway,
  type UIMessage,
} from "ai";
import { createClient } from "@/utils/supabase/server";
import { createImageSearchTool } from "@/lib/tools/imageSearch";

export const maxDuration = 30;

const CHAT_MODEL = "deepseek/deepseek-v4-pro";
const MAX_STEPS = 5;

const SYSTEM_PROMPT = `You are Pixn's helpful assistant, embedded in an AI photo gallery.
Answer general questions conversationally and concisely.
When the user asks to find, show, browse, or ask about THEIR OWN photos, call the
"searchImages" tool with a concise natural-language query. You cannot see images, so
describe what was found using the descriptions the tool returns. Never paste raw image
URLs into your replies — the app renders the matching images for you. If the search
returns no results, say so plainly and suggest rephrasing.`;

export async function POST(request: Request) {
  // `/api` is public in middleware, so this route must guard itself.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: gateway(CHAT_MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: { searchImages: createImageSearchTool(supabase, user.id) },
    stopWhen: stepCountIs(MAX_STEPS),
  });

  return result.toUIMessageStreamResponse({ sendReasoning: true });
}
