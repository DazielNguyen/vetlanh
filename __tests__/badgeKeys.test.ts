/**
 * Unit tests for the BADGE_KEYS query-key factory in hooks/useBadges.ts
 *
 * These verify stable, predictable query-key shapes so cache invalidation
 * works correctly.  Pure logic — no React, no network.
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

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
  default: { get: jest.fn(), post: jest.fn() },
}));

jest.mock("@/lib/api/services/fetchBadges", () => ({
  fetchBadges: { getBadges: jest.fn() },
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn() },
}));

// ── SUT ───────────────────────────────────────────────────────────────────────

import { BADGE_KEYS } from "@/hooks/useBadges";

// ─── BADGE_KEYS.all ───────────────────────────────────────────────────────────

describe("BADGE_KEYS.all", () => {
  it("is an array containing exactly 'badges'", () => {
    expect(BADGE_KEYS.all).toEqual(["badges"]);
  });

  it("has length 1", () => {
    expect(BADGE_KEYS.all).toHaveLength(1);
  });

  it("first element is the string 'badges'", () => {
    expect(BADGE_KEYS.all[0]).toBe("badges");
  });
});

// ─── BADGE_KEYS.list ─────────────────────────────────────────────────────────

describe("BADGE_KEYS.list", () => {
  it("is a readonly array (not a function)", () => {
    expect(Array.isArray(BADGE_KEYS.list)).toBe(true);
  });

  it("starts with the 'badges' root key", () => {
    expect(BADGE_KEYS.list[0]).toBe("badges");
  });

  it("contains 'list' as the second segment", () => {
    expect(BADGE_KEYS.list[1]).toBe("list");
  });

  it("has exactly 2 elements", () => {
    expect(BADGE_KEYS.list).toHaveLength(2);
  });

  it("is a superset of BADGE_KEYS.all", () => {
    BADGE_KEYS.all.forEach((segment, i) => {
      expect(BADGE_KEYS.list[i]).toBe(segment);
    });
  });

  it("is distinct from BADGE_KEYS.all", () => {
    expect(JSON.stringify(BADGE_KEYS.list)).not.toBe(JSON.stringify(BADGE_KEYS.all));
  });
});
