"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCommunity } from "@/lib/api/services/fetchCommunity";
import { getHubConnection, onHubReconnected } from "@/lib/realtime/signalr";
import { skipRetryOn } from "@/lib/api/queryConfig";
import type { CommunityMessage } from "@/types/community";

const messagesKey = (matchId: string) => ["community", "messages", matchId] as const;

/**
 * Same hybrid one-shot GET + SignalR push model as useCheckIns/useCommunityMatchStatus.
 * staleTime: Infinity — a match's history doesn't change from elsewhere once loaded,
 * only new messages arrive, and those come exclusively through the push event.
 */
export function useCommunityMessages(matchId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: matchId ? messagesKey(matchId) : ["community", "messages", "none"],
    queryFn: () => fetchCommunity.getMessages(matchId as string),
    enabled: !!matchId,
    staleTime: Infinity,
    retry: skipRetryOn(404),
  });

  useEffect(() => {
    if (!matchId) return;

    const connection = getHubConnection();

    const handleMessage = (message: CommunityMessage) => {
      if (message.matchId !== matchId) return;
      queryClient.setQueryData<CommunityMessage[]>(messagesKey(matchId), (prev) => {
        const existing = prev ?? [];
        if (existing.some((m) => m.id === message.id)) return existing;
        return [...existing, message];
      });
    };

    connection.on("ReceiveCommunityMessage", handleMessage);

    // A message sent while the connection was down would otherwise be
    // missed permanently (staleTime: Infinity means no automatic refetch) —
    // refetch this match's history on reconnect to resync.
    const unsubscribeReconnect = onHubReconnected(() => {
      queryClient.invalidateQueries({ queryKey: messagesKey(matchId) });
    });

    return () => {
      connection.off("ReceiveCommunityMessage", handleMessage);
      unsubscribeReconnect();
    };
  }, [matchId, queryClient]);

  return { messages: query.data ?? [], isLoading: query.isLoading };
}

/**
 * Optimistic local append (client-generated temp id). On success, the temp
 * id is swapped for the server-assigned id — if the SignalR echo of the same
 * message already arrived first (and got appended under its real id), the
 * temp entry is dropped instead of duplicated. Fire-and-forget on network
 * failure: worst case the peer never sees it, not that the sender's UI hangs.
 */
export function useSendCommunityMessage(matchId: string | null) {
  const queryClient = useQueryClient();

  return (content: string) => {
    if (!matchId || !content.trim()) return;

    const tempId = `local-${Date.now()}`;
    const optimistic: CommunityMessage = {
      id: tempId,
      matchId,
      content,
      isMine: true,
      createdAt: new Date().toISOString(),
    };

    queryClient.setQueryData<CommunityMessage[]>(messagesKey(matchId), (prev) => [...(prev ?? []), optimistic]);

    fetchCommunity
      .sendMessage(matchId, content)
      .then((saved) => {
        queryClient.setQueryData<CommunityMessage[]>(messagesKey(matchId), (prev) => {
          const existing = prev ?? [];
          const alreadyEchoed = existing.some((m) => m.id === saved.id && m.id !== tempId);
          if (alreadyEchoed) return existing.filter((m) => m.id !== tempId);
          return existing.map((m) => (m.id === tempId ? saved : m));
        });
      })
      .catch((err) => {
        console.warn("[useSendCommunityMessage] failed to persist message", err);
      });
  };
}
