import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchChat } from "@/lib/api/services/fetchChat";
import { STALE } from "@/lib/api/queryConfig";

export const CHAT_KEYS = {
  conversations: ["chat", "conversations"] as const,
  messages: (id: string) => ["chat", "messages", id] as const,
};

export function useConversations() {
  return useQuery({
    queryKey: CHAT_KEYS.conversations,
    queryFn: fetchChat.listConversations,
    staleTime: STALE.SHORT,
  });
}

export function useConversationMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: CHAT_KEYS.messages(conversationId ?? ""),
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
    onError: () => {
      toast.error("Không thể tạo cuộc hội thoại mới");
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchChat.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations });
    },
    onError: () => {
      toast.error("Không thể xóa cuộc hội thoại");
    },
  });
}
