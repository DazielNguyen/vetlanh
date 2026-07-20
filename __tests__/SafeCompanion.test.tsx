/**
 * Unit tests for components/illustrations/SafeCompanion.tsx
 *
 * @/lib/env is mocked so enableCompanion can be flipped per test.
 *
 * The disabled-flag and prop-passthrough behavior is exercised with a real
 * render via react-dom/server's renderToStaticMarkup (no jsdom in this
 * repo), following __tests__/LevelGate.test.tsx / __tests__/CompanionCharacter.test.tsx
 * (motion/react mocked the same way).
 *
 * The error-boundary *wiring* (SafeCompanion must mount CompanionCharacter
 * inside a CompanionErrorBoundary) is instead verified by calling
 * SafeCompanion(...) as a plain function and inspecting the returned React
 * element tree — NOT a full render. This is intentional: React's legacy
 * synchronous server renderer does not run error-boundary recovery (see the
 * doc comment in __tests__/CompanionErrorBoundary.test.tsx for the
 * empirically-confirmed reason), so a real thrown-error integration test
 * through renderToStaticMarkup isn't possible in this repo's test
 * environment. The boundary's own catch/log/null-render contract is unit
 * tested directly in __tests__/CompanionErrorBoundary.test.tsx; here we only
 * need to confirm SafeCompanion actually wires the boundary around the
 * character (i.e., doesn't skip it), which the element-tree shape proves.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockEnv: { enableCompanion: boolean } = { enableCompanion: true };
jest.mock("@/lib/env", () => ({
  get env() {
    return mockEnv;
  },
}));

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

import { SafeCompanion } from "@/components/illustrations/SafeCompanion";
import { CompanionErrorBoundary } from "@/components/illustrations/CompanionErrorBoundary";
import CompanionCharacter from "@/components/illustrations/CompanionCharacter";

describe("SafeCompanion — real render (disabled flag + prop passthrough)", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockEnv.enableCompanion = true;
    mockUseReducedMotion.mockReturnValue(false);
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders nothing when env.enableCompanion is false", () => {
    mockEnv.enableCompanion = false;

    const markup = renderToStaticMarkup(<SafeCompanion state="idle" />);

    expect(markup).toBe("");
  });

  it("renders the companion when env.enableCompanion is true", () => {
    const markup = renderToStaticMarkup(<SafeCompanion state="happy" />);

    expect(markup).toContain("var(--color-illustration-sun-yellow)"); // happy-state accent
  });

  it("passes the state prop through to CompanionCharacter (distinct markup per state)", () => {
    const idleMarkup = renderToStaticMarkup(<SafeCompanion state="idle" />);
    const thinkingMarkup = renderToStaticMarkup(<SafeCompanion state="thinking" />);

    expect(idleMarkup).not.toBe(thinkingMarkup);
    expect(thinkingMarkup).toContain("var(--color-illustration-sky-blue)");
  });

  it("passes the className prop through to CompanionCharacter", () => {
    const markup = renderToStaticMarkup(<SafeCompanion state="idle" className="w-20 h-20" />);
    expect(markup).toContain('class="w-20 h-20"');
  });

  it("renders without throwing and without console errors when disabled or enabled", () => {
    mockEnv.enableCompanion = false;
    expect(() => renderToStaticMarkup(<SafeCompanion state="idle" />)).not.toThrow();

    mockEnv.enableCompanion = true;
    expect(() => renderToStaticMarkup(<SafeCompanion state="idle" />)).not.toThrow();

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});

describe("SafeCompanion — error boundary wiring (element-tree inspection)", () => {
  beforeEach(() => {
    mockEnv.enableCompanion = true;
  });

  it("mounts CompanionCharacter inside a CompanionErrorBoundary when enabled", () => {
    const element = SafeCompanion({ state: "idle" }) as React.ReactElement;

    expect(element.type).toBe(CompanionErrorBoundary);

    const boundaryChildren = (element.props as { children: React.ReactElement }).children;
    expect(boundaryChildren.type).toBe(CompanionCharacter);
  });

  it("forwards state and className into the wrapped CompanionCharacter element's props", () => {
    const element = SafeCompanion({ state: "happy", className: "w-10 h-10" }) as React.ReactElement;
    const boundaryChildren = (element.props as { children: React.ReactElement }).children;

    expect(boundaryChildren.props).toEqual(
      expect.objectContaining({ state: "happy", className: "w-10 h-10" })
    );
  });

  it("returns null (no boundary, no character) when disabled — the kill switch short-circuits before mounting anything", () => {
    mockEnv.enableCompanion = false;

    const element = SafeCompanion({ state: "idle" });

    expect(element).toBeNull();
  });
});
