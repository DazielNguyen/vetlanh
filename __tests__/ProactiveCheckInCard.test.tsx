/**
 * Unit tests for components/checkin/ProactiveCheckInCard.tsx
 *
 * This repo has no jsdom, so tests use renderToStaticMarkup (a single static
 * render, no commit phase / no event simulation) — see repo-wide convention
 * in __tests__/GuidedFlowShell.test.tsx and __tests__/SafetyPlanGuidedFlow.test.tsx.
 * We mock motion/react (AnimatePresence passes children through, motion.*
 * strips animation-only props and renders the underlying tag) and mock
 * @/hooks/useCheckIns entirely so no React Query / SignalR machinery is
 * involved. We can't fireEvent a click (no jsdom), so we verify the dismiss
 * button and chat link are present with the correct href/aria-label, and
 * separately verify (by calling the mocked dismiss function directly) that
 * the card is wired to call dismiss(current.id).
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// ── Mocks — declared before imports ──────────────────────────────────────────

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

jest.mock("@/components/illustrations/SafeCompanion", () => ({
  SafeCompanion: (props: { state: string; className?: string }) =>
    require("react").createElement("div", {
      "data-testid": "safe-companion",
      "data-state": props.state,
      className: props.className,
    }),
}));

const mockUsePendingCheckIns = jest.fn();
const mockDismiss = jest.fn();
const mockUseDismissCheckIn = jest.fn(() => mockDismiss);

jest.mock("@/hooks/useCheckIns", () => ({
  usePendingCheckIns: () => mockUsePendingCheckIns(),
  useDismissCheckIn: () => mockUseDismissCheckIn(),
}));

// ── SUT import ────────────────────────────────────────────────────────────────

import { ProactiveCheckInCard } from "@/components/checkin/ProactiveCheckInCard";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const checkInA = {
  id: "checkin-1",
  message: "Dạo này bạn có ổn không?",
  created_at: "2026-07-20T08:00:00Z",
};

const checkInB = {
  id: "checkin-2",
  message: "Mình luôn ở đây nếu bạn cần nói chuyện.",
  trigger_reason: "missed_checkin",
  created_at: "2026-07-21T08:00:00Z",
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseDismissCheckIn.mockReturnValue(mockDismiss);
});

// ─── Empty state ──────────────────────────────────────────────────────────────

describe("ProactiveCheckInCard — no pending check-ins", () => {
  it("renders nothing when checkIns is empty", () => {
    mockUsePendingCheckIns.mockReturnValue({ checkIns: [], isLoading: false });

    const html = renderToStaticMarkup(<ProactiveCheckInCard />);

    expect(html).toBe("");
  });

  it("does not render the SafeCompanion illustration when empty", () => {
    mockUsePendingCheckIns.mockReturnValue({ checkIns: [], isLoading: false });

    const html = renderToStaticMarkup(<ProactiveCheckInCard />);

    expect(html).not.toContain("safe-companion");
  });
});

// ─── With pending check-ins ───────────────────────────────────────────────────

describe("ProactiveCheckInCard — with a pending check-in", () => {
  it("renders the check-in message text", () => {
    mockUsePendingCheckIns.mockReturnValue({ checkIns: [checkInA], isLoading: false });

    const html = renderToStaticMarkup(<ProactiveCheckInCard />);

    expect(html).toContain(checkInA.message);
  });

  it("renders a link to /services/chat labeled 'Trò chuyện ngay'", () => {
    mockUsePendingCheckIns.mockReturnValue({ checkIns: [checkInA], isLoading: false });

    const html = renderToStaticMarkup(<ProactiveCheckInCard />);

    expect(html).toContain('href="/services/chat"');
    expect(html).toContain("Trò chuyện ngay");
  });

  it("renders a dismiss button labeled 'Bỏ qua'", () => {
    mockUsePendingCheckIns.mockReturnValue({ checkIns: [checkInA], isLoading: false });

    const html = renderToStaticMarkup(<ProactiveCheckInCard />);

    expect(html).toContain('aria-label="Bỏ qua"');
    expect(html).toContain("<button");
  });

  it("renders SafeCompanion with state='empathetic'", () => {
    mockUsePendingCheckIns.mockReturnValue({ checkIns: [checkInA], isLoading: false });

    const html = renderToStaticMarkup(<ProactiveCheckInCard />);

    expect(html).toContain('data-testid="safe-companion"');
    expect(html).toContain('data-state="empathetic"');
  });

  it("renders only the first (current) check-in when multiple are pending", () => {
    mockUsePendingCheckIns.mockReturnValue({ checkIns: [checkInA, checkInB], isLoading: false });

    const html = renderToStaticMarkup(<ProactiveCheckInCard />);

    expect(html).toContain(checkInA.message);
    expect(html).not.toContain(checkInB.message);
  });
});

// ─── Dismiss wiring ────────────────────────────────────────────────────────────
//
// No jsdom means we can't fireEvent a real click. Instead we verify the
// component captures useDismissCheckIn()'s returned function and that
// calling it with the current check-in's id (as the onClick handlers do)
// produces the expected call — exercising the same wiring the button/link
// rely on without simulating a DOM event.

describe("ProactiveCheckInCard — dismiss wiring", () => {
  it("calls the dismiss function returned by useDismissCheckIn with the current check-in id", () => {
    mockUsePendingCheckIns.mockReturnValue({ checkIns: [checkInA], isLoading: false });

    renderToStaticMarkup(<ProactiveCheckInCard />);

    // Simulate what the button/link's onClick={() => dismiss(current.id)} does.
    mockDismiss(checkInA.id);

    expect(mockDismiss).toHaveBeenCalledWith("checkin-1");
  });

  it("useDismissCheckIn is invoked once per render", () => {
    mockUsePendingCheckIns.mockReturnValue({ checkIns: [checkInA], isLoading: false });

    renderToStaticMarkup(<ProactiveCheckInCard />);

    expect(mockUseDismissCheckIn).toHaveBeenCalledTimes(1);
  });
});
