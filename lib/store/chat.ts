import { create } from "zustand";
import type { useChat } from "@ai-sdk/react";

// Derive the message type straight from useChat's return so the store always
// matches the hook exactly (avoids the ai / @ai-sdk/react UIMessage type skew).
export type ChatMessage = ReturnType<typeof useChat>["messages"][number];

export type ChatStore = {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  // The unsent prompt-input text, so a typed draft survives navigation too.
  draft: string;
  setDraft: (draft: string) => void;
  clearMessages: () => void;
};

// In-memory only: keeps the conversation (and draft) alive across in-app
// navigation (the chat page unmounts), but reset on a full page reload.
export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  draft: "",
  setDraft: (draft) => set({ draft }),
  clearMessages: () => set({ messages: [] }),
}));
