import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchChat } from "@/lib/api/services/fetchChat";
import { STALE } from "@/lib/api/queryConfig";

export const CHAT_KEYS = {
  // Base key — invalidating this clears ALL conversation queries (incl. search variants)
  conversations: ["chat", "conversations"] as const,
  messages: (id: number) => ["chat", "messages", id] as const,
};

export function useConversations(q?: string) {
  return useQuery({
    // Append q so each search term gets its own cache slot
    queryKey: q ? [...CHAT_KEYS.conversations, q] : CHAT_KEYS.conversations,
    queryFn: () => fetchChat.listConversations(q),
    staleTime: STALE.SHORT,
  });
}

export function useConversationMessages(conversationId: number | undefined) {
  return useQuery({
    queryKey: CHAT_KEYS.messages(conversationId ?? 0),
    queryFn: () => fetchChat.getMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 0,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetchChat.createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fetchChat.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations });
    },
    onError: (err) => {
      // 404 means the resource is already gone — still clean up the cache
      if ((err as { code?: number })?.code === 404) {
        queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations });
      }
    },
  });
}
