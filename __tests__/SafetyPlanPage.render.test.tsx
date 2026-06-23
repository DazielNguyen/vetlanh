/**
 * Rendering tests for app/services/safety-plan/page.tsx
 *
 * Verifies the ListSection / ContactList sub-components render the right
 * content for a given SafetyPlan shape (string[] for warning_signs /
 * coping_activities, TrustedContact[] for trusted_contacts).
 *
 * No jsdom is available in this repo's Jest config (testEnvironment: "node"),
 * so we render via react-dom/server's renderToStaticMarkup — a real render
 * pass that exercises hooks correctly — and assert on the resulting HTML
 * string. Interactive add/remove/Enter-key *behaviour* (which requires event
 * dispatch) is covered separately in SafetyPlanPage.logic.test.ts, where the
 * same handler logic is exercised directly without a DOM.
 *
 * IMPORTANT CAVEAT: renderToStaticMarkup performs a server-side render pass,
 * which never runs useEffect. SafetyPlanPage pre-fills its `form` state from
 * the loaded `plan` via a `useEffect(() => { if (plan) setForm(plan) }, [plan])`,
 * so under SSR the form always starts from the EMPTY default regardless of
 * what `useSafetyPlan` returns. Tests below that depend on list/contact
 * content being pre-filled are therefore covered in
 * SafetyPlanPage.logic.test.ts instead (which exercises the pre-fill effect
 * and the add/remove handlers as plain extracted functions).
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockUseSafetyPlan = jest.fn();
const mockUseUpsertSafetyPlan = jest.fn();

jest.mock("@/hooks/useSafetyPlan", () => ({
  useSafetyPlan: () => mockUseSafetyPlan(),
  useUpsertSafetyPlan: () => mockUseUpsertSafetyPlan(),
}));

// ── SUT import ────────────────────────────────────────────────────────────────

import SafetyPlanPage from "@/app/services/safety-plan/page";
import type { SafetyPlan } from "@/types/safetyPlan";

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderPage(): string {
  return renderToStaticMarkup(React.createElement(SafetyPlanPage));
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseUpsertSafetyPlan.mockReturnValue({ mutate: jest.fn(), isPending: false });
});

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("SafetyPlanPage — loading / error states", () => {
  it("renders a spinner while loading", () => {
    mockUseSafetyPlan.mockReturnValue({ data: undefined, isLoading: true, isError: false, refetch: jest.fn() });

    const html = renderPage();
    expect(html).toContain("animate-spin");
  });

  it("renders ErrorCard on a non-404 error (useSafetyPlan absorbs 404 to null, not error)", () => {
    mockUseSafetyPlan.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch: jest.fn() });

    const html = renderPage();
    expect(html).toContain("Không thể tải kế hoạch an toàn");
  });
});

describe("SafetyPlanPage — new-plan banner", () => {
  it("shows the 'create first plan' banner when plan is null", () => {
    mockUseSafetyPlan.mockReturnValue({ data: null, isLoading: false, isError: false, refetch: jest.fn() });

    const html = renderPage();
    expect(html).toContain("Tạo kế hoạch an toàn đầu tiên");
    expect(html).toContain("Kế hoạch mới");
  });

  it("hides the banner when an existing plan is loaded", () => {
    const plan: SafetyPlan = {
      warning_signs: [],
      coping_activities: [],
      trusted_contacts: [],
      reasons_to_live: null,
    };
    mockUseSafetyPlan.mockReturnValue({ data: plan, isLoading: false, isError: false, refetch: jest.fn() });

    const html = renderPage();
    expect(html).not.toContain("Tạo kế hoạch an toàn đầu tiên");
    expect(html).toContain("Kế hoạch của tôi");
  });
});

describe("SafetyPlanPage — ListSection rendering (warning_signs / coping_activities)", () => {
  it("renders no <ul> for warning_signs by default (SSR never runs the pre-fill effect)", () => {
    const plan: SafetyPlan = {
      warning_signs: ["Mất ngủ", "Tâm trạng tồi tệ"],
      coping_activities: [],
      trusted_contacts: [],
      reasons_to_live: null,
    };
    mockUseSafetyPlan.mockReturnValue({ data: plan, isLoading: false, isError: false, refetch: jest.fn() });

    const html = renderPage();
    // Pre-fill happens in useEffect, which does not run during SSR, so the
    // form always starts EMPTY here — content coverage for the populated
    // case lives in SafetyPlanPage.logic.test.ts.
    expect((html.match(/<ul/g) ?? []).length).toBe(0);
  });

  it("renders both list sections with their distinct labels regardless of data", () => {
    const plan: SafetyPlan = {
      warning_signs: ["sign1"],
      coping_activities: ["activity1"],
      trusted_contacts: [],
      reasons_to_live: null,
    };
    mockUseSafetyPlan.mockReturnValue({ data: plan, isLoading: false, isError: false, refetch: jest.fn() });

    const html = renderPage();
    expect(html).toContain("Dấu hiệu cảnh báo");
    expect(html).toContain("Hoạt động đối phó");
  });

  it("renders the add-item input and button for each list section", () => {
    mockUseSafetyPlan.mockReturnValue({ data: null, isLoading: false, isError: false, refetch: jest.fn() });

    const html = renderPage();
    expect(html).toContain("VD: Mất ngủ nhiều đêm liên tiếp");
    expect(html).toContain("VD: Đi bộ 15 phút");
    expect((html.match(/lucide-plus/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });
});

describe("SafetyPlanPage — ContactList rendering (trusted_contacts)", () => {
  it("renders no contact <ul> when trusted_contacts is empty", () => {
    const plan: SafetyPlan = {
      warning_signs: [],
      coping_activities: [],
      trusted_contacts: [],
      reasons_to_live: null,
    };
    mockUseSafetyPlan.mockReturnValue({ data: plan, isLoading: false, isError: false, refetch: jest.fn() });

    const html = renderPage();
    expect((html.match(/<ul/g) ?? []).length).toBe(0);
  });

  it("renders two inputs (name + phone) for the contact draft form", () => {
    const plan: SafetyPlan = {
      warning_signs: [],
      coping_activities: [],
      trusted_contacts: [],
      reasons_to_live: null,
    };
    mockUseSafetyPlan.mockReturnValue({ data: plan, isLoading: false, isError: false, refetch: jest.fn() });

    const html = renderPage();
    expect(html).toContain('placeholder="Tên"');
    expect(html).toContain('placeholder="Số điện thoại"');
  });
});

describe("SafetyPlanPage — reasons_to_live textarea", () => {
  it("renders an empty textarea when reasons_to_live is null", () => {
    const plan: SafetyPlan = {
      warning_signs: [],
      coping_activities: [],
      trusted_contacts: [],
      reasons_to_live: null,
    };
    mockUseSafetyPlan.mockReturnValue({ data: plan, isLoading: false, isError: false, refetch: jest.fn() });

    const html = renderPage();
    expect(html).toContain("<textarea");
    // self-closing textarea with no inner text content
    expect(html).not.toMatch(/<textarea[^>]*>[^<]+<\/textarea>/);
  });

  it("renders the placeholder text for reasons_to_live", () => {
    mockUseSafetyPlan.mockReturnValue({ data: null, isLoading: false, isError: false, refetch: jest.fn() });

    const html = renderPage();
    expect(html).toContain("Gia đình, thú cưng, những ước mơ chưa thực hiện");
  });
});

describe("SafetyPlanPage — submit button label", () => {
  it("shows 'Lưu kế hoạch' for a new plan", () => {
    mockUseSafetyPlan.mockReturnValue({ data: null, isLoading: false, isError: false, refetch: jest.fn() });

    const html = renderPage();
    expect(html).toContain("Lưu kế hoạch");
  });

  it("shows 'Cập nhật kế hoạch' for an existing plan", () => {
    const plan: SafetyPlan = {
      warning_signs: [],
      coping_activities: [],
      trusted_contacts: [],
      reasons_to_live: null,
    };
    mockUseSafetyPlan.mockReturnValue({ data: plan, isLoading: false, isError: false, refetch: jest.fn() });

    const html = renderPage();
    expect(html).toContain("Cập nhật kế hoạch");
  });

  it("shows the spinner instead of a label while the mutation is pending", () => {
    mockUseSafetyPlan.mockReturnValue({ data: null, isLoading: false, isError: false, refetch: jest.fn() });
    mockUseUpsertSafetyPlan.mockReturnValue({ mutate: jest.fn(), isPending: true });

    const html = renderPage();
    expect(html).not.toContain("Lưu kế hoạch");
    expect(html).not.toContain("Cập nhật kế hoạch");
    expect(html).toContain("animate-spin");
  });
});
