/**
 * Unit tests for components/guided-flow/GuidedFlowShell.tsx
 *
 * Rendered with react-dom/server's renderToStaticMarkup (no jsdom in this
 * repo), following the pattern in __tests__/CompanionOnboarding.test.tsx:
 * motion/react is mocked (strip animation-only props, controllable
 * useReducedMotion()) and SafeCompanion is mocked to a trivial stub so this
 * file only exercises GuidedFlowShell's own logic (title/progress/summary/
 * footer/children slots).
 *
 * GuidedFlowShell has no internal state — its only hook is the (mocked,
 * hook-free) useReducedMotion() — so it can also be invoked as a plain
 * function (GuidedFlowShell({...})) to inspect the returned React element
 * tree directly, the same trick used in __tests__/SafeCompanion.test.tsx.
 * That lets us grab the exit button's onClick prop (a real JS closure) and
 * invoke it directly to verify onExitToStatic wiring, without needing
 * jsdom/fireEvent.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

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
  SafeCompanion: (props: { state: string; className?: string }) =>
    require("react").createElement("div", {
      "data-testid": "safe-companion",
      "data-state": props.state,
      className: props.className,
    }),
}));

import { GuidedFlowShell } from "@/components/guided-flow/GuidedFlowShell";

function baseProps(overrides: Partial<React.ComponentProps<typeof GuidedFlowShell>> = {}) {
  return {
    title: "Ghi chú suy nghĩ cùng trợ lý",
    stepIndex: 0,
    totalSteps: 5,
    companionState: "thinking" as const,
    summary: [],
    onExitToStatic: jest.fn(),
    footer: React.createElement("button", { type: "button" }, "Tiếp theo"),
    children: React.createElement("p", null, "Question prompt"),
    ...overrides,
  };
}

function render(overrides: Partial<React.ComponentProps<typeof GuidedFlowShell>> = {}) {
  return renderToStaticMarkup(React.createElement(GuidedFlowShell, baseProps(overrides)));
}

describe("GuidedFlowShell — real render", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
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

  it("renders the title", () => {
    const markup = render();
    expect(markup).toContain("Ghi chú suy nghĩ cùng trợ lý");
  });

  it("renders 'Câu {stepIndex + 1}/{totalSteps}' progress text", () => {
    const markup = render({ stepIndex: 2, totalSteps: 5 });
    expect(markup).toContain("Câu 3/5");
  });

  it("clamps the displayed step at totalSteps when stepIndex >= totalSteps (review state)", () => {
    const markup = render({ stepIndex: 5, totalSteps: 5 });
    expect(markup).toContain("Câu 5/5");
    expect(markup).not.toContain("Câu 6/5");
  });

  it("renders a progress bar whose width reflects stepIndex/totalSteps", () => {
    const markup = render({ stepIndex: 1, totalSteps: 4 });
    expect(markup).toContain('style="width:25%"');
  });

  it("clamps the progress bar width at 100% once stepIndex reaches totalSteps", () => {
    const markup = render({ stepIndex: 4, totalSteps: 4 });
    expect(markup).toContain('style="width:100%"');
  });

  it("renders no summary chips when summary is empty", () => {
    const markup = render({ summary: [] });
    expect(markup).not.toContain("rounded-full bg-secondary/40 text-foreground/60");
  });

  it("renders a chip per summary item, labelled 'label: value'", () => {
    const markup = render({
      summary: [
        { label: "Tình huống", value: "Họp nhóm căng thẳng" },
        { label: "Cảm xúc", value: "Lo âu 70%" },
      ],
    });
    expect(markup).toContain("Tình huống: Họp nhóm căng thẳng");
    expect(markup).toContain("Cảm xúc: Lo âu 70%");
  });

  it("renders the children (current question slot) content", () => {
    const markup = render({ children: React.createElement("p", null, "Chuyện gì đã xảy ra?") });
    expect(markup).toContain("Chuyện gì đã xảy ra?");
  });

  it("renders the footer slot content", () => {
    const markup = render({ footer: React.createElement("button", { type: "button" }, "Lưu ghi chú") });
    expect(markup).toContain("Lưu ghi chú");
  });

  it("renders the crisisButton slot when provided", () => {
    const markup = render({
      crisisButton: React.createElement("button", { "aria-label": "Đường dây hỗ trợ khẩn cấp" }, "SOS"),
    });
    expect(markup).toContain('aria-label="Đường dây hỗ trợ khẩn cấp"');
  });

  it("renders no crisis button markup when crisisButton is omitted", () => {
    const markup = render({ crisisButton: undefined });
    expect(markup).not.toContain("Đường dây hỗ trợ khẩn cấp");
  });

  it("forwards companionState into the (mocked) SafeCompanion", () => {
    const markup = render({ companionState: "happy" });
    expect(markup).toContain('data-state="happy"');
  });

  it("renders the 'Dùng biểu mẫu thường' exit link as a <button>", () => {
    const markup = render();
    expect(markup).toMatch(/<button[^>]*>[\s\S]*?Dùng biểu mẫu thường/);
  });

  it("still renders full content when useReducedMotion() returns true", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const markup = render();
    expect(markup).toContain("Ghi chú suy nghĩ cùng trợ lý");
  });
});

describe("GuidedFlowShell — exit button wiring (element-tree inspection, no hooks of its own)", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("calls onExitToStatic when the exit button's onClick is invoked", () => {
    const onExitToStatic = jest.fn();
    const element = GuidedFlowShell(baseProps({ onExitToStatic })) as React.ReactElement;

    // Card > CardContent > [header div, progress div, (summary), motion.div, footer div]
    const cardContentChildren = React.Children.toArray(
      (element.props as { children: React.ReactElement }).children.props.children
    ) as React.ReactElement[];
    const headerRow = cardContentChildren[0];
    const headerChildren = React.Children.toArray(
      (headerRow.props as { children: React.ReactNode }).children
    ) as React.ReactElement[];
    const exitButton = headerChildren[1];

    expect(exitButton.type).toBe("button");
    expect(typeof (exitButton.props as { onClick?: () => void }).onClick).toBe("function");

    (exitButton.props as { onClick: () => void }).onClick();
    expect(onExitToStatic).toHaveBeenCalledTimes(1);
  });
});
