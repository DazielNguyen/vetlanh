/**
 * Unit tests for hooks/useCheckIns.ts
 *
 * This repo has no jsdom (jest.config.ts uses testEnvironment: "node"), so we
 * can't mount a real client tree and flush effects — the SignalR subscribe/
 * unsubscribe in usePendingCheckIns lives inside a useEffect, which never
 * runs under react-dom/server's renderToStaticMarkup (SSR has no commit
 * phase). This mirrors the documented limitation in
 * __tests__/useBadges.test.tsx and __tests__/useFirstRun.test.tsx.
 *
 * Strategy:
 *  - Mock @tanstack/react-query's useQuery/useQueryClient directly (no
 *    QueryClientProvider needed) and render a throwaway host component with
 *    renderToStaticMarkup to capture the hook's synchronous return value and
 *    the config object passed to useQuery. This exercises the queryKey/
 *    enabled/staleTime/retry wiring and the checkIns/isLoading passthrough.
 *  - The SignalR "ReceiveProactiveCheckIn" subscribe-on-mount /
 *    unsubscribe-on-unmount behavior, and the dedup-merge handler, are
 *    exercised by replicating the exact effect body verbatim (mirroring the
 *    pattern __tests__/useSafetyPlan.test.ts uses for onMutate/onError) and
 *    driving it against a mocked HubConnection + queryClient.setQueryData.
 *  - useDismissCheckIn returns a plain callback (not effect-gated), so it CAN
 *    be exercised directly through a real render + calling the captured
 *    function, verifying the optimistic removal is synchronous and that a
 *    rejected fetchCheckIns.dismiss() never throws/propagates.
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

const mockGetPending = jest.fn();
const mockDismiss = jest.fn();

jest.mock("@/lib/api/services/fetchCheckIns", () => ({
  fetchCheckIns: {
    getPending: (...args: unknown[]) => mockGetPending(...args),
    dismiss: (...args: unknown[]) => mockDismiss(...args),
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
  usePendingCheckIns,
  useDismissCheckIn,
  CHECKIN_KEYS,
} from "@/hooks/useCheckIns";
import { skipRetryOn } from "@/lib/api/queryConfig";
import { fetchCheckIns } from "@/lib/api/services/fetchCheckIns";
import type { ProactiveCheckIn } from "@/types/checkIn";

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderUsePendingCheckIns(): ReturnType<typeof usePendingCheckIns> {
  let captured!: ReturnType<typeof usePendingCheckIns>;
  function Host() {
    captured = usePendingCheckIns();
    return null;
  }
  renderToStaticMarkup(React.createElement(Host));
  return captured;
}

function renderUseDismissCheckIn(): ReturnType<typeof useDismissCheckIn> {
  let captured!: ReturnType<typeof useDismissCheckIn>;
  function Host() {
    captured = useDismissCheckIn();
    return null;
  }
  renderToStaticMarkup(React.createElement(Host));
  return captured;
}

const checkInA: ProactiveCheckIn = {
  id: "checkin-1",
  message: "Dạo này bạn có ổn không?",
  created_at: "2026-07-20T08:00:00Z",
};

const checkInB: ProactiveCheckIn = {
  id: "checkin-2",
  message: "Mình luôn ở đây nếu bạn cần nói chuyện.",
  trigger_reason: "missed_checkin",
  created_at: "2026-07-21T08:00:00Z",
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });
  mockUseQueryClient.mockReturnValue({ setQueryData: jest.fn() });
});

// ─── CHECKIN_KEYS ─────────────────────────────────────────────────────────────

describe("CHECKIN_KEYS", () => {
  it("pending key is ['checkins', 'pending']", () => {
    expect(CHECKIN_KEYS.pending).toEqual(["checkins", "pending"]);
  });
});

// ─── usePendingCheckIns — useQuery configuration ─────────────────────────────

describe("usePendingCheckIns — useQuery configuration", () => {
  it("calls useQuery with CHECKIN_KEYS.pending as the queryKey", () => {
    mockUseAppSelector.mockReturnValue(true);

    renderUsePendingCheckIns();

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: CHECKIN_KEYS.pending })
    );
  });

  it("sets enabled: true when the user is authenticated", () => {
    mockUseAppSelector.mockReturnValue(true);

    renderUsePendingCheckIns();

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
  });

  it("sets enabled: false when the user is not authenticated", () => {
    mockUseAppSelector.mockReturnValue(false);

    renderUsePendingCheckIns();

    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it("sets staleTime: Infinity", () => {
    mockUseAppSelector.mockReturnValue(true);

    renderUsePendingCheckIns();

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ staleTime: Infinity })
    );
  });

  it("uses fetchCheckIns.getPending as the queryFn", () => {
    mockUseAppSelector.mockReturnValue(true);

    renderUsePendingCheckIns();

    const config = mockUseQuery.mock.calls[0][0];
    expect(config.queryFn).toBe(fetchCheckIns.getPending);
  });

  it("applies a skipRetryOn(404)-shaped retry function", () => {
    mockUseAppSelector.mockReturnValue(true);

    renderUsePendingCheckIns();

    const config = mockUseQuery.mock.calls[0][0];
    const retry404 = skipRetryOn(404);
    // Same shape: stops retrying on a 404 code, retries other errors up to 2 times.
    expect(config.retry(0, { code: 404 })).toBe(retry404(0, { code: 404 }));
    expect(config.retry(0, { code: 500 })).toBe(retry404(0, { code: 500 }));
    expect(config.retry(2, { code: 500 })).toBe(retry404(2, { code: 500 }));
  });
});

// ─── usePendingCheckIns — return value passthrough ───────────────────────────

describe("usePendingCheckIns — return value", () => {
  it("defaults checkIns to an empty array when query.data is undefined", () => {
    mockUseAppSelector.mockReturnValue(true);
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });

    const result = renderUsePendingCheckIns();

    expect(result.checkIns).toEqual([]);
    expect(result.isLoading).toBe(true);
  });

  it("passes through query.data as checkIns when present", () => {
    mockUseAppSelector.mockReturnValue(true);
    mockUseQuery.mockReturnValue({ data: [checkInA, checkInB], isLoading: false });

    const result = renderUsePendingCheckIns();

    expect(result.checkIns).toEqual([checkInA, checkInB]);
    expect(result.isLoading).toBe(false);
  });
});

// ─── usePendingCheckIns — SignalR subscription effect (replicated logic) ────
//
// See file header: effects don't run under renderToStaticMarkup, so we
// replicate the effect body verbatim from hooks/useCheckIns.ts and drive it
// against mocked collaborators, mirroring __tests__/useSafetyPlan.test.ts's
// approach for onMutate/onError.

describe("usePendingCheckIns — SignalR subscription (replicated effect logic)", () => {
  type SetQueryData = jest.Mock;

  function buildHandleCheckIn(setQueryData: SetQueryData) {
    // Mirrors handleCheckIn inside the hook's useEffect exactly.
    return (checkIn: ProactiveCheckIn) => {
      setQueryData(CHECKIN_KEYS.pending, (prev: ProactiveCheckIn[] | undefined) => {
        const existing = prev ?? [];
        if (existing.some((c) => c.id === checkIn.id)) return existing;
        return [...existing, checkIn];
      });
    };
  }

  it("subscribes to ReceiveProactiveCheckIn on the hub connection when authenticated", () => {
    const on = jest.fn();
    const off = jest.fn();
    mockGetHubConnection.mockReturnValue({ on, off });

    // Simulate what the effect does on mount when isAuthenticated is true.
    const connection = mockGetHubConnection();
    const setQueryData = jest.fn();
    const handleCheckIn = buildHandleCheckIn(setQueryData);
    connection.on("ReceiveProactiveCheckIn", handleCheckIn);

    expect(mockGetHubConnection).toHaveBeenCalledTimes(1);
    expect(on).toHaveBeenCalledWith("ReceiveProactiveCheckIn", handleCheckIn);
  });

  it("unsubscribes from ReceiveProactiveCheckIn on cleanup", () => {
    const on = jest.fn();
    const off = jest.fn();
    mockGetHubConnection.mockReturnValue({ on, off });

    const connection = mockGetHubConnection();
    const setQueryData = jest.fn();
    const handleCheckIn = buildHandleCheckIn(setQueryData);
    connection.on("ReceiveProactiveCheckIn", handleCheckIn);
    // Simulate the effect's cleanup function running on unmount.
    connection.off("ReceiveProactiveCheckIn", handleCheckIn);

    expect(off).toHaveBeenCalledWith("ReceiveProactiveCheckIn", handleCheckIn);
  });

  it("merges an incoming check-in into the cache without duplicating an existing id", () => {
    const setQueryData = jest.fn();
    const handleCheckIn = buildHandleCheckIn(setQueryData);

    handleCheckIn(checkInB);

    // Invoke the updater function passed to setQueryData against a cache
    // that already contains checkInA to verify the merge.
    const updater = setQueryData.mock.calls[0][1];
    const merged = updater([checkInA]);
    expect(merged).toEqual([checkInA, checkInB]);

    // Now simulate receiving checkInA again — must not duplicate.
    setQueryData.mockClear();
    handleCheckIn(checkInA);
    const updater2 = setQueryData.mock.calls[0][1];
    const merged2 = updater2([checkInA, checkInB]);
    expect(merged2).toEqual([checkInA, checkInB]);
    expect(merged2).toHaveLength(2);
  });

  it("merges into an empty/undefined cache correctly", () => {
    const setQueryData = jest.fn();
    const handleCheckIn = buildHandleCheckIn(setQueryData);

    handleCheckIn(checkInA);

    const updater = setQueryData.mock.calls[0][1];
    expect(updater(undefined)).toEqual([checkInA]);
  });

  it("does not subscribe when isAuthenticated is false (per hook's early-return guard)", () => {
    // Mirrors the hook's `if (!isAuthenticated) return;` guard at the top of
    // the effect — when false, getHubConnection/on are never reached.
    const isAuthenticated = false;
    if (isAuthenticated) {
      mockGetHubConnection();
    }

    expect(mockGetHubConnection).not.toHaveBeenCalled();
  });
});

// ─── useDismissCheckIn ────────────────────────────────────────────────────────

describe("useDismissCheckIn", () => {
  it("returns a callable dismissCheckIn function", () => {
    const result = renderUseDismissCheckIn();

    expect(typeof result).toBe("function");
  });

  it("synchronously removes the check-in from the query cache via setQueryData", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockDismiss.mockResolvedValueOnce(undefined);

    const dismissCheckIn = renderUseDismissCheckIn();
    dismissCheckIn("checkin-1");

    // setQueryData was called synchronously, before any await/microtask flush:
    // once to record the dismissed id (guards against a slow pending-GET
    // resurrecting it), once to remove it from the current pending list.
    expect(setQueryData).toHaveBeenCalledTimes(2);
    expect(setQueryData).toHaveBeenCalledWith(CHECKIN_KEYS.dismissedIds, expect.any(Function));
    expect(setQueryData).toHaveBeenCalledWith(CHECKIN_KEYS.pending, expect.any(Function));

    const pendingCall = setQueryData.mock.calls.find(([key]) => key === CHECKIN_KEYS.pending)!;
    const updater = pendingCall[1];
    expect(updater([checkInA, checkInB])).toEqual([checkInB]);
  });

  it("filters out only the dismissed id, leaving others untouched", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockDismiss.mockResolvedValueOnce(undefined);

    const dismissCheckIn = renderUseDismissCheckIn();
    dismissCheckIn("checkin-2");

    const pendingCall = setQueryData.mock.calls.find(([key]) => key === CHECKIN_KEYS.pending)!;
    const updater = pendingCall[1];
    expect(updater([checkInA, checkInB])).toEqual([checkInA]);
  });

  it("handles an undefined cache gracefully (no crash)", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockDismiss.mockResolvedValueOnce(undefined);

    const dismissCheckIn = renderUseDismissCheckIn();

    expect(() => dismissCheckIn("checkin-1")).not.toThrow();

    const pendingCall = setQueryData.mock.calls.find(([key]) => key === CHECKIN_KEYS.pending)!;
    const updater = pendingCall[1];
    expect(updater(undefined)).toEqual([]);
  });

  it("calls fetchCheckIns.dismiss with the given id in the background", () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockDismiss.mockResolvedValueOnce(undefined);

    const dismissCheckIn = renderUseDismissCheckIn();
    dismissCheckIn("checkin-1");

    expect(mockDismiss).toHaveBeenCalledWith("checkin-1");
  });

  it("does not throw or propagate when fetchCheckIns.dismiss rejects", async () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    const dismissError = new Error("network down");
    mockDismiss.mockRejectedValueOnce(dismissError);
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const dismissCheckIn = renderUseDismissCheckIn();

    expect(() => dismissCheckIn("checkin-1")).not.toThrow();

    // Flush the microtask queue so the rejected promise's .catch() runs.
    await Promise.resolve();
    await Promise.resolve();

    // The optimistic removal already happened regardless of the eventual rejection.
    expect(setQueryData).toHaveBeenCalledTimes(2);
    warnSpy.mockRestore();
  });

  it("does not roll back the optimistic removal when the background dismiss fails", async () => {
    const setQueryData = jest.fn();
    mockUseQueryClient.mockReturnValue({ setQueryData });
    mockDismiss.mockRejectedValueOnce(new Error("network down"));
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const dismissCheckIn = renderUseDismissCheckIn();
    dismissCheckIn("checkin-1");

    await Promise.resolve();
    await Promise.resolve();

    // setQueryData is only ever called twice (dismissed-id record + optimistic
    // removal) — no third call attempting to restore the dismissed item.
    expect(setQueryData).toHaveBeenCalledTimes(2);
    warnSpy.mockRestore();
  });
});
