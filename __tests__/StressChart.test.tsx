/**
 * Unit tests for app/services/components/StressChart.tsx
 *
 * StressChart is a "use client" component that wraps recharts.
 * We mock recharts so the tests run in the Node environment without a browser.
 *
 * Key behaviours:
 *  1. Renders "Chưa có dữ liệu tâm trạng" when sparkline is [] or undefined.
 *  2. Renders the chart container (not the empty state) when sparkline has data.
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

// recharts uses browser APIs — stub all exports to simple React pass-throughs.
// We use named function declarations (not arrow functions) so that element.type.name
// is a non-empty string that collectTypes() can detect.
jest.mock("recharts", () => {
  const React = require("react");

  function ResponsiveContainer({ children }: { children?: React.ReactNode }) {
    return React.createElement("recharts-responsivecontainer", null, children);
  }
  function LineChart({ children }: { children?: React.ReactNode }) {
    return React.createElement("recharts-linechart", null, children);
  }
  function Line() { return null; }
  function Tooltip() { return null; }
  function XAxis() { return null; }
  function YAxis() { return null; }

  return { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis };
});

// ── SUT imports ───────────────────────────────────────────────────────────────

import React from "react";
import { StressChart } from "@/app/services/components/StressChart";

// ── Helper ────────────────────────────────────────────────────────────────────

function collectText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");
  const element = node as React.ReactElement;
  if (!element.props) return "";
  return collectText(element.props.children);
}

/**
 * Walk the React element tree and collect all element type names as a flat
 * array — useful for asserting which components were rendered.
 *
 * For host elements (string type) we use the type string directly.
 * For function/class components we use their .name or .displayName.
 * We also shallow-render function components one level deep so we can see
 * what string elements they produce (e.g. the recharts mock wrappers).
 */
function collectTypes(node: React.ReactNode): string[] {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap(collectTypes);
  const element = node as React.ReactElement;

  let name: string;
  if (typeof element.type === "string") {
    name = element.type;
  } else {
    const fn = element.type as ((...args: unknown[]) => React.ReactNode) & {
      displayName?: string;
      name?: string;
    };
    name = fn?.displayName ?? fn?.name ?? "";
  }

  // Shallow-render function components so their inner host element names
  // (produced by the recharts mock) are also collected.
  let childrenToWalk: React.ReactNode = element.props?.children;
  if (typeof element.type === "function") {
    try {
      const rendered = (element.type as (p: unknown) => React.ReactNode)(element.props);
      // Collect the inner tree too
      const innerTypes = collectTypes(rendered);
      return [name, ...innerTypes, ...collectTypes(childrenToWalk)];
    } catch {
      // ignore render errors
    }
  }

  return [name, ...collectTypes(childrenToWalk)];
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("StressChart — empty / undefined sparkline", () => {
  it("renders the empty-state message when sparkline is undefined", () => {
    const el = StressChart({});
    const text = collectText(el);
    expect(text).toContain("Chưa có dữ liệu tâm trạng");
  });

  it("renders the empty-state message when sparkline is an empty array", () => {
    const el = StressChart({ sparkline: [] });
    const text = collectText(el);
    expect(text).toContain("Chưa có dữ liệu tâm trạng");
  });

  it("does NOT render the chart container when sparkline is empty", () => {
    const el = StressChart({ sparkline: [] });
    const types = collectTypes(el);
    // The recharts mock uses lowercase names; a real chart would be 'recharts-responsivecontainer'
    expect(types).not.toContain("recharts-responsivecontainer");
  });

  it("returns a React element (not null) for the empty state", () => {
    const el = StressChart({ sparkline: undefined });
    expect(el).not.toBeNull();
    expect(el).not.toBeUndefined();
  });
});

describe("StressChart — sparkline with data", () => {
  const sparkline = [50, 55, 60, 58, 70, 65, 72];

  it("does NOT render the empty-state message when sparkline has data", () => {
    const el = StressChart({ sparkline });
    const text = collectText(el);
    expect(text).not.toContain("Chưa có dữ liệu tâm trạng");
  });

  it("renders the recharts ResponsiveContainer when sparkline has data", () => {
    const el = StressChart({ sparkline });
    const types = collectTypes(el);
    expect(types).toContain("recharts-responsivecontainer");
  });

  it("renders the recharts LineChart when sparkline has data", () => {
    const el = StressChart({ sparkline });
    const types = collectTypes(el);
    expect(types).toContain("recharts-linechart");
  });

  it("returns a React element (not null) for the chart state", () => {
    const el = StressChart({ sparkline });
    expect(el).not.toBeNull();
  });

  it("works with a single data point (sparkline length 1)", () => {
    const el = StressChart({ sparkline: [42] });
    const text = collectText(el);
    // Should render chart, not empty state
    expect(text).not.toContain("Chưa có dữ liệu tâm trạng");
  });

  it("works with maximum expected data (7 points)", () => {
    const el = StressChart({ sparkline: [10, 20, 30, 40, 50, 60, 70] });
    const types = collectTypes(el);
    expect(types).toContain("recharts-responsivecontainer");
  });
});
