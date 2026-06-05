/**
 * Unit tests for lib/api/services/fetchSafetyPlan.ts
 *
 * Covers:
 *   - getSafetyPlan: correct URL, data unwrapping, error propagation
 *   - upsertSafetyPlan: correct URL + method, body forwarded, data unwrapping
 *   - getCrisisResources: plain fetch path, HTTP error handling, empty list
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

const mockGet = jest.fn();
const mockPut = jest.fn();

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: { get: mockGet, put: mockPut, post: jest.fn(), patch: jest.fn() },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import { fetchSafetyPlan } from "@/lib/api/services/fetchSafetyPlan";
import type { SafetyPlan, CrisisResource } from "@/types/safetyPlan";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockPlan: SafetyPlan = {
  warning_signs: "Cảm thấy mệt mỏi",
  coping_activities: "Nghe nhạc, đi bộ",
  trusted_contacts: "Bạn thân: 0900000001",
  reasons_to_live: "Gia đình và bạn bè",
};

const mockResources: CrisisResource[] = [
  { type: "hotline", name: "Đường dây hỗ trợ quốc gia", phone: "1800 599 920" },
  { type: "chat", name: "Chat hỗ trợ sức khỏe tâm thần", description: "24/7" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a minimal Response-compatible object for global.fetch mocking. */
function makeFetchResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

// ── Tests ──────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getSafetyPlan ────────────────────────────────────────────────────────────

describe("fetchSafetyPlan.getSafetyPlan", () => {
  it("calls GET api/v1/safety-plan", async () => {
    mockGet.mockResolvedValueOnce({ data: mockPlan });

    await fetchSafetyPlan.getSafetyPlan();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("api/v1/safety-plan");
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: mockPlan });

    const result = await fetchSafetyPlan.getSafetyPlan();

    expect(result).toEqual(mockPlan);
  });

  it("returns a plan with all optional fields populated", async () => {
    mockGet.mockResolvedValueOnce({ data: mockPlan });

    const result = await fetchSafetyPlan.getSafetyPlan();

    expect(result.warning_signs).toBe("Cảm thấy mệt mỏi");
    expect(result.coping_activities).toBe("Nghe nhạc, đi bộ");
    expect(result.trusted_contacts).toBe("Bạn thân: 0900000001");
    expect(result.reasons_to_live).toBe("Gia đình và bạn bè");
  });

  it("returns a plan with all fields undefined (empty plan from server)", async () => {
    const emptyPlan: SafetyPlan = {};
    mockGet.mockResolvedValueOnce({ data: emptyPlan });

    const result = await fetchSafetyPlan.getSafetyPlan();

    expect(result).toEqual({});
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchSafetyPlan.getSafetyPlan()).rejects.toThrow("Network error");
  });

  it("propagates a 404-shaped error so callers can handle it", async () => {
    const err404 = { response: { status: 404, data: { detail: "Not found" } } };
    mockGet.mockRejectedValueOnce(err404);

    await expect(fetchSafetyPlan.getSafetyPlan()).rejects.toMatchObject({
      response: { status: 404 },
    });
  });

  it("propagates a 401-shaped error", async () => {
    const err401 = { response: { status: 401 } };
    mockGet.mockRejectedValueOnce(err401);

    await expect(fetchSafetyPlan.getSafetyPlan()).rejects.toMatchObject({
      response: { status: 401 },
    });
  });

  it("does not call put", async () => {
    mockGet.mockResolvedValueOnce({ data: mockPlan });

    await fetchSafetyPlan.getSafetyPlan();

    expect(mockPut).not.toHaveBeenCalled();
  });
});

// ─── upsertSafetyPlan ─────────────────────────────────────────────────────────

describe("fetchSafetyPlan.upsertSafetyPlan", () => {
  it("calls PUT api/v1/safety-plan with the full body", async () => {
    mockPut.mockResolvedValueOnce({ data: mockPlan });

    await fetchSafetyPlan.upsertSafetyPlan(mockPlan);

    expect(mockPut).toHaveBeenCalledTimes(1);
    expect(mockPut).toHaveBeenCalledWith("api/v1/safety-plan", mockPlan);
  });

  it("returns response.data directly", async () => {
    mockPut.mockResolvedValueOnce({ data: mockPlan });

    const result = await fetchSafetyPlan.upsertSafetyPlan(mockPlan);

    expect(result).toEqual(mockPlan);
  });

  it("accepts a partial plan (only warning_signs set)", async () => {
    const partial: SafetyPlan = { warning_signs: "Mất ngủ" };
    mockPut.mockResolvedValueOnce({ data: partial });

    const result = await fetchSafetyPlan.upsertSafetyPlan(partial);

    expect(mockPut).toHaveBeenCalledWith("api/v1/safety-plan", partial);
    expect(result.warning_signs).toBe("Mất ngủ");
  });

  it("accepts an empty plan object", async () => {
    const empty: SafetyPlan = {};
    mockPut.mockResolvedValueOnce({ data: empty });

    await fetchSafetyPlan.upsertSafetyPlan(empty);

    expect(mockPut).toHaveBeenCalledWith("api/v1/safety-plan", {});
  });

  it("propagates rejection when apiService.put throws", async () => {
    mockPut.mockRejectedValueOnce(new Error("Server error"));

    await expect(fetchSafetyPlan.upsertSafetyPlan(mockPlan)).rejects.toThrow("Server error");
  });

  it("does not call get", async () => {
    mockPut.mockResolvedValueOnce({ data: mockPlan });

    await fetchSafetyPlan.upsertSafetyPlan(mockPlan);

    expect(mockGet).not.toHaveBeenCalled();
  });
});

// ─── getCrisisResources ────────────────────────────────────────────────────────

describe("fetchSafetyPlan.getCrisisResources", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("fetches from the crisis resources endpoint", async () => {
    const spy = jest.fn().mockResolvedValueOnce(makeFetchResponse(mockResources));
    global.fetch = spy;

    await fetchSafetyPlan.getCrisisResources();

    expect(spy).toHaveBeenCalledTimes(1);
    const calledUrl: string = spy.mock.calls[0][0];
    expect(calledUrl).toContain("/api/v1/crisis/resources");
  });

  it("does NOT use the Axios apiService (no get/put called)", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(makeFetchResponse(mockResources));

    await fetchSafetyPlan.getCrisisResources();

    expect(mockGet).not.toHaveBeenCalled();
    expect(mockPut).not.toHaveBeenCalled();
  });

  it("returns the parsed JSON array from the response", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(makeFetchResponse(mockResources));

    const result = await fetchSafetyPlan.getCrisisResources();

    expect(result).toEqual(mockResources);
  });

  it("returns an empty array when server returns []", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(makeFetchResponse([]));

    const result = await fetchSafetyPlan.getCrisisResources();

    expect(result).toEqual([]);
  });

  it("throws when the HTTP response is not ok (e.g. 500)", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(makeFetchResponse({ detail: "error" }, false, 500));

    await expect(fetchSafetyPlan.getCrisisResources()).rejects.toThrow("HTTP 500");
  });

  it("throws when the HTTP response is 503", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(makeFetchResponse({ detail: "unavailable" }, false, 503));

    await expect(fetchSafetyPlan.getCrisisResources()).rejects.toThrow("HTTP 503");
  });

  it("propagates network-level errors from fetch", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("ECONNREFUSED"));

    await expect(fetchSafetyPlan.getCrisisResources()).rejects.toThrow("ECONNREFUSED");
  });

  it("uses NEXT_PUBLIC_API_URL env var when set", async () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/";
    const spy = jest.fn().mockResolvedValueOnce(makeFetchResponse(mockResources));
    global.fetch = spy;

    await fetchSafetyPlan.getCrisisResources();

    const calledUrl: string = spy.mock.calls[0][0];
    expect(calledUrl).toBe("https://api.example.com/api/v1/crisis/resources");

    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  it("falls back to localhost:8080 when NEXT_PUBLIC_API_URL is not set", async () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
    const spy = jest.fn().mockResolvedValueOnce(makeFetchResponse(mockResources));
    global.fetch = spy;

    await fetchSafetyPlan.getCrisisResources();

    const calledUrl: string = spy.mock.calls[0][0];
    expect(calledUrl).toBe("http://localhost:8080/api/v1/crisis/resources");

    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });
});
