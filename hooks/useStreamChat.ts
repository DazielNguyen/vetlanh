import { useState, useRef, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchChat } from "@/lib/api/services/fetchChat";
import { CHAT_KEYS } from "@/hooks/useChat";
import type { ExerciseCard, Emotion, DepressionRisk } from "@/types/chat";

export type LocalMessage =
  | { kind: "text"; role: "user" | "assistant"; content: string; id: string }
  | { kind: "exercise"; card: ExerciseCard; id: string }
  | { kind: "crisis"; id: string };

export interface StreamChatState {
  localMessages: LocalMessage[];
  streamingText: string;
  isStreaming: boolean;
  error: string | null;
  suggestCheckin: boolean;
  lastEmotion: { emotion: Emotion; confidence: number } | null;
  emotionHistory: { emotion: Emotion; confidence: number }[];
  depressionRisk: DepressionRisk | null;
  crisisLevel: number;
  sendMessage: (text: string) => Promise<void>;
}

export function useStreamChat(conversationId: number | undefined): StreamChatState {
  const queryClient = useQueryClient();
  const abortRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref mirrors isStreaming state so sendMessage useCallback has no stale-closure risk
  const isStreamingRef = useRef(false);

  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestCheckin, setSuggestCheckin] = useState(false);
  const [lastEmotion, setLastEmotion] = useState<{ emotion: Emotion; confidence: number } | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<{ emotion: Emotion; confidence: number }[]>([]);
  const [depressionRisk, setDepressionRisk] = useState<DepressionRisk | null>(null);
  const [crisisLevel, setCrisisLevel] = useState(0);

  function setStreamingState(val: boolean) {
    isStreamingRef.current = val;
    setIsStreaming(val);
  }

  // Abort in-progress stream and clear local state when switching conversations
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    abortRef.current?.abort();
    abortRef.current = null;

    setLocalMessages([]);
    setStreamingText("");
    setStreamingState(false);
    setError(null);
    setSuggestCheckin(false);
    setLastEmotion(null);
    setEmotionHistory([]);
    setDepressionRisk(null);
    setCrisisLevel(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!conversationId || isStreamingRef.current) return;

      setError(null);
      setSuggestCheckin(false);
      setLastEmotion(null);
      setCrisisLevel(0);

      setLocalMessages((prev) => [
        ...prev,
        { kind: "text", role: "user", content: text, id: crypto.randomUUID() },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      // Hard 30s timeout — prevents permanently frozen input if BE hangs
      timeoutRef.current = setTimeout(() => {
        controller.abort();
        setStreamingState(false);
        setStreamingText("");
        setError("AI đang xử lý quá lâu, vui lòng thử lại.");
      }, 30000);

      setStreamingState(true);
      let assistantText = "";

      try {
        const gen = fetchChat.streamChatMessage(conversationId, text, controller.signal);

        for await (const chunk of gen) {
          if (chunk.type === "chunk") {
            if (chunk.content) {
              assistantText += chunk.content;
              setStreamingText(assistantText);
            }
          } else if (chunk.type === "done") {
            if (chunk.exercise_card) {
              setLocalMessages((prev) => [
                ...prev,
                { kind: "exercise", card: chunk.exercise_card!, id: crypto.randomUUID() },
              ]);
            }
            if (chunk.suggest_checkin) setSuggestCheckin(true);

            // Emotion — only surface if confident enough and not neutral
            const emotion = chunk.emotion;
            const confidence = chunk.emotion_confidence ?? 0;
            if (emotion && emotion !== "neutral" && confidence >= 0.55) {
              setLastEmotion({ emotion, confidence });
              setEmotionHistory((prev) => [...prev, { emotion, confidence }]);
            }

            if (chunk.depression_risk && chunk.depression_risk !== "none") {
              setDepressionRisk(chunk.depression_risk);
            }

            // Crisis level 3: stream had no AI text — show hotline card instead
            if (chunk.crisis_level && chunk.crisis_level >= 3) {
              setCrisisLevel(chunk.crisis_level);
              setLocalMessages((prev) => [
                ...prev,
                { kind: "crisis", id: crypto.randomUUID() },
              ]);
            }

            break;
          } else if (chunk.type === "error") {
            throw new Error(chunk.detail || "Stream error");
          }
        }

        if (assistantText) {
          setLocalMessages((prev) => [
            ...prev,
            { kind: "text", role: "assistant", content: assistantText, id: crypto.randomUUID() },
          ]);
        }
        setStreamingText("");

        // refetchQueries resolves only after the network response — guarantees server data is in
        // cache before we clear optimistic messages, preventing a brief double-render.
        await queryClient.refetchQueries({ queryKey: CHAT_KEYS.messages(conversationId) });
        // Keep non-text cards visible after server data loads
        setLocalMessages((prev) => prev.filter((m) => m.kind === "exercise" || m.kind === "crisis"));
      } catch (err: unknown) {
        // AbortError = either timeout abort (error already set) or navigation abort (silent)
        if ((err as Error).name === "AbortError") {
          setStreamingText("");
          return;
        }
        if ((err as Error).message === "SSE_UNSUPPORTED") {
          setError("Trình duyệt của bạn không hỗ trợ streaming. Vui lòng dùng trình duyệt hiện đại hơn.");
        } else {
          setError("Gửi tin nhắn thất bại, vui lòng thử lại.");
        }
        setStreamingText("");
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setStreamingState(false);
        abortRef.current = null;
      }
    },
    // isStreaming intentionally omitted — isStreamingRef used inside the guard instead
    [conversationId, queryClient]
  );

  return { localMessages, streamingText, isStreaming, error, suggestCheckin, lastEmotion, emotionHistory, depressionRisk, crisisLevel, sendMessage };
}
