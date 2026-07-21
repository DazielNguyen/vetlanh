/**
 * Unit tests for
 * app/services/thought-records/components/ThoughtRecordGuidedFlow.tsx
 *
 * Rendered with react-dom/server's renderToStaticMarkup (no jsdom in this
 * repo — see jest.config.ts's testEnvironment: "node"), following the
 * pattern in __tests__/SafetyPlanPage.render.test.tsx / CompanionOnboarding.
 *
 * IMPORTANT SCOPE NOTE: this component drives its wizard (step index,
 * per-question draft, accumulated answers) entirely with real
 * `useState`/closures internal to the component — there is no prop-driven
 * way to mount it "at step 3" or "in review", and this repo has no
 * fireEvent/dispatchEvent shim anywhere (confirmed via
 * `grep -rl "fireEvent\|dispatchEvent" __tests__/` — zero hits) to simulate
 * typing into the textarea or clicking "Tiếp theo"/"Lưu ghi chú" and drive
 * the component through subsequent renders. Unlike GuidedFlowShell (whose
 * only hook is a mocked, hook-free useReducedMotion), this component's own
 * useState calls require a real React dispatcher, so it also cannot be
 * invoked as a plain function outside of a render pass the way
 * __tests__/SafeCompanion.test.tsx does for its hook-free component.
 *
 * As a result, the tests below can only verify:
 *   - the component's single reachable state via SSR: initial mount (step 0)
 *   - that mounting alone never calls the create mutation (a real,
 *     necessary-but-not-sufficient slice of the "nothing persists until
 *     review is confirmed" contract)
 * They CANNOT verify: typing answers, advancing through all 5 questions,
 * reaching the review step, clicking "Lưu ghi chú" and asserting `create`
 * fires with the full accumulated answers, or clicking the exit link at a
 * non-zero step and asserting `onExitToStatic` receives the right partial
 * object. Those interaction paths are explicitly flagged as NOT verified by
 * this test file, per instructions, rather than faked.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

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

const mockCreate = jest.fn();
const mockUseCreateThoughtRecord = jest.fn(() => ({ mutate: mockCreate, isPending: false }));

jest.mock("@/hooks/useThoughtRecords", () => ({
  useCreateThoughtRecord: () => mockUseCreateThoughtRecord(),
}));

// ── SUT import ────────────────────────────────────────────────────────────────

import { ThoughtRecordGuidedFlow } from "@/app/services/thought-records/components/ThoughtRecordGuidedFlow";

function render(props: Partial<React.ComponentProps<typeof ThoughtRecordGuidedFlow>> = {}) {
  const onExitToStatic = props.onExitToStatic ?? jest.fn();
  const onSaved = props.onSaved ?? jest.fn();
  return renderToStaticMarkup(
    React.createElement(ThoughtRecordGuidedFlow, { onExitToStatic, onSaved, ...props })
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseReducedMotion.mockReturnValue(false);
  mockUseCreateThoughtRecord.mockReturnValue({ mutate: mockCreate, isPending: false });
});

describe("ThoughtRecordGuidedFlow — initial mount (step 0)", () => {
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

  it("shows the wizard title and 'Câu 1/5' progress", () => {
    const markup = render();
    expect(markup).toContain("Ghi chú suy nghĩ cùng trợ lý");
    expect(markup).toContain("Câu 1/5");
  });

  it("shows the first question's prompt (situation)", () => {
    const markup = render();
    expect(markup).toContain("Chuyện gì đã xảy ra khiến bạn nghĩ về điều này?");
  });

  it("renders an empty textarea for the answer", () => {
    const markup = render();
    expect(markup).toContain("<textarea");
    expect(markup).not.toMatch(/<textarea[^>]*>[^<]+<\/textarea>/);
  });

  it("does not show a 'Quay lại' step-back button at the very first step", () => {
    const markup = render();
    expect(markup).not.toContain("Quay lại");
  });

  it("disables 'Tiếp theo' while the draft textarea is empty", () => {
    const markup = render();
    expect(markup).toMatch(/<button[^>]*disabled=""[^>]*>Tiếp theo<\/button>/);
  });

  it("renders no summary chips yet (no questions confirmed)", () => {
    const markup = render();
    expect(markup).not.toContain("rounded-full bg-secondary/40 text-foreground/60");
  });

  it("does not render the review step's content at the first step", () => {
    const markup = render();
    expect(markup).not.toContain("Xem lại trước khi lưu");
    expect(markup).not.toContain("Lưu ghi chú");
  });

  it("renders the 'Dùng biểu mẫu thường' exit-to-static link", () => {
    const markup = render();
    expect(markup).toContain("Dùng biểu mẫu thường");
  });
});

describe("ThoughtRecordGuidedFlow — persistence contract", () => {
  it("never calls the create mutation just from mounting (nothing persists before review is confirmed)", () => {
    render();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("does not call create even while the create mutation is reported as pending from a prior run", () => {
    mockUseCreateThoughtRecord.mockReturnValue({ mutate: mockCreate, isPending: true });
    render();
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
