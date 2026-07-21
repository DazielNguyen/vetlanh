"use client";

import { useEffect, useRef } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { LiveInsights } from "./components/LiveInsights";
import { useChatSession } from "@/hooks/useChatSession";

export default function ChatPage() {
  const handledPrompt = useRef(false);
  const { conversationId, setConversationId, sendMessage, stream, companionState } =
    useChatSession();

  // Mood insights and other services can hand a focused prompt into chat.
  // Handle it once and then clean the URL so refresh does not send it again.
  useEffect(() => {
    if (handledPrompt.current || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt")?.trim();
    if (!prompt) return;

    handledPrompt.current = true;
    void sendMessage(prompt);
    window.history.replaceState({}, "", window.location.pathname);
  }, [sendMessage]);

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
          stream={stream}
          onPromptSelect={sendMessage}
        />
        <ChatInput stream={stream} />
      </div>

      <LiveInsights stream={stream} />
    </div>
  );
}
