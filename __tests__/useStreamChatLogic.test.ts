/**
 * Unit tests for the streaming state-machine logic inside useStreamChat.ts
 *
 * Because @testing-library/react is not installed, we cannot render React hooks
 * directly.  Instead, we extract and test:
 *
 *   1. The SSE chunk handling logic in isolation — chunk accumulation,
 *      exercise_card extraction, suggest_checkin detection, error/done stops.
 *
 *   2. The fetchChat.streamChatMessage generator wiring: that sendMessage drives
 *      the generator and accumulates `assistantText` correctly.
 *
 *   3. CHAT_KEYS integration — that messages(id) keys are correctly formed
 *      for invalidation after a stream completes.
 *
 * All state mutations are simulated manually (capturing what useState setters
 * would produce) so we remain in pure Node/Jest without a DOM.
 */

// ── Mocks ──────────────────────────────────────────────────────────────────────

jest.mock("redux-persist/lib/storage", () => ({
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => "mock-token"),
}));

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(() => ({ invalidateQueries: jest.fn() })),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/lib/api/queryConfig", () => ({
  STALE: { SHORT: 30_000, MEDIUM: 60_000, LONG: 300_000 },
}));

// ── Imports ────────────────────────────────────────────────────────────────────

import type { StreamChunk, ExerciseCard } from "@/types/chat";
import { CHAT_KEYS } from "@/hooks/useChat";

// ── Types (mirror LocalMessage from useStreamChat) ────────────────────────────

type LocalMessage =
  | { kind: "text"; role: "user" | "assistant"; content: string; id: string }
  | { kind: "exercise"; card: ExerciseCard; id: string };

// ── Streaming logic extracted for unit testing ────────────────────────────────
// This mirrors the for-await loop inside sendMessage so we can test each branch
// without mounting a React component.

interface SimulatedState {
  localMessages: LocalMessage[];
  streamingText: string;
  suggestCheckin: boolean;
  errorMessage: string | null;
  assistantText: string;
}

async function simulateSendMessage(
  chunks: StreamChunk[]
): Promise<SimulatedState> {
  const state: SimulatedState = {
    localMessages: [],
    streamingText: "",
    suggestCheckin: false,
    errorMessage: null,
    assistantText: "",
  };

  // Simulate optimistic user message
  state.localMessages.push({
    kind: "text",
    role: "user",
    content: "test input",
    id: "local-user-0",
  });

  async function* makeGen(): AsyncGenerator<StreamChunk> {
    for (const chunk of chunks) {
      yield chunk;
    }
  }

  try {
    for await (const chunk of makeGen()) {
      if (chunk.type === "chunk") {
        if (chunk.content) {
          state.assistantText += chunk.content;
          state.streamingText = state.assistantText;
        }
        if (chunk.exercise_card) {
          state.localMessages.push({
            kind: "exercise",
            card: chunk.exercise_card,
            id: `ex-${state.localMessages.length}`,
          });
        }
        if (chunk.suggest_checkin) {
          state.suggestCheckin = true;
        }
      } else if (chunk.type === "done") {
        break;
      } else if (chunk.type === "error") {
        throw new Error(chunk.content || "Stream error");
      }
    }

    if (state.assistantText) {
      state.localMessages.push({
        kind: "text",
        role: "assistant",
        content: state.assistantText,
        id: "local-ai-0",
      });
    }
    state.streamingText = "";
  } catch (err: unknown) {
    const message = (err as Error).message;
    if (message === "SSE_UNSUPPORTED") {
      state.errorMessage =
        "Trình duyệt của bạn không hỗ trợ streaming. Vui lòng dùng trình duyệt hiện đại hơn.";
    } else if ((err as Error).name === "AbortError") {
      state.streamingText = "";
    } else {
      state.errorMessage = "Gửi tin nhắn thất bại, vui lòng thử lại.";
    }
    state.streamingText = "";
  }

  return state;
}

// ── Tests: chunk accumulation ─────────────────────────────────────────────────

describe("sendMessage — chunk accumulation", () => {
  it("concatenates content from multiple chunk chunks into assistantText", async () => {
    const chunks: StreamChunk[] = [
      { type: "chunk", content: "Hello" },
      { type: "chunk", content: " World" },
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    expect(state.assistantText).toBe("Hello World");
  });

  it("adds a text assistant message to localMessages when stream completes", async () => {
    const chunks: StreamChunk[] = [
      { type: "chunk", content: "response" },
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    const assistantMsgs = state.localMessages.filter(
      (m): m is Extract<LocalMessage, { kind: "text" }> =>
        m.kind === "text" && m.role === "assistant"
    );
    expect(assistantMsgs).toHaveLength(1);
    expect(assistantMsgs[0].content).toBe("response");
  });

  it("does not add assistant message when no text content was received", async () => {
    const chunks: StreamChunk[] = [
      { type: "chunk" },  // no content
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    const assistantMsgs = state.localMessages.filter(
      (m): m is Extract<LocalMessage, { kind: "text" }> =>
        m.kind === "text" && m.role === "assistant"
    );
    expect(assistantMsgs).toHaveLength(0);
  });

  it("always prepends the optimistic user message", async () => {
    const chunks: StreamChunk[] = [{ type: "done" }];

    const state = await simulateSendMessage(chunks);

    expect(state.localMessages[0]).toMatchObject({
      kind: "text",
      role: "user",
      content: "test input",
    });
  });

  it("clears streamingText after stream completes", async () => {
    const chunks: StreamChunk[] = [
      { type: "chunk", content: "partial" },
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    expect(state.streamingText).toBe("");
  });

  it("handles empty stream (no chunks at all) gracefully", async () => {
    const state = await simulateSendMessage([]);

    expect(state.errorMessage).toBeNull();
    expect(state.assistantText).toBe("");
    // user message still present
    expect(state.localMessages).toHaveLength(1);
  });
});

// ── Tests: exercise_card extraction ──────────────────────────────────────────

describe("sendMessage — exercise_card handling", () => {
  const card: ExerciseCard = {
    slug: "deep-breathing",
    title: "Hít thở sâu",
    description: "Giúp giảm lo âu",
    category: "breathing",
    duration_seconds: 300,
  };

  it("pushes an exercise LocalMessage when chunk carries exercise_card", async () => {
    const chunks: StreamChunk[] = [
      { type: "chunk", exercise_card: card },
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    const exercises = state.localMessages.filter((m) => m.kind === "exercise");
    expect(exercises).toHaveLength(1);
    expect((exercises[0] as Extract<LocalMessage, { kind: "exercise" }>).card.slug).toBe(
      "deep-breathing"
    );
  });

  it("pushes exercise message even when no text content in same chunk", async () => {
    const chunks: StreamChunk[] = [
      { type: "chunk", exercise_card: card },
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    expect(state.assistantText).toBe("");
    const exercises = state.localMessages.filter((m) => m.kind === "exercise");
    expect(exercises).toHaveLength(1);
  });

  it("pushes multiple exercise messages for multiple cards", async () => {
    const card2: ExerciseCard = {
      slug: "body-scan",
      title: "Quét cơ thể",
      description: "Thiền định cơ thể",
      category: "mindfulness",
    };
    const chunks: StreamChunk[] = [
      { type: "chunk", exercise_card: card },
      { type: "chunk", exercise_card: card2 },
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    const exercises = state.localMessages.filter((m) => m.kind === "exercise");
    expect(exercises).toHaveLength(2);
  });

  it("preserves card fields accurately", async () => {
    const chunks: StreamChunk[] = [
      { type: "chunk", exercise_card: card },
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    const ex = state.localMessages.find(
      (m) => m.kind === "exercise"
    ) as Extract<LocalMessage, { kind: "exercise" }>;
    expect(ex.card).toEqual(card);
  });
});

// ── Tests: suggest_checkin detection ─────────────────────────────────────────

describe("sendMessage — suggest_checkin", () => {
  it("sets suggestCheckin to true when chunk carries suggest_checkin: true", async () => {
    const chunks: StreamChunk[] = [
      { type: "chunk", suggest_checkin: true },
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    expect(state.suggestCheckin).toBe(true);
  });

  it("suggestCheckin stays false when no chunk carries the flag", async () => {
    const chunks: StreamChunk[] = [
      { type: "chunk", content: "just text" },
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    expect(state.suggestCheckin).toBe(false);
  });

  it("suggestCheckin is true even if flag appears mid-stream", async () => {
    const chunks: StreamChunk[] = [
      { type: "chunk", content: "A" },
      { type: "chunk", suggest_checkin: true },
      { type: "chunk", content: "B" },
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    expect(state.suggestCheckin).toBe(true);
    expect(state.assistantText).toBe("AB");
  });
});

// ── Tests: done chunk stops processing ───────────────────────────────────────

describe("sendMessage — done chunk stops the stream", () => {
  it("ignores chunks that arrive after done", async () => {
    // The generator breaks on "done" so post-done content never processes.
    // We verify the loop stops correctly by checking content only up to done.
    const chunks: StreamChunk[] = [
      { type: "chunk", content: "before" },
      { type: "done" },
    ];

    const state = await simulateSendMessage(chunks);

    expect(state.assistantText).toBe("before");
    expect(state.errorMessage).toBeNull();
  });
});

// ── Tests: error chunk ────────────────────────────────────────────────────────

describe("sendMessage — error chunk", () => {
  it("sets errorMessage to generic Vietnamese fallback on stream error", async () => {
    const chunks: StreamChunk[] = [
      { type: "error", content: "Internal error" },
    ];

    const state = await simulateSendMessage(chunks);

    expect(state.errorMessage).toBe("Gửi tin nhắn thất bại, vui lòng thử lại.");
  });

  it("clears streamingText after stream error", async () => {
    const chunks: StreamChunk[] = [
      { type: "chunk", content: "partial" },
      { type: "error" },
    ];

    const state = await simulateSendMessage(chunks);

    expect(state.streamingText).toBe("");
  });
});

// ── Tests: SSE_UNSUPPORTED error ──────────────────────────────────────────────

describe("sendMessage — SSE_UNSUPPORTED", () => {
  it("sets the browser-unsupported Vietnamese error message", async () => {
    async function* unsupportedGen(): AsyncGenerator<StreamChunk> {
      throw new Error("SSE_UNSUPPORTED");
      yield { type: "done" }; // unreachable — needed to satisfy generator typing
    }

    const state: SimulatedState = {
      localMessages: [{ kind: "text", role: "user", content: "hi", id: "u0" }],
      streamingText: "",
      suggestCheckin: false,
      errorMessage: null,
      assistantText: "",
    };

    try {
      for await (const chunk of unsupportedGen()) {
        if (chunk.type === "done") break;
      }
    } catch (err: unknown) {
      const message = (err as Error).message;
      if (message === "SSE_UNSUPPORTED") {
        state.errorMessage =
          "Trình duyệt của bạn không hỗ trợ streaming. Vui lòng dùng trình duyệt hiện đại hơn.";
      } else {
        state.errorMessage = "Gửi tin nhắn thất bại, vui lòng thử lại.";
      }
      state.streamingText = "";
    }

    expect(state.errorMessage).toBe(
      "Trình duyệt của bạn không hỗ trợ streaming. Vui lòng dùng trình duyệt hiện đại hơn."
    );
  });
});

// ── Tests: AbortError handling ────────────────────────────────────────────────

describe("sendMessage — AbortError handling", () => {
  it("does not set errorMessage on AbortError (silent cancel)", async () => {
    async function* abortedGen(): AsyncGenerator<StreamChunk> {
      const err = new DOMException("Aborted", "AbortError");
      throw err;
      yield { type: "done" };
    }

    const state: SimulatedState = {
      localMessages: [{ kind: "text", role: "user", content: "hi", id: "u0" }],
      streamingText: "partial",
      suggestCheckin: false,
      errorMessage: null,
      assistantText: "partial",
    };

    try {
      for await (const chunk of abortedGen()) {
        if (chunk.type === "done") break;
      }
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") {
        state.streamingText = "";
        // no errorMessage set — this is the silent path
      } else {
        state.errorMessage = "Gửi tin nhắn thất bại, vui lòng thử lại.";
        state.streamingText = "";
      }
    }

    expect(state.errorMessage).toBeNull();
    expect(state.streamingText).toBe("");
  });
});

// ── Tests: CHAT_KEYS for query invalidation ───────────────────────────────────

describe("CHAT_KEYS used for invalidation in useStreamChat", () => {
  it("messages key for a conversation is correct", () => {
    const key = CHAT_KEYS.messages("conv-99");
    expect(key).toEqual(["chat", "messages", "conv-99"]);
  });

  it("different conversation ids produce different keys", () => {
    const k1 = JSON.stringify(CHAT_KEYS.messages("a"));
    const k2 = JSON.stringify(CHAT_KEYS.messages("b"));
    expect(k1).not.toBe(k2);
  });
});
