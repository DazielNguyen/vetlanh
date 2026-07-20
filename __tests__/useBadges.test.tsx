/**
 * Unit tests for hooks/useBadges.ts
 *
 * useBadges wraps @tanstack/react-query's useQuery and derives xp/level/
 * xpToNextLevel/levelUpTo/dismissLevelUp on top of it. This repo has no
 * jsdom, so we can't mount a real client tree and flush effects (the
 * sessionStorage-backed "celebrate once" dedup and the badge-toast dedup
 * both live inside useEffect, which never runs under
 * react-dom/server's renderToStaticMarkup — SSR has no commit phase).
 *
 * Strategy: mock @tanstack/react-query's useQuery directly (so no network/
 * QueryClientProvider is needed) and render a tiny throwaway host component
 * with renderToStaticMarkup, capturing the hook's return value in a closure
 * variable during that synchronous render. This fully exercises the
 * *synchronous* derivation logic (xp/level/xpToNextLevel fallback math,
 * BE-value passthrough, isLoading passthrough) — which is the core Phase 2
 * contract point covered here. The effect-driven levelUpTo/toast dedup logic
 * is out of scope for this render strategy (documented, not silently
 * skipped) and is exercised indirectly via the underlying pure functions in
 * __tests__/progression.test.ts instead.
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

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockUseQuery = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}));

jest.mock("@/lib/api/services/fetchBadges", () => ({
  fetchBadges: { getBadges: jest.fn() },
}));

// ── SUT import ────────────────────────────────────────────────────────────────

import { useBadges, BADGE_KEYS } from "@/hooks/useBadges";
import { getLevelForXp, getXpToNextLevel } from "@/lib/constants/progression";

// ── Helpers ───────────────────────────────────────────────────────────────────

type UseBadgesReturn = ReturnType<typeof useBadges>;

function renderUseBadges(): UseBadgesReturn {
  let captured!: UseBadgesReturn;
  function Host() {
    captured = useBadges();
    return null;
  }
  renderToStaticMarkup(<Host />);
  return captured;
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Query wiring ──────────────────────────────────────────────────────────────

describe("useBadges — query configuration", () => {
  it("calls useQuery with BADGE_KEYS.list as the queryKey", () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });

    renderUseBadges();

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: BADGE_KEYS.list })
    );
  });

  it("BADGE_KEYS.list is ['badges', 'list']", () => {
    expect(BADGE_KEYS.list).toEqual(["badges", "list"]);
  });

  it("BADGE_KEYS.all is ['badges']", () => {
    expect(BADGE_KEYS.all).toEqual(["badges"]);
  });
});

// ── xp/level/xpToNextLevel derivation — no BE data yet ───────────────────────

describe("useBadges — derived xp/level/xpToNextLevel (no data / loading)", () => {
  it("defaults xp to 0, level to 1, and passes through isLoading when query.data is undefined", () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });

    const result = renderUseBadges();

    expect(result.xp).toBe(0);
    expect(result.level).toBe(1);
    expect(result.xpToNextLevel).toBe(getXpToNextLevel(0));
    expect(result.isLoading).toBe(true);
  });
});

// ── xp/level/xpToNextLevel derivation — BE sends explicit values ─────────────

describe("useBadges — derived values when BE sends xp/level/xp_to_next_level", () => {
  it("prefers BE-provided xp/level/xp_to_next_level over client-side derivation", () => {
    mockUseQuery.mockReturnValue({
      data: { streak_days: 3, badges: [], xp: 999, level: 4, xp_to_next_level: 1 },
      isLoading: false,
    });

    const result = renderUseBadges();

    expect(result.xp).toBe(999);
    expect(result.level).toBe(4);
    expect(result.xpToNextLevel).toBe(1);
  });

  it("uses BE level even when it disagrees with what the xp/threshold table would compute", () => {
    // xp=10 would normally map to level 1, but BE is authoritative once present.
    mockUseQuery.mockReturnValue({
      data: { streak_days: 0, badges: [], xp: 10, level: 5, xp_to_next_level: 340 },
      isLoading: false,
    });

    const result = renderUseBadges();

    expect(result.level).toBe(5);
  });
});

// ── xp/level/xpToNextLevel derivation — fallback to client-side table ────────

describe("useBadges — derived values fall back to progression table when BE omits level/xp_to_next_level", () => {
  it("derives level/xpToNextLevel from xp alone using getLevelForXp/getXpToNextLevel", () => {
    mockUseQuery.mockReturnValue({
      data: { streak_days: 0, badges: [], xp: 130 },
      isLoading: false,
    });

    const result = renderUseBadges();

    expect(result.xp).toBe(130);
    expect(result.level).toBe(getLevelForXp(130));
    expect(result.xpToNextLevel).toBe(getXpToNextLevel(130));
    expect(result.level).toBe(3);
  });

  it("defaults xp to 0 when query.data.xp is undefined even though data exists", () => {
    mockUseQuery.mockReturnValue({
      data: { streak_days: 0, badges: [] },
      isLoading: false,
    });

    const result = renderUseBadges();

    expect(result.xp).toBe(0);
    expect(result.level).toBe(1);
  });

  it("computes max-level xpToNextLevel of 0 when BE-omitted xp already reaches 700", () => {
    mockUseQuery.mockReturnValue({
      data: { streak_days: 0, badges: [], xp: 700 },
      isLoading: false,
    });

    const result = renderUseBadges();

    expect(result.level).toBe(7);
    expect(result.xpToNextLevel).toBe(0);
  });
});

// ── levelUpTo / dismissLevelUp shape ──────────────────────────────────────────

describe("useBadges — levelUpTo / dismissLevelUp shape", () => {
  it("levelUpTo starts as null before any level-up effect has run", () => {
    mockUseQuery.mockReturnValue({
      data: { streak_days: 0, badges: [], xp: 100 },
      isLoading: false,
    });

    const result = renderUseBadges();

    expect(result.levelUpTo).toBeNull();
  });

  it("exposes dismissLevelUp as a callable function", () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });

    const result = renderUseBadges();

    expect(typeof result.dismissLevelUp).toBe("function");
  });
});

// ── Passthrough of the underlying query result ───────────────────────────────

describe("useBadges — spreads the underlying query result", () => {
  it("passes through query.data, isLoading, and other react-query fields unchanged", () => {
    const queryResult = {
      data: { streak_days: 5, badges: [{ slug: "x", label: "X", milestone_days: 5, unlocked: true, is_new: false }] },
      isLoading: false,
      isError: false,
      error: null,
    };
    mockUseQuery.mockReturnValue(queryResult);

    const result = renderUseBadges();

    expect(result.data).toEqual(queryResult.data);
    expect(result.isError).toBe(false);
    expect(result.error).toBeNull();
  });
});
