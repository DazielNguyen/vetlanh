/**
 * Unit tests for app/services/community/components/CommunityWaiting.tsx
 *
 * No jsdom (testEnvironment: "node"). Rendered directly as a plain function
 * call (component has no local useState of its own — only the mocked
 * useCommunityOptInOut hook), following the AIRecommendationCard pattern.
 * next/link is mocked as a plain <a href> so hrefs are inspectable.
 */

// ── Mocks (must precede all imports) ──────────────────────────────────────────

jest.mock("@/hooks/useCommunityMatch", () => ({
  useCommunityOptInOut: jest.fn(),
}));

jest.mock("next/link", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ children, href }: { children?: React.ReactNode; href: string }) =>
      React.createElement("a", { href }, children),
  };
});

jest.mock("lucide-react", () => {
  const React = require("react");
  function makeIcon(name: string) {
    return function IconComp(props: Record<string, unknown>) {
      return React.createElement("svg", { "data-icon": name, ...props });
    };
  }
  return { Loader2: makeIcon("Loader2"), MessageSquare: makeIcon("MessageSquare"), LifeBuoy: makeIcon("LifeBuoy") };
});

jest.mock("@/components/ui/card", () => {
  const React = require("react");
  return {
    Card: ({ children, className }: { children?: React.ReactNode; className?: string }) =>
      React.createElement("div", { "data-card": true, className }, children),
    CardContent: ({ children, className }: { children?: React.ReactNode; className?: string }) =>
      React.createElement("div", { "data-card-content": true, className }, children),
  };
});

jest.mock("@/components/ui/button", () => {
  const React = require("react");
  return {
    Button: ({
      children,
      onClick,
      disabled,
      asChild,
      className,
    }: {
      children?: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      asChild?: boolean;
      className?: string;
    }) => {
      // Mirrors Radix Slot's asChild behaviour closely enough for this test:
      // when asChild is set, render children directly (the wrapped <Link>).
      if (asChild) return React.createElement(React.Fragment, null, children);
      return React.createElement("button", { onClick, disabled, className }, children);
    },
  };
});

// ── SUT imports ───────────────────────────────────────────────────────────────

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CommunityWaiting } from "@/app/services/community/components/CommunityWaiting";
import { useCommunityOptInOut } from "@/hooks/useCommunityMatch";

const mockUseCommunityOptInOut = useCommunityOptInOut as jest.Mock;

// ── Helpers ───────────────────────────────────────────────────────────────────

function deepCollectProp(node: React.ReactNode, propName: string): unknown[] {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap((n) => deepCollectProp(n, propName));
  const element = node as React.ReactElement;
  const results: unknown[] = [];
  if (element.props?.[propName] !== undefined) results.push(element.props[propName]);
  if (typeof element.type === "function") {
    try {
      const rendered = (element.type as (p: unknown) => React.ReactNode)(element.props);
      results.push(...deepCollectProp(rendered, propName));
    } catch {
      if (element.props?.children) results.push(...deepCollectProp(element.props.children, propName));
    }
  } else if (element.props?.children) {
    results.push(...deepCollectProp(element.props.children, propName));
  }
  return results;
}

function elementOf(): React.ReactElement {
  return (CommunityWaiting as unknown as () => React.ReactElement)();
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CommunityWaiting", () => {
  beforeEach(() => {
    mockUseCommunityOptInOut.mockReturnValue({ optIn: jest.fn(), optOut: jest.fn(), isPending: false });
  });

  it("renders the waiting-room copy", () => {
    const markup = renderToStaticMarkup(React.createElement(CommunityWaiting));
    expect(markup).toContain("Đang tìm người bạn đồng hành");
  });

  it("links to /services/chat", () => {
    const el = elementOf();
    const hrefs = [...new Set(deepCollectProp(el, "href"))];
    expect(hrefs).toContain("/services/chat");
  });

  it("links to /services/safety-plan", () => {
    const el = elementOf();
    const hrefs = [...new Set(deepCollectProp(el, "href"))];
    expect(hrefs).toContain("/services/safety-plan");
  });

  it("exposes exactly the chat and safety-plan links (no other navigable hrefs)", () => {
    const el = elementOf();
    const hrefs = [...new Set(deepCollectProp(el, "href"))];
    expect(hrefs.sort()).toEqual(["/services/chat", "/services/safety-plan"].sort());
  });

  it("renders an opt-out ('Huỷ tham gia') button", () => {
    const markup = renderToStaticMarkup(React.createElement(CommunityWaiting));
    expect(markup).toContain("Huỷ tham gia");
  });

  it("clicking the opt-out button calls optOut()", () => {
    const optOut = jest.fn();
    mockUseCommunityOptInOut.mockReturnValue({ optIn: jest.fn(), optOut, isPending: false });

    const el = elementOf();
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    expect(onClicks).toHaveLength(1);

    onClicks[0]();
    expect(optOut).toHaveBeenCalledTimes(1);
  });

  it("shows 'Đang huỷ...' and disables the opt-out button while isPending", () => {
    mockUseCommunityOptInOut.mockReturnValue({ optIn: jest.fn(), optOut: jest.fn(), isPending: true });

    const markup = renderToStaticMarkup(React.createElement(CommunityWaiting));
    expect(markup).toContain("Đang huỷ...");
    expect(markup.match(/disabled=""/g)?.length).toBe(1);
  });

  it("does not leak any partner-identifying content (no user id/avatar in the waiting room)", () => {
    const markup = renderToStaticMarkup(React.createElement(CommunityWaiting));
    expect(markup).not.toMatch(/userId|avatarUrl/i);
  });
});
