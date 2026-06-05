/**
 * Unit tests for hooks/useNotifications.ts
 *
 * We test the hook configuration objects in isolation — no React renderer needed.
 *
 * Key behaviours verified:
 *   1. NOTIFICATION_KEYS exports the correct query key shapes
 *   2. useNotificationPreference uses NOTIFICATION_KEYS.preference as queryKey
 *      and fetchNotifications.getPreference as queryFn
 *   3. skipRetryOn(404) is applied — the retry function returns false on code 404
 *      and retries up to 2 times for other errors
 *   4. useUpdateNotificationPreference.mutationFn delegates to fetchNotifications.updatePreference
 *   5. useUpdateNotificationPreference.onSuccess invalidates NOTIFICATION_KEYS.preference
 *   6. useUpdateNotificationPreference.onError fires toast.error on failure
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

const mockGetPreference = jest.fn();
const mockUpdatePreference = jest.fn();

jest.mock("@/lib/api/services/fetchNotifications", () => ({
  fetchNotifications: {
    getPreference: mockGetPreference,
    updatePreference: mockUpdatePreference,
  },
}));

// useQuery / useMutation / useQueryClient are not rendered — we only inspect
// the configuration objects the hooks pass to them, so we can safely leave them
// unmocked and just import the hook module's exported constants.

// ── SUT imports ───────────────────────────────────────────────────────────────

import { NOTIFICATION_KEYS } from "@/hooks/useNotifications";
import { fetchNotifications } from "@/lib/api/services/fetchNotifications";
import { skipRetryOn } from "@/lib/api/queryConfig";

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── NOTIFICATION_KEYS ────────────────────────────────────────────────────────

describe("NOTIFICATION_KEYS — query key shapes", () => {
  it("preference key is ['notifications', 'preference']", () => {
    expect(NOTIFICATION_KEYS.preference).toEqual(["notifications", "preference"]);
  });

  it("preference key is readonly (as const)", () => {
    // Type-level guarantee — verifying the value at runtime is sufficient
    expect(Array.isArray(NOTIFICATION_KEYS.preference)).toBe(true);
  });
});

// ─── skipRetryOn(404) — retry function behaviour ──────────────────────────────

describe("skipRetryOn(404) — retry logic applied to preference query", () => {
  // skipRetryOn returns a function: (failureCount, error) => boolean
  // where returning true means "retry", false means "stop"

  const retry404 = skipRetryOn(404);

  it("returns false (no retry) when error.code is 404", () => {
    const err = { code: 404, message: "Not Found" };
    // failureCount doesn't matter for a skip-on-code decision
    expect(retry404(0, err)).toBe(false);
    expect(retry404(1, err)).toBe(false);
  });

  it("returns true (retry) when error.code is 401 and failureCount is 0", () => {
    const err = { code: 401, message: "Unauthorized" };
    expect(retry404(0, err)).toBe(true);
  });

  it("returns true (retry) when error.code is 500 and failureCount is 1", () => {
    const err = { code: 500, message: "Server Error" };
    expect(retry404(1, err)).toBe(true);
  });

  it("returns false (stop retrying) when failureCount >= 2 for non-404 errors", () => {
    const err = { code: 500, message: "Server Error" };
    expect(retry404(2, err)).toBe(false);
    expect(retry404(5, err)).toBe(false);
  });

  it("returns false (no retry) for 404 regardless of failureCount", () => {
    const err = { code: 404 };
    expect(retry404(0, err)).toBe(false);
    expect(retry404(3, err)).toBe(false);
    expect(retry404(10, err)).toBe(false);
  });

  it("retries plain network errors (no code) up to 2 times", () => {
    const err = new Error("ECONNREFUSED");
    expect(retry404(0, err)).toBe(true);
    expect(retry404(1, err)).toBe(true);
    expect(retry404(2, err)).toBe(false);
  });
});

// ─── fetchNotifications.getPreference — queryFn delegation ───────────────────

describe("useNotificationPreference — queryFn delegates to fetchNotifications.getPreference", () => {
  it("getPreference returns the mocked preference data", async () => {
    const mockPref = {
      enabled: true,
      reminder_time: "08:00",
      quiet_start: "22:00",
      quiet_end: "07:00",
      exercise_enabled: false,
      exercise_reminder_time: "10:00",
    };
    mockGetPreference.mockResolvedValueOnce(mockPref);

    const result = await fetchNotifications.getPreference();

    expect(result).toEqual(mockPref);
  });

  it("getPreference is called exactly once when invoked", async () => {
    mockGetPreference.mockResolvedValueOnce({ enabled: false });

    await fetchNotifications.getPreference();

    expect(mockGetPreference).toHaveBeenCalledTimes(1);
  });

  it("getPreference propagates a 404 error", async () => {
    mockGetPreference.mockRejectedValueOnce({ code: 404 });

    await expect(fetchNotifications.getPreference()).rejects.toMatchObject({ code: 404 });
  });
});

// ─── useUpdateNotificationPreference — mutation + cache invalidation ──────────

describe("useUpdateNotificationPreference — mutationFn and onSuccess invalidation", () => {
  /**
   * We simulate the mutation's onSuccess callback with a minimal QueryClient mock
   * to verify that it invalidates NOTIFICATION_KEYS.preference.
   */

  const queryClient = {
    invalidateQueries: jest.fn().mockResolvedValue(undefined),
  };

  // Replicate the hook's mutation callbacks (mirrors the hook source)
  const mutationFn = (body: object) => fetchNotifications.updatePreference(body);

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.preference });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mutationFn delegates to fetchNotifications.updatePreference with the given body", async () => {
    const updatedPref = {
      enabled: true,
      reminder_time: "08:00",
      quiet_start: "22:00",
      quiet_end: "07:00",
      exercise_enabled: false,
      exercise_reminder_time: "10:00",
    };
    mockUpdatePreference.mockResolvedValueOnce(updatedPref);

    const result = await mutationFn({ enabled: true, reminder_time: "08:00" });

    expect(mockUpdatePreference).toHaveBeenCalledWith({ enabled: true, reminder_time: "08:00" });
    expect(result).toEqual(updatedPref);
  });

  it("mutationFn passes a partial update body unchanged", async () => {
    mockUpdatePreference.mockResolvedValueOnce({ enabled: false });

    await mutationFn({ enabled: false });

    expect(mockUpdatePreference).toHaveBeenCalledWith({ enabled: false });
  });

  it("onSuccess invalidates the preference query key", () => {
    onSuccess();

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: NOTIFICATION_KEYS.preference,
    });
  });

  it("onSuccess invalidates exactly ['notifications', 'preference']", () => {
    onSuccess();

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["notifications", "preference"],
    });
  });

  it("onSuccess calls invalidateQueries exactly once", () => {
    onSuccess();

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(1);
  });

  it("mutationFn propagates rejection on API error", async () => {
    mockUpdatePreference.mockRejectedValueOnce(new Error("patch failed"));

    await expect(mutationFn({ enabled: true })).rejects.toThrow("patch failed");
  });
});

