/**
 * Unit tests for lib/api/services/fetchNotifications.ts
 *
 * Each method delegates to the apiService singleton.
 * We mock apiService so no real network call is made, then assert:
 *   1. The correct HTTP method and URL are used.
 *   2. The returned value is exactly response.data (unwrapped).
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
const mockPatch = jest.fn();

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: { get: mockGet, patch: mockPatch },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import { fetchNotifications } from "@/lib/api/services/fetchNotifications";
import type { NotificationPreference } from "@/types/notifications";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockPreference: NotificationPreference = {
  enabled: true,
  reminder_time: "08:00",
  quiet_start: "22:00",
  quiet_end: "07:00",
  exercise_enabled: false,
  exercise_reminder_time: "10:00",
};

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getPreference ────────────────────────────────────────────────────────────

describe("fetchNotifications.getPreference", () => {
  it("calls GET api/v1/notifications/preference", async () => {
    mockGet.mockResolvedValueOnce({ data: mockPreference });

    await fetchNotifications.getPreference();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("api/v1/notifications/preference");
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: mockPreference });

    const result = await fetchNotifications.getPreference();

    expect(result).toEqual(mockPreference);
  });

  it("returns the enabled flag from the response", async () => {
    mockGet.mockResolvedValueOnce({ data: mockPreference });

    const result = await fetchNotifications.getPreference();

    expect(result.enabled).toBe(true);
  });

  it("returns all time fields correctly", async () => {
    mockGet.mockResolvedValueOnce({ data: mockPreference });

    const result = await fetchNotifications.getPreference();

    expect(result.reminder_time).toBe("08:00");
    expect(result.quiet_start).toBe("22:00");
    expect(result.quiet_end).toBe("07:00");
    expect(result.exercise_reminder_time).toBe("10:00");
  });

  it("returns disabled preference when enabled is false", async () => {
    const disabledPref: NotificationPreference = { ...mockPreference, enabled: false };
    mockGet.mockResolvedValueOnce({ data: disabledPref });

    const result = await fetchNotifications.getPreference();

    expect(result.enabled).toBe(false);
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchNotifications.getPreference()).rejects.toThrow("Network error");
  });

  it("propagates a 404 error without swallowing it", async () => {
    mockGet.mockRejectedValueOnce({ code: 404, message: "Not Found" });

    await expect(fetchNotifications.getPreference()).rejects.toMatchObject({ code: 404 });
  });
});

// ─── updatePreference ─────────────────────────────────────────────────────────

describe("fetchNotifications.updatePreference", () => {
  it("calls PATCH api/v1/notifications/preference with the body", async () => {
    mockPatch.mockResolvedValueOnce({ data: mockPreference });

    await fetchNotifications.updatePreference({ enabled: true });

    expect(mockPatch).toHaveBeenCalledTimes(1);
    expect(mockPatch).toHaveBeenCalledWith("api/v1/notifications/preference", { enabled: true });
  });

  it("returns response.data directly", async () => {
    mockPatch.mockResolvedValueOnce({ data: mockPreference });

    const result = await fetchNotifications.updatePreference({ enabled: true });

    expect(result).toEqual(mockPreference);
  });

  it("sends a partial update body (only changed fields)", async () => {
    const updatedPref: NotificationPreference = { ...mockPreference, reminder_time: "09:30" };
    mockPatch.mockResolvedValueOnce({ data: updatedPref });

    const result = await fetchNotifications.updatePreference({ reminder_time: "09:30" });

    expect(mockPatch).toHaveBeenCalledWith(
      "api/v1/notifications/preference",
      { reminder_time: "09:30" },
    );
    expect(result.reminder_time).toBe("09:30");
  });

  it("sends an empty body without throwing", async () => {
    mockPatch.mockResolvedValueOnce({ data: mockPreference });

    await expect(fetchNotifications.updatePreference({})).resolves.toEqual(mockPreference);
    expect(mockPatch).toHaveBeenCalledWith("api/v1/notifications/preference", {});
  });

  it("propagates rejection when apiService.patch throws", async () => {
    mockPatch.mockRejectedValueOnce(new Error("Server error"));

    await expect(fetchNotifications.updatePreference({ enabled: false })).rejects.toThrow(
      "Server error",
    );
  });

  it("does not call get() when updating", async () => {
    mockPatch.mockResolvedValueOnce({ data: mockPreference });

    await fetchNotifications.updatePreference({ enabled: true });

    expect(mockGet).not.toHaveBeenCalled();
  });
});

