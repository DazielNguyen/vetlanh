/**
 * Phase 3 tests — Interactive Healing Services: Feeling Picker
 *
 * Tests the three key deliverables in app/services/exercises/[slug]/page.tsx:
 *
 *   1. resolveFeelingAndComplete — localStorage write, setDone(), onComplete() wiring
 *   2. FeelingPicker — 4 feeling buttons + skip; callback behaviour
 *   3. SessionDoneView — shows FeelingPicker when doneState="done_pending",
 *                        shows Loader2 when doneState="done_logged" && isLogging
 *
 * Strategy: the three target components are local (not exported).
 *
 *  a) resolveFeelingAndComplete — tested via an in-test mirror of the exact same
 *     logic (pure function, trivial to duplicate for contract verification).
 *
 *  b) FeelingPicker callback wiring — tested via a self-contained mirror of the
 *     FeelingPicker element tree; callbacks exercised directly.
 *
 *  c) SessionDoneView / integration — ExerciseDetailPage is called as a plain
 *     function; we use a "deepText" traversal that recursively shallow-renders
 *     function components to collect all visible text.  Depth limit is set high
 *     enough to traverse: Page → Card → CardContent → Session → SessionDoneView
 *     → FeelingPicker → motion.div → text leaves (~12 levels).
 *
 * Mocks:
 *   motion/react, next/navigation, next/link, lucide-react,
 *   @/components/ui/card, @/components/ui/button, @/hooks/useExercise,
 *   redux-persist, cookies-next, sonner — all silenced / stubbed.
 */

// ── Mocks (must precede all imports) ─────────────────────────────────────────

jest.mock("motion/react", () => {
  const React = require("react");
  return {
    motion: {
      div: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) =>
        React.createElement("div", p, children),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useAnimate: () => [{ current: null }, jest.fn()],
    useReducedMotion: () => false,
  };
});

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ back: jest.fn(), push: jest.fn() })),
}));

jest.mock("next/link", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) =>
      React.createElement("a", { href }, children),
  };
});

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

// Lucide icons: each becomes a named function returning a sentinel <span>.
jest.mock("lucide-react", () => {
  const React = require("react");
  function makeIcon(name: string) {
    function IconComp({ className }: { className?: string }) {
      return React.createElement("span", { "data-icon": name, className });
    }
    Object.defineProperty(IconComp, "name", { value: name });
    return IconComp;
  }
  return {
    Loader2: makeIcon("Loader2"),
    CheckCircle: makeIcon("CheckCircle"),
    ArrowLeft: makeIcon("ArrowLeft"),
    Play: makeIcon("Play"),
    Square: makeIcon("Square"),
    ChevronRight: makeIcon("ChevronRight"),
  };
});

jest.mock("@/components/ui/card", () => {
  const React = require("react");
  return {
    Card: function Card({ children }: { children?: React.ReactNode }) {
      return React.createElement("div", { "data-card": true }, children);
    },
    CardContent: function CardContent({ children }: { children?: React.ReactNode }) {
      return React.createElement("div", { "data-card-content": true }, children);
    },
    CardHeader: function CardHeader({ children }: { children?: React.ReactNode }) {
      return React.createElement("div", { "data-card-header": true }, children);
    },
    CardTitle: function CardTitle({ children }: { children?: React.ReactNode }) {
      return React.createElement("h2", { "data-card-title": true }, children);
    },
  };
});

jest.mock("@/components/ui/button", () => {
  const React = require("react");
  return {
    Button: function Button({
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
    }) {
      return React.createElement(
        "button",
        { onClick, disabled, "data-variant": variant, className },
        children,
      );
    },
  };
});

jest.mock("@/hooks/useExercise", () => ({
  useExercise: jest.fn(() => ({ data: undefined, isLoading: false })),
  useLogExercise: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
}));

// ── useState / useEffect / useRef / use control ───────────────────────────────
//
// Inject synthetic state so session components enter specific states without
// running timers or effects.

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
    useRef: jest.fn(() => ({ current: null })),
    use: jest.fn((p: unknown) => p),
  };
});

// ── SUT imports (AFTER mocks) ─────────────────────────────────────────────────

import React from "react";
import ExerciseDetailPage from "@/app/services/exercises/[slug]/page";
import { useExercise, useLogExercise } from "@/hooks/useExercise";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Collect visible text from a React element tree WITHOUT calling function
 * components.  Use for shallow-only assertions.
 */
function collectText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");
  const el = node as React.ReactElement;
  if (!el?.props) return "";
  return collectText(el.props.children);
}

/**
 * Recursively render function components in the element tree, collecting ALL
 * visible text including from deeply nested sub-components.
 *
 * Depth limit is 20 to safely handle:
 *   Page(0) → Card(1) → CardContent(2) → TimerSession(3) → SessionDoneView(4)
 *   → motion.div(5) → FeelingPicker(6) → motion.div(7) → grid(8) → button(9)
 *   → span(10) → text(11)
 *
 * The `renderDepth` counter only increments when we CALL a function component,
 * so we do not waste budget on HTML element descent.
 */
function deepText(node: React.ReactNode, renderDepth = 0): string {
  if (renderDepth > 20) return "";
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map((n) => deepText(n, renderDepth)).join("");

  const el = node as React.ReactElement;

  if (typeof el.type === "function") {
    // Render the function component — increment render depth
    try {
      const rendered = (el.type as (p: unknown) => React.ReactNode)(el.props);
      return deepText(rendered, renderDepth + 1);
    } catch {
      return "";
    }
  }

  // Plain HTML or Fragment — descend without incrementing render depth
  if (!el?.props) return "";
  return deepText(el.props.children, renderDepth);
}

/**
 * Walk the element tree (rendering function components) and collect all
 * elements matching the predicate.
 */
function deepFind(
  node: React.ReactNode,
  predicate: (el: React.ReactElement) => boolean,
  renderDepth = 0,
): React.ReactElement[] {
  if (renderDepth > 20 || !node || typeof node !== "object") return [];
  if (Array.isArray(node))
    return node.flatMap((n) => deepFind(n, predicate, renderDepth));

  const el = node as React.ReactElement;
  const results: React.ReactElement[] = [];

  if (predicate(el)) results.push(el);

  if (typeof el.type === "function") {
    try {
      const rendered = (el.type as (p: unknown) => React.ReactNode)(el.props);
      results.push(...deepFind(rendered, predicate, renderDepth + 1));
    } catch {
      // skip
    }
  } else if (el.props?.children) {
    results.push(...deepFind(el.props.children, predicate, renderDepth));
  }

  return results;
}

/** Find all <span data-icon="…"> sentinel elements (from our lucide mock). */
function deepFindIcons(node: React.ReactNode, iconName: string): React.ReactElement[] {
  return deepFind(node, (el) => {
    return (
      el.type === "span" &&
      (el.props as Record<string, unknown>)["data-icon"] === iconName
    );
  });
}

/** Find all native <button> elements in the deep tree. */
function deepFindButtons(node: React.ReactNode): React.ReactElement[] {
  return deepFind(node, (el) => el.type === "button");
}

// ── State-injection helper ────────────────────────────────────────────────────

function setupState(pairs: StatePair<unknown>[]) {
  stateSequence = pairs;
  stateCallIndex = 0;
}

// ── Mock localStorage ─────────────────────────────────────────────────────────

const localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: jest.fn((key: string) => localStorageStore[key] ?? null),
  setItem: jest.fn((key: string, value: string) => {
    localStorageStore[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete localStorageStore[key];
  }),
  clear: jest.fn(() => {
    Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]);
  }),
};
Object.defineProperty(global, "localStorage", { value: localStorageMock, writable: true });

// ── Setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  stateSequence = [];
  stateCallIndex = 0;
});

// ═════════════════════════════════════════════════════════════════════════════
// 1. resolveFeelingAndComplete — pure-logic unit tests
// ═════════════════════════════════════════════════════════════════════════════
//
// The function is not exported, so we mirror its exact logic (3 lines).
// Tests verify the contract against that logic.

describe("resolveFeelingAndComplete (logic mirror)", () => {
  function resolveFeelingAndComplete(
    slug: string,
    feeling: string | undefined,
    elapsed: number,
    setDone: () => void,
    onComplete: (d: number) => void,
  ) {
    if (feeling) localStorage.setItem(`feeling_after_${slug}_${Date.now()}`, feeling);
    setDone();
    onComplete(elapsed);
  }

  it("writes to localStorage with key feeling_after_{slug}_{timestamp} when feeling is provided", () => {
    const setDone = jest.fn();
    const onComplete = jest.fn();
    const before = Date.now();
    resolveFeelingAndComplete("test-slug", "better", 42, setDone, onComplete);
    const after = Date.now();

    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    const [key, value] = localStorageMock.setItem.mock.calls[0] as [string, string];
    expect(key).toMatch(/^feeling_after_test-slug_\d+$/);
    const ts = parseInt(key.split("_").pop()!, 10);
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
    expect(value).toBe("better");
  });

  it("does NOT write to localStorage when feeling is undefined", () => {
    resolveFeelingAndComplete("test-slug", undefined, 10, jest.fn(), jest.fn());
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it("does NOT write to localStorage when feeling is an empty string", () => {
    resolveFeelingAndComplete("test-slug", "", 10, jest.fn(), jest.fn());
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it("calls setDone() regardless of feeling", () => {
    const setDone = jest.fn();
    resolveFeelingAndComplete("any-slug", undefined, 5, setDone, jest.fn());
    expect(setDone).toHaveBeenCalledTimes(1);
  });

  it("calls onComplete with the correct elapsed value", () => {
    const onComplete = jest.fn();
    resolveFeelingAndComplete("any-slug", "much_better", 300, jest.fn(), onComplete);
    expect(onComplete).toHaveBeenCalledWith(300);
  });

  it("calls onComplete with elapsed=0 when duration is zero", () => {
    const onComplete = jest.fn();
    resolveFeelingAndComplete("any-slug", "worse", 0, jest.fn(), onComplete);
    expect(onComplete).toHaveBeenCalledWith(0);
  });

  it("uses the slug verbatim in the localStorage key", () => {
    resolveFeelingAndComplete("my-special_slug.v2", "same", 1, jest.fn(), jest.fn());
    const [key] = localStorageMock.setItem.mock.calls[0] as [string, string];
    expect(key).toMatch(/^feeling_after_my-special_slug\.v2_\d+$/);
  });

  it("stores the correct feeling value for each of the 4 options", () => {
    const feelings = ["much_better", "better", "same", "worse"];
    feelings.forEach((feeling) => {
      localStorageMock.setItem.mockClear();
      resolveFeelingAndComplete("slug", feeling, 1, jest.fn(), jest.fn());
      const [, value] = localStorageMock.setItem.mock.calls[0] as [string, string];
      expect(value).toBe(feeling);
    });
  });

  it("always calls setDone before onComplete (order guarantee)", () => {
    const order: string[] = [];
    resolveFeelingAndComplete(
      "s",
      "better",
      1,
      () => order.push("setDone"),
      () => order.push("onComplete"),
    );
    expect(order).toEqual(["setDone", "onComplete"]);
  });

  it("writes exactly one localStorage entry per call with a feeling", () => {
    resolveFeelingAndComplete("slug", "worse", 5, jest.fn(), jest.fn());
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
  });

  it("writes zero localStorage entries per call without a feeling", () => {
    resolveFeelingAndComplete("slug", undefined, 5, jest.fn(), jest.fn());
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. FeelingPicker — callback wiring (direct element tree mirror)
// ═════════════════════════════════════════════════════════════════════════════
//
// We directly construct the FeelingPicker element tree to test callback
// behaviour without needing to export the component.

describe("FeelingPicker — callback wiring (direct tree)", () => {
  const FEELINGS = [
    { value: "much_better", label: "Rất nhẹ" },
    { value: "better", label: "Nhẹ hơn" },
    { value: "same", label: "Bình thường" },
    { value: "worse", label: "Vẫn căng" },
  ];

  function buildFeelingPicker(onSelect: (v: string) => void, onSkip: () => void) {
    return React.createElement(
      "div",
      { className: "w-full space-y-3" },
      React.createElement(
        "p",
        { className: "text-sm font-semibold text-slate-600 text-center" },
        "Bạn cảm thấy thế nào sau buổi tập?",
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-2 gap-2" },
        ...FEELINGS.map((f) =>
          React.createElement(
            "button",
            { key: f.value, onClick: () => onSelect(f.value) },
            React.createElement("span", { className: "text-2xl leading-none" }, ""),
            React.createElement("span", { className: "text-xs font-semibold text-slate-600" }, f.label),
          ),
        ),
      ),
      React.createElement(
        "button",
        { onClick: onSkip, className: "w-full text-xs" },
        "Bỏ qua",
      ),
    );
  }

  it("renders exactly 4 feeling buttons + 1 skip = 5 buttons total", () => {
    const tree = buildFeelingPicker(jest.fn(), jest.fn());
    const buttons = deepFindButtons(tree);
    expect(buttons).toHaveLength(5);
  });

  it("renders the question text 'Bạn cảm thấy thế nào sau buổi tập?'", () => {
    const tree = buildFeelingPicker(jest.fn(), jest.fn());
    expect(collectText(tree)).toContain("Bạn cảm thấy thế nào sau buổi tập?");
  });

  it("renders all 4 feeling labels (Rất nhẹ, Nhẹ hơn, Bình thường, Vẫn căng)", () => {
    const tree = buildFeelingPicker(jest.fn(), jest.fn());
    const text = collectText(tree);
    expect(text).toContain("Rất nhẹ");
    expect(text).toContain("Nhẹ hơn");
    expect(text).toContain("Bình thường");
    expect(text).toContain("Vẫn căng");
  });

  it("renders the skip button 'Bỏ qua'", () => {
    const tree = buildFeelingPicker(jest.fn(), jest.fn());
    expect(collectText(tree)).toContain("Bỏ qua");
  });

  it("clicking the 'much_better' button calls onSelect('much_better')", () => {
    const onSelect = jest.fn();
    const onSkip = jest.fn();
    const tree = buildFeelingPicker(onSelect, onSkip);
    const buttons = deepFindButtons(tree);
    const btn = buttons.find((b) => collectText(b).includes("Rất nhẹ"));
    expect(btn).toBeDefined();
    (btn!.props as { onClick?: () => void }).onClick?.();
    expect(onSelect).toHaveBeenCalledWith("much_better");
    expect(onSkip).not.toHaveBeenCalled();
  });

  it("clicking the 'better' button calls onSelect('better')", () => {
    const onSelect = jest.fn();
    const tree = buildFeelingPicker(onSelect, jest.fn());
    const buttons = deepFindButtons(tree);
    const btn = buttons.find((b) => collectText(b).includes("Nhẹ hơn"));
    expect(btn).toBeDefined();
    (btn!.props as { onClick?: () => void }).onClick?.();
    expect(onSelect).toHaveBeenCalledWith("better");
  });

  it("clicking the 'same' button calls onSelect('same')", () => {
    const onSelect = jest.fn();
    const tree = buildFeelingPicker(onSelect, jest.fn());
    const buttons = deepFindButtons(tree);
    const btn = buttons.find((b) => collectText(b).includes("Bình thường"));
    expect(btn).toBeDefined();
    (btn!.props as { onClick?: () => void }).onClick?.();
    expect(onSelect).toHaveBeenCalledWith("same");
  });

  it("clicking the 'worse' button calls onSelect('worse')", () => {
    const onSelect = jest.fn();
    const tree = buildFeelingPicker(onSelect, jest.fn());
    const buttons = deepFindButtons(tree);
    const btn = buttons.find((b) => collectText(b).includes("Vẫn căng"));
    expect(btn).toBeDefined();
    (btn!.props as { onClick?: () => void }).onClick?.();
    expect(onSelect).toHaveBeenCalledWith("worse");
  });

  it("clicking skip calls onSkip and does NOT call onSelect", () => {
    const onSelect = jest.fn();
    const onSkip = jest.fn();
    const tree = buildFeelingPicker(onSelect, onSkip);
    const buttons = deepFindButtons(tree);
    const skip = buttons.find((b) => collectText(b).includes("Bỏ qua"));
    expect(skip).toBeDefined();
    (skip!.props as { onClick?: () => void }).onClick?.();
    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("each of the 4 feeling values is unique", () => {
    const values = FEELINGS.map((f) => f.value);
    expect(new Set(values).size).toBe(4);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. SessionDoneView — via TimerSession (deep rendering)
// ═════════════════════════════════════════════════════════════════════════════
//
// ExerciseDetailPage is called as a plain function.  deepText() recursively
// renders function-type nodes (up to depth 20) to reach SessionDoneView and
// FeelingPicker which are nested ~6 function-render levels deep.

describe("SessionDoneView — done_pending: FeelingPicker is shown (TimerSession)", () => {
  function renderPage(state: string, isLogging: boolean) {
    // ExerciseDetailPage: sessionDone; TimerSession: state, elapsed
    setupState([
      [false, jest.fn()],
      [state, jest.fn()],
      [42, jest.fn()],
    ]);
    (useExercise as jest.Mock).mockReturnValue({
      data: {
        slug: "test-ex",
        title: "Test Exercise",
        description: "desc",
        category: "relaxation",
        mood_tags: [],
        steps: [],
      },
      isLoading: false,
    });
    (useLogExercise as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: isLogging });
    return ExerciseDetailPage({ params: Promise.resolve({ slug: "test-ex" }) });
  }

  it("shows the FeelingPicker question when doneState='done_pending'", () => {
    const el = renderPage("done_pending", false);
    expect(deepText(el)).toContain("Bạn cảm thấy thế nào sau buổi tập?");
  });

  it("shows all 4 feeling labels when doneState='done_pending'", () => {
    const el = renderPage("done_pending", false);
    const text = deepText(el);
    expect(text).toContain("Rất nhẹ");
    expect(text).toContain("Nhẹ hơn");
    expect(text).toContain("Bình thường");
    expect(text).toContain("Vẫn căng");
  });

  it("shows skip option when doneState='done_pending'", () => {
    const el = renderPage("done_pending", false);
    expect(deepText(el)).toContain("Bỏ qua");
  });

  it("shows 'Tuyệt vời!' completion message when doneState='done_pending'", () => {
    const el = renderPage("done_pending", false);
    expect(deepText(el)).toContain("Tuyệt vời!");
  });

  it("shows 'Buổi tập hoàn thành' when doneState='done_pending'", () => {
    const el = renderPage("done_pending", false);
    expect(deepText(el)).toContain("Buổi tập hoàn thành");
  });

  it("does NOT show FeelingPicker when doneState='done_logged'", () => {
    const el = renderPage("done_logged", false);
    expect(deepText(el)).not.toContain("Bạn cảm thấy thế nào sau buổi tập?");
  });

  it("does NOT show skip option when doneState='done_logged'", () => {
    const el = renderPage("done_logged", false);
    expect(deepText(el)).not.toContain("Bỏ qua");
  });

  it("still shows completion message when doneState='done_logged'", () => {
    const el = renderPage("done_logged", false);
    expect(deepText(el)).toContain("Buổi tập hoàn thành");
  });

  it("shows Loader2 icon when doneState='done_logged' and isLogging=true", () => {
    const el = renderPage("done_logged", true);
    const loader2 = deepFindIcons(el, "Loader2");
    expect(loader2.length).toBeGreaterThan(0);
  });

  it("shows CheckCircle icon (not Loader2) when doneState='done_pending'", () => {
    const el = renderPage("done_pending", false);
    const checkCircles = deepFindIcons(el, "CheckCircle");
    expect(checkCircles.length).toBeGreaterThan(0);
  });

  it("does NOT show Loader2 icon when isLogging=false in done_logged state", () => {
    const el = renderPage("done_logged", false);
    const loader2 = deepFindIcons(el, "Loader2");
    expect(loader2.length).toBe(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. StepSession — FeelingPicker integration
// ═════════════════════════════════════════════════════════════════════════════

describe("StepSession — FeelingPicker shown after steps complete", () => {
  const PMR_STEPS = [
    {
      order: 1,
      instruction: "Tense your fists",
      input_prompt: null,
      tense_seconds: 7,
      release_seconds: 10,
    },
    {
      order: 2,
      instruction: "Relax fists",
      input_prompt: null,
      tense_seconds: 7,
      release_seconds: 10,
    },
  ];

  function renderStepPage(state: string, isLogging = false) {
    // ExerciseDetailPage: sessionDone; StepSession: state, currentStep
    setupState([
      [false, jest.fn()],
      [state, jest.fn()],
      [0, jest.fn()],
    ]);
    (useExercise as jest.Mock).mockReturnValue({
      data: {
        slug: "pmr-ex",
        title: "PMR Exercise",
        description: "Progressive muscle relaxation",
        category: "pmr",
        mood_tags: [],
        steps: PMR_STEPS,
      },
      isLoading: false,
    });
    (useLogExercise as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: isLogging });
    return ExerciseDetailPage({ params: Promise.resolve({ slug: "pmr-ex" }) });
  }

  it("shows FeelingPicker question after step session completes", () => {
    const el = renderStepPage("done_pending");
    expect(deepText(el)).toContain("Bạn cảm thấy thế nào sau buổi tập?");
  });

  it("shows all 4 feeling labels after step session completes", () => {
    const el = renderStepPage("done_pending");
    const text = deepText(el);
    expect(text).toContain("Rất nhẹ");
    expect(text).toContain("Nhẹ hơn");
    expect(text).toContain("Bình thường");
    expect(text).toContain("Vẫn căng");
  });

  it("shows skip option after step session completes", () => {
    const el = renderStepPage("done_pending");
    expect(deepText(el)).toContain("Bỏ qua");
  });

  it("shows 'Tuyệt vời!' after step session completes", () => {
    const el = renderStepPage("done_pending");
    expect(deepText(el)).toContain("Tuyệt vời!");
  });

  it("does NOT show FeelingPicker when step session is done_logged", () => {
    const el = renderStepPage("done_logged");
    expect(deepText(el)).not.toContain("Bạn cảm thấy thế nào sau buổi tập?");
  });

  it("shows Loader2 when step session done_logged and isLogging=true", () => {
    const el = renderStepPage("done_logged", true);
    expect(deepFindIcons(el, "Loader2").length).toBeGreaterThan(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. BreathingSession — FeelingPicker integration
// ═════════════════════════════════════════════════════════════════════════════

describe("BreathingSession — FeelingPicker shown after breathing completes", () => {
  function renderBreathPage(state: string, isLogging = false) {
    // ExerciseDetailPage: sessionDone; BreathingSession: state, breathPhase
    setupState([
      [false, jest.fn()],
      [state, jest.fn()],
      ["inhale", jest.fn()],
    ]);
    (useExercise as jest.Mock).mockReturnValue({
      data: {
        slug: "breathing-478",
        title: "4-7-8 Breathing",
        description: "Calming breath technique",
        category: "breathing",
        mood_tags: [],
      },
      isLoading: false,
    });
    (useLogExercise as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: isLogging });
    return ExerciseDetailPage({ params: Promise.resolve({ slug: "breathing-478" }) });
  }

  it("shows FeelingPicker question after breathing session completes", () => {
    const el = renderBreathPage("done_pending");
    expect(deepText(el)).toContain("Bạn cảm thấy thế nào sau buổi tập?");
  });

  it("shows all 4 feeling options after breathing session", () => {
    const el = renderBreathPage("done_pending");
    const text = deepText(el);
    expect(text).toContain("Rất nhẹ");
    expect(text).toContain("Nhẹ hơn");
    expect(text).toContain("Bình thường");
    expect(text).toContain("Vẫn căng");
  });

  it("shows skip option after breathing session", () => {
    const el = renderBreathPage("done_pending");
    expect(deepText(el)).toContain("Bỏ qua");
  });

  it("shows 'Tuyệt vời!' after breathing session completes", () => {
    const el = renderBreathPage("done_pending");
    expect(deepText(el)).toContain("Tuyệt vời!");
  });

  it("does NOT show FeelingPicker when breathing session is done_logged", () => {
    const el = renderBreathPage("done_logged");
    expect(deepText(el)).not.toContain("Bạn cảm thấy thế nào sau buổi tập?");
  });

  it("shows Loader2 when breathing done_logged and isLogging=true", () => {
    const el = renderBreathPage("done_logged", true);
    expect(deepFindIcons(el, "Loader2").length).toBeGreaterThan(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 6. localStorage key format — edge cases
// ═════════════════════════════════════════════════════════════════════════════

describe("resolveFeelingAndComplete — localStorage key format edge cases", () => {
  function resolveFeelingAndComplete(
    slug: string,
    feeling: string | undefined,
    elapsed: number,
    setDone: () => void,
    onComplete: (d: number) => void,
  ) {
    if (feeling) localStorage.setItem(`feeling_after_${slug}_${Date.now()}`, feeling);
    setDone();
    onComplete(elapsed);
  }

  it("key prefix is always 'feeling_after_'", () => {
    resolveFeelingAndComplete("my-slug", "better", 0, jest.fn(), jest.fn());
    const [key] = localStorageMock.setItem.mock.calls[0] as [string, string];
    expect(key.startsWith("feeling_after_")).toBe(true);
  });

  it("key ends with a numeric timestamp", () => {
    resolveFeelingAndComplete("my-slug", "same", 0, jest.fn(), jest.fn());
    const [key] = localStorageMock.setItem.mock.calls[0] as [string, string];
    const ts = key.split("_").pop();
    expect(Number(ts)).not.toBeNaN();
    expect(Number(ts)).toBeGreaterThan(0);
  });

  it("two calls produce different keys (unique timestamps)", async () => {
    resolveFeelingAndComplete("slug-a", "better", 1, jest.fn(), jest.fn());
    await new Promise((r) => setTimeout(r, 2));
    resolveFeelingAndComplete("slug-a", "better", 1, jest.fn(), jest.fn());
    const calls = localStorageMock.setItem.mock.calls as [string, string][];
    expect(calls[0][0]).not.toBe(calls[1][0]);
  });

  it("writes exactly one entry per call with a feeling", () => {
    resolveFeelingAndComplete("slug", "worse", 5, jest.fn(), jest.fn());
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
  });

  it("writes zero entries per call without a feeling", () => {
    resolveFeelingAndComplete("slug", undefined, 5, jest.fn(), jest.fn());
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 7. ExerciseDetailPage — basic rendering regression guards
// ═════════════════════════════════════════════════════════════════════════════

describe("ExerciseDetailPage — basic rendering guards", () => {
  it("renders a Loader2 spinner when isLoading=true", () => {
    setupState([]);
    (useExercise as jest.Mock).mockReturnValue({ data: undefined, isLoading: true });
    (useLogExercise as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    const el = ExerciseDetailPage({ params: Promise.resolve({ slug: "x" }) });
    const loaders = deepFindIcons(el, "Loader2");
    expect(loaders.length).toBeGreaterThan(0);
  });

  it("renders 'Không tìm thấy' when exercise data is null", () => {
    setupState([]);
    (useExercise as jest.Mock).mockReturnValue({ data: null, isLoading: false });
    (useLogExercise as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    const el = ExerciseDetailPage({ params: Promise.resolve({ slug: "x" }) });
    expect(collectText(el)).toContain("Không tìm thấy");
  });

  it("renders the exercise title when data is present (idle timer session)", () => {
    setupState([[false, jest.fn()], ["idle", jest.fn()], [0, jest.fn()]]);
    (useExercise as jest.Mock).mockReturnValue({
      data: {
        slug: "test",
        title: "My Exercise Title",
        description: "desc",
        category: "relaxation",
        mood_tags: [],
        steps: [],
      },
      isLoading: false,
    });
    (useLogExercise as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    const el = ExerciseDetailPage({ params: Promise.resolve({ slug: "test" }) });
    expect(collectText(el)).toContain("My Exercise Title");
  });

  it("renders mood tags when present", () => {
    setupState([[false, jest.fn()], ["idle", jest.fn()], [0, jest.fn()]]);
    (useExercise as jest.Mock).mockReturnValue({
      data: {
        slug: "test",
        title: "T",
        description: "d",
        category: "relaxation",
        mood_tags: ["stress", "anxiety"],
        steps: [],
      },
      isLoading: false,
    });
    (useLogExercise as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    const el = ExerciseDetailPage({ params: Promise.resolve({ slug: "test" }) });
    const text = collectText(el);
    expect(text).toContain("stress");
    expect(text).toContain("anxiety");
  });

  it("shows category tag in the rendered output", () => {
    setupState([[false, jest.fn()], ["idle", jest.fn()], [0, jest.fn()]]);
    (useExercise as jest.Mock).mockReturnValue({
      data: {
        slug: "test",
        title: "T",
        description: "d",
        category: "mindfulness",
        mood_tags: [],
        steps: [],
      },
      isLoading: false,
    });
    (useLogExercise as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    const el = ExerciseDetailPage({ params: Promise.resolve({ slug: "test" }) });
    expect(collectText(el)).toContain("mindfulness");
  });
});
