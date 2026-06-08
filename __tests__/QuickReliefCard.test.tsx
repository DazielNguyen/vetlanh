/**
 * Unit tests for app/services/components/QuickReliefCard.tsx
 *
 * QuickReliefCard is a "use client" component that:
 *  - Calls useRecommendedExercises({ limit: 3 })
 *  - Shows 3 Skeleton placeholders while loading
 *  - Returns null on error OR when exercises is empty/undefined after load
 *  - Renders a Card with amber/emerald gradient header and Link tiles when data is available
 *
 * We call the component as a plain function (no jsdom needed) and inspect
 * the React element tree directly, following the StressChart/Phq9ReminderBanner
 * test patterns used in this project.
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mock the hook — each test overrides the return value via mockReturnValue
const mockUseRecommendedExercises = jest.fn();
jest.mock("@/hooks/useExercise", () => ({
  useRecommendedExercises: (...args: unknown[]) =>
    mockUseRecommendedExercises(...args),
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

// lucide-react Zap — render as a plain <svg data-icon="Zap">
jest.mock("lucide-react", () => {
  const React = require("react");
  return {
    Zap: function MockZap(props: Record<string, unknown>) {
      return React.createElement("svg", { "data-icon": "Zap", ...props });
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
import { QuickReliefCard } from "@/app/services/components/QuickReliefCard";
import type { Exercise } from "@/types/exercise";

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

  // Shallow-render function components so their internal DOM nodes are traversed
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
 * For function components, shallow-renders them and walks the rendered output
 * (not the original .props.children, since that is already part of the render).
 * For host elements, walks .props.children directly.
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
    // Shallow-render; the rendered tree already includes children so walk only it
    try {
      const rendered = (element.type as (p: unknown) => React.ReactNode)(element.props);
      results.push(...deepCollectProp(rendered, propName));
    } catch {
      // fall back to children if render throws
      if (element.props?.children) {
        results.push(...deepCollectProp(element.props.children, propName));
      }
    }
  } else if (element.props?.children) {
    // Host element — walk children directly
    results.push(...deepCollectProp(element.props.children, propName));
  }

  return results;
}

/**
 * Count elements in the tree that have a specific prop with a specific value.
 * Shallow-renders function components (their rendered output includes children).
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

/** Build a minimal Exercise fixture with required fields. */
function makeExercise(
  overrides: Partial<Exercise> & { slug: string; title: string; category: string }
): Exercise {
  return {
    description: "test",
    mood_tags: [],
    ...overrides,
  };
}

// ── Shared fixture exercises ───────────────────────────────────────────────────

const THREE_EXERCISES: Exercise[] = [
  makeExercise({ slug: "breath-1", title: "Thở sâu", category: "breathing", duration_minutes: 5 }),
  makeExercise({ slug: "ground-1", title: "Kỹ thuật 5 giác quan", category: "grounding" }),
  makeExercise({ slug: "relax-1", title: "Thư giãn cơ", category: "relaxation", duration_seconds: 120 }),
];

// ── Tests: loading state ───────────────────────────────────────────────────────

describe("QuickReliefCard — loading state", () => {
  beforeEach(() => {
    mockUseRecommendedExercises.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
  });

  it("renders 3 Skeleton placeholders while loading", () => {
    const el = QuickReliefCard({});
    const skeletonCount = deepCountByProp(el, "data-skeleton", "true");
    expect(skeletonCount).toBe(3);
  });

  it("does NOT return null while loading (card is still rendered)", () => {
    const el = QuickReliefCard({});
    expect(el).not.toBeNull();
  });

  it("calls useRecommendedExercises with limit: 3", () => {
    QuickReliefCard({});
    expect(mockUseRecommendedExercises).toHaveBeenCalledWith({ limit: 3 });
  });
});

// ── Tests: error state ─────────────────────────────────────────────────────────

describe("QuickReliefCard — error state", () => {
  beforeEach(() => {
    mockUseRecommendedExercises.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
  });

  it("returns null when isError is true", () => {
    const el = QuickReliefCard({});
    expect(el).toBeNull();
  });

  it("renders nothing at all on error", () => {
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).toBe("");
  });
});

// ── Tests: empty array ─────────────────────────────────────────────────────────

describe("QuickReliefCard — empty exercises array", () => {
  beforeEach(() => {
    mockUseRecommendedExercises.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
  });

  it("returns null when exercises is an empty array", () => {
    const el = QuickReliefCard({});
    expect(el).toBeNull();
  });

  it("renders nothing at all when exercises is empty", () => {
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).toBe("");
  });
});

// ── Tests: data present ────────────────────────────────────────────────────────

describe("QuickReliefCard — data present (3 exercises)", () => {
  beforeEach(() => {
    mockUseRecommendedExercises.mockReturnValue({
      data: THREE_EXERCISES,
      isLoading: false,
      isError: false,
    });
  });

  it("renders 3 link tiles with correct hrefs", () => {
    const el = QuickReliefCard({});
    const hrefs = [...new Set(deepCollectProp(el, "href") as string[])];
    expect(hrefs).toContain("/services/exercises/breath-1");
    expect(hrefs).toContain("/services/exercises/ground-1");
    expect(hrefs).toContain("/services/exercises/relax-1");
    expect(hrefs).toHaveLength(3);
  });

  it("renders the header title 'Giảm căng thẳng ngay'", () => {
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).toContain("Giảm căng thẳng ngay");
  });

  it("renders the Zap icon in the header", () => {
    const el = QuickReliefCard({});
    const zapIcons = deepCountByProp(el, "data-icon", "Zap");
    expect(zapIcons).toBeGreaterThanOrEqual(1);
  });

  it("does NOT return null when data is available", () => {
    const el = QuickReliefCard({});
    expect(el).not.toBeNull();
  });

  it("does NOT render Skeleton placeholders when data is loaded", () => {
    const el = QuickReliefCard({});
    const skeletonCount = deepCountByProp(el, "data-skeleton", "true");
    expect(skeletonCount).toBe(0);
  });

  it("renders each exercise title in the tiles", () => {
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).toContain("Thở sâu");
    expect(text).toContain("Kỹ thuật 5 giác quan");
    expect(text).toContain("Thư giãn cơ");
  });
});

// ── Tests: category emoji mapping ─────────────────────────────────────────────

describe("QuickReliefCard — category emoji mapping", () => {
  const EMOJI_CASES: Array<{ category: string; expectedEmoji: string }> = [
    { category: "breathing", expectedEmoji: "🌬️" },
    { category: "meditation", expectedEmoji: "🧘" },
    { category: "grounding", expectedEmoji: "🌱" },
    { category: "cbt", expectedEmoji: "💭" },
    { category: "relaxation", expectedEmoji: "🌊" },
  ];

  EMOJI_CASES.forEach(({ category, expectedEmoji }) => {
    it(`renders ${expectedEmoji} for category '${category}'`, () => {
      mockUseRecommendedExercises.mockReturnValue({
        data: [makeExercise({ slug: "ex-1", title: "Exercise 1", category })],
        isLoading: false,
        isError: false,
      });
      const el = QuickReliefCard({});
      const text = deepText(el);
      expect(text).toContain(expectedEmoji);
    });
  });

  it("renders fallback emoji ✨ for an unknown category", () => {
    mockUseRecommendedExercises.mockReturnValue({
      data: [makeExercise({ slug: "ex-1", title: "Exercise 1", category: "unknown_xyz" })],
      isLoading: false,
      isError: false,
    });
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).toContain("✨");
  });

  it("renders fallback emoji ✨ for empty string category", () => {
    mockUseRecommendedExercises.mockReturnValue({
      data: [makeExercise({ slug: "ex-1", title: "Exercise 1", category: "" })],
      isLoading: false,
      isError: false,
    });
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).toContain("✨");
  });
});

// ── Tests: duration badge ──────────────────────────────────────────────────────

describe("QuickReliefCard — duration badge", () => {
  it("shows duration_minutes as 'N phút' when duration_minutes is set", () => {
    mockUseRecommendedExercises.mockReturnValue({
      data: [
        makeExercise({
          slug: "ex-1",
          title: "Test",
          category: "breathing",
          duration_minutes: 7,
        }),
      ],
      isLoading: false,
      isError: false,
    });
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).toContain("7 phút");
  });

  it("shows duration_seconds converted to minutes when duration_minutes is absent", () => {
    // 150 seconds = 2.5 minutes → Math.round → 3 phút
    mockUseRecommendedExercises.mockReturnValue({
      data: [
        makeExercise({
          slug: "ex-1",
          title: "Test",
          category: "breathing",
          duration_seconds: 150,
        }),
      ],
      isLoading: false,
      isError: false,
    });
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).toContain("3 phút");
  });

  it("shows duration_seconds converted (120 seconds → 2 phút)", () => {
    mockUseRecommendedExercises.mockReturnValue({
      data: [
        makeExercise({
          slug: "ex-1",
          title: "Test",
          category: "relaxation",
          duration_seconds: 120,
        }),
      ],
      isLoading: false,
      isError: false,
    });
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).toContain("2 phút");
  });

  it("prefers duration_minutes over duration_seconds when both are set", () => {
    mockUseRecommendedExercises.mockReturnValue({
      data: [
        makeExercise({
          slug: "ex-1",
          title: "Test",
          category: "breathing",
          duration_minutes: 5,
          duration_seconds: 360, // 6 min — different value proves minutes wins
        }),
      ],
      isLoading: false,
      isError: false,
    });
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).toContain("5 phút");
    expect(text).not.toContain("6 phút");
  });

  it("does NOT render a duration badge when neither field is set", () => {
    mockUseRecommendedExercises.mockReturnValue({
      data: [makeExercise({ slug: "ex-1", title: "Test", category: "grounding" })],
      isLoading: false,
      isError: false,
    });
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).not.toContain("phút");
    expect(text).not.toContain("⏱");
  });
});

// ── Tests: edge cases ──────────────────────────────────────────────────────────

describe("QuickReliefCard — edge cases", () => {
  it("returns null when data is undefined and not loading", () => {
    mockUseRecommendedExercises.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
    const el = QuickReliefCard({});
    expect(el).toBeNull();
  });

  it("handles a single exercise gracefully", () => {
    mockUseRecommendedExercises.mockReturnValue({
      data: [makeExercise({ slug: "single", title: "Solo Exercise", category: "cbt" })],
      isLoading: false,
      isError: false,
    });
    const el = QuickReliefCard({});
    expect(el).not.toBeNull();
    const text = deepText(el);
    expect(text).toContain("Solo Exercise");
    expect(text).toContain("💭"); // cbt emoji
  });

  it("link href uses slug not title", () => {
    mockUseRecommendedExercises.mockReturnValue({
      data: [
        makeExercise({ slug: "my-slug-123", title: "Some Title", category: "meditation" }),
      ],
      isLoading: false,
      isError: false,
    });
    const el = QuickReliefCard({});
    const hrefs = deepCollectProp(el, "href") as string[];
    expect(hrefs).toContain("/services/exercises/my-slug-123");
    hrefs.forEach((href) => {
      expect(href).not.toContain("Some Title");
    });
  });

  it("renders header when loading (even without data)", () => {
    mockUseRecommendedExercises.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    const el = QuickReliefCard({});
    const text = deepText(el);
    expect(text).toContain("Giảm căng thẳng ngay");
  });
});
