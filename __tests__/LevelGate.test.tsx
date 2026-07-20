/**
 * Unit tests for components/progression/LevelGate.tsx
 *
 * Rendered with react-dom/server's renderToStaticMarkup (no jsdom in this
 * repo), following the pattern in __tests__/CompanionCharacter.test.tsx.
 * useBadgesData() is mocked directly since it internally uses @tanstack/react-query.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const mockUseBadges = jest.fn();

jest.mock("@/hooks/useBadges", () => ({
  useBadgesData: () => mockUseBadges(),
}));

import { LevelGate } from "@/components/progression/LevelGate";

function renderGate(requiredLevel: number, children: React.ReactNode = "PROTECTED_CONTENT") {
  return renderToStaticMarkup(
    <LevelGate requiredLevel={requiredLevel}>{children}</LevelGate>
  );
}

describe("LevelGate", () => {
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

  it("renders a skeleton while loading, without leaking the children", () => {
    mockUseBadges.mockReturnValue({ level: 0, isLoading: true });

    const markup = renderGate(2);

    expect(markup).not.toContain("PROTECTED_CONTENT");
  });

  it("renders the children directly when level >= requiredLevel", () => {
    mockUseBadges.mockReturnValue({ level: 3, isLoading: false });

    const markup = renderGate(2);

    expect(markup).toContain("PROTECTED_CONTENT");
    expect(markup).not.toContain("Mở khoá ở cấp");
  });

  it("renders the children directly when level === requiredLevel (boundary)", () => {
    mockUseBadges.mockReturnValue({ level: 2, isLoading: false });

    const markup = renderGate(2);

    expect(markup).toContain("PROTECTED_CONTENT");
  });

  it("renders blurred children + lock copy when level < requiredLevel", () => {
    mockUseBadges.mockReturnValue({ level: 1, isLoading: false });

    const markup = renderGate(3);

    // Children are still present in the DOM (blurred, not removed) per the
    // ProContentGate-style shape.
    expect(markup).toContain("PROTECTED_CONTENT");
    expect(markup).toContain("Mở khoá ở cấp 3");
    expect(markup).toContain("Cấp 3");
  });

  it("does not throw for a variety of level/requiredLevel combinations", () => {
    for (const level of [0, 1, 2, 5, 7]) {
      for (const requiredLevel of [1, 2, 4, 7]) {
        mockUseBadges.mockReturnValue({ level, isLoading: false });
        expect(() => renderGate(requiredLevel)).not.toThrow();
      }
    }
  });

  it("applies the provided className to the gated wrapper", () => {
    mockUseBadges.mockReturnValue({ level: 0, isLoading: false });

    const markup = renderToStaticMarkup(
      <LevelGate requiredLevel={5} className="my-gate-class">
        PROTECTED_CONTENT
      </LevelGate>
    );

    expect(markup).toContain("my-gate-class");
  });

  it("logs no console errors/warnings across loading, locked, and unlocked states", () => {
    mockUseBadges.mockReturnValue({ level: 0, isLoading: true });
    renderGate(2);
    mockUseBadges.mockReturnValue({ level: 1, isLoading: false });
    renderGate(2);
    mockUseBadges.mockReturnValue({ level: 3, isLoading: false });
    renderGate(2);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});
