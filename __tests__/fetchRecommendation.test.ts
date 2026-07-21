/**
 * Unit tests for lib/api/services/fetchRecommendation.ts
 *
 * getPersonalized delegates to the apiService singleton. We mock apiService
 * so no real network call is made, then assert:
 *   1. The correct HTTP method and URL are used.
 *   2. The returned value is exactly response.data (unwrapped).
 *   3. null is returned (not swallowed/rethrown) when the API responds with
 *      a null body (BE endpoint may not have a recommendation yet).
 *   4. Errors propagate when the service rejects.
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

import { fetchRecommendation } from "@/lib/api/services/fetchRecommendation";
import type { DashboardRecommendation } from "@/types/recommendation";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockRecommendation: DashboardRecommendation = {
  title: "Thử bài tập thở 4-7-8",
  rationale: "Dựa trên nhật ký gần đây của bạn, bài tập này có thể giúp bạn thư giãn.",
  url: "/services/breathing",
};

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getPersonalized ──────────────────────────────────────────────────────────

describe("fetchRecommendation.getPersonalized", () => {
  it("calls GET api/v1/dashboard/personalized-recommendation", async () => {
    mockGet.mockResolvedValueOnce({ data: mockRecommendation });

    await fetchRecommendation.getPersonalized();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("api/v1/dashboard/personalized-recommendation");
  });

  it("returns response.data directly when a recommendation is present", async () => {
    mockGet.mockResolvedValueOnce({ data: mockRecommendation });

    const result = await fetchRecommendation.getPersonalized();

    expect(result).toEqual(mockRecommendation);
  });

  it("returns null when the API responds with a null body", async () => {
    mockGet.mockResolvedValueOnce({ data: null });

    const result = await fetchRecommendation.getPersonalized();

    expect(result).toBeNull();
  });

  it("does not call post() when fetching", async () => {
    mockGet.mockResolvedValueOnce({ data: mockRecommendation });

    await fetchRecommendation.getPersonalized();

    expect(mockPost).not.toHaveBeenCalled();
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchRecommendation.getPersonalized()).rejects.toThrow("Network error");
  });

  it("propagates a 404 error without swallowing it (retry policy handles it upstream)", async () => {
    mockGet.mockRejectedValueOnce({ code: 404, message: "Not Found" });

    await expect(fetchRecommendation.getPersonalized()).rejects.toMatchObject({ code: 404 });
  });
});
