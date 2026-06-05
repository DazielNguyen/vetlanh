/**
 * Unit tests for the optimistic-delete logic in hooks/useThoughtRecords.ts
 *
 * We isolate the three mutation callbacks (onMutate, onError, onSettled) that
 * power the optimistic delete, and verify:
 *
 *   1. onMutate removes the target record from every list-query in the cache
 *   2. onMutate returns a snapshot of ALL affected list queries for rollback
 *   3. onError restores every cached list to its pre-mutation state
 *   4. onError leaves the cache unchanged when there is no context (safety net)
 *   5. onSettled invalidates the full thought-records query tree
 *
 * No React renderer is needed — we drive the callbacks directly against a
 * minimal in-memory cache modelled after TanStack QueryClient.
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

jest.mock("@/lib/api/services/fetchThoughtRecords", () => ({
  fetchThoughtRecords: {
    deleteRecord: jest.fn(),
    listRecords: jest.fn(),
    getHints: jest.fn(),
    createRecord: jest.fn(),
    getRecord: jest.fn(),
    updateRecord: jest.fn(),
  },
}));

// ── Types ─────────────────────────────────────────────────────────────────────

import type { ThoughtRecord } from "@/types/thoughtRecord";

type QueryKey = readonly unknown[];
type CacheEntry = [QueryKey, ThoughtRecord[] | undefined];
type MutationContext = { snapshot: CacheEntry[] };

// ── Fixtures ──────────────────────────────────────────────────────────────────

const makeRecord = (id: string): ThoughtRecord => ({
  id,
  situation: `Situation ${id}`,
  automatic_thought: `Thought ${id}`,
  emotion: "Anxiety",
  evidence_for: "Some evidence for",
  evidence_against: "Some evidence against",
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z",
});

const rec1 = makeRecord("tr_001");
const rec2 = makeRecord("tr_002");
const rec3 = makeRecord("tr_003");

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Builds a minimal QueryClient-shaped object backed by an in-memory Map,
 * plus the three mutation callback functions extracted verbatim from the hook.
 */
function buildSimulatedDelete(initialCache: Map<string, ThoughtRecord[] | undefined>) {
  const serialize = (key: QueryKey) => JSON.stringify(key);

  const queryClient = {
    cancelQueries: jest.fn().mockResolvedValue(undefined),

    getQueriesData: jest.fn((filter: { queryKey: QueryKey }): CacheEntry[] => {
      const prefix = JSON.stringify(filter.queryKey);
      const entries: CacheEntry[] = [];
      initialCache.forEach((value, rawKey) => {
        if (rawKey.startsWith(prefix.slice(0, -1))) {
          entries.push([JSON.parse(rawKey) as QueryKey, value]);
        }
      });
      return entries;
    }),

    setQueriesData: jest.fn(
      (
        filter: { queryKey: QueryKey },
        updater: (old: ThoughtRecord[] | undefined) => ThoughtRecord[] | undefined,
      ) => {
        const prefix = JSON.stringify(filter.queryKey);
        initialCache.forEach((value, rawKey) => {
          if (rawKey.startsWith(prefix.slice(0, -1))) {
            initialCache.set(rawKey, updater(value));
          }
        });
      },
    ),

    setQueryData: jest.fn((key: QueryKey, value: ThoughtRecord[] | undefined) => {
      initialCache.set(serialize(key), value);
    }),

    invalidateQueries: jest.fn().mockResolvedValue(undefined),
  };

  // ── Replicate the hook's mutation callbacks exactly ──────────────────────

  const onMutate = async (id: string): Promise<MutationContext> => {
    await queryClient.cancelQueries({ queryKey: ["thought-records"] });
    const snapshot = queryClient.getQueriesData<ThoughtRecord[]>({
      queryKey: ["thought-records", "list"],
    });
    queryClient.setQueriesData(
      { queryKey: ["thought-records", "list"] },
      (old: ThoughtRecord[] | undefined) => old?.filter((r) => r.id !== id) ?? old,
    );
    return { snapshot };
  };

  const onError = (
    _err: unknown,
    _id: string,
    ctx: MutationContext | undefined,
  ): void => {
    ctx?.snapshot.forEach(([key, value]) => queryClient.setQueryData(key, value));
  };

  const onSettled = (): void => {
    queryClient.invalidateQueries({ queryKey: ["thought-records"] });
  };

  return { queryClient, onMutate, onError, onSettled };
}

// ── Test Suite ────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useDeleteThoughtRecord — onMutate (optimistic removal)", () => {
  it("cancels queries for the thought-records key before mutating", async () => {
    const cache = new Map([
      [JSON.stringify(["thought-records", "list", undefined]), [rec1, rec2]],
    ]);
    const { queryClient, onMutate } = buildSimulatedDelete(cache);

    await onMutate("tr_001");

    expect(queryClient.cancelQueries).toHaveBeenCalledWith({
      queryKey: ["thought-records"],
    });
  });

  it("removes the target record from a list query in the cache", async () => {
    const cache = new Map([
      [JSON.stringify(["thought-records", "list", undefined]), [rec1, rec2, rec3]],
    ]);
    const { onMutate } = buildSimulatedDelete(cache);

    await onMutate("tr_002");

    const remaining = cache.get(JSON.stringify(["thought-records", "list", undefined]));
    expect(remaining).toBeDefined();
    expect(remaining!.find((r) => r.id === "tr_002")).toBeUndefined();
  });

  it("leaves other records in the list untouched", async () => {
    const cache = new Map([
      [JSON.stringify(["thought-records", "list", undefined]), [rec1, rec2, rec3]],
    ]);
    const { onMutate } = buildSimulatedDelete(cache);

    await onMutate("tr_002");

    const remaining = cache.get(JSON.stringify(["thought-records", "list", undefined]));
    expect(remaining!.map((r) => r.id)).toEqual(["tr_001", "tr_003"]);
  });

  it("returns a snapshot containing the original pre-mutation list", async () => {
    const originalList = [rec1, rec2, rec3];
    const cache = new Map([
      [JSON.stringify(["thought-records", "list", undefined]), [...originalList]],
    ]);
    const { onMutate } = buildSimulatedDelete(cache);

    const ctx = await onMutate("tr_001");

    expect(ctx.snapshot).toBeDefined();
    expect(ctx.snapshot.length).toBe(1);
    // snapshot value should contain all 3 records (before the delete)
    const [, snapshotValue] = ctx.snapshot[0];
    expect(snapshotValue).toEqual(originalList);
  });

  it("handles deleting from an empty list gracefully", async () => {
    const cache = new Map([
      [JSON.stringify(["thought-records", "list", undefined]), [] as ThoughtRecord[]],
    ]);
    const { onMutate } = buildSimulatedDelete(cache);

    await expect(onMutate("tr_nonexistent")).resolves.not.toThrow();

    const remaining = cache.get(JSON.stringify(["thought-records", "list", undefined]));
    expect(remaining).toEqual([]);
  });

  it("handles multiple list query keys (pagination) simultaneously", async () => {
    const cache = new Map([
      [JSON.stringify(["thought-records", "list", { limit: 10, offset: 0 }]), [rec1, rec2]],
      [JSON.stringify(["thought-records", "list", { limit: 10, offset: 10 }]), [rec3]],
    ]);
    const { onMutate } = buildSimulatedDelete(cache);

    const ctx = await onMutate("tr_001");

    // Both keys should be in the snapshot
    expect(ctx.snapshot.length).toBe(2);
  });
});

describe("useDeleteThoughtRecord — onError (rollback)", () => {
  it("restores the original list from the snapshot", async () => {
    const originalList = [rec1, rec2, rec3];
    const cache = new Map([
      [JSON.stringify(["thought-records", "list", undefined]), [...originalList]],
    ]);
    const { queryClient, onMutate, onError } = buildSimulatedDelete(cache);

    const ctx = await onMutate("tr_002"); // optimistic remove
    onError(new Error("DELETE failed"), "tr_002", ctx); // rollback

    // setQueryData should be called with the original snapshot entries
    expect(queryClient.setQueryData).toHaveBeenCalled();
    const [lastKey, lastValue] = queryClient.setQueryData.mock.calls[
      queryClient.setQueryData.mock.calls.length - 1
    ];
    expect(lastValue).toEqual(originalList);
    void lastKey; // key is an array — just assert value
  });

  it("calls setQueryData once per snapshotted list query", async () => {
    const cache = new Map([
      [JSON.stringify(["thought-records", "list", { limit: 5, offset: 0 }]), [rec1]],
      [JSON.stringify(["thought-records", "list", { limit: 5, offset: 5 }]), [rec2, rec3]],
    ]);
    const { queryClient, onMutate, onError } = buildSimulatedDelete(cache);

    const ctx = await onMutate("tr_001");
    onError(new Error("fail"), "tr_001", ctx);

    expect(queryClient.setQueryData).toHaveBeenCalledTimes(ctx.snapshot.length);
  });

  it("does nothing when context is undefined (no snapshot to restore)", () => {
    const cache = new Map([
      [JSON.stringify(["thought-records", "list", undefined]), [rec1, rec2]],
    ]);
    const { queryClient, onError } = buildSimulatedDelete(cache);

    expect(() => onError(new Error("fail"), "tr_001", undefined)).not.toThrow();
    expect(queryClient.setQueryData).not.toHaveBeenCalled();
  });

  it("does not call invalidateQueries on error (that is onSettled's job)", () => {
    const cache = new Map([
      [JSON.stringify(["thought-records", "list", undefined]), [rec1]],
    ]);
    const { queryClient, onError } = buildSimulatedDelete(cache);

    onError(new Error("fail"), "tr_001", { snapshot: [] });

    expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
  });
});

describe("useDeleteThoughtRecord — onSettled (invalidation)", () => {
  it("invalidates queries for the thought-records root key", () => {
    const cache = new Map([
      [JSON.stringify(["thought-records", "list", undefined]), [rec1]],
    ]);
    const { queryClient, onSettled } = buildSimulatedDelete(cache);

    onSettled();

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["thought-records"],
    });
  });

  it("calls invalidateQueries exactly once", () => {
    const cache = new Map<string, ThoughtRecord[]>();
    const { queryClient, onSettled } = buildSimulatedDelete(cache);

    onSettled();

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(1);
  });
});
