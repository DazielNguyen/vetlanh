"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useConversations, useCreateConversation } from "@/hooks/useChat";
import { useStreamChat } from "@/hooks/useStreamChat";
import { getChatCompanionState } from "@/lib/companion";

export function useChatSession() {
  const [conversationId, setConversationId] = useState<number | undefined>();
  const [pendingFirstMessage, setPendingFirstMessage] = useState<string | null>(null);
  const { data: conversations } = useConversations();
  const { mutate: createConversation, isPending: isCreatingConversation } = useCreateConversation();
  const stream = useStreamChat(conversationId);

  useEffect(() => {
    if (!conversationId && conversations?.length) {
      setConversationId(conversations[0].id);
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    if (!conversationId || !pendingFirstMessage) return;
    void stream.sendMessage(pendingFirstMessage);
    setPendingFirstMessage(null);
    // sendMessage changes with conversationId; that is the trigger needed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, pendingFirstMessage]);

  const sendMessage = useCallback(
    (text: string) => {
      if (conversationId) return stream.sendMessage(text);

      createConversation(undefined, {
        onSuccess: (conversation) => {
          setConversationId(conversation.id);
          setPendingFirstMessage(text);
        },
      });
      return Promise.resolve();
    },
    [conversationId, createConversation, stream.sendMessage]
  );

  const patchedStream = useMemo(
    () => ({
      ...stream,
      sendMessage,
      isStreaming: stream.isStreaming || isCreatingConversation,
    }),
    [isCreatingConversation, sendMessage, stream]
  );

  return {
    conversationId,
    setConversationId,
    sendMessage,
    stream: patchedStream,
    companionState: getChatCompanionState(patchedStream),
  };
}
