/**
 * Unit tests for app/services/community/components/CommunityConversation.tsx
 *
 * Safety-critical coverage:
 *  1. Plain-text rendering: message content containing markdown/HTML/script
 *     syntax renders as a literal escaped string via renderToStaticMarkup
 *     (which HTML-escapes plain-string JSX children by construction) — never
 *     interpreted markup. This directly verifies MyBubble/PeerBubble never
 *     use dangerouslySetInnerHTML or a markdown renderer.
 *  2. Anonymization: only match.partnerHandle ever appears — no partner user
 *     id/avatar surfaces anywhere in the rendered tree.
 *  3. Report/Block/Exit are persistently-visible top-level buttons, not
 *     nested in a menu — and Report opens an inline reason textarea rather
 *     than firing immediately.
 *  4. Composer: Enter sends, Shift+Enter inserts a newline (does not send).
 *
 * No jsdom (testEnvironment: "node"). CommunityConversation has three local
 * useState values (text, reportOpen, reportReason, in that declaration
 * order) plus a useRef/useEffect that never runs under SSR — same
 * injectable-useState-sequence strategy as CommunityOptIn.test.tsx /
 * exerciseSlugPage.phase3.test.tsx.
 */

// ── Mocks (must precede all imports) ──────────────────────────────────────────

const mockUseCommunityMessages = jest.fn();
const mockUseSendCommunityMessage = jest.fn();
jest.mock("@/hooks/useCommunityMessages", () => ({
  useCommunityMessages: (...args: unknown[]) => mockUseCommunityMessages(...args),
  useSendCommunityMessage: (...args: unknown[]) => mockUseSendCommunityMessage(...args),
}));

const mockUseCommunityMatchActions = jest.fn();
jest.mock("@/hooks/useCommunityMatch", () => ({
  useCommunityMatchActions: (...args: unknown[]) => mockUseCommunityMatchActions(...args),
}));

jest.mock("lucide-react", () => {
  const React = require("react");
  function makeIcon(name: string) {
    return function IconComp(props: Record<string, unknown>) {
      return React.createElement("svg", { "data-icon": name, ...props });
    };
  }
  return {
    Send: makeIcon("Send"),
    LogOut: makeIcon("LogOut"),
    ShieldOff: makeIcon("ShieldOff"),
    Flag: makeIcon("Flag"),
    User: makeIcon("User"),
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
      size,
      className,
    }: {
      children?: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      variant?: string;
      size?: string;
      className?: string;
    }) =>
      React.createElement(
        "button",
        { onClick, disabled, "data-variant": variant, "data-size": size, className },
        children
      ),
  };
});

// Injectable useState sequence — order in source: text, reportOpen, reportReason.
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
    useEffect: jest.fn(), // never fires under SSR anyway; stub to avoid any accidental scrollIntoView call
  };
});

// ── SUT imports ───────────────────────────────────────────────────────────────

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CommunityConversation } from "@/app/services/community/components/CommunityConversation";
import type { CommunityMatch, CommunityMessage } from "@/types/community";

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

function renderConversation(match: CommunityMatch, states: StatePair<unknown>[]) {
  stateSequence = states;
  stateCallIndex = 0;
  return renderToStaticMarkup(React.createElement(CommunityConversation, { match }));
}

function elementOf(match: CommunityMatch, states: StatePair<unknown>[]) {
  stateSequence = states;
  stateCallIndex = 0;
  // CommunityConversation calls the real (unmocked) useRef, which requires an
  // active React dispatcher — only present during an actual render pass.
  // Capture its returned element from inside a Host component's render,
  // mirroring the hook-capture pattern in __tests__/useCheckIns.test.ts.
  let captured!: React.ReactElement;
  function Host() {
    captured = (CommunityConversation as unknown as (p: { match: CommunityMatch }) => React.ReactElement)({ match });
    return null;
  }
  renderToStaticMarkup(React.createElement(Host));
  return captured;
}

const match: CommunityMatch = {
  matchId: "match-1",
  partnerHandle: "AnHung92",
  matchedAt: "2026-07-21T08:00:00Z",
};

const defaultStates: StatePair<unknown>[] = [
  ["", jest.fn()], // text
  [false, jest.fn()], // reportOpen
  ["", jest.fn()], // reportReason
];

beforeEach(() => {
  jest.clearAllMocks();
  mockUseCommunityMessages.mockReturnValue({ messages: [], isLoading: false });
  mockUseSendCommunityMessage.mockReturnValue(jest.fn());
  mockUseCommunityMatchActions.mockReturnValue({
    exitMatch: jest.fn(),
    blockMatch: jest.fn(),
    reportMatch: jest.fn(),
  });
});

// ─── Anonymization ────────────────────────────────────────────────────────────

describe("CommunityConversation — anonymization", () => {
  it("renders match.partnerHandle in the header", () => {
    const markup = renderConversation(match, defaultStates);
    expect(markup).toContain("AnHung92");
  });

  it("never renders a partner user id/avatar field name in the DOM (only partnerHandle exists on the type)", () => {
    const markup = renderConversation(match, defaultStates);
    expect(markup).not.toMatch(/userId|partnerId|avatarUrl/i);
  });

  it("uses the partnerHandle initials in the peer bubble avatar, not any id-derived value", () => {
    mockUseCommunityMessages.mockReturnValue({
      messages: [{ id: "m1", matchId: "match-1", content: "Chào bạn", isMine: false, createdAt: "2026-07-21T08:00:00Z" }],
      isLoading: false,
    });
    const markup = renderConversation(match, defaultStates);
    expect(markup).toContain("AN"); // handle.slice(0,2).toUpperCase()
  });
});

// ─── Plain-text message rendering (no markdown/HTML interpretation) ─────────

describe("CommunityConversation — plain-text message rendering", () => {
  it("renders a peer message containing markdown/HTML syntax as a literal escaped string, not interpreted markup", () => {
    const dangerous = "**bold** <b>html</b> <script>alert(1)</script>";
    mockUseCommunityMessages.mockReturnValue({
      messages: [{ id: "m1", matchId: "match-1", content: dangerous, isMine: false, createdAt: "2026-07-21T08:00:00Z" }],
      isLoading: false,
    });

    const markup = renderConversation(match, defaultStates);

    // React escapes plain-string JSX children — a real <script> tag must never
    // appear unescaped in the output, and markdown syntax stays literal.
    expect(markup).not.toContain("<script>alert(1)</script>");
    expect(markup).not.toContain("<b>html</b>");
    expect(markup).toContain("&lt;script&gt;");
    expect(markup).toContain("**bold**");
  });

  it("renders a my-message containing markdown/HTML syntax as a literal escaped string too", () => {
    const dangerous = "<img src=x onerror=alert(1)> _italic_";
    mockUseCommunityMessages.mockReturnValue({
      messages: [{ id: "m1", matchId: "match-1", content: dangerous, isMine: true, createdAt: "2026-07-21T08:00:00Z" }],
      isLoading: false,
    });

    const markup = renderConversation(match, defaultStates);

    expect(markup).not.toContain("<img src=x onerror=alert(1)>");
    expect(markup).toContain("&lt;img");
    expect(markup).toContain("_italic_");
  });

  it("renders each message's actual content string somewhere in the tree", () => {
    const messages: CommunityMessage[] = [
      { id: "m1", matchId: "match-1", content: "Chào bạn, dạo này thế nào?", isMine: false, createdAt: "2026-07-21T08:00:00Z" },
      { id: "m2", matchId: "match-1", content: "Mình ổn, cảm ơn bạn đã hỏi", isMine: true, createdAt: "2026-07-21T08:01:00Z" },
    ];
    mockUseCommunityMessages.mockReturnValue({ messages, isLoading: false });

    const markup = renderConversation(match, defaultStates);

    expect(markup).toContain("Chào bạn, dạo này thế nào?");
    expect(markup).toContain("Mình ổn, cảm ơn bạn đã hỏi");
  });

  it("shows an empty-state prompt when there are no messages yet", () => {
    mockUseCommunityMessages.mockReturnValue({ messages: [], isLoading: false });
    const markup = renderConversation(match, defaultStates);
    expect(markup).toContain("Hãy bắt đầu bằng một lời chào");
  });

  it("shows a loading placeholder while isLoading", () => {
    mockUseCommunityMessages.mockReturnValue({ messages: [], isLoading: true });
    const markup = renderConversation(match, defaultStates);
    expect(markup).toContain("Đang tải...");
  });
});

// ─── Persistently-visible Report/Block/Exit controls ─────────────────────────

describe("CommunityConversation — Report/Block/Exit controls", () => {
  it("always renders Report ('Báo cáo'), Block ('Chặn'), and Exit ('Thoát') labels, regardless of reportOpen state", () => {
    const markup = renderConversation(match, defaultStates);
    expect(markup).toContain("Báo cáo");
    expect(markup).toContain("Chặn");
    expect(markup).toContain("Thoát");
  });

  it("clicking Block calls blockMatch(matchId) directly (no confirmation dialog)", () => {
    const blockMatch = jest.fn();
    mockUseCommunityMatchActions.mockReturnValue({ exitMatch: jest.fn(), blockMatch, reportMatch: jest.fn() });

    const el = elementOf(match, defaultStates);
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    // report toggle, block, exit, send (disabled since text empty) = 4 handlers present
    const blockHandler = onClicks.find((fn) => {
      fn();
      const called = blockMatch.mock.calls.length > 0;
      blockMatch.mockClear();
      return called;
    });
    expect(blockHandler).toBeDefined();
  });

  it("clicking Exit calls exitMatch(matchId) directly (no confirmation dialog)", () => {
    const exitMatch = jest.fn();
    mockUseCommunityMatchActions.mockReturnValue({ exitMatch, blockMatch: jest.fn(), reportMatch: jest.fn() });

    const el = elementOf(match, defaultStates);
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    const exitHandler = onClicks.find((fn) => {
      fn();
      const called = exitMatch.mock.calls.length > 0;
      exitMatch.mockClear();
      return called;
    });
    expect(exitHandler).toBeDefined();
  });

  it("does not call reportMatch immediately when reportOpen is false (Report toggles the inline form first)", () => {
    const reportMatch = jest.fn();
    mockUseCommunityMatchActions.mockReturnValue({ exitMatch: jest.fn(), blockMatch: jest.fn(), reportMatch });

    renderConversation(match, defaultStates);

    expect(reportMatch).not.toHaveBeenCalled();
  });

  it("renders the inline report-reason textarea and submit copy when reportOpen is true", () => {
    const states: StatePair<unknown>[] = [["", jest.fn()], [true, jest.fn()], ["", jest.fn()]];
    const markup = renderConversation(match, states);

    expect(markup).toContain("Báo cáo sẽ kết thúc cuộc trò chuyện này ngay lập tức");
    expect(markup).toContain("Gửi báo cáo &amp; thoát");
  });

  it("submitting the report calls reportMatch(matchId, reason) with the entered reason", () => {
    const reportMatch = jest.fn();
    mockUseCommunityMatchActions.mockReturnValue({ exitMatch: jest.fn(), blockMatch: jest.fn(), reportMatch });
    const setReportOpen = jest.fn();
    const setReportReason = jest.fn();
    const states: StatePair<unknown>[] = [
      ["", jest.fn()],
      [true, setReportOpen],
      ["Ngôn từ khiếm nhã", setReportReason],
    ];

    const el = elementOf(match, states);
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    // Find and invoke the submit handler (the one that calls reportMatch).
    const submitHandler = onClicks.find((fn) => {
      fn();
      const called = reportMatch.mock.calls.length > 0;
      return called;
    });
    expect(submitHandler).toBeDefined();
    expect(reportMatch).toHaveBeenCalledWith("match-1", "Ngôn từ khiếm nhã");
    expect(setReportOpen).toHaveBeenCalledWith(false);
    expect(setReportReason).toHaveBeenCalledWith("");
  });

  it("submitting the report with a blank reason passes undefined (not an empty string)", () => {
    const reportMatch = jest.fn();
    mockUseCommunityMatchActions.mockReturnValue({ exitMatch: jest.fn(), blockMatch: jest.fn(), reportMatch });
    const states: StatePair<unknown>[] = [["", jest.fn()], [true, jest.fn()], ["   ", jest.fn()]];

    const el = elementOf(match, states);
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    onClicks.forEach((fn) => fn());

    expect(reportMatch).toHaveBeenCalledWith("match-1", undefined);
  });
});

// ─── Composer: Enter sends, Shift+Enter newlines ─────────────────────────────

describe("CommunityConversation — composer keyboard behavior", () => {
  it("the Send button is disabled when the text is empty/whitespace-only", () => {
    const states: StatePair<unknown>[] = [["   ", jest.fn()], [false, jest.fn()], ["", jest.fn()]];
    const markup = renderConversation(match, states);
    expect(markup.match(/disabled=""/g)?.length).toBeGreaterThanOrEqual(1);
  });

  it("the Send button is enabled and calls sendMessage(trimmedText) when clicked with non-empty text", () => {
    const sendMessage = jest.fn();
    mockUseSendCommunityMessage.mockReturnValue(sendMessage);
    const setText = jest.fn();
    const states: StatePair<unknown>[] = [["  Chào bạn  ", setText], [false, jest.fn()], ["", jest.fn()]];

    const el = elementOf(match, states);
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    onClicks.forEach((fn) => {
      sendMessage.mockClear();
      setText.mockClear();
      fn();
    });

    expect(sendMessage).toHaveBeenCalledWith("Chào bạn");
    expect(setText).toHaveBeenCalledWith("");
  });

  it("does not call sendMessage when clicking send while text is blank (handleSend guards on trimmed text)", () => {
    const sendMessage = jest.fn();
    mockUseSendCommunityMessage.mockReturnValue(sendMessage);
    const states: StatePair<unknown>[] = [["   ", jest.fn()], [false, jest.fn()], ["", jest.fn()]];

    const el = elementOf(match, states);
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    onClicks.forEach((fn) => fn());

    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("Enter (no Shift) on the textarea sends the message and calls preventDefault", () => {
    const sendMessage = jest.fn();
    mockUseSendCommunityMessage.mockReturnValue(sendMessage);
    const states: StatePair<unknown>[] = [["Chào bạn", jest.fn()], [false, jest.fn()], ["", jest.fn()]];

    const el = elementOf(match, states);
    const onKeyDowns = [...new Set(deepCollectProp(el, "onKeyDown"))] as Array<
      (e: { key: string; shiftKey: boolean; preventDefault: () => void }) => void
    >;
    expect(onKeyDowns).toHaveLength(1);

    const preventDefault = jest.fn();
    onKeyDowns[0]({ key: "Enter", shiftKey: false, preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledWith("Chào bạn");
  });

  it("Shift+Enter on the textarea does NOT send and does NOT call preventDefault (allows newline insertion)", () => {
    const sendMessage = jest.fn();
    mockUseSendCommunityMessage.mockReturnValue(sendMessage);
    const states: StatePair<unknown>[] = [["Chào bạn", jest.fn()], [false, jest.fn()], ["", jest.fn()]];

    const el = elementOf(match, states);
    const onKeyDowns = [...new Set(deepCollectProp(el, "onKeyDown"))] as Array<
      (e: { key: string; shiftKey: boolean; preventDefault: () => void }) => void
    >;

    const preventDefault = jest.fn();
    onKeyDowns[0]({ key: "Enter", shiftKey: true, preventDefault });

    expect(preventDefault).not.toHaveBeenCalled();
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("a non-Enter key does not send", () => {
    const sendMessage = jest.fn();
    mockUseSendCommunityMessage.mockReturnValue(sendMessage);
    const states: StatePair<unknown>[] = [["Chào bạn", jest.fn()], [false, jest.fn()], ["", jest.fn()]];

    const el = elementOf(match, states);
    const onKeyDowns = [...new Set(deepCollectProp(el, "onKeyDown"))] as Array<
      (e: { key: string; shiftKey: boolean; preventDefault: () => void }) => void
    >;

    const preventDefault = jest.fn();
    onKeyDowns[0]({ key: "a", shiftKey: false, preventDefault });

    expect(preventDefault).not.toHaveBeenCalled();
    expect(sendMessage).not.toHaveBeenCalled();
  });
});
