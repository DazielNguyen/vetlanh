/**
 * Unit tests for lib/api/services/fetchChat.ts
 *
 * Tests cover:
 *   1. CRUD methods (createConversation, listConversations, deleteConversation,
 *      getMessages) — verified via mocked Axios apiService.
 *   2. streamChatMessage SSE parsing logic — native fetch is replaced with a
 *      controlled mock that yields pre-built ReadableStream chunks.
 */

// ── Mocks — declared before any imports ──────────────────────────────────────

jest.mock("redux-persist/lib/storage", () => ({
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => "test-auth-token"),
}));

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: { get: mockGet, post: mockPost, delete: mockDelete },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import { fetchChat } from "@/lib/api/services/fetchChat";
import type { Conversation, ChatMessage, StreamChunk } from "@/types/chat";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const sampleConversation: Conversation = {
  id: "conv-1",
  title: "Test chat",
  created_at: "2026-06-05T00:00:00Z",
};

const sampleMessages: ChatMessage[] = [
  { id: "m1", role: "user", content: "Hello", created_at: "2026-06-05T10:00:00Z" },
  { id: "m2", role: "assistant", content: "Hi there", created_at: "2026-06-05T10:00:05Z" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build a mocked Response whose body is a ReadableStream that emits the
 * provided SSE lines followed by a natural end.
 *
 * Each item in `sseLines` is a raw SSE line string, e.g.:
 *   'data: {"type":"chunk","content":"hi"}'
 */
function makeStreamResponse(sseLines: string[], status = 200): Response {
  const encoder = new TextEncoder();
  const fullText = sseLines.map((l) => l + "\n").join("\n");
  const bytes = encoder.encode(fullText);

  let position = 0;
  const readable = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (position >= bytes.length) {
        controller.close();
        return;
      }
      // Emit one byte at a time to stress-test the buffering logic
      controller.enqueue(bytes.slice(position, position + 1));
      position += 1;
    },
  });

  return new Response(readable, {
    status,
    headers: { "Content-Type": "text/event-stream" },
  });
}

/**
 * Collect all chunks from the async generator into an array.
 */
async function collectChunks(
  conversationId: string,
  message: string,
  signal: AbortSignal
): Promise<StreamChunk[]> {
  const chunks: StreamChunk[] = [];
  for await (const chunk of fetchChat.streamChatMessage(conversationId, message, signal)) {
    chunks.push(chunk);
  }
  return chunks;
}

// ── Setup / teardown ──────────────────────────────────────────────────────────

let originalFetch: typeof global.fetch;

beforeAll(() => {
  originalFetch = global.fetch;
  // Make window.ReadableStream available in the node test env so the guard
  // `typeof window !== "undefined" && !("ReadableStream" in window)` passes
  if (typeof (global as any).window === "undefined") {
    (global as any).window = {};
  }
  (global as any).window.ReadableStream = ReadableStream;
});

afterAll(() => {
  global.fetch = originalFetch;
});

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── createConversation ───────────────────────────────────────────────────────

describe("fetchChat.createConversation", () => {
  it("calls POST api/v1/chat/conversations", async () => {
    mockPost.mockResolvedValueOnce({ data: sampleConversation });

    await fetchChat.createConversation();

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith("api/v1/chat/conversations", { title: null });
  });

  it("returns response.data directly", async () => {
    mockPost.mockResolvedValueOnce({ data: sampleConversation });

    const result = await fetchChat.createConversation();

    expect(result).toEqual(sampleConversation);
  });

  it("propagates rejection from apiService.post", async () => {
    mockPost.mockRejectedValueOnce(new Error("Server error"));

    await expect(fetchChat.createConversation()).rejects.toThrow("Server error");
  });
});

// ─── listConversations ────────────────────────────────────────────────────────

describe("fetchChat.listConversations", () => {
  it("calls GET api/v1/chat/conversations", async () => {
    mockGet.mockResolvedValueOnce({ data: [sampleConversation] });

    await fetchChat.listConversations();

    expect(mockGet).toHaveBeenCalledWith("api/v1/chat/conversations", undefined);
  });

  it("returns an array of conversations", async () => {
    mockGet.mockResolvedValueOnce({ data: [sampleConversation] });

    const result = await fetchChat.listConversations();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("conv-1");
  });

  it("returns empty array when server returns none", async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    const result = await fetchChat.listConversations();

    expect(result).toEqual([]);
  });

  it("propagates network errors", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchChat.listConversations()).rejects.toThrow("Network error");
  });
});

// ─── deleteConversation ───────────────────────────────────────────────────────

describe("fetchChat.deleteConversation", () => {
  it("calls DELETE api/v1/chat/conversations/:id", async () => {
    mockDelete.mockResolvedValueOnce({});

    await fetchChat.deleteConversation("conv-99");

    expect(mockDelete).toHaveBeenCalledWith("api/v1/chat/conversations/conv-99");
  });

  it("uses the correct id in the URL for different ids", async () => {
    mockDelete.mockResolvedValueOnce({});

    await fetchChat.deleteConversation("abc-123");

    expect(mockDelete).toHaveBeenCalledWith("api/v1/chat/conversations/abc-123");
  });

  it("propagates rejection when delete fails", async () => {
    mockDelete.mockRejectedValueOnce(new Error("Not found"));

    await expect(fetchChat.deleteConversation("missing")).rejects.toThrow("Not found");
  });
});

// ─── getMessages ──────────────────────────────────────────────────────────────

describe("fetchChat.getMessages", () => {
  it("calls GET with the correct conversation-scoped URL", async () => {
    mockGet.mockResolvedValueOnce({ data: sampleMessages });

    await fetchChat.getMessages("conv-1");

    expect(mockGet).toHaveBeenCalledWith("api/v1/chat/conversations/conv-1/messages");
  });

  it("returns the messages array", async () => {
    mockGet.mockResolvedValueOnce({ data: sampleMessages });

    const result = await fetchChat.getMessages("conv-1");

    expect(result).toHaveLength(2);
    expect(result[0].role).toBe("user");
    expect(result[1].role).toBe("assistant");
  });

  it("returns empty array when conversation has no messages", async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    const result = await fetchChat.getMessages("empty-conv");

    expect(result).toEqual([]);
  });

  it("propagates rejection on network failure", async () => {
    mockGet.mockRejectedValueOnce(new Error("Timeout"));

    await expect(fetchChat.getMessages("conv-1")).rejects.toThrow("Timeout");
  });
});

// ─── streamChatMessage — SSE parsing ─────────────────────────────────────────

describe("fetchChat.streamChatMessage — SSE parsing", () => {
  const controller = new AbortController();

  beforeEach(() => {
    // Ensure process.env is available for the base URL
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:8080";
  });

  it("yields a single chunk chunk with text content", async () => {
    const sseLines = [
      'data: {"type":"chunk","content":"Hello"}',
      'data: {"type":"done"}',
    ];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    const chunks = await collectChunks("conv-1", "hi", controller.signal);

    expect(chunks).toHaveLength(2);
    expect(chunks[0].type).toBe("chunk");
    expect(chunks[0].content).toBe("Hello");
    expect(chunks[1].type).toBe("done");
  });

  it("accumulates multiple chunk chunks before done", async () => {
    const sseLines = [
      'data: {"type":"chunk","content":"A"}',
      'data: {"type":"chunk","content":"B"}',
      'data: {"type":"chunk","content":"C"}',
      'data: {"type":"done"}',
    ];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    const chunks = await collectChunks("conv-1", "test", controller.signal);

    const textChunks = chunks.filter((c) => c.type === "chunk");
    expect(textChunks.map((c) => c.content).join("")).toBe("ABC");
  });

  it("yields exercise_card when present in chunk", async () => {
    const card = {
      slug: "box-breathing",
      title: "Hít thở hộp",
      description: "4-4-4-4",
      category: "breathing",
    };
    const sseLines = [
      `data: {"type":"chunk","exercise_card":${JSON.stringify(card)}}`,
      'data: {"type":"done"}',
    ];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    const chunks = await collectChunks("conv-1", "suggest", controller.signal);

    const withCard = chunks.find((c) => c.exercise_card != null);
    expect(withCard).toBeDefined();
    expect(withCard!.exercise_card!.slug).toBe("box-breathing");
  });

  it("yields suggest_checkin flag when present", async () => {
    const sseLines = [
      'data: {"type":"chunk","suggest_checkin":true}',
      'data: {"type":"done"}',
    ];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    const chunks = await collectChunks("conv-1", "mood?", controller.signal);

    expect(chunks[0].suggest_checkin).toBe(true);
  });

  it("stops yielding after a done chunk", async () => {
    const sseLines = [
      'data: {"type":"chunk","content":"first"}',
      'data: {"type":"done"}',
      'data: {"type":"chunk","content":"should not appear"}',
    ];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    const chunks = await collectChunks("conv-1", "test", controller.signal);

    const afterDone = chunks.filter((c) => c.content === "should not appear");
    expect(afterDone).toHaveLength(0);
  });

  it("stops yielding after an error chunk", async () => {
    const sseLines = [
      'data: {"type":"error","content":"AI failed"}',
      'data: {"type":"chunk","content":"too late"}',
    ];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    const chunks = await collectChunks("conv-1", "oops", controller.signal);

    const afterError = chunks.filter((c) => c.content === "too late");
    expect(afterError).toHaveLength(0);
    expect(chunks[0].type).toBe("error");
    expect(chunks[0].content).toBe("AI failed");
  });

  it("skips lines that are not prefixed with 'data: '", async () => {
    const sseLines = [
      ": ping",
      "event: message",
      'data: {"type":"chunk","content":"valid"}',
      'data: {"type":"done"}',
    ];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    const chunks = await collectChunks("conv-1", "test", controller.signal);

    const textChunks = chunks.filter((c) => c.type === "chunk");
    expect(textChunks).toHaveLength(1);
    expect(textChunks[0].content).toBe("valid");
  });

  it("skips malformed JSON lines without throwing", async () => {
    const sseLines = [
      "data: {broken json",
      'data: {"type":"chunk","content":"ok"}',
      'data: {"type":"done"}',
    ];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    const chunks = await collectChunks("conv-1", "test", controller.signal);

    const textChunks = chunks.filter((c) => c.type === "chunk");
    expect(textChunks).toHaveLength(1);
    expect(textChunks[0].content).toBe("ok");
  });

  it("throws HTTP error when response is not ok (non-401)", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(
      new Response(null, { status: 500 })
    );

    await expect(collectChunks("conv-1", "test", controller.signal)).rejects.toThrow(
      "HTTP 500"
    );
  });

  it("throws HTTP 404 error for missing conversation", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(
      new Response(null, { status: 404 })
    );

    await expect(collectChunks("missing-conv", "test", controller.signal)).rejects.toThrow(
      "HTTP 404"
    );
  });

  it("includes Authorization header when cookie is present", async () => {
    const sseLines = ['data: {"type":"done"}'];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    await collectChunks("conv-1", "hi", controller.signal);

    const callArgs = (global.fetch as jest.Mock).mock.calls[0];
    const options = callArgs[1] as RequestInit;
    expect((options.headers as Record<string, string>)["Authorization"]).toBe(
      "Bearer test-auth-token"
    );
  });

  it("sends message in POST body as JSON", async () => {
    const sseLines = ['data: {"type":"done"}'];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    await collectChunks("conv-1", "my message", controller.signal);

    const callArgs = (global.fetch as jest.Mock).mock.calls[0];
    const options = callArgs[1] as RequestInit;
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body as string)).toEqual({ content: "my message" });
  });

  it("passes the AbortSignal to fetch", async () => {
    const sseLines = ['data: {"type":"done"}'];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    const ac = new AbortController();
    await collectChunks("conv-1", "hi", ac.signal);

    const callArgs = (global.fetch as jest.Mock).mock.calls[0];
    const options = callArgs[1] as RequestInit;
    expect(options.signal).toBe(ac.signal);
  });

  it("includes conversation id in the URL", async () => {
    const sseLines = ['data: {"type":"done"}'];
    global.fetch = jest.fn().mockResolvedValueOnce(makeStreamResponse(sseLines));

    await collectChunks("conv-xyz", "hi", controller.signal);

    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain("conv-xyz");
  });

  it("produces zero chunks when stream is immediately closed (empty body)", async () => {
    const emptyStream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.close();
      },
    });
    global.fetch = jest.fn().mockResolvedValueOnce(
      new Response(emptyStream, { status: 200 })
    );

    const chunks = await collectChunks("conv-1", "hi", controller.signal);
    expect(chunks).toHaveLength(0);
  });
});
