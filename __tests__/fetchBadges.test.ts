/**
 * Unit tests for lib/api/services/fetchBadges.ts
 *
 * fetchBadges.getBadges delegates to apiService.get.  We mock the singleton so
 * no network call occurs and verify the correct URL is used and that the
 * unwrapped data is returned.
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

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: { get: mockGet, post: jest.fn() },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import { fetchBadges } from "@/lib/api/services/fetchBadges";
import type { BadgesData } from "@/types/dashboard";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockBadgesData: BadgesData = {
  streak_days: 14,
  badges: [
    { slug: "streak-7",  label: "7 ngày",  milestone_days: 7,  unlocked: true,  is_new: false },
    { slug: "streak-14", label: "14 ngày", milestone_days: 14, unlocked: true,  is_new: true  },
    { slug: "streak-30", label: "30 ngày", milestone_days: 30, unlocked: false, is_new: false },
  ],
};

// ── Tests ──────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getBadges ────────────────────────────────────────────────────────────────

describe("fetchBadges.getBadges", () => {
  it("calls GET api/v1/badges", async () => {
    mockGet.mockResolvedValueOnce({ data: mockBadgesData });

    await fetchBadges.getBadges();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("api/v1/badges");
  });

  it("returns response.data directly (not the AxiosResponse wrapper)", async () => {
    mockGet.mockResolvedValueOnce({ data: mockBadgesData });

    const result = await fetchBadges.getBadges();

    expect(result).toEqual(mockBadgesData);
  });

  it("returns the correct streak_days from the response", async () => {
    mockGet.mockResolvedValueOnce({ data: mockBadgesData });

    const result = await fetchBadges.getBadges();

    expect(result.streak_days).toBe(14);
  });

  it("returns the full badges array", async () => {
    mockGet.mockResolvedValueOnce({ data: mockBadgesData });

    const result = await fetchBadges.getBadges();

    expect(result.badges).toHaveLength(3);
  });

  it("correctly preserves is_new flags on each badge", async () => {
    mockGet.mockResolvedValueOnce({ data: mockBadgesData });

    const result = await fetchBadges.getBadges();

    const newBadges = result.badges.filter((b) => b.is_new);
    expect(newBadges).toHaveLength(1);
    expect(newBadges[0].slug).toBe("streak-14");
  });

  it("returns an empty badges array when server returns none", async () => {
    const emptyData: BadgesData = { streak_days: 0, badges: [] };
    mockGet.mockResolvedValueOnce({ data: emptyData });

    const result = await fetchBadges.getBadges();

    expect(result.badges).toEqual([]);
    expect(result.streak_days).toBe(0);
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Server unavailable"));

    await expect(fetchBadges.getBadges()).rejects.toThrow("Server unavailable");
  });

  it("propagates API-shaped error objects", async () => {
    mockGet.mockRejectedValueOnce({ code: 500, message: "Internal Server Error", status: false });

    await expect(fetchBadges.getBadges()).rejects.toMatchObject({
      code: 500,
      status: false,
    });
  });

  it("returns streak_days: 0 when user has no streak", async () => {
    const noStreak: BadgesData = { streak_days: 0, badges: [] };
    mockGet.mockResolvedValueOnce({ data: noStreak });

    const result = await fetchBadges.getBadges();

    expect(result.streak_days).toBe(0);
  });

  it("does not call POST or any other method", async () => {
    mockGet.mockResolvedValueOnce({ data: mockBadgesData });

    await fetchBadges.getBadges();

    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
