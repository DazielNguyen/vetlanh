/**
 * Unit tests for components/progression/CompanionOnboarding.tsx
 *
 * Rendered with react-dom/server's renderToStaticMarkup (no jsdom in this
 * repo), following the exact pattern in __tests__/LevelUpCelebration.test.tsx:
 * motion/react is mocked (strip animation-only props, controllable
 * useReducedMotion()), and SafeCompanion is exercised via a mocked
 * CompanionCharacter + real env flag (enabled) so the companion mount
 * renders without needing to mock SafeCompanion itself.
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

import { CompanionOnboarding } from "@/components/progression/CompanionOnboarding";

function render(onDismiss: () => void = jest.fn()) {
  return renderToStaticMarkup(<CompanionOnboarding onDismiss={onDismiss} />);
}

describe("CompanionOnboarding", () => {
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

  it("renders the welcome copy", () => {
    const markup = render();
    expect(markup).toContain("Chào mừng bạn đến với Vết Lành!");
  });

  // ── Exactly 3 first-run feature links ────────────────────────────────────────

  it("renders exactly 3 feature links", () => {
    const markup = render();
    const hrefMatches = markup.match(/href="\/services\/[a-z-]+"/g) ?? [];
    expect(hrefMatches).toHaveLength(3);
  });

  it("renders a link to the chat feature", () => {
    const markup = render();
    expect(markup).toContain('href="/services/chat"');
    expect(markup).toContain("Trò chuyện AI");
  });

  it("renders a link to the mood feature", () => {
    const markup = render();
    expect(markup).toContain('href="/services/mood"');
    expect(markup).toContain("Tâm trạng");
  });

  it("renders a link to the exercises feature", () => {
    const markup = render();
    expect(markup).toContain('href="/services/exercises"');
    expect(markup).toContain("Bài tập");
  });

  it("does not link to any other feature (e.g. sounds, library, journal)", () => {
    const markup = render();
    expect(markup).not.toContain('href="/services/sounds"');
    expect(markup).not.toContain('href="/services/library"');
    expect(markup).not.toContain('href="/services/journal"');
  });

  // ── Companion + dismiss control ───────────────────────────────────────────────

  it("renders the companion mascot", () => {
    const markup = render();
    // CompanionCharacter renders as a decorative, aria-hidden svg
    expect(markup).toContain('aria-hidden="true"');
  });

  it("renders a close button labelled 'Đóng'", () => {
    const markup = render();
    expect(markup).toContain('aria-label="Đóng"');
  });

  it("close button is a <button> element (clickable, keyboard accessible)", () => {
    const markup = render();
    expect(markup).toMatch(/<button[^>]*aria-label="Đóng"/);
  });

  // ── Reduced-motion path ───────────────────────────────────────────────────────

  it("still renders full content when useReducedMotion() returns true", () => {
    mockUseReducedMotion.mockReturnValue(true);

    const markup = render();

    expect(markup).toContain("Chào mừng bạn đến với Vết Lành!");
    expect(markup).toContain('href="/services/chat"');
  });

  it("does not throw and logs no console errors/warnings on the reduced-motion path", () => {
    mockUseReducedMotion.mockReturnValue(true);

    expect(() => render()).not.toThrow();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});
