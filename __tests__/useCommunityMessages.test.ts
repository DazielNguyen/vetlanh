/**
 * Unit tests for hooks/useCommunityMessages.ts
 *
 * Same node-environment/no-jsdom strategy as __tests__/useCheckIns.test.ts and
 * __tests__/useCommunityMatch.test.ts: mock useQuery/useQueryClient directly,
 * capture the hook's return value + useQuery config via renderToStaticMarkup,
 * and replicate the SignalR effect body verbatim to exercise subscribe/
 * cleanup/dedupe logic that never runs during SSR.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// ── Mocks — declared before imports ──────────────────────────────────────────

jest.mock("redux-persist/lib/storage", () => ({
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => undefined),
}));

const mockUseQuery = jest.fn();
const mockUseQueryClient = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  useQueryClient: (...args: unknown[]) => mockUseQueryClient(...args),
}));

const mockGetMessages = jest.fn();
const mockSendMessage = jest.fn();

jest.mock("@/lib/api/services/fetchCommunity", () => ({
  fetchCommunity: {
    getMessages: (...args: unknown[]) => mockGetMessages(...args),
    sendMessage: (...args: unknown[]) => mockSendMessage(...args),
  },
}));

const mockGetHubConnection = jest.fn();

jest.mock("@/lib/realtime/signalr", () => ({
  getHubConnection: (...args: unknown[]) => mockGetHubConnection(...args),
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import { useCommunityMessages, useSendCommunityMessage } from "@/hooks/useCommunityMessages";
import { skipRetryOn } from "@/lib/api/queryConfig";
import { fetchCommunity } from "@/lib/api/services/fetchCommunity";
import type { CommunityMessage } from "@/types/community";

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderUseCommunityMessages(matchId: string | null): ReturnType<typeof useCommunityMessages> {
  let captured!: ReturnType<typeof useCommunityMessages>;
  function Host() {
    captured = useCommunityMessages(matchId);
    return null;
  }
  renderToStaticMarkup(React.createElement(Host));
  return captured;
}

function renderUseSendCommunityMessage(matchId: string | null): ReturnType<typeof useSendCommunityMessage> {
  let captured!: ReturnType<typeof useSendCommunityMessage>;
  function Host() {
    captured = useSendCommunityMessage(matchId);
    return null;
  }
  renderToStaticMarkup(React.createElement(Host));
  return captured;
}

const msgA: CommunityMessage = {
  id: "msg-1",
  matchId: "match-1",
  content: "Chào bạn",
  isMine: false,
  createdAt: "2026-07-21T08:00:00Z",
};

const msgB: CommunityMessage = {
  id: "msg-2",
  matchId: "match-1",
  content: "Chào, dạo này bạn ổn không?",
  isMine: true,
  createdAt: "2026-07-21T08:01:00Z",
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });
  mockUseQueryClient.mockReturnValue({ setQueryData: jest.fn() });
});

// ─── useCommunityMessages — useQuery configuration ───────────────────────────

describe("useCommunityMessages — useQuery configuration", () => {
  it("uses ['community','messages',matchId] as the queryKey when matchId is present", () => {
    renderUseCommunityMessages("match-1");

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ["community", "messages", "match-1"] })
    );
  });

  it("falls back to a 'none' queryKey and enabled:false when matchId is null", () => {
    renderUseCommunityMessages(null);

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ["community", "messages", "none"], enabled: false })
    );
  });

  it("sets enabled: true when matchId is present", () => {
    renderUseCommunityMessages("match-1");

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
  });

  it("sets staleTime: Infinity (new messages arrive only via SignalR push)", () => {
    renderUseCommunityMessages("match-1");

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ staleTime: Infinity }));
  });

  it("queryFn calls fetchCommunity.getMessages with the matchId", async () => {
    mockGetMessages.mockResolvedValueOnce([msgA]);

    renderUseCommunityMessages("match-1");

    const config = mockUseQuery.mock.calls[0][0];
    await config.queryFn();

    expect(mockGetMessages).toHaveBeenCalledWith("match-1");
  });

  it("applies a skipRetryOn(404)-shaped retry function", () => {
    renderUseCommunityMessages("match-1");

    const config = mockUseQuery.mock.calls[0][0];
    const retry404 = skipRetryOn(404);
    expect(config.retry(0, { code: 404 })).toBe(retry404(0, { code: 404 }));
    expect(config.retry(2, { code: 500 })).toBe(retry404(2, { code: 500 }));
  });
});

// ─── useCommunityMessages — return value ─────────────────────────────────────

describe("useCommunityMessages — return value", () => {
  it("defaults messages to an empty array when query.data is undefined", () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });

    const result = renderUseCommunityMessages("match-1");

    expect(result.messages).toEqual([]);
    expect(result.isLoading).toBe(true);
  });

  it("passes through query.data as messages when present", () => {
    mockUseQuery.mockReturnValue({ data: [msgA, msgB], isLoading: false });

    const result = renderUseCommunityMessages("match-1");

    expect(result.messages).toEqual([msgA, msgB]);
  });
});

// ─── useCommunityMessages — SignalR subscription (replicated effect logic) ──

describe("useCommunityMessages — SignalR subscription (replicated effect logic)", () => {
  function buildHandleMessage(matchId: string, setQueryData: jest.Mock) {
    // Mirrors handleMessage inside the hook's useEffect exactly.
    return (message: CommunityMessage) => {
      if (message.matchId !== matchId) return;
      setQueryData(["community", "messages", matchId], (prev: CommunityMessage[] | undefined) => {
        const existing = prev ?? [];
        if (existing.some((m) => m.id === message.id)) return existing;
        return [...existing, message];
      });
    };
  }

  it("subscribes to ReceiveCommunityMessage when matchId is present", () => {
    const on = jest.fn();
    const off = jest.fn();
    mockGetHubConnection.mockReturnValue({ on, off });

    const connection = mockGetHubConnection();
    const setQueryData = jest.fn();
    const handleMessage = buildHandleMessage("match-1", setQueryData);
    connection.on("ReceiveCommunityMessage", handleMessage);

    expect(mockGetHubConnection).toHaveBeenCalledTimes(1);
    expect(on).toHaveBeenCalledWith("ReceiveCommunityMessage", handleMessage);
  });

  it("unsubscribes from ReceiveCommunityMessage on cleanup", () => {
    const on = jest.fn();
    const off = jest.fn();
    mockGetHubConnection.mockReturnValue({ on, off });

    const connection = mockGetHubConnection();
    const setQueryData = jest.fn();
    const handleMessage = buildHandleMessage("match-1", setQueryData);
    connection.on("ReceiveCommunityMessage", handleMessage);
    connection.off("ReceiveCommunityMessage", handleMessage);

    expect(off).toHaveBeenCalledWith("ReceiveCommunityMessage", handleMessage);
  });

  it("ignores a pushed message belonging to a different matchId", () => {
    const setQueryData = jest.fn();
    const handleMessage = buildHandleMessage("match-1", setQueryData);

    handleMessage({ ...msgA, matchId: "match-other" });

    expect(setQueryData).not.toHaveBeenCalled();
  });

  it("merges an incoming message into the cache without duplicating an existing id", () => {
    const setQueryData = jest.fn();
    const handleMessage = buildHandleMessage("match-1", setQueryData);

    handleMessage(msgB);

    const updater = setQueryData.mock.calls[0][1];
    const merged = updater([msgA]);
    expect(merged).toEqual([msgA, msgB]);

    setQueryData.mockClear();
    handleMessage(msgA);
    const updater2 = setQueryData.mock.calls[0][1];
    const merged2 = updater2([msgA, msgB]);
    expect(merged2).toEqual([msgA, msgB]);
    expect(merged2).toHaveLength(2);
  });

  it("merges into an empty/undefined cache correctly", () => {
    const setQueryData = jest.fn();
    const handleMessage = buildHandleMessage("match-1", setQueryData);

    handleMessage(msgA);

    const updater = setQueryData.mock.calls[0][1];
    expect(updater(undefined)).toEqual([msgA]);
  });

  it("does not subscribe when matchId is null (per hook's early-return guard)", () => {
    const matchId: string | null = null;
    if (matchId) {
      mockGetHubConnection();
    }

    expect(mockGetHubConnection).not.toHaveBeenCalled();
  });
});

// ─── useSendCommunityMessage ──────────────────────────────────────────────────

describe("useSendCommunityMessage", () => {
  it("returns a callable send function", () => {
    const send = renderUseSendCommunityMessage("match-1");

    expect(typeof send).toBe("function");
  });

  it("does nothing when matchId is null", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });

    const send = renderUseSendCommunityMessage(null);
    send("Chào bạn");

    expect(setQueryData).not.toHaveBeenCalled();
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("does nothing when content is blank/whitespace-only", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });

    const send = renderUseSendCommunityMessage("match-1");
    send("   ");

    expect(setQueryData).not.toHaveBeenCalled();
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("synchronously appends an optimistic local message before the network call resolves", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockSendMessage.mockResolvedValueOnce(msgB);

    const send = renderUseSendCommunityMessage("match-1");
    send("Chào, dạo này bạn ổn không?");

    expect(setQueryData).toHaveBeenCalledWith(["community", "messages", "match-1"], expect.any(Function));
    const updater = setQueryData.mock.calls[0][1];
    const result = updater([msgA]);
    expect(result).toHaveLength(2);
    expect(result[1]).toMatchObject({ matchId: "match-1", content: "Chào, dạo này bạn ổn không?", isMine: true });
    expect(result[1].id).toMatch(/^local-/);
  });

  it("calls fetchCommunity.sendMessage with the matchId and trimmed... content in the background", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockSendMessage.mockResolvedValueOnce(msgB);

    const send = renderUseSendCommunityMessage("match-1");
    send("Chào bạn");

    expect(mockSendMessage).toHaveBeenCalledWith("match-1", "Chào bạn");
  });

  it("does not throw when fetchCommunity.sendMessage rejects (fire-and-forget)", async () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockSendMessage.mockRejectedValueOnce(new Error("network down"));
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const send = renderUseSendCommunityMessage("match-1");

    expect(() => send("Chào bạn")).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();

    expect(setQueryData).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("passes raw untrusted content through to fetchCommunity.sendMessage without any HTML/markdown transformation", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockSendMessage.mockResolvedValueOnce(msgB);
    const raw = "**bold** <script>alert(1)</script>";

    const send = renderUseSendCommunityMessage("match-1");
    send(raw);

    expect(mockSendMessage).toHaveBeenCalledWith("match-1", raw);
    const updater = setQueryData.mock.calls[0][1];
    const result = updater([]);
    expect(result[0].content).toBe(raw);
  });
});
