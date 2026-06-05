/**
 * Unit tests for the DASHBOARD_KEYS query-key factory in hooks/useDashboard.ts
 *
 * DASHBOARD_KEYS must produce stable, predictable query key arrays so that
 * cache invalidation (e.g. from Phase 7's useLogExercise) targets the right
 * entries.  These tests are pure logic — no React, no network.
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
  default: { get: jest.fn(), post: jest.fn() },
}));

jest.mock("@/lib/api/services/fetchDashboard", () => ({
  fetchDashboard: {
    getDashboard: jest.fn(),
  },
}));

// Stub out @tanstack/react-query — only the export is needed for the module
// to load; we don't call useQuery in these pure key tests.
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// ── SUT ───────────────────────────────────────────────────────────────────────

import { DASHBOARD_KEYS } from "@/hooks/useDashboard";

// ─── DASHBOARD_KEYS.all ───────────────────────────────────────────────────────

describe("DASHBOARD_KEYS.all", () => {
  it("is an array containing exactly 'dashboard'", () => {
    expect(DASHBOARD_KEYS.all).toEqual(["dashboard"]);
  });

  it("has length 1", () => {
    expect(DASHBOARD_KEYS.all).toHaveLength(1);
  });

  it("first element is the string 'dashboard'", () => {
    expect(DASHBOARD_KEYS.all[0]).toBe("dashboard");
  });
});

// ─── DASHBOARD_KEYS.dashboard() ───────────────────────────────────────────────

describe("DASHBOARD_KEYS.dashboard", () => {
  it("is a readonly array (not a function)", () => {
    expect(Array.isArray(DASHBOARD_KEYS.dashboard)).toBe(true);
  });

  it("starts with the 'dashboard' root key", () => {
    expect(DASHBOARD_KEYS.dashboard[0]).toBe("dashboard");
  });

  it("contains 'data' as the second segment", () => {
    expect(DASHBOARD_KEYS.dashboard[1]).toBe("data");
  });

  it("has exactly 2 elements", () => {
    expect(DASHBOARD_KEYS.dashboard).toHaveLength(2);
  });

  it("is a superset of DASHBOARD_KEYS.all", () => {
    const all = DASHBOARD_KEYS.all;
    all.forEach((segment, i) => expect(DASHBOARD_KEYS.dashboard[i]).toBe(segment));
  });
});

// ─── Key uniqueness ───────────────────────────────────────────────────────────

describe("DASHBOARD_KEYS uniqueness", () => {
  it("all and dashboard do not collide", () => {
    expect(JSON.stringify(DASHBOARD_KEYS.all)).not.toBe(JSON.stringify(DASHBOARD_KEYS.dashboard));
  });

  it("both key shapes are serialisable to distinct strings", () => {
    const shapes = [
      JSON.stringify(DASHBOARD_KEYS.all),
      JSON.stringify(DASHBOARD_KEYS.dashboard),
    ];
    expect(new Set(shapes).size).toBe(2);
  });
});
