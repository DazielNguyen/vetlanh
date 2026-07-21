/**
 * Unit tests for app/services/community/components/CommunityOptIn.tsx
 *
 * No jsdom (testEnvironment: "node"). Rendered with react-dom/server's
 * renderToStaticMarkup, using the deepText/deepCollectProp helper pattern
 * from __tests__/AIRecommendationCard.test.tsx.
 *
 * The two-step confirm (button -> confirm/cancel pair) is driven by local
 * useState, so we mock React's useState with an injectable sequence
 * (mirroring __tests__/exerciseSlugPage.phase3.test.tsx) to render the
 * "confirming" branch and exercise its onClick handlers directly.
 */

// ── Mocks (must precede all imports) ──────────────────────────────────────────

jest.mock("@/hooks/useCommunityMatch", () => ({
  useCommunityOptInOut: jest.fn(),
}));

jest.mock("lucide-react", () => {
  const React = require("react");
  function makeIcon(name: string) {
    return function IconComp(props: Record<string, unknown>) {
      return React.createElement("svg", { "data-icon": name, ...props });
    };
  }
  return {
    Users: makeIcon("Users"),
    ShieldCheck: makeIcon("ShieldCheck"),
    EyeOff: makeIcon("EyeOff"),
    Flag: makeIcon("Flag"),
  };
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
      variant,
      className,
    }: {
      children?: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      variant?: string;
      className?: string;
    }) => React.createElement("button", { onClick, disabled, "data-variant": variant, className }, children),
  };
});

// Injectable useState sequence, mirroring exerciseSlugPage.phase3.test.tsx.
type StatePair<T> = [T, jest.Mock];
let stateSequence: StatePair<unknown>[] = [];
let stateCallIndex = 0;

jest.mock("react", () => {
  const actual = jest.requireActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: jest.fn((initial: unknown) => {
      const pair = stateSequence[stateCallIndex] ?? [initial, jest.fn()];
      stateCallIndex += 1;
      return pair;
    }),
  };
});

// ── SUT imports ───────────────────────────────────────────────────────────────

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CommunityOptIn } from "@/app/services/community/components/CommunityOptIn";
import { useCommunityOptInOut } from "@/hooks/useCommunityMatch";

const mockUseCommunityOptInOut = useCommunityOptInOut as jest.Mock;

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function renderWithState(states: StatePair<unknown>[]) {
  stateSequence = states;
  stateCallIndex = 0;
  const markup = renderToStaticMarkup(React.createElement(CommunityOptIn));
  return markup;
}

// getting the raw element tree (not markup) for onClick inspection
function elementWithState(states: StatePair<unknown>[]) {
  stateSequence = states;
  stateCallIndex = 0;
  return (CommunityOptIn as unknown as () => React.ReactElement)();
}

beforeEach(() => {
  jest.clearAllMocks();
  stateSequence = [];
  stateCallIndex = 0;
});

// ─── Step 1 — initial (not confirming) state ─────────────────────────────────

describe("CommunityOptIn — initial state (confirming=false)", () => {
  beforeEach(() => {
    mockUseCommunityOptInOut.mockReturnValue({ optIn: jest.fn(), optOut: jest.fn(), isPending: false });
  });

  it("renders the primary 'Tham gia cộng đồng' button, not the confirm/cancel pair", () => {
    const markup = renderWithState([[false, jest.fn()]]);
    expect(markup).toContain("Tham gia cộng đồng");
    expect(markup).not.toContain("Đồng ý, tham gia");
  });

  it("explains anonymization, exit-anytime, and report/block in the explainer copy", () => {
    const markup = renderWithState([[false, jest.fn()]]);
    expect(markup).toContain("ẩn danh");
    expect(markup).toContain("thoát");
    expect(markup).toContain("báo cáo hoặc chặn");
  });

  it("clicking the primary button calls setConfirming(true)", () => {
    const setConfirming = jest.fn();
    const el = elementWithState([[false, setConfirming]]);
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    // The only onClick present in this branch is the primary button's.
    expect(onClicks).toHaveLength(1);
    onClicks[0]();
    expect(setConfirming).toHaveBeenCalledWith(true);
  });

  it("does not call optIn on initial render", () => {
    const optIn = jest.fn();
    mockUseCommunityOptInOut.mockReturnValue({ optIn, optOut: jest.fn(), isPending: false });
    renderWithState([[false, jest.fn()]]);
    expect(optIn).not.toHaveBeenCalled();
  });
});

// ─── Step 2 — confirming state ────────────────────────────────────────────────

describe("CommunityOptIn — confirming state (confirming=true)", () => {
  beforeEach(() => {
    mockUseCommunityOptInOut.mockReturnValue({ optIn: jest.fn(), optOut: jest.fn(), isPending: false });
  });

  it("renders the confirm/cancel pair with an explicit confirmation question, not the primary button", () => {
    const markup = renderWithState([[true, jest.fn()]]);
    expect(markup).toContain("Xác nhận bạn đồng ý được ghép ẩn danh");
    expect(markup).toContain("Đồng ý, tham gia");
    expect(markup).toContain("Huỷ");
  });

  it("clicking 'Huỷ' calls setConfirming(false), not optIn", () => {
    const setConfirming = jest.fn();
    const optIn = jest.fn();
    mockUseCommunityOptInOut.mockReturnValue({ optIn, optOut: jest.fn(), isPending: false });

    const el = elementWithState([[true, setConfirming]]);
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    expect(onClicks).toHaveLength(2); // Huỷ, Đồng ý

    onClicks[0](); // Huỷ
    expect(setConfirming).toHaveBeenCalledWith(false);
    expect(optIn).not.toHaveBeenCalled();
  });

  it("clicking 'Đồng ý, tham gia' calls optIn()", () => {
    const optIn = jest.fn();
    mockUseCommunityOptInOut.mockReturnValue({ optIn, optOut: jest.fn(), isPending: false });

    const el = elementWithState([[true, jest.fn()]]);
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;

    onClicks[1](); // Đồng ý, tham gia
    expect(optIn).toHaveBeenCalledTimes(1);
  });

  it("disables both confirm/cancel buttons while isPending", () => {
    mockUseCommunityOptInOut.mockReturnValue({ optIn: jest.fn(), optOut: jest.fn(), isPending: true });

    const markup = renderWithState([[true, jest.fn()]]);
    // Both the Huỷ and Đồng ý buttons render a `disabled` attribute.
    expect(markup.match(/disabled=""/g)?.length).toBe(2);
  });

  it("does not disable the confirm/cancel buttons when not pending", () => {
    mockUseCommunityOptInOut.mockReturnValue({ optIn: jest.fn(), optOut: jest.fn(), isPending: false });

    const markup = renderWithState([[true, jest.fn()]]);
    expect(markup.match(/disabled=""/g)).toBeNull();
  });

  it("shows 'Đang xử lý...' label while isPending", () => {
    mockUseCommunityOptInOut.mockReturnValue({ optIn: jest.fn(), optOut: jest.fn(), isPending: true });

    const markup = renderWithState([[true, jest.fn()]]);
    expect(markup).toContain("Đang xử lý...");
  });
});
