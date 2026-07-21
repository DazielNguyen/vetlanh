/**
 * Unit tests for hooks/useRecommendation.ts
 *
 * usePersonalizedRecommendation is a thin React Query wrapper with no
 * effects, so — unlike hooks/useCheckIns.ts — we don't need to replicate any
 * effect body. We mock @tanstack/react-query's useQuery directly (no
 * QueryClientProvider needed) and render a throwaway host component with
 * renderToStaticMarkup to capture the config object passed to useQuery,
 * mirroring __tests__/useCheckIns.test.ts's "useQuery configuration" pattern.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// ── Mocks — declared before imports ──────────────────────────────────────────

jest.mock("redux-persist/lib/storage", () => ({
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => undefined),
}));

const mockUseQuery = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}));

const mockGetPersonalized = jest.fn();

jest.mock("@/lib/api/services/fetchRecommendation", () => ({
  fetchRecommendation: {
    getPersonalized: (...args: unknown[]) => mockGetPersonalized(...args),
  },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import {
  usePersonalizedRecommendation,
  RECOMMENDATION_KEYS,
} from "@/hooks/useRecommendation";
import { STALE, skipRetryOn } from "@/lib/api/queryConfig";
import { fetchRecommendation } from "@/lib/api/services/fetchRecommendation";

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderUsePersonalizedRecommendation(): ReturnType<
  typeof usePersonalizedRecommendation
> {
  let captured!: ReturnType<typeof usePersonalizedRecommendation>;
  function Host() {
    captured = usePersonalizedRecommendation();
    return null;
  }
  renderToStaticMarkup(React.createElement(Host));
  return captured;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
});

// ─── RECOMMENDATION_KEYS ──────────────────────────────────────────────────────

describe("RECOMMENDATION_KEYS", () => {
  it("personalized key is ['recommendation', 'personalized']", () => {
    expect(RECOMMENDATION_KEYS.personalized).toEqual(["recommendation", "personalized"]);
  });
});

// ─── usePersonalizedRecommendation — useQuery configuration ─────────────────

describe("usePersonalizedRecommendation — useQuery configuration", () => {
  it("calls useQuery with RECOMMENDATION_KEYS.personalized as the queryKey", () => {
    renderUsePersonalizedRecommendation();

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: RECOMMENDATION_KEYS.personalized })
    );
  });

  it("uses fetchRecommendation.getPersonalized as the queryFn", () => {
    renderUsePersonalizedRecommendation();

    const config = mockUseQuery.mock.calls[0][0];
    expect(config.queryFn).toBe(fetchRecommendation.getPersonalized);
  });

  it("sets staleTime: STALE.DAILY (24h)", () => {
    renderUsePersonalizedRecommendation();

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ staleTime: STALE.DAILY })
    );
    expect(STALE.DAILY).toBe(24 * 60 * 60 * 1000);
  });

  it("applies a skipRetryOn(404)-shaped retry function", () => {
    renderUsePersonalizedRecommendation();

    const config = mockUseQuery.mock.calls[0][0];
    const retry404 = skipRetryOn(404);
    // Same shape: stops retrying on a 404 code, retries other errors up to 2 times.
    expect(config.retry(0, { code: 404 })).toBe(retry404(0, { code: 404 }));
    expect(config.retry(0, { code: 500 })).toBe(retry404(0, { code: 500 }));
    expect(config.retry(2, { code: 500 })).toBe(retry404(2, { code: 500 }));
  });

  it("retry returns false on the first 404 failure (no retry loop for a missing recommendation)", () => {
    renderUsePersonalizedRecommendation();

    const config = mockUseQuery.mock.calls[0][0];
    expect(config.retry(0, { code: 404 })).toBe(false);
  });
});

// ─── usePersonalizedRecommendation — return value passthrough ───────────────

describe("usePersonalizedRecommendation — return value", () => {
  it("passes through the raw useQuery result object", () => {
    const queryResult = { data: undefined, isLoading: true, isError: false };
    mockUseQuery.mockReturnValue(queryResult);

    const result = renderUsePersonalizedRecommendation();

    expect(result).toBe(queryResult);
  });

  it("passes through data when a recommendation is present", () => {
    const recommendation = {
      title: "Thử bài tập thở 4-7-8",
      rationale: "Dựa trên nhật ký gần đây của bạn.",
      url: "/services/breathing",
    };
    mockUseQuery.mockReturnValue({ data: recommendation, isLoading: false, isError: false });

    const result = renderUsePersonalizedRecommendation();

    expect(result.data).toEqual(recommendation);
    expect(result.isLoading).toBe(false);
  });

  it("passes through isError: true when the query fails", () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });

    const result = renderUsePersonalizedRecommendation();

    expect(result.isError).toBe(true);
  });
});
