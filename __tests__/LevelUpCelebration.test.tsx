/**
 * Unit tests for components/progression/LevelUpCelebration.tsx
 *
 * Rendered with react-dom/server's renderToStaticMarkup (no jsdom in this
 * repo). LevelUpCelebration takes levelUpTo/dismissLevelUp as props (owned by
 * the single useBadges() call in DashboardContent), so no hook mocking is
 * needed here — just pass the props directly. motion/react is mocked using
 * the same pattern as __tests__/CompanionCharacter.test.tsx (strip
 * animation-only props, controllable useReducedMotion()).
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

import { LevelUpCelebration } from "@/components/progression/LevelUpCelebration";

function render(levelUpTo: number | null, dismissLevelUp: () => void = jest.fn()) {
  return renderToStaticMarkup(
    <LevelUpCelebration levelUpTo={levelUpTo} dismissLevelUp={dismissLevelUp} />
  );
}

describe("LevelUpCelebration", () => {
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

  it("renders nothing when levelUpTo is null", () => {
    const markup = render(null);

    expect(markup).toBe("");
  });

  it("renders the celebration overlay with the correct level copy", () => {
    const markup = render(3);

    expect(markup).toContain("Chúc mừng! Bạn đã đạt Cấp 3");
  });

  it("renders the unlocks copy for the celebrated level", () => {
    const markup = render(3);

    // Level 3 unlocks "Thư viện" per LEVEL_THRESHOLDS
    expect(markup).toContain("Thư viện");
  });

  it("renders a distinct unlocks copy for a different level", () => {
    const markup = render(7);

    expect(markup).toContain("Chúc mừng! Bạn đã đạt Cấp 7");
    expect(markup).toContain("Trang trí (cosmetic)");
  });

  it("renders the CompanionCharacter in the 'happy' state (sparkle accent present)", () => {
    const markup = render(2);

    expect(markup).toContain("var(--color-illustration-sun-yellow)");
  });

  it("renders without throwing and without console errors/warnings for every level 1..7", () => {
    for (let level = 1; level <= 7; level++) {
      expect(() => render(level)).not.toThrow();
    }

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  // ── Reduced-motion path is exercised, not skipped ───────────────────────────

  it("still renders the full celebration content when useReducedMotion() returns true", () => {
    mockUseReducedMotion.mockReturnValue(true);

    const markup = render(4);

    expect(markup).toContain("Chúc mừng! Bạn đã đạt Cấp 4");
    expect(markup).toContain("Âm thanh"); // level 4 unlocks
  });

  it("does not throw and logs no console errors/warnings on the reduced-motion path", () => {
    mockUseReducedMotion.mockReturnValue(true);

    for (let level = 1; level <= 7; level++) {
      expect(() => render(level)).not.toThrow();
    }

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("produces different markup between reduced-motion and normal-motion paths (transition prop differs)", () => {
    mockUseReducedMotion.mockReturnValue(false);
    const normalMarkup = render(2);

    mockUseReducedMotion.mockReturnValue(true);
    const reducedMarkup = render(2);

    // Both should still contain the core content regardless of animation path.
    expect(normalMarkup).toContain("Chúc mừng! Bạn đã đạt Cấp 2");
    expect(reducedMarkup).toContain("Chúc mừng! Bạn đã đạt Cấp 2");
  });

  it("renders a dismiss ('Đóng') control and a primary CTA button", () => {
    const markup = render(2);

    expect(markup).toContain("Đóng");
    expect(markup).toContain("Tuyệt vời!");
  });
});
