/**
 * Unit tests for lib/api/services/fetchCheckIns.ts
 *
 * Each method delegates to the apiService singleton.
 * We mock apiService so no real network call is made, then assert:
 *   1. The correct HTTP method and URL are used.
 *   2. The returned value is exactly response.data (unwrapped) for getPending.
 *   3. Errors propagate when the service rejects.
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

import { fetchCheckIns } from "@/lib/api/services/fetchCheckIns";
import type { ProactiveCheckIn } from "@/types/checkIn";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockCheckIns: ProactiveCheckIn[] = [
  {
    id: "checkin-1",
    message: "Dạo này bạn có ổn không?",
    trigger_reason: "missed_checkin",
    created_at: "2026-07-20T08:00:00Z",
  },
  {
    id: "checkin-2",
    message: "Mình luôn ở đây nếu bạn cần nói chuyện.",
    created_at: "2026-07-21T08:00:00Z",
  },
];

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getPending ────────────────────────────────────────────────────────────

describe("fetchCheckIns.getPending", () => {
  it("calls GET api/v1/checkins/pending", async () => {
    mockGet.mockResolvedValueOnce({ data: mockCheckIns });

    await fetchCheckIns.getPending();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("api/v1/checkins/pending");
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: mockCheckIns });

    const result = await fetchCheckIns.getPending();

    expect(result).toEqual(mockCheckIns);
  });

  it("returns an empty array when there are no pending check-ins", async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    const result = await fetchCheckIns.getPending();

    expect(result).toEqual([]);
  });

  it("does not call post() when fetching", async () => {
    mockGet.mockResolvedValueOnce({ data: mockCheckIns });

    await fetchCheckIns.getPending();

    expect(mockPost).not.toHaveBeenCalled();
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchCheckIns.getPending()).rejects.toThrow("Network error");
  });

  it("propagates a 404 error without swallowing it", async () => {
    mockGet.mockRejectedValueOnce({ code: 404, message: "Not Found" });

    await expect(fetchCheckIns.getPending()).rejects.toMatchObject({ code: 404 });
  });
});

// ─── dismiss ─────────────────────────────────────────────────────────────────

describe("fetchCheckIns.dismiss", () => {
  it("calls POST api/v1/checkins/{id}/dismiss with the given id", async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await fetchCheckIns.dismiss("checkin-1");

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith("api/v1/checkins/checkin-1/dismiss");
  });

  it("interpolates a different id correctly", async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await fetchCheckIns.dismiss("abc-123");

    expect(mockPost).toHaveBeenCalledWith("api/v1/checkins/abc-123/dismiss");
  });

  it("resolves without a return value", async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await expect(fetchCheckIns.dismiss("checkin-1")).resolves.toBeUndefined();
  });

  it("does not call get() when dismissing", async () => {
    mockPost.mockResolvedValueOnce({ data: undefined });

    await fetchCheckIns.dismiss("checkin-1");

    expect(mockGet).not.toHaveBeenCalled();
  });

  it("propagates rejection when apiService.post throws", async () => {
    mockPost.mockRejectedValueOnce(new Error("Server error"));

    await expect(fetchCheckIns.dismiss("checkin-1")).rejects.toThrow("Server error");
  });
});
