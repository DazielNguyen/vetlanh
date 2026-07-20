/**
 * Unit tests for components/progression/XpLevelIndicator.tsx
 *
 * Rendered with react-dom/server's renderToStaticMarkup (no jsdom in this
 * repo). useBadgesData() is mocked directly.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const mockUseBadges = jest.fn();

jest.mock("@/hooks/useBadges", () => ({
  useBadgesData: () => mockUseBadges(),
}));

import { XpLevelIndicator } from "@/components/progression/XpLevelIndicator";

function render() {
  return renderToStaticMarkup(<XpLevelIndicator />);
}

describe("XpLevelIndicator", () => {
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

  it("renders nothing while loading", () => {
    mockUseBadges.mockReturnValue({ xp: 0, level: 1, xpToNextLevel: 50, isLoading: true });

    const markup = render();

    expect(markup).toBe("");
  });

  it("renders the current level label", () => {
    mockUseBadges.mockReturnValue({ xp: 60, level: 2, xpToNextLevel: 60, isLoading: false });

    const markup = render();

    expect(markup).toContain("Cấp 2");
  });

  it("renders the XP-to-next-level copy for a non-max level", () => {
    mockUseBadges.mockReturnValue({ xp: 60, level: 2, xpToNextLevel: 60, isLoading: false });

    const markup = render();

    expect(markup).toContain("60 XP nữa để lên cấp 3");
  });

  it("renders the max-level copy instead of XP-to-next when level >= MAX_LEVEL (7)", () => {
    mockUseBadges.mockReturnValue({ xp: 800, level: 7, xpToNextLevel: 0, isLoading: false });

    const markup = render();

    expect(markup).toContain("Đã đạt cấp tối đa");
    expect(markup).not.toContain("XP nữa để lên cấp");
  });

  it("clamps the progress bar width to 100% at max level", () => {
    mockUseBadges.mockReturnValue({ xp: 5000, level: 7, xpToNextLevel: 0, isLoading: false });

    const markup = render();

    // Radix Progress renders its fill via translateX(-(100 - value)%)
    expect(markup).toContain("translateX(-0%)");
  });

  it("computes an intermediate progress-bar width between the current and next threshold", () => {
    // Level 2 spans xp 50..120. xp=85 is roughly halfway (50%).
    mockUseBadges.mockReturnValue({ xp: 85, level: 2, xpToNextLevel: 35, isLoading: false });

    const markup = render();

    // (85-50)/(120-50) = 0.5 -> 50% -> translateX(-50%)
    expect(markup).toContain("translateX(-50%)");
  });

  it("renders 0% width at the very start of a level", () => {
    mockUseBadges.mockReturnValue({ xp: 50, level: 2, xpToNextLevel: 70, isLoading: false });

    const markup = render();

    expect(markup).toContain("translateX(-100%)");
  });

  it("does not throw for every level 1..7", () => {
    for (let level = 1; level <= 7; level++) {
      mockUseBadges.mockReturnValue({ xp: 0, level, xpToNextLevel: 10, isLoading: false });
      expect(() => render()).not.toThrow();
    }
  });

  it("logs no console errors/warnings across loading/mid-level/max-level states", () => {
    mockUseBadges.mockReturnValue({ xp: 0, level: 1, xpToNextLevel: 50, isLoading: true });
    render();
    mockUseBadges.mockReturnValue({ xp: 60, level: 2, xpToNextLevel: 60, isLoading: false });
    render();
    mockUseBadges.mockReturnValue({ xp: 800, level: 7, xpToNextLevel: 0, isLoading: false });
    render();

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});
