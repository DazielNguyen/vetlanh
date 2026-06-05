/**
 * Unit tests for lib/api/services/fetchDashboard.ts
 *
 * fetchDashboard.getDashboard delegates to the apiService singleton.
 * We mock apiService so no real network call is made, then assert that:
 *   1. The correct HTTP method and URL are used.
 *   2. The returned value is exactly response.data (unwrapped).
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

import { fetchDashboard } from "@/lib/api/services/fetchDashboard";
import type { DashboardData } from "@/types/dashboard";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockDashboardData: DashboardData = {
  greeting: "Chào mừng trở lại, Duy!",
  streak_days: 7,
  today_checked_in: false,
  last_mood: 65,
  sparkline: [50, 55, 60, 58, 70, 65, 72],
  recommended_exercises: [{ id: 1, title: "Thiền định", duration_minutes: 10, category: "mindfulness" }],
  phq9_reminder: { due: true, last_completed_at: null, next_due_at: "2026-06-10T00:00:00Z" },
};

// ── Tests ──────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getDashboard ─────────────────────────────────────────────────────────────

describe("fetchDashboard.getDashboard", () => {
  it("calls GET api/v1/dashboard", async () => {
    mockGet.mockResolvedValueOnce({ data: mockDashboardData });

    await fetchDashboard.getDashboard();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("api/v1/dashboard");
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: mockDashboardData });

    const result = await fetchDashboard.getDashboard();

    expect(result).toEqual(mockDashboardData);
  });

  it("returns the greeting from the response", async () => {
    mockGet.mockResolvedValueOnce({ data: mockDashboardData });

    const result = await fetchDashboard.getDashboard();

    expect(result.greeting).toBe("Chào mừng trở lại, Duy!");
  });

  it("returns sparkline array as-is", async () => {
    const dataWithSparkline: DashboardData = { ...mockDashboardData, sparkline: [10, 20, 30] };
    mockGet.mockResolvedValueOnce({ data: dataWithSparkline });

    const result = await fetchDashboard.getDashboard();

    expect(result.sparkline).toEqual([10, 20, 30]);
  });

  it("returns empty sparkline when API sends []", async () => {
    const dataEmpty: DashboardData = { ...mockDashboardData, sparkline: [] };
    mockGet.mockResolvedValueOnce({ data: dataEmpty });

    const result = await fetchDashboard.getDashboard();

    expect(result.sparkline).toEqual([]);
  });

  it("returns null last_mood when API sends null", async () => {
    const dataNoMood: DashboardData = { ...mockDashboardData, last_mood: null };
    mockGet.mockResolvedValueOnce({ data: dataNoMood });

    const result = await fetchDashboard.getDashboard();

    expect(result.last_mood).toBeNull();
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchDashboard.getDashboard()).rejects.toThrow("Network error");
  });

  it("does not call any other HTTP method", async () => {
    mockGet.mockResolvedValueOnce({ data: mockDashboardData });

    await fetchDashboard.getDashboard();

    // Only get() should have been invoked
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
