"use client";

import { useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageSquare, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
} from "@/components/ai-elements/tool";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ChatImageResults } from "./ChatImageResults";
import type { ImageSearchToolOutput } from "@/lib/chat/types";

// History is kept in memory only; cap it so a single chat can't grow unbounded.
const MAX_MESSAGES = 30;

export default function ChatPage() {
  const { messages, sendMessage, setMessages, status, stop } = useChat();

  const atLimit = messages.length >= MAX_MESSAGES;
  const isBusy = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  // Warn before leaving/reloading with an in-memory (unsaved) conversation.
  useEffect(() => {
    if (!hasMessages) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasMessages]);

  const handleSubmit = (message: PromptInputMessage) => {
    if (atLimit) return;
    const text = message.text.trim();
    if (!text) return;
    sendMessage({ text });
  };

  const handleReset = () => {
    stop();
    setMessages([]);
  };

  return (
    <div className="chat-scroll relative flex h-[100dvh] flex-col pt-16 pb-4">
      {atLimit && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="absolute right-4 top-[4.5rem] z-10 gap-1.5 rounded-full bg-background/80 backdrop-blur"
        >
          <RotateCcw className="size-3.5" />
          New chat
        </Button>
      )}

      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="size-8" />}
              title="Chat with your gallery"
              description="Ask anything — or say “show me my beach photos” to search your images."
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, index) => {
                    const key = `${message.id}-${index}`;

                    if (part.type === "reasoning") {
                      return (
                        <Reasoning
                          key={key}
                          className="w-full"
                          isStreaming={part.state === "streaming"}
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    }

                    if (part.type === "text") {
                      return (
                        <MessageResponse key={key}>{part.text}</MessageResponse>
                      );
                    }

                    if (part.type === "tool-searchImages") {
                      const output =
                        part.state === "output-available"
                          ? (part.output as ImageSearchToolOutput)
                          : null;

                      return (
                        <div key={key} className="w-full space-y-2">
                          <Tool>
                            <ToolHeader
                              title="Image search"
                              type={part.type}
                              state={part.state}
                            />
                            <ToolContent>
                              <ToolInput input={part.input} />
                              {output && (
                                <p className="text-xs text-muted-foreground">
                                  Found {output.count} image
                                  {output.count === 1 ? "" : "s"}.
                                </p>
                              )}
                              {part.state === "output-error" && (
                                <p className="text-xs text-destructive">
                                  {part.errorText}
                                </p>
                              )}
                            </ToolContent>
                          </Tool>
                          {output && (
                            <ChatImageResults
                              images={output.images}
                              query={output.query}
                            />
                          )}
                        </div>
                      );
                    }

                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Thinking…</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl px-4">
        {atLimit && (
          <p className="mb-2 text-center text-xs text-muted-foreground">
            You’ve reached the {MAX_MESSAGES}-message limit for this chat.{" "}
            <button
              type="button"
              onClick={handleReset}
              className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
            >
              Start a new chat
            </button>{" "}
            to continue.
          </p>
        )}

        <PromptInput onSubmit={handleSubmit} className="rounded-xl">
          <PromptInputTextarea
            disabled={atLimit}
            placeholder={
              atLimit
                ? "Start a new chat to continue…"
                : "Ask about your photos…"
            }
          />
          <PromptInputFooter>
            <div />
            <PromptInputSubmit
              status={status}
              onStop={stop}
              disabled={atLimit && !isBusy}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
