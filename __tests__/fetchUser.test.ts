/**
 * Unit tests for lib/api/services/fetchUser.ts
 *
 * fetchUser delegates to the apiService singleton.
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
const mockPatch = jest.fn();
const mockPut = jest.fn();

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: { get: mockGet, post: jest.fn(), patch: mockPatch, put: mockPut },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import { fetchUser } from "@/lib/api/services/fetchUser";
import type {
  UserProfile,
  UpdateProfileRequest,
  GoalsUpdateRequest,
  AvailableGoal,
} from "@/types/user";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockProfile: UserProfile = {
  id: "usr_001",
  email: "test@vetlanh.com",
  is_active: true,
  is_verified: true,
  display_name: "Test User",
  avatar_url: null,
  timezone: "Asia/Ho_Chi_Minh",
  goals: ["stress_relief", "better_sleep"],
};

const mockAvailableGoals: AvailableGoal[] = [
  { value: "stress_relief", label: "Giảm căng thẳng" },
  { value: "better_sleep", label: "Cải thiện giấc ngủ" },
  { value: "focus", label: "Tăng tập trung" },
];

// ── Tests ──────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getMe ────────────────────────────────────────────────────────────────────

describe("fetchUser.getMe", () => {
  it("calls GET api/v1/users/me", async () => {
    mockGet.mockResolvedValueOnce({ data: mockProfile });

    await fetchUser.getMe();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("api/v1/users/me");
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: mockProfile });

    const result = await fetchUser.getMe();

    expect(result).toEqual(mockProfile);
  });

  it("returns the user id from the response", async () => {
    mockGet.mockResolvedValueOnce({ data: mockProfile });

    const result = await fetchUser.getMe();

    expect(result.id).toBe("usr_001");
  });

  it("returns null display_name when API sends null", async () => {
    const noName: UserProfile = { ...mockProfile, display_name: null };
    mockGet.mockResolvedValueOnce({ data: noName });

    const result = await fetchUser.getMe();

    expect(result.display_name).toBeNull();
  });

  it("returns empty goals array when API sends []", async () => {
    const noGoals: UserProfile = { ...mockProfile, goals: [] };
    mockGet.mockResolvedValueOnce({ data: noGoals });

    const result = await fetchUser.getMe();

    expect(result.goals).toEqual([]);
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchUser.getMe()).rejects.toThrow("Network error");
  });

  it("does not call patch or put", async () => {
    mockGet.mockResolvedValueOnce({ data: mockProfile });

    await fetchUser.getMe();

    expect(mockPatch).not.toHaveBeenCalled();
    expect(mockPut).not.toHaveBeenCalled();
  });
});

// ─── updateMe ─────────────────────────────────────────────────────────────────

describe("fetchUser.updateMe", () => {
  const updateBody: UpdateProfileRequest = {
    display_name: "New Name",
    timezone: "Asia/Bangkok",
  };

  it("calls PATCH api/v1/users/me with the request body", async () => {
    mockPatch.mockResolvedValueOnce({ data: mockProfile });

    await fetchUser.updateMe(updateBody);

    expect(mockPatch).toHaveBeenCalledTimes(1);
    expect(mockPatch).toHaveBeenCalledWith("api/v1/users/me", updateBody);
  });

  it("returns response.data directly", async () => {
    const updated: UserProfile = { ...mockProfile, display_name: "New Name" };
    mockPatch.mockResolvedValueOnce({ data: updated });

    const result = await fetchUser.updateMe(updateBody);

    expect(result).toEqual(updated);
  });

  it("returns the updated display_name", async () => {
    const updated: UserProfile = { ...mockProfile, display_name: "New Name" };
    mockPatch.mockResolvedValueOnce({ data: updated });

    const result = await fetchUser.updateMe(updateBody);

    expect(result.display_name).toBe("New Name");
  });

  it("accepts a partial body with only display_name", async () => {
    mockPatch.mockResolvedValueOnce({ data: mockProfile });

    await fetchUser.updateMe({ display_name: "Partial" });

    expect(mockPatch).toHaveBeenCalledWith("api/v1/users/me", { display_name: "Partial" });
  });

  it("accepts a partial body with only avatar_url", async () => {
    mockPatch.mockResolvedValueOnce({ data: mockProfile });

    await fetchUser.updateMe({ avatar_url: "https://example.com/avatar.png" });

    expect(mockPatch).toHaveBeenCalledWith("api/v1/users/me", {
      avatar_url: "https://example.com/avatar.png",
    });
  });

  it("propagates rejection when apiService.patch throws", async () => {
    mockPatch.mockRejectedValueOnce(new Error("Update failed"));

    await expect(fetchUser.updateMe(updateBody)).rejects.toThrow("Update failed");
  });

  it("does not call get or put", async () => {
    mockPatch.mockResolvedValueOnce({ data: mockProfile });

    await fetchUser.updateMe(updateBody);

    expect(mockGet).not.toHaveBeenCalled();
    expect(mockPut).not.toHaveBeenCalled();
  });
});

// ─── updateGoals ──────────────────────────────────────────────────────────────

describe("fetchUser.updateGoals", () => {
  const goalsBody: GoalsUpdateRequest = { goals: ["stress_relief", "focus"] };

  it("calls PUT api/v1/users/me/goals with the request body", async () => {
    mockPut.mockResolvedValueOnce({ data: mockProfile });

    await fetchUser.updateGoals(goalsBody);

    expect(mockPut).toHaveBeenCalledTimes(1);
    expect(mockPut).toHaveBeenCalledWith("api/v1/users/me/goals", goalsBody);
  });

  it("returns response.data directly", async () => {
    const updated: UserProfile = { ...mockProfile, goals: ["stress_relief", "focus"] };
    mockPut.mockResolvedValueOnce({ data: updated });

    const result = await fetchUser.updateGoals(goalsBody);

    expect(result).toEqual(updated);
  });

  it("returns the updated goals array", async () => {
    const updated: UserProfile = { ...mockProfile, goals: ["stress_relief", "focus"] };
    mockPut.mockResolvedValueOnce({ data: updated });

    const result = await fetchUser.updateGoals(goalsBody);

    expect(result.goals).toEqual(["stress_relief", "focus"]);
  });

  it("accepts an empty goals array", async () => {
    const cleared: UserProfile = { ...mockProfile, goals: [] };
    mockPut.mockResolvedValueOnce({ data: cleared });

    const result = await fetchUser.updateGoals({ goals: [] });

    expect(mockPut).toHaveBeenCalledWith("api/v1/users/me/goals", { goals: [] });
    expect(result.goals).toEqual([]);
  });

  it("propagates rejection when apiService.put throws", async () => {
    mockPut.mockRejectedValueOnce(new Error("Goals update failed"));

    await expect(fetchUser.updateGoals(goalsBody)).rejects.toThrow("Goals update failed");
  });

  it("does not call get or patch", async () => {
    mockPut.mockResolvedValueOnce({ data: mockProfile });

    await fetchUser.updateGoals(goalsBody);

    expect(mockGet).not.toHaveBeenCalled();
    expect(mockPatch).not.toHaveBeenCalled();
  });
});

// ─── getAvailableGoals ────────────────────────────────────────────────────────

describe("fetchUser.getAvailableGoals", () => {
  it("calls GET api/v1/users/goals", async () => {
    mockGet.mockResolvedValueOnce({ data: mockAvailableGoals });

    await fetchUser.getAvailableGoals();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("api/v1/users/goals");
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: mockAvailableGoals });

    const result = await fetchUser.getAvailableGoals();

    expect(result).toEqual(mockAvailableGoals);
  });

  it("returns each goal with value and label", async () => {
    mockGet.mockResolvedValueOnce({ data: mockAvailableGoals });

    const result = await fetchUser.getAvailableGoals();

    expect(result[0]).toEqual({ value: "stress_relief", label: "Giảm căng thẳng" });
  });

  it("returns an empty array when API sends []", async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    const result = await fetchUser.getAvailableGoals();

    expect(result).toEqual([]);
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Goals fetch failed"));

    await expect(fetchUser.getAvailableGoals()).rejects.toThrow("Goals fetch failed");
  });

  it("does not call patch or put", async () => {
    mockGet.mockResolvedValueOnce({ data: mockAvailableGoals });

    await fetchUser.getAvailableGoals();

    expect(mockPatch).not.toHaveBeenCalled();
    expect(mockPut).not.toHaveBeenCalled();
  });
});
