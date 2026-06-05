import apiService from "@/lib/api/core";
import { getCookie } from "cookies-next";
import type { Conversation, ChatMessage, StreamChunk } from "@/types/chat";

export const fetchChat = {
  createConversation: async (): Promise<Conversation> => {
    const res = await apiService.post<Conversation>("api/v1/chat/conversations");
    return res.data;
  },

  listConversations: async (): Promise<Conversation[]> => {
    const res = await apiService.get<Conversation[]>("api/v1/chat/conversations");
    return res.data;
  },

  deleteConversation: async (id: string): Promise<void> => {
    await apiService.delete(`api/v1/chat/conversations/${id}`);
  },

  getMessages: async (conversationId: string): Promise<ChatMessage[]> => {
    const res = await apiService.get<ChatMessage[]>(
      `api/v1/chat/conversations/${conversationId}/messages`
    );
    return res.data;
  },

  // SSE over POST — Axios cannot consume ReadableStream, so we use native fetch.
  // Token is read once at call time (no refresh token in this BE, so stale risk is minimal).
  streamChatMessage: async function* (
    conversationId: string,
    message: string,
    signal: AbortSignal
  ): AsyncGenerator<StreamChunk> {
    if (typeof window !== "undefined" && !("ReadableStream" in window)) {
      throw new Error("SSE_UNSUPPORTED");
    }

    const token = getCookie("authToken");
    const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/").replace(/\/$/, "");
    const url = `${base}/api/v1/chat/conversations/${conversationId}/messages`;

    const response = await fetch(url, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      // Mirror the core.ts Axios interceptor: only treat 401 as session expiry when the
      // request actually carried a token (same hadToken guard as core.ts line 57-65).
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
