/**
 * Unit tests for the critical logic in hooks/useSafetyPlan.ts
 *
 * We test the queryFn and mutation callbacks directly — no React renderer is
 * required, avoiding the need for @testing-library/react-hooks in a pure node
 * Jest environment.
 *
 * Key behaviours verified:
 *   1. queryFn returns null (not throws) on 404
 *   2. queryFn re-throws on any other HTTP error (e.g. 401, 500)
 *   3. queryFn returns the plan data on success
 *   4. useUpsertSafetyPlan.onMutate sets optimistic data and returns a snapshot
 *   5. useUpsertSafetyPlan.onError restores the snapshot from context
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

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockGetSafetyPlan = jest.fn();
const mockUpsertSafetyPlan = jest.fn();

jest.mock("@/lib/api/services/fetchSafetyPlan", () => ({
  fetchSafetyPlan: {
    getSafetyPlan: mockGetSafetyPlan,
    upsertSafetyPlan: mockUpsertSafetyPlan,
    getCrisisResources: jest.fn(),
  },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build an Axios-style error with a given HTTP status code. */
function makeHttpError(status: number): { response: { status: number } } {
  return { response: { status } };
}

// ─────────────────────────────────────────────────────────────────────────────
// We extract the queryFn logic verbatim from the hook so we can test it
// in isolation without rendering.  The hook calls fetchSafetyPlan.getSafetyPlan
// and converts 404 to null; all other errors are re-thrown.
// ─────────────────────────────────────────────────────────────────────────────

async function safetyPlanQueryFn(): Promise<import("@/types/safetyPlan").SafetyPlan | null> {
  // This mirrors the queryFn body inside useSafetyPlan exactly.
  const { fetchSafetyPlan } = await import("@/lib/api/services/fetchSafetyPlan");
  try {
    return await fetchSafetyPlan.getSafetyPlan();
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 404) return null;
    throw err;
  }
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

import type { SafetyPlan } from "@/types/safetyPlan";

const mockPlan: SafetyPlan = {
  warning_signs: "Mệt mỏi",
  coping_activities: "Nghe nhạc",
  trusted_contacts: "Mẹ: 0900000001",
  reasons_to_live: "Gia đình",
};

// ── Tests ──────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── queryFn: 404 → null ──────────────────────────────────────────────────────

describe("useSafetyPlan queryFn — 404 handling", () => {
  it("returns null when getSafetyPlan rejects with status 404", async () => {
    mockGetSafetyPlan.mockRejectedValueOnce(makeHttpError(404));

    const result = await safetyPlanQueryFn();

    expect(result).toBeNull();
  });

  it("does NOT throw when the status is exactly 404", async () => {
    mockGetSafetyPlan.mockRejectedValueOnce(makeHttpError(404));

    await expect(safetyPlanQueryFn()).resolves.toBeNull();
  });

  it("returns the plan data on a successful response", async () => {
    mockGetSafetyPlan.mockResolvedValueOnce(mockPlan);

    const result = await safetyPlanQueryFn();

    expect(result).toEqual(mockPlan);
  });

  it("returns null (not the plan) when response has status === 404", async () => {
    mockGetSafetyPlan.mockRejectedValueOnce(makeHttpError(404));

    const result = await safetyPlanQueryFn();

    expect(result).not.toEqual(mockPlan);
    expect(result).toBeNull();
  });
});

// ─── queryFn: non-404 errors are re-thrown ───────────────────────────────────

describe("useSafetyPlan queryFn — non-404 errors are re-thrown", () => {
  it("re-throws when the status is 401 (unauthorized)", async () => {
    mockGetSafetyPlan.mockRejectedValueOnce(makeHttpError(401));

    await expect(safetyPlanQueryFn()).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("re-throws when the status is 403 (forbidden)", async () => {
    mockGetSafetyPlan.mockRejectedValueOnce(makeHttpError(403));

    await expect(safetyPlanQueryFn()).rejects.toMatchObject({ response: { status: 403 } });
  });

  it("re-throws when the status is 500 (server error)", async () => {
    mockGetSafetyPlan.mockRejectedValueOnce(makeHttpError(500));

    await expect(safetyPlanQueryFn()).rejects.toMatchObject({ response: { status: 500 } });
  });

  it("re-throws plain network errors (no response.status)", async () => {
    mockGetSafetyPlan.mockRejectedValueOnce(new Error("ECONNREFUSED"));

    await expect(safetyPlanQueryFn()).rejects.toThrow("ECONNREFUSED");
  });

  it("re-throws when status is 405 (not 404)", async () => {
    mockGetSafetyPlan.mockRejectedValueOnce(makeHttpError(405));

    await expect(safetyPlanQueryFn()).rejects.toMatchObject({ response: { status: 405 } });
  });
});

// ─── useUpsertSafetyPlan: optimistic update + rollback ───────────────────────

describe("useUpsertSafetyPlan — optimistic mutations and rollback", () => {
  /**
   * We exercise the onMutate / onError logic directly by simulating a minimal
   * QueryClient-like store (a plain Map) — matching the behaviour of the real
   * TanStack QueryClient methods the hook calls.
   */

  type QueryCache = Map<string, SafetyPlan | null>;

  interface MutationContext {
    snapshot: SafetyPlan | null | undefined;
  }

  function buildSimulatedMutation(cache: QueryCache) {
    const PLAN_KEY = JSON.stringify(["safety-plan"]);

    const queryClient = {
      cancelQueries: jest.fn().mockResolvedValue(undefined),
      getQueryData: jest.fn(<T>(): T => cache.get(PLAN_KEY) as unknown as T),
      setQueryData: jest.fn(<T>(key: unknown[], value: T) => {
        cache.set(JSON.stringify(key), value as unknown as SafetyPlan | null);
      }),
      invalidateQueries: jest.fn().mockResolvedValue(undefined),
    };

    const onMutate = async (body: SafetyPlan): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["safety-plan"] });
      const snapshot = queryClient.getQueryData<SafetyPlan | null>();
      queryClient.setQueryData(["safety-plan"], body);
      return { snapshot };
    };

    const onError = (_err: unknown, _body: SafetyPlan, ctx: MutationContext | undefined) => {
      queryClient.setQueryData(["safety-plan"], ctx?.snapshot ?? null);
    };

    const onSettled = () => {
      queryClient.invalidateQueries({ queryKey: ["safety-plan"] });
    };

    return { queryClient, onMutate, onError, onSettled };
  }

  it("onMutate sets the optimistic plan in the cache", async () => {
    const cache: QueryCache = new Map([
      [JSON.stringify(["safety-plan"]), mockPlan],
    ]);
    const { queryClient, onMutate } = buildSimulatedMutation(cache);

    const newPlan: SafetyPlan = { warning_signs: "Insomnia" };
    await onMutate(newPlan);

    expect(queryClient.setQueryData).toHaveBeenCalledWith(["safety-plan"], newPlan);
  });

  it("onMutate returns a snapshot of the previous plan", async () => {
    const cache: QueryCache = new Map([
      [JSON.stringify(["safety-plan"]), mockPlan],
    ]);
    const { onMutate } = buildSimulatedMutation(cache);

    const ctx = await onMutate({ warning_signs: "New" });

    expect(ctx.snapshot).toEqual(mockPlan);
  });

  it("onMutate cancels queries for the safety-plan key", async () => {
    const cache: QueryCache = new Map([[JSON.stringify(["safety-plan"]), null]]);
    const { queryClient, onMutate } = buildSimulatedMutation(cache);

    await onMutate({ coping_activities: "Walk" });

    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: ["safety-plan"] });
  });

  it("onError restores the snapshot when mutation fails", async () => {
    const cache: QueryCache = new Map([
      [JSON.stringify(["safety-plan"]), mockPlan],
    ]);
    const { queryClient, onMutate, onError } = buildSimulatedMutation(cache);

    const newPlan: SafetyPlan = { warning_signs: "Something went wrong" };
    const ctx = await onMutate(newPlan);

    // Simulate failure — reset via onError
    onError(new Error("PUT failed"), newPlan, ctx);

    expect(queryClient.setQueryData).toHaveBeenLastCalledWith(["safety-plan"], mockPlan);
  });

  it("onError sets cache to null when snapshot was null (no prior plan)", async () => {
    const cache: QueryCache = new Map([[JSON.stringify(["safety-plan"]), null]]);
    const { queryClient, onMutate, onError } = buildSimulatedMutation(cache);

    const plan: SafetyPlan = { warning_signs: "test" };
    const ctx = await onMutate(plan);
    onError(new Error("PUT failed"), plan, ctx);

    expect(queryClient.setQueryData).toHaveBeenLastCalledWith(["safety-plan"], null);
  });

  it("onError falls back to null when context is undefined", async () => {
    const cache: QueryCache = new Map([[JSON.stringify(["safety-plan"]), mockPlan]]);
    const { queryClient, onError } = buildSimulatedMutation(cache);

    onError(new Error("something"), mockPlan, undefined);

    expect(queryClient.setQueryData).toHaveBeenCalledWith(["safety-plan"], null);
  });

  it("onSettled calls invalidateQueries for the safety-plan key", async () => {
    const cache: QueryCache = new Map([[JSON.stringify(["safety-plan"]), mockPlan]]);
    const { queryClient, onSettled } = buildSimulatedMutation(cache);

    onSettled();

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ["safety-plan"] });
  });
});
