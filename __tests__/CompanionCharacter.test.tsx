/**
 * Unit tests for components/illustrations/CompanionCharacter.tsx
 *
 * CompanionCharacter is a hand-authored SVG mascot with a `state` prop
 * (CompanionState) that cross-fades between 5 expressive faces using
 * motion/react's AnimatePresence + useReducedMotion.
 *
 * This project has no jsdom / testing-library / react-test-renderer set up
 * (jest.config.ts uses testEnvironment: "node"). Following the pattern used
 * by other tests in this repo (StressChart, QuickReliefCard, WelcomeHeader),
 * we render the component with react-dom/server's renderToStaticMarkup —
 * which works fine under the Node test environment without a DOM/window —
 * and inspect the resulting markup string. This exercises the *real* render
 * path (unlike calling the component as a plain function), so a crash while
 * building the element tree, an invalid element type, etc. will throw.
 *
 * motion/react is mocked to strip animation-only props (animate, initial,
 * exit, transition, variants) down to plain DOM elements, and to expose a
 * controllable useReducedMotion() mock — since real useReducedMotion() reads
 * window.matchMedia, which does not exist under the "node" test environment.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockUseReducedMotion = jest.fn(() => false);

jest.mock("motion/react", () => {
  const ReactLib = require("react");

  // Strip motion-only props so the underlying tag renders as plain SVG/DOM.
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

import CompanionCharacter, {
  COMPANION_STATES,
  type CompanionState,
} from "@/components/illustrations/CompanionCharacter";

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderCompanion(state?: CompanionState, className?: string) {
  return renderToStaticMarkup(<CompanionCharacter state={state} className={className} />);
}

describe("CompanionCharacter", () => {
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

  // ── Criterion 1: all 5 states render distinguishable markup ────────────────

  it("exports all 5 expected states", () => {
    expect(COMPANION_STATES).toEqual(["idle", "listening", "thinking", "happy", "empathetic"]);
  });

  it.each(COMPANION_STATES)("renders without throwing for state '%s'", (state) => {
    expect(() => renderCompanion(state)).not.toThrow();
  });

  it("renders a distinct markup string for each of the 5 states", () => {
    const markupByState = new Map<CompanionState, string>();
    for (const state of COMPANION_STATES) {
      markupByState.set(state, renderCompanion(state));
    }

    const allMarkup = Array.from(markupByState.values());
    const uniqueMarkup = new Set(allMarkup);
    expect(uniqueMarkup.size).toBe(COMPANION_STATES.length);
  });

  it("defaults to the 'idle' face when no state prop is provided", () => {
    const defaultMarkup = renderCompanion(undefined);
    const idleMarkup = renderCompanion("idle");
    expect(defaultMarkup).toBe(idleMarkup);
  });

  // Spot-check a couple of state-specific visual accents mentioned in the
  // component's FACE_CONFIG table, to ensure the face really changes (not
  // just some incidental React key churn).
  it("includes state-specific accent markers unique to certain states", () => {
    const happyMarkup = renderCompanion("happy");
    const thinkingMarkup = renderCompanion("thinking");
    const idleMarkup = renderCompanion("idle");

    // "happy" draws sparkle/star accents using illustration-sun-yellow / coral fills
    expect(happyMarkup).toContain("var(--color-illustration-sun-yellow)");
    // "thinking" draws small "thought dot" circles using illustration-sky-blue
    expect(thinkingMarkup).toContain("var(--color-illustration-sky-blue)");
    // idle has neither of the above state-specific accents
    expect(idleMarkup).not.toContain("var(--color-illustration-sky-blue)");
  });

  // ── Criterion 2: switching state doesn't throw; mount/unmount/rapid switch ─

  it("does not throw when switching between every pair of states", () => {
    for (const from of COMPANION_STATES) {
      for (const to of COMPANION_STATES) {
        expect(() => {
          renderCompanion(from);
          renderCompanion(to);
        }).not.toThrow();
      }
    }
  });

  it("does not throw or log console errors/warnings across rapid mount/unmount/re-render cycles", () => {
    // Simulate rapid remount + rapid state switching, as a mount/unmount cycle
    // stand-in in the absence of a DOM renderer in this repo.
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const state of COMPANION_STATES) {
        expect(() => renderCompanion(state)).not.toThrow();
      }
      // Also rapidly reverse order, exercising remount with a different key.
      for (const state of [...COMPANION_STATES].reverse()) {
        expect(() => renderCompanion(state)).not.toThrow();
      }
    }

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  // ── Criterion 3: reduced-motion path is exercised, not skipped ──────────────

  it("renders without crashing when useReducedMotion() returns true", () => {
    mockUseReducedMotion.mockReturnValue(true);

    for (const state of COMPANION_STATES) {
      expect(() => renderCompanion(state)).not.toThrow();
    }

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("produces markup for the reduced-motion path distinct per state (face still swaps)", () => {
    mockUseReducedMotion.mockReturnValue(true);

    const idleMarkup = renderCompanion("idle");
    const happyMarkup = renderCompanion("happy");
    expect(idleMarkup).not.toBe(happyMarkup);
  });

  // ── Criterion 4: differing className sizes render without throwing ─────────

  it.each([
    ["avatar scale", "w-10 h-10"],
    ["hero scale", "w-48 h-48"],
    ["no className", undefined],
    ["empty className", ""],
  ])("renders without throwing for %s className", (_label, className) => {
    expect(() => renderCompanion("idle", className)).not.toThrow();
  });

  it("applies the provided className to the root svg element", () => {
    const markup = renderCompanion("idle", "w-48 h-48");
    expect(markup).toContain('class="w-48 h-48"');
  });

  // ── Criterion 5: no console warnings/errors on mount/unmount for any state ─

  it.each(COMPANION_STATES)("logs no console errors or warnings for state '%s'", (state) => {
    consoleErrorSpy.mockClear();
    consoleWarnSpy.mockClear();

    renderCompanion(state);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("renders as a decorative svg hidden from assistive tech", () => {
    const markup = renderCompanion("idle");
    expect(markup).toContain('aria-hidden="true"');
  });
});
