/**
 * Unit tests for app/services/components/AIRecommendationCard.tsx
 *
 * AIRecommendationCard is a "use client" component that:
 *  - Calls usePersonalizedRecommendation()
 *  - Shows Skeleton placeholders while isLoading
 *  - Returns null on isError OR when recommendation is falsy (graceful
 *    fallback for when the BE hasn't derived a personalized recommendation
 *    yet — no broken/empty card should ever render)
 *  - Renders a Card with title, rationale, and a tap-to-navigate Link
 *    wrapping the whole content (including SafeCompanion) when data is
 *    available
 *
 * We call the component as a plain function (no jsdom needed) and inspect
 * the React element tree directly via shallow-render tree-walking helpers,
 * following the QuickReliefCard test pattern used in this project.
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockUsePersonalizedRecommendation = jest.fn();
jest.mock("@/hooks/useRecommendation", () => ({
  usePersonalizedRecommendation: (...args: unknown[]) =>
    mockUsePersonalizedRecommendation(...args),
}));

// next/link — render as a plain <a> so href is inspectable
jest.mock("next/link", () => {
  const React = require("react");
  return function MockLink({
    href,
    children,
    className,
  }: {
    href: string;
    children?: React.ReactNode;
    className?: string;
  }) {
    return React.createElement("a", { href, className }, children);
  };
});

// Skeleton — render as a plain <div data-skeleton="true">
jest.mock("@/components/ui/skeleton", () => {
  const React = require("react");
  return {
    Skeleton: function MockSkeleton({ className }: { className?: string }) {
      return React.createElement("div", { "data-skeleton": "true", className });
    },
  };
});

// SafeCompanion — render as a plain <div data-testid="safe-companion">
jest.mock("@/components/illustrations/SafeCompanion", () => {
  const React = require("react");
  return {
    SafeCompanion: function MockSafeCompanion(props: { state?: string; className?: string }) {
      return React.createElement("div", {
        "data-testid": "safe-companion",
        "data-state": props.state,
        className: props.className,
      });
    },
  };
});

// lucide-react Sparkles — render as a plain <svg data-icon="Sparkles">
jest.mock("lucide-react", () => {
  const React = require("react");
  return {
    Sparkles: function MockSparkles(props: Record<string, unknown>) {
      return React.createElement("svg", { "data-icon": "Sparkles", ...props });
    },
  };
});

// Card components — thin pass-through wrappers
jest.mock("@/components/ui/card", () => {
  const React = require("react");

  function Card({ children, className }: { children?: React.ReactNode; className?: string }) {
    return React.createElement("div", { "data-card": "true", className }, children);
  }
  function CardHeader({ children, className }: { children?: React.ReactNode; className?: string }) {
    return React.createElement("div", { "data-card-header": "true", className }, children);
  }
  function CardTitle({ children, className }: { children?: React.ReactNode; className?: string }) {
    return React.createElement("div", { "data-card-title": "true", className }, children);
  }
  function CardContent({ children, className }: { children?: React.ReactNode; className?: string }) {
    return React.createElement("div", { "data-card-content": "true", className }, children);
  }

  return { Card, CardHeader, CardTitle, CardContent };
});

// ── SUT imports ───────────────────────────────────────────────────────────────

import React from "react";
import { AIRecommendationCard } from "@/app/services/components/AIRecommendationCard";
import type { DashboardRecommendation } from "@/types/recommendation";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Recursively traverse the React element tree, shallow-rendering function
 * components one level deep so their output is also inspected.
 * Returns all text content concatenated.
 */
function deepText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(deepText).join("");
  const element = node as React.ReactElement;

  if (typeof element.type === "function") {
    try {
      const rendered = (element.type as (p: unknown) => React.ReactNode)(element.props);
      return deepText(rendered);
    } catch {
      // fall back to children
    }
  }

  return deepText(element.props?.children);
}

/**
 * Recursively collect all values of a given prop from the element tree.
 */
function deepCollectProp(node: React.ReactNode, propName: string): unknown[] {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap((n) => deepCollectProp(n, propName));
  const element = node as React.ReactElement;
  const results: unknown[] = [];

  if (element.props?.[propName] !== undefined) {
    results.push(element.props[propName]);
  }

  if (typeof element.type === "function") {
    try {
      const rendered = (element.type as (p: unknown) => React.ReactNode)(element.props);
      results.push(...deepCollectProp(rendered, propName));
    } catch {
      if (element.props?.children) {
        results.push(...deepCollectProp(element.props.children, propName));
      }
    }
  } else if (element.props?.children) {
    results.push(...deepCollectProp(element.props.children, propName));
  }

  return results;
}

/**
 * Count elements in the tree that have a specific prop with a specific value.
 */
function deepCountByProp(node: React.ReactNode, propName: string, propValue: unknown): number {
  if (!node || typeof node !== "object") return 0;
  if (Array.isArray(node)) {
    return node.reduce<number>((acc, n) => acc + deepCountByProp(n, propName, propValue), 0);
  }
  const element = node as React.ReactElement;
  let count = element.props?.[propName] === propValue ? 1 : 0;

  if (typeof element.type === "function") {
    try {
      const rendered = (element.type as (p: unknown) => React.ReactNode)(element.props);
      count += deepCountByProp(rendered, propName, propValue);
    } catch {
      if (element.props?.children) {
        count += deepCountByProp(element.props.children, propName, propValue);
      }
    }
  } else if (element.props?.children) {
    count += deepCountByProp(element.props.children, propName, propValue);
  }

  return count;
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockRecommendation: DashboardRecommendation = {
  title: "Thử bài tập thở 4-7-8",
  rationale: "Dựa trên nhật ký gần đây của bạn, bài tập này có thể giúp bạn thư giãn.",
  url: "/services/breathing",
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Tests: loading state ───────────────────────────────────────────────────────

describe("AIRecommendationCard — loading state", () => {
  beforeEach(() => {
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
  });

  it("renders Skeleton placeholders while loading", () => {
    const el = AIRecommendationCard({});
    const skeletonCount = deepCountByProp(el, "data-skeleton", "true");
    expect(skeletonCount).toBeGreaterThanOrEqual(1);
  });

  it("does NOT return null while loading (card shell is still rendered)", () => {
    const el = AIRecommendationCard({});
    expect(el).not.toBeNull();
  });

  it("does not render a Link (no navigable content) while loading", () => {
    const el = AIRecommendationCard({});
    const hrefs = deepCollectProp(el, "href");
    expect(hrefs).toHaveLength(0);
  });
});

// ── Tests: error state — graceful fallback ─────────────────────────────────────

describe("AIRecommendationCard — error state", () => {
  beforeEach(() => {
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
  });

  it("returns null when isError is true", () => {
    const el = AIRecommendationCard({});
    expect(el).toBeNull();
  });

  it("renders nothing at all on error (no broken/empty card)", () => {
    const el = AIRecommendationCard({});
    const text = deepText(el);
    expect(text).toBe("");
  });
});

// ── Tests: no recommendation yet — graceful fallback ────────────────────────────

describe("AIRecommendationCard — recommendation is null/falsy", () => {
  it("returns null when recommendation data is null", () => {
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    const el = AIRecommendationCard({});
    expect(el).toBeNull();
  });

  it("returns null when recommendation data is undefined", () => {
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
    const el = AIRecommendationCard({});
    expect(el).toBeNull();
  });

  it("renders nothing at all when there is no recommendation", () => {
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });
    const el = AIRecommendationCard({});
    const text = deepText(el);
    expect(text).toBe("");
  });
});

// ── Tests: data present ────────────────────────────────────────────────────────

describe("AIRecommendationCard — recommendation present", () => {
  beforeEach(() => {
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: mockRecommendation,
      isLoading: false,
      isError: false,
    });
  });

  it("does NOT return null when data is available", () => {
    const el = AIRecommendationCard({});
    expect(el).not.toBeNull();
  });

  it("renders the recommendation title", () => {
    const el = AIRecommendationCard({});
    const text = deepText(el);
    expect(text).toContain(mockRecommendation.title);
  });

  it("renders the recommendation rationale", () => {
    const el = AIRecommendationCard({});
    const text = deepText(el);
    expect(text).toContain(mockRecommendation.rationale);
  });

  it("renders a Link with href equal to recommendation.url", () => {
    const el = AIRecommendationCard({});
    const hrefs = [...new Set(deepCollectProp(el, "href") as string[])];
    expect(hrefs).toContain(mockRecommendation.url);
    expect(hrefs).toHaveLength(1);
  });

  it("renders SafeCompanion with state='happy' inside the link", () => {
    const el = AIRecommendationCard({});
    const states = deepCollectProp(el, "data-state");
    expect(states).toContain("happy");
  });

  it("does NOT render Skeleton placeholders when data is loaded", () => {
    const el = AIRecommendationCard({});
    const skeletonCount = deepCountByProp(el, "data-skeleton", "true");
    expect(skeletonCount).toBe(0);
  });

  it("renders the Sparkles icon in the header", () => {
    const el = AIRecommendationCard({});
    const sparklesCount = deepCountByProp(el, "data-icon", "Sparkles");
    expect(sparklesCount).toBeGreaterThanOrEqual(1);
  });

  it("renders the section heading 'Gợi ý riêng cho bạn'", () => {
    const el = AIRecommendationCard({});
    const text = deepText(el);
    expect(text).toContain("Gợi ý riêng cho bạn");
  });
});

// ── Tests: edge cases ──────────────────────────────────────────────────────────

describe("AIRecommendationCard — unsafe url", () => {
  it.each([
    ["javascript: scheme", "javascript:alert(1)"],
    ["data: scheme", "data:text/html,<script>alert(1)</script>"],
    ["protocol-relative url", "//evil.example.com/phish"],
    ["absolute external url", "https://evil.example.com/phish"],
  ])("returns null when recommendation.url is a %s", (_label, url) => {
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: { ...mockRecommendation, url },
      isLoading: false,
      isError: false,
    });
    const el = AIRecommendationCard({});
    expect(el).toBeNull();
  });

  it("still renders when recommendation.url is a normal relative path", () => {
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: { ...mockRecommendation, url: "/services/exercises/box-breathing" },
      isLoading: false,
      isError: false,
    });
    const el = AIRecommendationCard({});
    expect(el).not.toBeNull();
  });
});

describe("AIRecommendationCard — edge cases", () => {
  it("treats an empty-string title/rationale as falsy content but still renders shell if recommendation object exists", () => {
    // recommendation itself is a truthy object even if fields are empty strings —
    // component only null-checks the recommendation object, not its fields.
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: { title: "", rationale: "", url: "/services" },
      isLoading: false,
      isError: false,
    });
    const el = AIRecommendationCard({});
    expect(el).not.toBeNull();
    const hrefs = deepCollectProp(el, "href") as string[];
    expect(hrefs).toContain("/services");
  });

  it("handles a long title/rationale without throwing", () => {
    const longRecommendation: DashboardRecommendation = {
      title: "A".repeat(200),
      rationale: "B".repeat(500),
      url: "/services/long",
    };
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: longRecommendation,
      isLoading: false,
      isError: false,
    });
    expect(() => AIRecommendationCard({})).not.toThrow();
    const el = AIRecommendationCard({});
    const text = deepText(el);
    expect(text).toContain(longRecommendation.title);
  });

  it("isError takes precedence over a present recommendation (never renders stale data on error)", () => {
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: mockRecommendation,
      isLoading: false,
      isError: true,
    });
    const el = AIRecommendationCard({});
    expect(el).toBeNull();
  });

  it("isLoading takes precedence over isError/data (shows skeleton first)", () => {
    mockUsePersonalizedRecommendation.mockReturnValue({
      data: mockRecommendation,
      isLoading: true,
      isError: false,
    });
    const el = AIRecommendationCard({});
    const skeletonCount = deepCountByProp(el, "data-skeleton", "true");
    expect(skeletonCount).toBeGreaterThanOrEqual(1);
    const hrefs = deepCollectProp(el, "href");
    expect(hrefs).toHaveLength(0);
  });
});
