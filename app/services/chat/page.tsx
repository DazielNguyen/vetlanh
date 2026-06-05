"use client";

import { useState, useEffect } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { LiveInsights } from "./components/LiveInsights";
import { useConversations } from "@/hooks/useChat";
import { useStreamChat } from "@/hooks/useStreamChat";

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | undefined>();
  const { data: conversations } = useConversations();
  const stream = useStreamChat(conversationId);

  // Auto-select the most recent conversation when the list first loads
  useEffect(() => {
    if (!conversationId && conversations && conversations.length > 0) {
      setConversationId(conversations[0].id);
    }
  }, [conversations, conversationId]);

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader conversationId={conversationId} onConversationChange={setConversationId} />
        <ChatMessages conversationId={conversationId} stream={stream} />
        <ChatInput stream={stream} />
      </div>

      <LiveInsights />
    </div>
  );
}
