import apiService from "@/lib/api/core";
import { getCookie } from "cookies-next";
import type { Conversation, ChatMessage, StreamChunk } from "@/types/chat";
import { env } from "@/lib/env";

export const fetchChat = {
  createConversation: async (): Promise<Conversation> => {
    const res = await apiService.post<Conversation>("api/v1/chat/conversations", { title: null });
    return res.data;
  },

  listConversations: async (q?: string): Promise<Conversation[]> => {
    const res = await apiService.get<Conversation[]>(
      "api/v1/chat/conversations",
      q ? { q } : undefined
    );
    return res.data;
  },

  deleteConversation: async (id: number): Promise<void> => {
    await apiService.delete(`api/v1/chat/conversations/${id}`);
  },

  getMessages: async (conversationId: number): Promise<ChatMessage[]> => {
    const res = await apiService.get<ChatMessage[]>(
      `api/v1/chat/conversations/${conversationId}/messages`
    );
    return res.data;
  },

  // SSE over POST — Axios cannot consume ReadableStream, so we use native fetch.
  // Token is read once at call time (no refresh token in this BE, so stale risk is minimal).
  streamChatMessage: async function* (
    conversationId: number,
    message: string,
    signal: AbortSignal
  ): AsyncGenerator<StreamChunk> {
    if (typeof window !== "undefined" && !("ReadableStream" in window)) {
      throw new Error("SSE_UNSUPPORTED");
    }

    const token = getCookie("authToken");
    const base = env.apiUrl.replace(/\/$/, "");
    const url = `${base}/api/v1/chat/conversations/${conversationId}/messages`;

    const response = await fetch(url, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content: message }),
    });

    if (!response.ok) {
      if (response.status === 401 && !!token) {
        const { store } = await import("@/lib/redux/store");
        const { logout } = await import("@/lib/redux/slices/authSlice");
        store.dispatch(logout());
        if (typeof window !== "undefined") window.dispatchEvent(new Event("logout"));
      }
      throw new Error(`HTTP ${response.status}`);
    }

    if (!response.body) throw new Error("SSE_UNSUPPORTED");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const chunk = JSON.parse(line.slice(6)) as StreamChunk;
            yield chunk;
            if (chunk.type === "done" || chunk.type === "error") return;
          } catch {
            // skip malformed SSE lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },
};
