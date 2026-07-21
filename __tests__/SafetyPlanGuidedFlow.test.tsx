/**
 * Unit tests for
 * app/services/safety-plan/components/SafetyPlanGuidedFlow.tsx
 *
 * Rendered with react-dom/server's renderToStaticMarkup (no jsdom in this
 * repo). Same scope caveat as __tests__/ThoughtRecordGuidedFlow.test.tsx:
 * step/draft state lives in real useState inside this component, and this
 * repo has no fireEvent/dispatchEvent shim, so multi-step interaction
 * (typing into inputs, clicking "Tiếp theo" repeatedly, reaching review,
 * clicking "Hoàn tất") cannot be driven or verified here.
 *
 * One thing IS directly testable via SSR though: `plan` is seeded from the
 * `initialPlan` prop via `useState(initialPlan)`, and that's exactly the
 * state visible on the very first render — so the "resume a partial draft"
 * behavior (Step 6 of the phase plan) can be verified by passing a
 * non-empty `initialPlan` and asserting its warning_signs render immediately
 * at step 0, without needing any interaction.
 *
 * What CANNOT be verified here (explicitly flagged, not faked): that
 * confirming step 1 (adding a warning sign + clicking "Tiếp theo") calls
 * `upsert` with a plan containing that warning sign, before review is
 * reached — this is the flow's core "auto-save per step" behavior, but
 * asserting it requires simulating a click + a subsequent render, which
 * needs jsdom/fireEvent that this repo's Jest config (testEnvironment:
 * "node") does not provide.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { SafetyPlan } from "@/types/safetyPlan";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockUseReducedMotion = jest.fn(() => false);

jest.mock("motion/react", () => {
  const ReactLib = require("react");

  const stripMotionProps = (props: Record<string, unknown>) => {
    const {
      animate: _animate,
      initial: _initial,
      exit: _exit,
      transition: _transition,
      variants: _variants,
      layout: _layout,
      layoutId: _layoutId,
      whileHover: _whileHover,
      whileTap: _whileTap,
      ...rest
    } = props;
    return rest;
  };

  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        ReactLib.forwardRef((props: Record<string, unknown>, ref: unknown) => {
          const { children, ...rest } = stripMotionProps(props);
          return ReactLib.createElement(tag, { ...rest, ref }, children as React.ReactNode);
        }),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useReducedMotion: () => mockUseReducedMotion(),
  };
});

jest.mock("@/components/illustrations/SafeCompanion", () => ({
  SafeCompanion: (props: { state: string }) =>
    require("react").createElement("div", { "data-testid": "safe-companion", "data-state": props.state }),
}));

const mockUpsert = jest.fn();
const mockUseUpsertSafetyPlan = jest.fn(() => ({ mutate: mockUpsert, isPending: false }));

jest.mock("@/hooks/useSafetyPlan", () => ({
  useUpsertSafetyPlan: () => mockUseUpsertSafetyPlan(),
}));

const mockUseCrisisResources = jest.fn(() => ({ data: undefined, isLoading: false }));
jest.mock("@/hooks/useCrisisResources", () => ({
  useCrisisResources: () => mockUseCrisisResources(),
}));

// ── SUT import ────────────────────────────────────────────────────────────────

import { SafetyPlanGuidedFlow } from "@/app/services/safety-plan/components/SafetyPlanGuidedFlow";

const EMPTY_PLAN: SafetyPlan = {
  warning_signs: [],
  coping_activities: [],
  trusted_contacts: [],
  reasons_to_live: null,
};

function render(overrides: Partial<React.ComponentProps<typeof SafetyPlanGuidedFlow>> = {}) {
  const onExitToStatic = overrides.onExitToStatic ?? jest.fn();
  const onSaved = overrides.onSaved ?? jest.fn();
  const initialPlan = overrides.initialPlan ?? EMPTY_PLAN;
  return renderToStaticMarkup(
    React.createElement(SafetyPlanGuidedFlow, { initialPlan, onExitToStatic, onSaved })
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseReducedMotion.mockReturnValue(false);
  mockUseUpsertSafetyPlan.mockReturnValue({ mutate: mockUpsert, isPending: false });
  mockUseCrisisResources.mockReturnValue({ data: undefined, isLoading: false });
});

describe("SafetyPlanGuidedFlow — initial mount (step 0, empty plan)", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("renders without throwing and without console errors/warnings", () => {
    expect(() => render()).not.toThrow();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("shows the wizard title and 'Câu 1/4' progress", () => {
    const markup = render();
    expect(markup).toContain("Kế hoạch an toàn cùng trợ lý");
    expect(markup).toContain("Câu 1/4");
  });

  it("shows the first question's prompt (warning signs)", () => {
    const markup = render();
    expect(markup).toContain("Những suy nghĩ, cảm xúc hay tình huống nào báo hiệu bạn đang gặp khó khăn?");
  });

  it("renders no <ul> of warning signs when the plan starts empty", () => {
    const markup = render();
    expect((markup.match(/<ul/g) ?? []).length).toBe(0);
  });

  it("does not show a 'Quay lại' step-back button at the very first step", () => {
    const markup = render();
    expect(markup).not.toContain("Quay lại");
  });

  it("does not render the review step's content at the first step", () => {
    const markup = render();
    expect(markup).not.toContain("Xem lại trước khi lưu");
    expect(markup).not.toContain("Hoàn tất");
  });

  it("renders the crisis resources button (SOS) via the shell's crisisButton slot", () => {
    const markup = render();
    expect(markup).toContain('aria-label="Đường dây hỗ trợ khẩn cấp"');
  });

  it("renders the 'Dùng biểu mẫu thường' exit-to-static link", () => {
    const markup = render();
    expect(markup).toContain("Dùng biểu mẫu thường");
  });

  it("'Tiếp theo' is NOT disabled for a list step, even with no draft text typed (unlike the Thought Record flow)", () => {
    const markup = render();
    expect(markup).toMatch(/<button[^>]*>Tiếp theo<\/button>/);
    expect(markup).not.toMatch(/<button[^>]*disabled=""[^>]*>Tiếp theo<\/button>/);
  });
});

describe("SafetyPlanGuidedFlow — resuming a partial draft from initialPlan", () => {
  it("renders pre-existing warning_signs from initialPlan immediately at step 0 (no interaction needed)", () => {
    const markup = render({
      initialPlan: { ...EMPTY_PLAN, warning_signs: ["Mất ngủ 3 đêm liên tiếp", "Né tránh bạn bè"] },
    });
    expect(markup).toContain("Mất ngủ 3 đêm liên tiếp");
    expect(markup).toContain("Né tránh bạn bè");
  });

  it("does not surface coping_activities or trusted_contacts content at step 0 (later steps)", () => {
    const markup = render({
      initialPlan: {
        ...EMPTY_PLAN,
        coping_activities: ["Đi bộ 15 phút"],
        trusted_contacts: [{ name: "Mẹ", phone: "0900000000" }],
      },
    });
    expect(markup).not.toContain("Đi bộ 15 phút");
    expect(markup).not.toContain("0900000000");
  });
});

describe("SafetyPlanGuidedFlow — persistence contract (what SSR-only tests can and cannot show)", () => {
  it("never calls upsert just from mounting at step 0", () => {
    render();
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("does not call upsert even when a prior mutation is reported as still pending", () => {
    mockUseUpsertSafetyPlan.mockReturnValue({ mutate: mockUpsert, isPending: true });
    render();
    expect(mockUpsert).not.toHaveBeenCalled();
  });
});
