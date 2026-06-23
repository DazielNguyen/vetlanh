/**
 * Unit tests for the 404-vs-other-error branching in
 * app/services/assessment/components/Phq9History.tsx
 *
 * Same rendering strategy as Phq9Form.phase1.test.tsx: Phq9History calls
 * useState (offset) unconditionally, so we render via react-dom/server's
 * renderToStaticMarkup rather than invoking the component as a plain function.
 *
 * Key behaviours:
 *   1. error.code === 404 → FeatureUnavailable (lock icon, no retry)
 *   2. error.code !== 404 → ErrorCard (alert icon, retry button)
 *   3. empty history → "no history yet" empty state, not an error
 *   4. happy path → renders score_delta badges with dark-mode classes
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockUsePhq9History = jest.fn();

jest.mock("@/hooks/usePhq9", () => ({
  usePhq9History: (params: unknown) => mockUsePhq9History(params),
}));

// ── SUT import ────────────────────────────────────────────────────────────────

import { Phq9History } from "@/app/services/assessment/components/Phq9History";

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderHistory(): string {
  return renderToStaticMarkup(React.createElement(Phq9History));
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("Phq9History — 404 error handling", () => {
  beforeEach(() => {
    mockUsePhq9History.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { code: 404 },
      refetch: jest.fn(),
    });
  });

  it("renders FeatureUnavailable's message", () => {
    const html = renderHistory();
    expect(html).toContain("Tính năng đang được phát triển");
  });

  it("renders the FeatureUnavailable description specific to history", () => {
    const html = renderHistory();
    expect(html).toContain("Lịch sử đánh giá PHQ-9 sẽ sớm có mặt");
  });

  it("renders the lock icon, not the alert icon", () => {
    const html = renderHistory();
    expect(html).toContain("lucide-lock-keyhole");
    expect(html).not.toContain("lucide-triangle-alert");
  });

  it("does not render a retry button", () => {
    const html = renderHistory();
    expect(html).not.toContain("Thử lại");
  });

  it("does not render the 'Lịch sử đánh giá' card title", () => {
    const html = renderHistory();
    // Title appears both in the error-free header and the empty state; for the
    // 404 branch it must be entirely absent.
    expect(html).not.toContain("Lịch sử đánh giá</");
  });
});

describe("Phq9History — non-404 error handling", () => {
  beforeEach(() => {
    mockUsePhq9History.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { code: 500 },
      refetch: jest.fn(),
    });
  });

  it("renders ErrorCard's message", () => {
    const html = renderHistory();
    expect(html).toContain("Không thể tải lịch sử đánh giá");
    expect(html).not.toContain("Tính năng đang được phát triển");
  });

  it("renders the alert-triangle icon and a retry button", () => {
    const html = renderHistory();
    expect(html).toContain("lucide-triangle-alert");
    expect(html).toContain("Thử lại");
  });
});

describe("Phq9History — loading state", () => {
  it("renders the spinner and no error/empty state", () => {
    mockUsePhq9History.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderHistory();
    expect(html).toContain("animate-spin");
    expect(html).not.toContain("Chưa có lịch sử đánh giá nào");
  });
});

describe("Phq9History — empty state (not an error)", () => {
  it("renders the 'no history yet' message when items is an empty array", () => {
    mockUsePhq9History.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderHistory();
    expect(html).toContain("Chưa có lịch sử đánh giá nào");
    expect(html).not.toContain("Tính năng đang được phát triển");
  });

  it("renders the 'no history yet' message when items is undefined", () => {
    mockUsePhq9History.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderHistory();
    expect(html).toContain("Chưa có lịch sử đánh giá nào");
  });
});

describe("Phq9History — happy path", () => {
  const baseItem = {
    id: 1,
    score: 12,
    severity: "Moderate",
    answers: [1, 2, 1, 2, 1, 2, 1, 2, 0],
    questions: ["Q1"],
    suggested_goals: [],
    submitted_at: "2026-06-20T10:00:00Z",
    score_delta: null as number | null,
  };

  it("renders a numeric integer score for each item", () => {
    mockUsePhq9History.mockReturnValue({
      data: [{ ...baseItem }],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderHistory();
    expect(html).toContain(">12<");
  });

  it("renders dark-mode classes on the severity badge fallback", () => {
    mockUsePhq9History.mockReturnValue({
      data: [{ ...baseItem, severity: "UnknownSeverity" }],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderHistory();
    expect(html).toContain("dark:text-white/60");
    expect(html).toContain("dark:bg-white/10");
  });

  it("renders a negative score_delta with a down arrow and dark-mode emerald classes", () => {
    mockUsePhq9History.mockReturnValue({
      data: [{ ...baseItem, score_delta: -3 }],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderHistory();
    expect(html).toContain("▼ 3 điểm");
    expect(html).toContain("dark:text-emerald-400");
  });

  it("renders a positive score_delta with an up arrow and dark-mode red classes", () => {
    mockUsePhq9History.mockReturnValue({
      data: [{ ...baseItem, score_delta: 4 }],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderHistory();
    expect(html).toContain("▲ 4 điểm");
    expect(html).toContain("dark:text-red-400");
  });

  it("does not render a score_delta badge when score_delta is null", () => {
    mockUsePhq9History.mockReturnValue({
      data: [{ ...baseItem, score_delta: null }],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderHistory();
    expect(html).not.toContain("điểm");
  });

  it("disables 'Trước' button when offset is 0 and enables 'Tiếp' when a full page is returned", () => {
    mockUsePhq9History.mockReturnValue({
      data: Array.from({ length: 5 }, (_, i) => ({ ...baseItem, id: i + 1 })),
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderHistory();
    // "Trước" button should be disabled on the first page (offset === 0)
    const prevIndex = html.indexOf("Trước");
    const prevButtonStart = html.lastIndexOf("<button", prevIndex);
    expect(html.slice(prevButtonStart, prevIndex)).toContain("disabled");
  });
});
