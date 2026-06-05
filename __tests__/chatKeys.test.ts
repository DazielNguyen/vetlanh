/**
 * Unit tests for the CHAT_KEYS query-key factory in hooks/useChat.ts
 *
 * CHAT_KEYS must produce stable, predictable query key arrays so that
 * React Query cache lookups and invalidations target the right entries.
 * These tests are pure logic — no React, no network.
 */

// ── Mocks — prevent side-effecting modules from loading ───────────────────────

jest.mock("redux-persist/lib/storage", () => ({
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => undefined),
}));

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

jest.mock("@/lib/api/services/fetchChat", () => ({
  fetchChat: {
    listConversations: jest.fn(),
    createConversation: jest.fn(),
    deleteConversation: jest.fn(),
    getMessages: jest.fn(),
    streamChatMessage: jest.fn(),
  },
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/lib/api/queryConfig", () => ({
  STALE: { SHORT: 30_000, MEDIUM: 60_000, LONG: 300_000 },
}));

// ── SUT ───────────────────────────────────────────────────────────────────────

import { CHAT_KEYS } from "@/hooks/useChat";

// ─── CHAT_KEYS.conversations ──────────────────────────────────────────────────

describe("CHAT_KEYS.conversations", () => {
  it("is an array", () => {
    expect(Array.isArray(CHAT_KEYS.conversations)).toBe(true);
  });

  it("starts with the 'chat' root segment", () => {
    expect(CHAT_KEYS.conversations[0]).toBe("chat");
  });

  it("second segment is 'conversations'", () => {
    expect(CHAT_KEYS.conversations[1]).toBe("conversations");
  });

  it("has exactly 2 elements", () => {
    expect(CHAT_KEYS.conversations).toHaveLength(2);
  });

  it("is stable across multiple accesses (same reference)", () => {
    expect(CHAT_KEYS.conversations).toBe(CHAT_KEYS.conversations);
  });
});

// ─── CHAT_KEYS.messages(id) ───────────────────────────────────────────────────

describe("CHAT_KEYS.messages", () => {
  it("returns an array", () => {
    expect(Array.isArray(CHAT_KEYS.messages("conv-1"))).toBe(true);
  });

  it("starts with the 'chat' root segment", () => {
    expect(CHAT_KEYS.messages("conv-1")[0]).toBe("chat");
  });

  it("second segment is 'messages'", () => {
    expect(CHAT_KEYS.messages("conv-1")[1]).toBe("messages");
  });

  it("third segment is the conversation id", () => {
    expect(CHAT_KEYS.messages("conv-abc")[2]).toBe("conv-abc");
  });

  it("has exactly 3 elements", () => {
    expect(CHAT_KEYS.messages("x")).toHaveLength(3);
  });

  it("returns different arrays for different conversation ids", () => {
    const key1 = JSON.stringify(CHAT_KEYS.messages("conv-1"));
    const key2 = JSON.stringify(CHAT_KEYS.messages("conv-2"));
    expect(key1).not.toBe(key2);
  });

  it("returns the same serialised key for the same id", () => {
    const key1 = JSON.stringify(CHAT_KEYS.messages("conv-42"));
    const key2 = JSON.stringify(CHAT_KEYS.messages("conv-42"));
    expect(key1).toBe(key2);
  });
});

// ─── Key uniqueness ───────────────────────────────────────────────────────────

describe("CHAT_KEYS uniqueness", () => {
  it("conversations and messages keys do not collide", () => {
    expect(JSON.stringify(CHAT_KEYS.conversations)).not.toBe(
      JSON.stringify(CHAT_KEYS.messages("conv-1"))
    );
  });

  it("messages keys for distinct ids are all unique", () => {
    const keys = ["a", "b", "c"].map((id) => JSON.stringify(CHAT_KEYS.messages(id)));
    expect(new Set(keys).size).toBe(3);
  });

  it("both key families share the 'chat' root prefix", () => {
    expect(CHAT_KEYS.conversations[0]).toBe("chat");
    expect(CHAT_KEYS.messages("any")[0]).toBe("chat");
  });
});
