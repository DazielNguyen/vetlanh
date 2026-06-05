/**
 * Unit tests for app/services/profile/components/NotificationSettings.tsx
 *
 * NotificationSettings uses useState/useEffect internally.  We call it as a
 * plain function (no React renderer), which means:
 *   • useState runs with its initial values: DEFAULT_PREF and dirty=false.
 *   • useEffect does NOT fire (no DOM, no event loop).
 *
 * This gives us a deterministic "initial render" snapshot that we can assert
 * against.  For state-dependent rendering (enabled=true, dirty=true) we mock
 * the `useState` hook at the react module level — each test installs the
 * sequence of [value, setter] pairs it wants the component to consume.
 *
 * Because Toggle is a local function component, `findElements` must
 * shallow-render it one level to see its `role="switch"` button output.
 *
 * Key behaviours:
 *  1. Renders a Loader2 spinner while preference is loading (isLoading=true).
 *  2. Renders the settings card when loading is false.
 *  3. Main toggle rendered with aria-checked matching form.enabled.
 *  4. Time input fields hidden when form.enabled is false.
 *  5. Time input fields shown when form.enabled is true.
 *  6. Save button absent when dirty=false, present when dirty=true.
 *  7. Save button disabled when isPending=true.
 *  8. useUpdateNotificationPreference and useNotificationPreference called on render.
 */

// ── Mocks — declared before imports ──────────────────────────────────────────

jest.mock("redux-persist/lib/storage", () => ({
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => undefined),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("lucide-react", () => ({
  Bell: () => null,
  Loader2: function Loader2() {
    const React = require("react");
    return React.createElement("span", { "data-loader": "true", className: "animate-spin" });
  },
}));

jest.mock("@/components/ui/card", () => {
  const React = require("react");
  return {
    Card: ({ children, className }: { children?: React.ReactNode; className?: string }) =>
      React.createElement("div", { "data-card": "true", className }, children),
    CardContent: ({ children, className }: { children?: React.ReactNode; className?: string }) =>
      React.createElement("div", { "data-card-content": "true", className }, children),
    CardHeader: ({ children, className }: { children?: React.ReactNode; className?: string }) =>
      React.createElement("div", { "data-card-header": "true", className }, children),
    CardTitle: ({ children, className }: { children?: React.ReactNode; className?: string }) =>
      React.createElement("h2", { "data-card-title": "true", className }, children),
  };
});

jest.mock("@/components/ui/button", () => {
  const React = require("react");
  return {
    Button: ({
      children,
      onClick,
      disabled,
    }: {
      children?: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
    }) =>
      React.createElement(
        "button",
        { onClick, disabled, "data-save-button": "true" },
        children,
      ),
  };
});

// ── Hook mocks ────────────────────────────────────────────────────────────────

const mockMutate = jest.fn();

jest.mock("@/hooks/useNotifications", () => ({
  useNotificationPreference: jest.fn(),
  useUpdateNotificationPreference: jest.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
}));

jest.mock("@/hooks/useUser", () => ({
  useCurrentUser: jest.fn(() => ({ data: { timezone: "Asia/Ho_Chi_Minh" } })),
}));

// ── React useState injection ──────────────────────────────────────────────────
//
// We mock the `react` module so our tests can control what useState returns.
// The sequence is populated per-test via `setupState()`.
// useEffect is a no-op — side-effects don't run outside jsdom.

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
    useEffect: jest.fn(),
  };
});

// ── SUT imports (AFTER mocks) ─────────────────────────────────────────────────

import React from "react";
import { NotificationSettings } from "@/app/services/profile/components/NotificationSettings";
import {
  useNotificationPreference,
  useUpdateNotificationPreference,
} from "@/hooks/useNotifications";
import type {
  NotificationPreference,
  NotificationPreferenceUpdate,
} from "@/types/notifications";

// ── Helper utilities ──────────────────────────────────────────────────────────

function collectText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");
  const element = node as React.ReactElement;
  if (!element.props) return "";
  return collectText(element.props.children);
}

/**
 * Recursively traverse the React element tree through `props.children`.
 * Does NOT shallow-render function components to avoid double-counting.
 */
function findElements(
  node: React.ReactNode,
  predicate: (el: React.ReactElement) => boolean,
): React.ReactElement[] {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap((n) => findElements(n, predicate));
  const el = node as React.ReactElement;
  const found: React.ReactElement[] = [];
  if (predicate(el)) found.push(el);
  if (el.props?.children) {
    found.push(...findElements(el.props.children, predicate));
  }
  return found;
}

/**
 * Find Toggle component elements by matching on their function name and
 * inspecting the props directly — no shallow rendering required.
 *
 * The component tree contains `React.createElement(Toggle, { label, checked, onChange })`.
 * We find all elements whose `type` is a function named "Toggle".
 */
function findToggleElements(node: React.ReactNode): React.ReactElement[] {
  return findElements(node, (el) => {
    return (
      typeof el.type === "function" &&
      (el.type as { name?: string }).name === "Toggle"
    );
  });
}

/**
 * Shallow-render a Toggle element to get its button output.
 * Returns the rendered button element, or undefined on failure.
 */
function renderToggle(el: React.ReactElement): React.ReactElement | undefined {
  try {
    return (el.type as (p: unknown) => React.ReactElement)(el.props) as React.ReactElement;
  } catch {
    return undefined;
  }
}

/**
 * Find all Toggle elements and expose them as their rendered button output
 * so callers can inspect `aria-checked` and `aria-label`.
 */
function findToggles(node: React.ReactNode): React.ReactElement[] {
  return findToggleElements(node)
    .map(renderToggle)
    .filter((el): el is React.ReactElement => el !== undefined);
}

function findTimeInputs(node: React.ReactNode): React.ReactElement[] {
  return findElements(node, (el) => el.type === "input" && el.props?.type === "time");
}

function findLoaders(node: React.ReactNode): React.ReactElement[] {
  // The Loader2 element is React.createElement(Loader2Function, {}) — its type
  // is a function named "Loader2".  We cannot inspect the rendered span
  // without actually calling the function, so we match by function name.
  return findElements(
    node,
    (el) =>
      typeof el.type === "function" &&
      (el.type as { name?: string }).name === "Loader2",
  );
}

/**
 * Find the Button component element rendered by NotificationSettings.
 * We look for elements whose type is a function named "Button" — then we
 * shallow-render them to get the underlying <button> element with its props.
 */
function findSaveButtons(node: React.ReactNode): React.ReactElement[] {
  const buttonElements = findElements(
    node,
    (el) =>
      typeof el.type === "function" &&
      (el.type as { name?: string }).name === "Button",
  );
  // Shallow-render each Button element to get the actual <button> output
  return buttonElements
    .map((el) => {
      try {
        return (el.type as (p: unknown) => React.ReactElement)(el.props) as React.ReactElement;
      } catch {
        return undefined;
      }
    })
    .filter((el): el is React.ReactElement => el !== undefined);
}

// ── State setup helper ────────────────────────────────────────────────────────

const DEFAULT_FORM: NotificationPreferenceUpdate = {
  enabled: false,
  reminder_time: "08:00",
  quiet_start: "22:00",
  quiet_end: "07:00",
  exercise_enabled: false,
  exercise_reminder_time: "10:00",
};

const ENABLED_FORM: NotificationPreferenceUpdate = {
  ...DEFAULT_FORM,
  enabled: true,
};

const BOTH_ENABLED_FORM: NotificationPreferenceUpdate = {
  ...ENABLED_FORM,
  exercise_enabled: true,
};

/**
 * Configure the useState mock sequence.
 * The component calls useState twice: first for `form`, then for `dirty`.
 */
function setupState(form: NotificationPreferenceUpdate, dirty: boolean) {
  stateSequence = [
    [form, jest.fn() as jest.Mock],
    [dirty, jest.fn() as jest.Mock],
  ];
  stateCallIndex = 0;
}

// ── Setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  stateSequence = [];
  stateCallIndex = 0;

  (useUpdateNotificationPreference as jest.Mock).mockReturnValue({
    mutate: mockMutate,
    isPending: false,
  });
  const { useCurrentUser } = require("@/hooks/useUser");
  (useCurrentUser as jest.Mock).mockReturnValue({
    data: { timezone: "Asia/Ho_Chi_Minh" },
  });
});

// ─── Loading state ────────────────────────────────────────────────────────────

describe("NotificationSettings — loading state", () => {
  beforeEach(() => {
    (useNotificationPreference as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    setupState(DEFAULT_FORM, false);
  });

  it("renders a Loader2 spinner when isLoading is true", () => {
    const el = NotificationSettings({});
    const loaders = findLoaders(el);
    expect(loaders.length).toBeGreaterThan(0);
  });

  it("does NOT render the 'Bật thông báo' text while loading", () => {
    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).not.toContain("Bật thông báo");
  });

  it("returns a non-null React element during loading", () => {
    const el = NotificationSettings({});
    expect(el).not.toBeNull();
    expect(el).not.toBeUndefined();
  });

  it("does not render time inputs while loading", () => {
    const el = NotificationSettings({});
    const timeInputs = findTimeInputs(el);
    expect(timeInputs).toHaveLength(0);
  });
});

// ─── Notifications OFF (default initial state) ────────────────────────────────

describe("NotificationSettings — no preference data, notifications OFF", () => {
  beforeEach(() => {
    (useNotificationPreference as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    setupState(DEFAULT_FORM, false);
  });

  it("renders the card title 'Cài đặt thông báo'", () => {
    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).toContain("Cài đặt thông báo");
  });

  it("renders the 'Bật thông báo' label text", () => {
    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).toContain("Bật thông báo");
  });

  it("renders the main toggle with aria-checked=false", () => {
    const el = NotificationSettings({});
    const toggles = findToggles(el);
    const mainToggle = toggles.find((t) => t.props["aria-label"] === "Bật thông báo");
    expect(mainToggle).toBeDefined();
    expect(mainToggle!.props["aria-checked"]).toBe(false);
  });

  it("does NOT render time input fields when notifications are off", () => {
    const el = NotificationSettings({});
    const timeInputs = findTimeInputs(el);
    expect(timeInputs).toHaveLength(0);
  });

  it("does NOT render the Save button when dirty is false", () => {
    const el = NotificationSettings({});
    const saveButtons = findSaveButtons(el);
    expect(saveButtons).toHaveLength(0);
  });

  it("shows the timezone label", () => {
    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).toContain("Múi giờ:");
  });

  it("does not render a loader when not loading", () => {
    const el = NotificationSettings({});
    const loaders = findLoaders(el);
    expect(loaders).toHaveLength(0);
  });
});

// ─── Notifications enabled, exercise OFF ─────────────────────────────────────

describe("NotificationSettings — notifications enabled, exercise OFF", () => {
  beforeEach(() => {
    (useNotificationPreference as jest.Mock).mockReturnValue({
      data: {
        enabled: true,
        reminder_time: "09:00",
        quiet_start: "23:00",
        quiet_end: "06:00",
        exercise_enabled: false,
        exercise_reminder_time: "10:00",
      } as NotificationPreference,
      isLoading: false,
    });
    setupState(ENABLED_FORM, false);
  });

  it("renders main toggle with aria-checked=true", () => {
    const el = NotificationSettings({});
    const toggles = findToggles(el);
    const mainToggle = toggles.find((t) => t.props["aria-label"] === "Bật thông báo");
    expect(mainToggle).toBeDefined();
    expect(mainToggle!.props["aria-checked"]).toBe(true);
  });

  it("renders at least 3 time inputs (reminder, quiet_start, quiet_end)", () => {
    const el = NotificationSettings({});
    const timeInputs = findTimeInputs(el);
    expect(timeInputs.length).toBeGreaterThanOrEqual(3);
  });

  it("renders 'Giờ nhắc nhở' label", () => {
    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).toContain("Giờ nhắc nhở");
  });

  it("renders 'Bắt đầu giờ yên tĩnh' label", () => {
    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).toContain("Bắt đầu giờ yên tĩnh");
  });

  it("renders 'Kết thúc giờ yên tĩnh' label", () => {
    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).toContain("Kết thúc giờ yên tĩnh");
  });

  it("renders the 'Nhắc nhở bài tập' exercise toggle section", () => {
    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).toContain("Nhắc nhở bài tập");
  });

  it("exercise toggle is aria-checked=false when exercise_enabled is false", () => {
    const el = NotificationSettings({});
    const toggles = findToggles(el);
    const exerciseToggle = toggles.find(
      (t) => t.props["aria-label"] === "Bật nhắc nhở bài tập",
    );
    expect(exerciseToggle).toBeDefined();
    expect(exerciseToggle!.props["aria-checked"]).toBe(false);
  });

  it("does NOT show 'Giờ nhắc bài tập' when exercise is off", () => {
    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).not.toContain("Giờ nhắc bài tập");
  });
});

// ─── Both notifications and exercise enabled ──────────────────────────────────

describe("NotificationSettings — both notifications and exercise enabled", () => {
  beforeEach(() => {
    (useNotificationPreference as jest.Mock).mockReturnValue({
      data: {
        enabled: true,
        reminder_time: "09:00",
        quiet_start: "23:00",
        quiet_end: "06:00",
        exercise_enabled: true,
        exercise_reminder_time: "11:00",
      } as NotificationPreference,
      isLoading: false,
    });
    setupState(BOTH_ENABLED_FORM, false);
  });

  it("renders at least 4 time inputs including exercise reminder", () => {
    const el = NotificationSettings({});
    const timeInputs = findTimeInputs(el);
    expect(timeInputs.length).toBeGreaterThanOrEqual(4);
  });

  it("renders 'Giờ nhắc bài tập' label when exercise is enabled", () => {
    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).toContain("Giờ nhắc bài tập");
  });

  it("exercise toggle is aria-checked=true when exercise_enabled is true", () => {
    const el = NotificationSettings({});
    const toggles = findToggles(el);
    const exerciseToggle = toggles.find(
      (t) => t.props["aria-label"] === "Bật nhắc nhở bài tập",
    );
    expect(exerciseToggle).toBeDefined();
    expect(exerciseToggle!.props["aria-checked"]).toBe(true);
  });
});

// ─── Save button (dirty state) ────────────────────────────────────────────────

describe("NotificationSettings — Save button (dirty state)", () => {
  it("Save button is absent when dirty=false", () => {
    (useNotificationPreference as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    setupState(DEFAULT_FORM, false);

    const el = NotificationSettings({});
    const saveButtons = findSaveButtons(el);
    expect(saveButtons).toHaveLength(0);
  });

  it("Save button is present when dirty=true", () => {
    (useNotificationPreference as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    setupState(DEFAULT_FORM, true);

    const el = NotificationSettings({});
    const saveButtons = findSaveButtons(el);
    expect(saveButtons.length).toBeGreaterThan(0);
  });

  it("Save button shows 'Lưu cài đặt' text when not pending", () => {
    (useNotificationPreference as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    setupState(DEFAULT_FORM, true);

    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).toContain("Lưu cài đặt");
  });

  it("Save button is disabled when mutation isPending=true", () => {
    (useNotificationPreference as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    (useUpdateNotificationPreference as jest.Mock).mockReturnValueOnce({
      mutate: mockMutate,
      isPending: true,
    });
    setupState(DEFAULT_FORM, true);

    const el = NotificationSettings({});
    const saveButtons = findSaveButtons(el);
    expect(saveButtons.length).toBeGreaterThan(0);
    expect(saveButtons[0].props.disabled).toBe(true);
  });

  it("Save button is NOT disabled when mutation isPending=false", () => {
    (useNotificationPreference as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    setupState(DEFAULT_FORM, true);

    const el = NotificationSettings({});
    const saveButtons = findSaveButtons(el);
    expect(saveButtons.length).toBeGreaterThan(0);
    expect(saveButtons[0].props.disabled).toBe(false);
  });
});

// ─── Hook wiring ──────────────────────────────────────────────────────────────

describe("NotificationSettings — hook wiring", () => {
  beforeEach(() => {
    (useNotificationPreference as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    setupState(DEFAULT_FORM, false);
  });

  it("calls useNotificationPreference during render", () => {
    NotificationSettings({});
    expect(useNotificationPreference).toHaveBeenCalled();
  });

  it("calls useUpdateNotificationPreference during render", () => {
    NotificationSettings({});
    expect(useUpdateNotificationPreference).toHaveBeenCalled();
  });

  it("renders without error when isPending is true", () => {
    (useUpdateNotificationPreference as jest.Mock).mockReturnValueOnce({
      mutate: mockMutate,
      isPending: true,
    });
    expect(() => NotificationSettings({})).not.toThrow();
  });

  it("renders without error when user timezone is undefined (falls back to Intl)", () => {
    const { useCurrentUser } = require("@/hooks/useUser");
    (useCurrentUser as jest.Mock).mockReturnValueOnce({ data: undefined });
    expect(() => NotificationSettings({})).not.toThrow();
  });

  it("displays the user timezone when provided", () => {
    const el = NotificationSettings({});
    const text = collectText(el);
    expect(text).toContain("Asia/Ho_Chi_Minh");
  });
});
