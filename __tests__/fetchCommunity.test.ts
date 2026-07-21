/**
 * Unit tests for lib/api/services/fetchCommunity.ts
 *
 * All 8 methods delegate to the apiService singleton. We mock apiService so
 * no real network call is made, then assert the exact HTTP method/URL/body
 * used and that the response is unwrapped/propagated correctly. Following the
 * pattern in __tests__/fetchRecommendation.test.ts.
 */

// ── Mocks — declared before imports ──────────────────────────────────────────

jest.mock("redux-persist/lib/storage", () => ({
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => undefined),
}));

const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: { get: mockGet, post: mockPost },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import { fetchCommunity } from "@/lib/api/services/fetchCommunity";
import type { CommunityMatch, CommunityMatchStatusResponse, CommunityMessage } from "@/types/community";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const match: CommunityMatch = {
  matchId: "match-1",
  partnerHandle: "AnHung92",
  matchedAt: "2026-07-21T08:00:00Z",
};

const statusResponse: CommunityMatchStatusResponse = { status: "matched", match };

const message: CommunityMessage = {
  id: "msg-1",
  matchId: "match-1",
  content: "Chào bạn",
  isMine: false,
  createdAt: "2026-07-21T08:05:00Z",
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getMatchStatus ───────────────────────────────────────────────────────────

describe("fetchCommunity.getMatchStatus", () => {
  it("calls GET api/v1/community/match/status", async () => {
    mockGet.mockResolvedValueOnce({ data: statusResponse });

    await fetchCommunity.getMatchStatus();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("api/v1/community/match/status");
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: statusResponse });

    const result = await fetchCommunity.getMatchStatus();

    expect(result).toEqual(statusResponse);
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchCommunity.getMatchStatus()).rejects.toThrow("Network error");
  });

  it("propagates a 404 without swallowing it (retry policy handles it upstream)", async () => {
    mockGet.mockRejectedValueOnce({ code: 404, message: "Not Found" });

    await expect(fetchCommunity.getMatchStatus()).rejects.toMatchObject({ code: 404 });
  });
});

// ─── optIn ────────────────────────────────────────────────────────────────────

describe("fetchCommunity.optIn", () => {
  it("calls POST api/v1/community/opt-in", async () => {
    mockPost.mockResolvedValueOnce({ data: statusResponse });

    await fetchCommunity.optIn();

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith("api/v1/community/opt-in");
  });

  it("returns response.data directly", async () => {
    mockPost.mockResolvedValueOnce({ data: statusResponse });

    const result = await fetchCommunity.optIn();

    expect(result).toEqual(statusResponse);
  });
});

// ─── optOut ───────────────────────────────────────────────────────────────────

describe("fetchCommunity.optOut", () => {
  it("calls POST api/v1/community/opt-out with no body", async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await fetchCommunity.optOut();

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith("api/v1/community/opt-out");
  });

  it("resolves to undefined", async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await expect(fetchCommunity.optOut()).resolves.toBeUndefined();
  });
});

// ─── getMessages ──────────────────────────────────────────────────────────────

describe("fetchCommunity.getMessages", () => {
  it("calls GET api/v1/community/match/:matchId/messages", async () => {
    mockGet.mockResolvedValueOnce({ data: [message] });

    await fetchCommunity.getMessages("match-1");

    expect(mockGet).toHaveBeenCalledWith("api/v1/community/match/match-1/messages");
  });

  it("returns the array of messages", async () => {
    mockGet.mockResolvedValueOnce({ data: [message] });

    const result = await fetchCommunity.getMessages("match-1");

    expect(result).toEqual([message]);
  });

  it("returns an empty array when there are no messages yet", async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    const result = await fetchCommunity.getMessages("match-1");

    expect(result).toEqual([]);
  });
});

// ─── sendMessage ──────────────────────────────────────────────────────────────

describe("fetchCommunity.sendMessage", () => {
  it("calls POST api/v1/community/match/:matchId/messages with { content }", async () => {
    mockPost.mockResolvedValueOnce({ data: message });

    await fetchCommunity.sendMessage("match-1", "Chào bạn");

    expect(mockPost).toHaveBeenCalledWith("api/v1/community/match/match-1/messages", { content: "Chào bạn" });
  });

  it("returns the created message", async () => {
    mockPost.mockResolvedValueOnce({ data: message });

    const result = await fetchCommunity.sendMessage("match-1", "Chào bạn");

    expect(result).toEqual(message);
  });

  it("passes untrusted content through as a plain string (no HTML/markdown transformation at the service layer)", async () => {
    const raw = "**bold** <script>alert(1)</script>";
    mockPost.mockResolvedValueOnce({ data: { ...message, content: raw } });

    await fetchCommunity.sendMessage("match-1", raw);

    expect(mockPost).toHaveBeenCalledWith("api/v1/community/match/match-1/messages", { content: raw });
  });
});

// ─── exitMatch ────────────────────────────────────────────────────────────────

describe("fetchCommunity.exitMatch", () => {
  it("calls POST api/v1/community/match/:matchId/exit", async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await fetchCommunity.exitMatch("match-1");

    expect(mockPost).toHaveBeenCalledWith("api/v1/community/match/match-1/exit");
  });
});

// ─── blockMatch ───────────────────────────────────────────────────────────────

describe("fetchCommunity.blockMatch", () => {
  it("calls POST api/v1/community/match/:matchId/block", async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await fetchCommunity.blockMatch("match-1");

    expect(mockPost).toHaveBeenCalledWith("api/v1/community/match/match-1/block");
  });
});

// ─── reportMatch ──────────────────────────────────────────────────────────────

describe("fetchCommunity.reportMatch", () => {
  it("calls POST api/v1/community/match/:matchId/report with { reason } when a reason is given", async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await fetchCommunity.reportMatch("match-1", "Lời lẽ khiếm nhã");

    expect(mockPost).toHaveBeenCalledWith("api/v1/community/match/match-1/report", { reason: "Lời lẽ khiếm nhã" });
  });

  it("calls POST with no body when no reason is given", async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await fetchCommunity.reportMatch("match-1");

    expect(mockPost).toHaveBeenCalledWith("api/v1/community/match/match-1/report", undefined);
  });

  it("treats an empty-string reason the same as no reason (falsy)", async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await fetchCommunity.reportMatch("match-1", "");

    expect(mockPost).toHaveBeenCalledWith("api/v1/community/match/match-1/report", undefined);
  });

  it("propagates rejection when apiService.post throws", async () => {
    mockPost.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchCommunity.reportMatch("match-1", "reason")).rejects.toThrow("Network error");
  });
});
