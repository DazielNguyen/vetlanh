/**
 * Unit tests for the 404-vs-other-error branching in
 * app/services/assessment/components/Phq9Form.tsx
 *
 * Phq9Form calls useState/useEffect unconditionally (even on the error/loading
 * paths), so it cannot be invoked as a plain function under Jest's
 * testEnvironment: "node" (there is no React dispatcher outside a renderer).
 * We use react-dom/server's renderToStaticMarkup instead — a real render pass
 * that works without jsdom and exercises hooks correctly.
 *
 * Key behaviours:
 *   1. error.code === 404 → renders FeatureUnavailable (lock icon, no retry button)
 *   2. error.code !== 404 (e.g. 500) → renders ErrorCard (alert icon, retry button)
 *   3. isLoading → renders the spinner, not either error state
 *   4. happy path → renders the question list from plain strings
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockUsePhq9Questions = jest.fn();
const mockUseSubmitPhq9 = jest.fn();

jest.mock("@/hooks/usePhq9", () => ({
  usePhq9Questions: () => mockUsePhq9Questions(),
  useSubmitPhq9: () => mockUseSubmitPhq9(),
}));

// ── SUT import ────────────────────────────────────────────────────────────────

import { Phq9Form } from "@/app/services/assessment/components/Phq9Form";

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderForm(onComplete: jest.Mock = jest.fn()): string {
  return renderToStaticMarkup(React.createElement(Phq9Form, { onComplete }));
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseSubmitPhq9.mockReturnValue({ mutate: jest.fn(), isPending: false });
});

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("Phq9Form — 404 error handling", () => {
  beforeEach(() => {
    mockUsePhq9Questions.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { code: 404 },
      refetch: jest.fn(),
    });
  });

  it("renders FeatureUnavailable's default-overridden message", () => {
    const html = renderForm();
    expect(html).toContain("Tính năng đang được phát triển");
  });

  it("renders the FeatureUnavailable description text", () => {
    const html = renderForm();
    expect(html).toContain("Bảng câu hỏi PHQ-9 sẽ sớm có mặt");
  });

  it("renders the lock icon (lucide-lock-keyhole), not the alert icon", () => {
    const html = renderForm();
    expect(html).toContain("lucide-lock-keyhole");
    expect(html).not.toContain("lucide-triangle-alert");
  });

  it("does not render a retry button", () => {
    const html = renderForm();
    expect(html).not.toContain("Thử lại");
    expect(html).not.toContain("<button");
  });

  it("does not render the question form", () => {
    const html = renderForm();
    expect(html).not.toContain("Đánh giá PHQ-9");
  });
});

describe("Phq9Form — non-404 error handling", () => {
  beforeEach(() => {
    mockUsePhq9Questions.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { code: 500 },
      refetch: jest.fn(),
    });
  });

  it("renders ErrorCard's message instead of FeatureUnavailable", () => {
    const html = renderForm();
    expect(html).toContain("Không thể tải câu hỏi PHQ-9");
    expect(html).not.toContain("Tính năng đang được phát triển");
  });

  it("renders the alert-triangle icon, not the lock icon", () => {
    const html = renderForm();
    expect(html).toContain("lucide-triangle-alert");
    expect(html).not.toContain("lucide-lock-keyhole");
  });

  it("renders a retry button labelled 'Thử lại'", () => {
    const html = renderForm();
    expect(html).toContain("Thử lại");
    expect(html).toContain("<button");
  });
});

describe("Phq9Form — error with no code (e.g. network error)", () => {
  it("falls through to the generic ErrorCard branch", () => {
    mockUsePhq9Questions.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: {},
      refetch: jest.fn(),
    });

    const html = renderForm();
    expect(html).toContain("Không thể tải câu hỏi PHQ-9");
  });
});

describe("Phq9Form — loading state", () => {
  it("renders the spinner and neither error state", () => {
    mockUsePhq9Questions.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderForm();
    expect(html).toContain("animate-spin");
    expect(html).not.toContain("Tính năng đang được phát triển");
    expect(html).not.toContain("Không thể tải câu hỏi PHQ-9");
  });
});

describe("Phq9Form — happy path (plain string[] questions)", () => {
  it("renders each question string by index, 1-based", () => {
    mockUsePhq9Questions.mockReturnValue({
      data: ["Cảm thấy buồn", "Mất ngủ", "Mệt mỏi"],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderForm();
    expect(html).toContain("1. Cảm thấy buồn");
    expect(html).toContain("2. Mất ngủ");
    expect(html).toContain("3. Mệt mỏi");
  });

  it("renders the answered-count progress text starting at 0", () => {
    mockUsePhq9Questions.mockReturnValue({
      data: ["Q1", "Q2"],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderForm();
    expect(html).toContain("Đã trả lời: 0/2 câu hỏi");
  });

  it("renders nothing (null) when questions array is empty", () => {
    mockUsePhq9Questions.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderForm();
    expect(html).toBe("");
  });

  it("disables the submit button while not all questions are answered", () => {
    mockUsePhq9Questions.mockReturnValue({
      data: ["Q1", "Q2"],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const html = renderForm();
    expect(html).toContain("disabled=\"\"");
  });
});
