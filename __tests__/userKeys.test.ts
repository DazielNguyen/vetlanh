/**
 * Unit tests for the USER_KEYS query-key factory in hooks/useUser.ts
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
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), put: jest.fn() },
}));

jest.mock("@/lib/api/services/fetchUser", () => ({
  fetchUser: {
    getMe: jest.fn(),
    updateMe: jest.fn(),
    updateGoals: jest.fn(),
    getAvailableGoals: jest.fn(),
  },
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

// ── SUT ───────────────────────────────────────────────────────────────────────

import { USER_KEYS } from "@/hooks/useUser";

// ─── USER_KEYS.all ────────────────────────────────────────────────────────────

describe("USER_KEYS.all", () => {
  it("is an array containing exactly 'user'", () => {
    expect(USER_KEYS.all).toEqual(["user"]);
  });

  it("has length 1", () => {
    expect(USER_KEYS.all).toHaveLength(1);
  });

  it("first element is the string 'user'", () => {
    expect(USER_KEYS.all[0]).toBe("user");
  });
});

// ─── USER_KEYS.me ─────────────────────────────────────────────────────────────

describe("USER_KEYS.me", () => {
  it("is a readonly array (not a function)", () => {
    expect(Array.isArray(USER_KEYS.me)).toBe(true);
  });

  it("starts with the 'user' root key", () => {
    expect(USER_KEYS.me[0]).toBe("user");
  });

  it("contains 'me' as the second segment", () => {
    expect(USER_KEYS.me[1]).toBe("me");
  });

  it("has exactly 2 elements", () => {
    expect(USER_KEYS.me).toHaveLength(2);
  });

  it("is a superset of USER_KEYS.all", () => {
    USER_KEYS.all.forEach((segment, i) => {
      expect(USER_KEYS.me[i]).toBe(segment);
    });
  });

  it("is distinct from USER_KEYS.all", () => {
    expect(JSON.stringify(USER_KEYS.me)).not.toBe(JSON.stringify(USER_KEYS.all));
  });
});

// ─── Key uniqueness ───────────────────────────────────────────────────────────

describe("USER_KEYS uniqueness", () => {
  it("all and me do not collide", () => {
    expect(JSON.stringify(USER_KEYS.all)).not.toBe(JSON.stringify(USER_KEYS.me));
  });

  it("both key shapes are serialisable to distinct strings", () => {
    const shapes = [JSON.stringify(USER_KEYS.all), JSON.stringify(USER_KEYS.me)];
    expect(new Set(shapes).size).toBe(2);
  });
});
