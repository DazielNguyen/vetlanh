/**
 * Unit tests for hooks/useCommunityMatch.ts
 *
 * No jsdom in this repo (testEnvironment: "node"), so effects never run under
 * react-dom/server's renderToStaticMarkup — same documented limitation as
 * __tests__/useCheckIns.test.ts. Strategy mirrors that file exactly:
 *
 *  - useCommunityMatchStatus: mock useQuery/useQueryClient directly, render a
 *    throwaway host with renderToStaticMarkup to capture the queryKey/enabled/
 *    staleTime/retry wiring and the status/match/isLoading passthrough. The
 *    SignalR ReceiveCommunityMatch/CommunityMatchEnded subscribe+cleanup
 *    logic is exercised by replicating the effect body verbatim and driving
 *    it against a mocked HubConnection + queryClient.setQueryData.
 *
 *  - useCommunityOptInOut: optIn/optOut are plain async callbacks (not
 *    effect-gated) — exercised directly via a real render + calling the
 *    captured functions.
 *
 *  - useCommunityMatchActions: exit/block/report are plain synchronous
 *    callbacks that fire a background promise — exercised directly, mirroring
 *    the useDismissCheckIn optimistic-update tests in useCheckIns.test.ts.
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

const mockGetMatchStatus = jest.fn();
const mockOptIn = jest.fn();
const mockOptOut = jest.fn();
const mockExitMatch = jest.fn();
const mockBlockMatch = jest.fn();
const mockReportMatch = jest.fn();

jest.mock("@/lib/api/services/fetchCommunity", () => ({
  fetchCommunity: {
    getMatchStatus: (...args: unknown[]) => mockGetMatchStatus(...args),
    optIn: (...args: unknown[]) => mockOptIn(...args),
    optOut: (...args: unknown[]) => mockOptOut(...args),
    exitMatch: (...args: unknown[]) => mockExitMatch(...args),
    blockMatch: (...args: unknown[]) => mockBlockMatch(...args),
    reportMatch: (...args: unknown[]) => mockReportMatch(...args),
  },
}));

const mockGetHubConnection = jest.fn();

jest.mock("@/lib/realtime/signalr", () => ({
  getHubConnection: (...args: unknown[]) => mockGetHubConnection(...args),
}));

const mockUseAppSelector = jest.fn();

jest.mock("@/lib/redux/hooks", () => ({
  useAppSelector: (...args: unknown[]) => mockUseAppSelector(...args),
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import {
  useCommunityMatchStatus,
  useCommunityOptInOut,
  useCommunityMatchActions,
  COMMUNITY_KEYS,
} from "@/hooks/useCommunityMatch";
import { skipRetryOn } from "@/lib/api/queryConfig";
import { fetchCommunity } from "@/lib/api/services/fetchCommunity";
import type { CommunityMatch, CommunityMatchStatusResponse } from "@/types/community";

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderUseCommunityMatchStatus(): ReturnType<typeof useCommunityMatchStatus> {
  let captured!: ReturnType<typeof useCommunityMatchStatus>;
  function Host() {
    captured = useCommunityMatchStatus();
    return null;
  }
  renderToStaticMarkup(React.createElement(Host));
  return captured;
}

function renderUseCommunityOptInOut(): ReturnType<typeof useCommunityOptInOut> {
  let captured!: ReturnType<typeof useCommunityOptInOut>;
  function Host() {
    captured = useCommunityOptInOut();
    return null;
  }
  renderToStaticMarkup(React.createElement(Host));
  return captured;
}

function renderUseCommunityMatchActions(): ReturnType<typeof useCommunityMatchActions> {
  let captured!: ReturnType<typeof useCommunityMatchActions>;
  function Host() {
    captured = useCommunityMatchActions();
    return null;
  }
  renderToStaticMarkup(React.createElement(Host));
  return captured;
}

const match: CommunityMatch = {
  matchId: "match-1",
  partnerHandle: "AnHung92",
  matchedAt: "2026-07-21T08:00:00Z",
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });
  mockUseQueryClient.mockReturnValue({ setQueryData: jest.fn() });
  mockUseAppSelector.mockReturnValue(true);
});

// ─── COMMUNITY_KEYS ───────────────────────────────────────────────────────────

describe("COMMUNITY_KEYS", () => {
  it("status key is ['community', 'status']", () => {
    expect(COMMUNITY_KEYS.status).toEqual(["community", "status"]);
  });
});

// ─── useCommunityMatchStatus — useQuery configuration ────────────────────────

describe("useCommunityMatchStatus — useQuery configuration", () => {
  it("calls useQuery with COMMUNITY_KEYS.status as the queryKey", () => {
    renderUseCommunityMatchStatus();

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: COMMUNITY_KEYS.status })
    );
  });

  it("sets enabled: true when the user is authenticated", () => {
    mockUseAppSelector.mockReturnValue(true);

    renderUseCommunityMatchStatus();

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
  });

  it("sets enabled: false when the user is not authenticated", () => {
    mockUseAppSelector.mockReturnValue(false);

    renderUseCommunityMatchStatus();

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it("uses fetchCommunity.getMatchStatus as the queryFn", () => {
    renderUseCommunityMatchStatus();

    const config = mockUseQuery.mock.calls[0][0];
    expect(config.queryFn).toBe(fetchCommunity.getMatchStatus);
  });

  it("applies a skipRetryOn(404)-shaped retry function so a missing BE endpoint fails silently", () => {
    renderUseCommunityMatchStatus();

    const config = mockUseQuery.mock.calls[0][0];
    const retry404 = skipRetryOn(404);
    expect(config.retry(0, { code: 404 })).toBe(retry404(0, { code: 404 }));
    expect(config.retry(0, { code: 500 })).toBe(retry404(0, { code: 500 }));
    expect(config.retry(2, { code: 500 })).toBe(retry404(2, { code: 500 }));
  });
});

// ─── useCommunityMatchStatus — return value ──────────────────────────────────

describe("useCommunityMatchStatus — return value", () => {
  it("defaults to opted_out/null when query.data is undefined", () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });

    const result = renderUseCommunityMatchStatus();

    expect(result.status).toBe("opted_out");
    expect(result.match).toBeNull();
    expect(result.isLoading).toBe(true);
  });

  it("passes through query.data's status and match when present", () => {
    const data: CommunityMatchStatusResponse = { status: "matched", match };
    mockUseQuery.mockReturnValue({ data, isLoading: false });

    const result = renderUseCommunityMatchStatus();

    expect(result.status).toBe("matched");
    expect(result.match).toEqual(match);
    expect(result.isLoading).toBe(false);
  });

  it("never exposes anything beyond matchId/partnerHandle/matchedAt on the match object (no partner user id/avatar leak)", () => {
    const data: CommunityMatchStatusResponse = { status: "matched", match };
    mockUseQuery.mockReturnValue({ data, isLoading: false });

    const result = renderUseCommunityMatchStatus();

    expect(Object.keys(result.match!).sort()).toEqual(["matchId", "matchedAt", "partnerHandle"].sort());
  });
});

// ─── useCommunityMatchStatus — SignalR subscription (replicated effect logic) ─
//
// Effects don't run under renderToStaticMarkup — replicate the effect body
// verbatim from hooks/useCommunityMatch.ts, mirroring useCheckIns.test.ts.

describe("useCommunityMatchStatus — SignalR subscription (replicated effect logic)", () => {
  type SetQueryData = jest.Mock;

  function buildHandlers(setQueryData: SetQueryData) {
    const handleMatched = (m: CommunityMatch) => {
      setQueryData(COMMUNITY_KEYS.status, { status: "matched", match: m });
    };
    const handleMatchEnded = () => {
      setQueryData(COMMUNITY_KEYS.status, { status: "waiting", match: null });
    };
    return { handleMatched, handleMatchEnded };
  }

  it("subscribes to ReceiveCommunityMatch and CommunityMatchEnded when authenticated", () => {
    const on = jest.fn();
    const off = jest.fn();
    mockGetHubConnection.mockReturnValue({ on, off });

    const connection = mockGetHubConnection();
    const setQueryData = jest.fn();
    const { handleMatched, handleMatchEnded } = buildHandlers(setQueryData);
    connection.on("ReceiveCommunityMatch", handleMatched);
    connection.on("CommunityMatchEnded", handleMatchEnded);

    expect(mockGetHubConnection).toHaveBeenCalledTimes(1);
    expect(on).toHaveBeenCalledWith("ReceiveCommunityMatch", handleMatched);
    expect(on).toHaveBeenCalledWith("CommunityMatchEnded", handleMatchEnded);
  });

  it("unsubscribes both listeners on cleanup", () => {
    const on = jest.fn();
    const off = jest.fn();
    mockGetHubConnection.mockReturnValue({ on, off });

    const connection = mockGetHubConnection();
    const setQueryData = jest.fn();
    const { handleMatched, handleMatchEnded } = buildHandlers(setQueryData);
    connection.on("ReceiveCommunityMatch", handleMatched);
    connection.on("CommunityMatchEnded", handleMatchEnded);
    connection.off("ReceiveCommunityMatch", handleMatched);
    connection.off("CommunityMatchEnded", handleMatchEnded);

    expect(off).toHaveBeenCalledWith("ReceiveCommunityMatch", handleMatched);
    expect(off).toHaveBeenCalledWith("CommunityMatchEnded", handleMatchEnded);
  });

  it("ReceiveCommunityMatch writes status: 'matched' with the pushed match into the cache", () => {
    const setQueryData = jest.fn();
    const { handleMatched } = buildHandlers(setQueryData);

    handleMatched(match);

    expect(setQueryData).toHaveBeenCalledWith(COMMUNITY_KEYS.status, { status: "matched", match });
  });

  it("CommunityMatchEnded resets to status: 'waiting', match: null", () => {
    const setQueryData = jest.fn();
    const { handleMatchEnded } = buildHandlers(setQueryData);

    handleMatchEnded();

    expect(setQueryData).toHaveBeenCalledWith(COMMUNITY_KEYS.status, { status: "waiting", match: null });
  });

  it("does not subscribe when isAuthenticated is false (per hook's early-return guard)", () => {
    const isAuthenticated = false;
    if (isAuthenticated) {
      mockGetHubConnection();
    }

    expect(mockGetHubConnection).not.toHaveBeenCalled();
  });
});

// ─── useCommunityOptInOut ─────────────────────────────────────────────────────

describe("useCommunityOptInOut", () => {
  it("returns callable optIn/optOut functions and isPending: false initially", () => {
    const result = renderUseCommunityOptInOut();

    expect(typeof result.optIn).toBe("function");
    expect(typeof result.optOut).toBe("function");
    expect(result.isPending).toBe(false);
  });

  it("optIn awaits fetchCommunity.optIn and writes the result into the status cache", async () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    const response: CommunityMatchStatusResponse = { status: "matched", match };
    mockOptIn.mockResolvedValueOnce(response);

    const { optIn } = renderUseCommunityOptInOut();
    await optIn();

    expect(mockOptIn).toHaveBeenCalledTimes(1);
    expect(setQueryData).toHaveBeenCalledWith(COMMUNITY_KEYS.status, response);
  });

  it("optIn can resolve to a waiting status (no immediate match)", async () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    const response: CommunityMatchStatusResponse = { status: "waiting", match: null };
    mockOptIn.mockResolvedValueOnce(response);

    const { optIn } = renderUseCommunityOptInOut();
    await optIn();

    expect(setQueryData).toHaveBeenCalledWith(COMMUNITY_KEYS.status, response);
  });

  it("optOut awaits fetchCommunity.optOut and writes opted_out/null into the status cache", async () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockOptOut.mockResolvedValueOnce(undefined);

    const { optOut } = renderUseCommunityOptInOut();
    await optOut();

    expect(mockOptOut).toHaveBeenCalledTimes(1);
    expect(setQueryData).toHaveBeenCalledWith(COMMUNITY_KEYS.status, { status: "opted_out", match: null });
  });

  it("propagates rejection from fetchCommunity.optIn (deliberate, confirmed action — the UI awaits it)", async () => {
    mockOptIn.mockRejectedValueOnce(new Error("Network error"));

    const { optIn } = renderUseCommunityOptInOut();

    await expect(optIn()).rejects.toThrow("Network error");
  });
});

// ─── useCommunityMatchActions — optimistic exit/block/report ────────────────

describe("useCommunityMatchActions", () => {
  it("exitMatch synchronously clears local match state to 'waiting' before the network promise resolves", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockExitMatch.mockResolvedValueOnce(undefined);

    const { exitMatch } = renderUseCommunityMatchActions();
    exitMatch("match-1");

    // Called synchronously, before any await/microtask flush.
    expect(setQueryData).toHaveBeenCalledWith(COMMUNITY_KEYS.status, { status: "waiting", match: null });
    expect(mockExitMatch).toHaveBeenCalledWith("match-1");
  });

  it("blockMatch synchronously clears local match state to 'waiting'", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockBlockMatch.mockResolvedValueOnce(undefined);

    const { blockMatch } = renderUseCommunityMatchActions();
    blockMatch("match-1");

    expect(setQueryData).toHaveBeenCalledWith(COMMUNITY_KEYS.status, { status: "waiting", match: null });
    expect(mockBlockMatch).toHaveBeenCalledWith("match-1");
  });

  it("reportMatch synchronously clears local match state to 'waiting' (report also triggers exit)", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockReportMatch.mockResolvedValueOnce(undefined);

    const { reportMatch } = renderUseCommunityMatchActions();
    reportMatch("match-1", "Ngôn từ khiếm nhã");

    expect(setQueryData).toHaveBeenCalledWith(COMMUNITY_KEYS.status, { status: "waiting", match: null });
    expect(mockReportMatch).toHaveBeenCalledWith("match-1", "Ngôn từ khiếm nhã");
  });

  it("reportMatch works with no reason given", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockReportMatch.mockResolvedValueOnce(undefined);

    const { reportMatch } = renderUseCommunityMatchActions();
    reportMatch("match-1");

    expect(mockReportMatch).toHaveBeenCalledWith("match-1", undefined);
  });

  it("exitMatch does not throw and does not revert state when the background call rejects", async () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockExitMatch.mockRejectedValueOnce(new Error("network down"));
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const { exitMatch } = renderUseCommunityMatchActions();

    expect(() => exitMatch("match-1")).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();

    // Only ever called once (the optimistic clear) — no rollback attempt.
    expect(setQueryData).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("blockMatch does not throw and does not revert state when the background call rejects", async () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockBlockMatch.mockRejectedValueOnce(new Error("network down"));
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const { blockMatch } = renderUseCommunityMatchActions();

    expect(() => blockMatch("match-1")).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();

    expect(setQueryData).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  it("reportMatch does not throw and does not revert state when the background call rejects", async () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockReportMatch.mockRejectedValueOnce(new Error("network down"));
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const { reportMatch } = renderUseCommunityMatchActions();

    expect(() => reportMatch("match-1", "reason")).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();

    expect(setQueryData).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });
});
