"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { LiveInsights } from "./components/LiveInsights";
import { useConversations, useCreateConversation } from "@/hooks/useChat";
import { useStreamChat } from "@/hooks/useStreamChat";
import { getChatCompanionState } from "@/lib/companion";

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [pendingFirstMessage, setPendingFirstMessage] = useState<string | null>(null);
  const handledPrompt = useRef(false);

  const { data: conversations } = useConversations();
  const { mutate: createConversation, isPending: isCreatingConv } = useCreateConversation();
  const stream = useStreamChat(conversationId);

  // Auto-select the most recent conversation when the list first loads
  useEffect(() => {
    if (!conversationId && conversations && conversations.length > 0) {
      setConversationId(conversations[0].id);
    }
  }, [conversations, conversationId]);

  // After auto-create resolves and conversationId is set, send the pending message
  useEffect(() => {
    if (conversationId && pendingFirstMessage) {
      stream.sendMessage(pendingFirstMessage);
      setPendingFirstMessage(null);
    }
    // stream.sendMessage changes when conversationId changes — that's the trigger we need
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, pendingFirstMessage, stream.sendMessage]);

  const handleSend = useCallback(
    (text: string) => {
      if (conversationId) {
        return stream.sendMessage(text);
      }
      // No conversation yet — auto-create then send
      createConversation(undefined, {
        onSuccess: (conv) => {
          setConversationId(conv.id);
          setPendingFirstMessage(text);
        },
      });
      return Promise.resolve();
    },
    [conversationId, stream.sendMessage, createConversation]
  );

  // Mood insights and other services can hand a focused prompt into chat.
  // Handle it once and then clean the URL so refresh does not send it again.
  useEffect(() => {
    if (handledPrompt.current || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt")?.trim();
    if (!prompt) return;

    handledPrompt.current = true;
    void handleSend(prompt);
    window.history.replaceState({}, "", window.location.pathname);
  }, [handleSend]);

  // Patch stream so ChatInput sees isStreaming=true while conversation is being created
  const patchedStream = useMemo(
    () => ({
      ...stream,
      sendMessage: handleSend,
      isStreaming: stream.isStreaming || isCreatingConv,
    }),
    [stream, handleSend, isCreatingConv]
  );

  const companionState = getChatCompanionState(patchedStream);

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-6">
      <div className="card-lifted rounded-3xl p-6 flex-1 flex flex-col min-w-0">
        <ChatHeader
          conversationId={conversationId}
          onConversationChange={setConversationId}
          companionState={companionState}
        />
        <ChatMessages
          conversationId={conversationId}
          stream={patchedStream}
          onPromptSelect={handleSend}
        />
        <ChatInput stream={patchedStream} />
      </div>

      <LiveInsights stream={patchedStream} />
    </div>
  );
}
