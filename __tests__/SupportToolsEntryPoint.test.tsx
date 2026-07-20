/**
 * Unit tests for components/progression/SupportToolsEntryPoint.tsx
 *
 * Rendered with react-dom/server's renderToStaticMarkup (no jsdom in this
 * repo). This component has no level-gating logic and no useBadges()
 * dependency — it always renders the 3 SAFETY_EXEMPT_FEATURES links,
 * initially collapsed behind a closed modal (useState(false) at mount).
 *
 * Because there's no jsdom/testing-library click simulation available,
 * we verify: (a) the always-visible trigger button renders, (b) the modal
 * content (with its next/link entries) is present in the initial
 * server-rendered markup driving useState's initial value of `open=false`
 * — i.e. we assert the modal is NOT shown by default, and dedicated
 * assertions confirm the SAFETY_EXEMPT_FEATURES data itself never changes
 * regardless of any level state (there is none to gate on here).
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { SupportToolsEntryPoint } from "@/components/progression/SupportToolsEntryPoint";
import { SAFETY_EXEMPT_FEATURES } from "@/lib/constants/progression";

function render() {
  return renderToStaticMarkup(<SupportToolsEntryPoint />);
}

describe("SupportToolsEntryPoint", () => {
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

  it("renders without throwing", () => {
    expect(() => render()).not.toThrow();
  });

  it("renders the always-visible trigger button with its accessible label", () => {
    const markup = render();

    expect(markup).toContain('aria-label="Công cụ hỗ trợ"');
  });

  it("does not render the modal content by default (closed on initial mount)", () => {
    const markup = render();

    expect(markup).not.toContain("Công cụ hỗ trợ</h2>");
    for (const feature of SAFETY_EXEMPT_FEATURES) {
      expect(markup).not.toContain(feature.href);
    }
  });

  it("logs no console errors/warnings on initial render", () => {
    render();

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});

describe("SAFETY_EXEMPT_FEATURES contract used by SupportToolsEntryPoint", () => {
  it("always exposes exactly 3 links regardless of any level state (no gating here)", () => {
    expect(SAFETY_EXEMPT_FEATURES).toHaveLength(3);
  });

  it("includes Thought Records, Safety Plan, and PHQ-9 assessment routes", () => {
    const hrefs = SAFETY_EXEMPT_FEATURES.map((f) => f.href);
    expect(hrefs).toContain("/services/thought-records");
    expect(hrefs).toContain("/services/safety-plan");
    expect(hrefs).toContain("/services/assessment");
  });

  it("every feature has a distinct href (no duplicate routes)", () => {
    const hrefs = SAFETY_EXEMPT_FEATURES.map((f) => f.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
