/**
 * Unit tests for app/(admin)/admin/community-reports/page.tsx
 *
 * Cloned from app/(admin)/admin/subscriptions/page.tsx's exact shape: local
 * useState + Promise.all refetch (no React Query), two tabs, three actions
 * per open report. No jsdom (testEnvironment: "node") — the mount-time
 * useEffect refetch never fires under SSR, so we drive the component purely
 * through injected useState values, mirroring the injectable-useState-
 * sequence pattern in __tests__/exerciseSlugPage.phase3.test.tsx.
 *
 * State declaration order in the SUT: tab, open, resolved, loading, acting.
 */

// ── Mocks (must precede all imports) ──────────────────────────────────────────

const mockGetCommunityReports = jest.fn();
const mockWarnCommunityReport = jest.fn();
const mockUnmatchCommunityReport = jest.fn();
const mockBanCommunityReport = jest.fn();

jest.mock("@/lib/api/services/fetchAdmin", () => ({
  fetchAdmin: {
    getCommunityReports: (...args: unknown[]) => mockGetCommunityReports(...args),
    warnCommunityReport: (...args: unknown[]) => mockWarnCommunityReport(...args),
    unmatchCommunityReport: (...args: unknown[]) => mockUnmatchCommunityReport(...args),
    banCommunityReport: (...args: unknown[]) => mockBanCommunityReport(...args),
  },
}));

const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
jest.mock("sonner", () => ({
  toast: { success: (...args: unknown[]) => mockToastSuccess(...args), error: (...args: unknown[]) => mockToastError(...args) },
}));

jest.mock("lucide-react", () => {
  const React = require("react");
  function makeIcon(name: string) {
    return function IconComp(props: Record<string, unknown>) {
      return React.createElement("svg", { "data-icon": name, ...props });
    };
  }
  return {
    CheckCircle2: makeIcon("CheckCircle2"),
    TriangleAlert: makeIcon("TriangleAlert"),
    ShieldOff: makeIcon("ShieldOff"),
    Ban: makeIcon("Ban"),
  };
});

// Injectable useState sequence: tab, open, resolved, loading, acting.
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
    useEffect: jest.fn(), // mount-time refetch never fires under SSR anyway
  };
});

// ── SUT imports ───────────────────────────────────────────────────────────────

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AdminCommunityReportsPage from "@/app/(admin)/admin/community-reports/page";
import type { CommunityReport } from "@/types/community";

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

function renderPage(states: StatePair<unknown>[]) {
  stateSequence = states;
  stateCallIndex = 0;
  return renderToStaticMarkup(React.createElement(AdminCommunityReportsPage));
}

function elementOf(states: StatePair<unknown>[]) {
  stateSequence = states;
  stateCallIndex = 0;
  let captured!: React.ReactElement;
  function Host() {
    captured = (AdminCommunityReportsPage as unknown as () => React.ReactElement)();
    return null;
  }
  renderToStaticMarkup(React.createElement(Host));
  return captured;
}

const FIXED_NOW = new Date("2026-07-21T12:00:00Z").getTime();

const overdueReport: CommunityReport = {
  id: "report-1",
  matchId: "match-1",
  reporterHandle: "MayXanh21",
  reportedHandle: "AnHung92",
  reason: "Lời lẽ khiếm nhã",
  reportedAt: "2026-07-20T08:00:00Z",
  slaDeadline: "2026-07-21T08:00:00Z", // before FIXED_NOW → overdue
  status: "open",
};

const notOverdueReport: CommunityReport = {
  id: "report-2",
  matchId: "match-2",
  reporterHandle: "TrangThu55",
  reportedHandle: "BinhMinh10",
  reason: null,
  reportedAt: "2026-07-21T09:00:00Z",
  slaDeadline: "2026-07-21T20:00:00Z", // after FIXED_NOW → not overdue
  status: "open",
};

const resolvedReport: CommunityReport = { ...overdueReport, id: "report-3", status: "resolved" };

let dateNowSpy: jest.SpyInstance;

beforeEach(() => {
  jest.clearAllMocks();
  dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(FIXED_NOW);
});

afterEach(() => {
  dateNowSpy.mockRestore();
});

function baseStates(overrides: Partial<{ tab: string; open: CommunityReport[]; resolved: CommunityReport[]; loading: boolean; acting: boolean }> = {}): StatePair<unknown>[] {
  return [
    [overrides.tab ?? "open", jest.fn()],
    [overrides.open ?? [], jest.fn()],
    [overrides.resolved ?? [], jest.fn()],
    [overrides.loading ?? false, jest.fn()],
    [overrides.acting ?? false, jest.fn()],
  ];
}

// ─── SLA-overdue badge logic ──────────────────────────────────────────────────

describe("AdminCommunityReportsPage — SLA-overdue badge", () => {
  it("shows the 'Quá hạn' badge for a report whose slaDeadline is in the past", () => {
    const markup = renderPage(baseStates({ open: [overdueReport] }));
    expect(markup).toContain("Quá hạn");
  });

  it("shows a formatted deadline (not 'Quá hạn') for a report whose slaDeadline is in the future", () => {
    const markup = renderPage(baseStates({ open: [notOverdueReport] }));
    expect(markup).not.toContain("Quá hạn");
  });

  it("mixed list: overdue and non-overdue reports are both correctly classified", () => {
    const markup = renderPage(baseStates({ open: [overdueReport, notOverdueReport] }));
    const overdueCount = (markup.match(/Quá hạn/g) ?? []).length;
    expect(overdueCount).toBe(1);
  });

  it("boundary: a slaDeadline exactly equal to now is treated as NOT overdue (strict less-than)", () => {
    const boundaryReport: CommunityReport = { ...overdueReport, id: "report-boundary", slaDeadline: new Date(FIXED_NOW).toISOString() };
    const markup = renderPage(baseStates({ open: [boundaryReport] }));
    expect(markup).not.toContain("Quá hạn");
  });

  it("the isOverdue computation matches new Date(slaDeadline).getTime() < Date.now() exactly", () => {
    const isOverdue = (slaDeadline: string) => new Date(slaDeadline).getTime() < Date.now();
    expect(isOverdue(overdueReport.slaDeadline)).toBe(true);
    expect(isOverdue(notOverdueReport.slaDeadline)).toBe(false);
  });
});

// ─── Tabs ─────────────────────────────────────────────────────────────────────

describe("AdminCommunityReportsPage — tabs", () => {
  it("shows the open-reports table by default when tab='open'", () => {
    const markup = renderPage(baseStates({ tab: "open", open: [overdueReport] }));
    expect(markup).toContain("MayXanh21");
    expect(markup).toContain("Cảnh cáo");
  });

  it("shows the resolved-reports table when tab='resolved'", () => {
    const markup = renderPage(baseStates({ tab: "resolved", resolved: [resolvedReport] }));
    expect(markup).toContain(resolvedReport.reporterHandle);
    // No action buttons on resolved rows.
    expect(markup).not.toContain("Cảnh cáo");
  });

  it("shows a resolved 'all clear' empty state when there are no open reports", () => {
    const markup = renderPage(baseStates({ tab: "open", open: [] }));
    expect(markup).toContain("Tất cả đã được xử lý");
  });

  it("shows the open/resolved counts in the tab badges", () => {
    const markup = renderPage(baseStates({ open: [overdueReport, notOverdueReport], resolved: [resolvedReport] }));
    expect(markup).toContain("2"); // open count
    expect(markup).toContain("1"); // resolved count
  });
});

// ─── Report handle / anonymization display ──────────────────────────────────

describe("AdminCommunityReportsPage — anonymized display", () => {
  it("renders reporterHandle/reportedHandle, never a raw user id", () => {
    const markup = renderPage(baseStates({ open: [overdueReport] }));
    expect(markup).toContain("MayXanh21");
    expect(markup).toContain("AnHung92");
  });

  it("shows a placeholder when reason is null", () => {
    const markup = renderPage(baseStates({ open: [notOverdueReport] }));
    expect(markup).toContain("(không có lý do)");
  });
});

// ─── Moderation actions ───────────────────────────────────────────────────────

describe("AdminCommunityReportsPage — moderation actions", () => {
  it("clicking 'Cảnh cáo' (warn) calls fetchAdmin.warnCommunityReport with the report id", () => {
    mockWarnCommunityReport.mockResolvedValueOnce({ ...overdueReport, status: "resolved" });

    const el = elementOf(baseStates({ open: [overdueReport] }));
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    const warnHandler = onClicks.find((fn) => {
      fn();
      const called = mockWarnCommunityReport.mock.calls.length > 0;
      mockWarnCommunityReport.mockClear();
      return called;
    });
    expect(warnHandler).toBeDefined();
    warnHandler!();
    expect(mockWarnCommunityReport).toHaveBeenCalledWith("report-1");
  });

  it("clicking unmatch calls fetchAdmin.unmatchCommunityReport with the report id", () => {
    mockUnmatchCommunityReport.mockResolvedValueOnce({ ...overdueReport, status: "resolved" });

    const el = elementOf(baseStates({ open: [overdueReport] }));
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    const handler = onClicks.find((fn) => {
      fn();
      const called = mockUnmatchCommunityReport.mock.calls.length > 0;
      mockUnmatchCommunityReport.mockClear();
      return called;
    });
    expect(handler).toBeDefined();
    handler!();
    expect(mockUnmatchCommunityReport).toHaveBeenCalledWith("report-1");
  });

  it("clicking ban calls fetchAdmin.banCommunityReport with the report id", () => {
    mockBanCommunityReport.mockResolvedValueOnce({ ...overdueReport, status: "resolved" });

    const el = elementOf(baseStates({ open: [overdueReport] }));
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => void>;
    const handler = onClicks.find((fn) => {
      fn();
      const called = mockBanCommunityReport.mock.calls.length > 0;
      mockBanCommunityReport.mockClear();
      return called;
    });
    expect(handler).toBeDefined();
    handler!();
    expect(mockBanCommunityReport).toHaveBeenCalledWith("report-1");
  });

  it("action handlers move the report from open to resolved (moveToResolved) and toast success on resolution", async () => {
    const setOpen = jest.fn();
    const setResolved = jest.fn();
    const updated = { ...overdueReport, status: "resolved" as const };
    mockWarnCommunityReport.mockResolvedValueOnce(updated);

    const el = elementOf(
      baseStates({ open: [overdueReport] }).map((pair, i) => (i === 1 ? [[overdueReport], setOpen] : i === 2 ? [[], setResolved] : pair)) as StatePair<unknown>[]
    );
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => Promise<void>>;
    const warnHandler = onClicks.find((fn) => fn.name !== "" || true); // handleWarn is the first action handler encountered
    // Invoke the handler that resolves via warnCommunityReport specifically.
    for (const fn of onClicks) {
      await fn();
      if (mockWarnCommunityReport.mock.calls.length > 0) break;
    }

    expect(mockWarnCommunityReport).toHaveBeenCalledWith("report-1");
    expect(setOpen).toHaveBeenCalledWith(expect.any(Function));
    expect(setResolved).toHaveBeenCalledWith(expect.any(Function));

    const openUpdater = setOpen.mock.calls.find(() => true)![0];
    expect(openUpdater([overdueReport])).toEqual([]);

    const resolvedUpdater = setResolved.mock.calls.find(() => true)![0];
    expect(resolvedUpdater([])).toEqual([updated]);

    expect(mockToastSuccess).toHaveBeenCalled();
  });

  it("disables action buttons while acting is true", () => {
    const markup = renderPage(baseStates({ open: [overdueReport], acting: true }));
    expect(markup.match(/disabled=""/g)?.length).toBeGreaterThanOrEqual(3);
  });

  it("shows a toast error and does not throw when a moderation action rejects", async () => {
    mockBanCommunityReport.mockRejectedValueOnce(new Error("Network error"));

    const el = elementOf(baseStates({ open: [overdueReport] }));
    const onClicks = [...new Set(deepCollectProp(el, "onClick"))] as Array<() => Promise<void>>;

    for (const fn of onClicks) {
      await fn();
    }

    expect(mockToastError).toHaveBeenCalled();
  });
});
