/**
 * Unit tests for FeatureUnavailable in components/ui/state.tsx
 *
 * FeatureUnavailable is a static presentational component (no hooks), so we
 * call it as a function and inspect the React element tree — matching the
 * existing convention in this repo (testEnvironment: "node", no RTL).
 *
 * Key behaviours:
 *   1. Renders the default message when no `message` prop given.
 *   2. Renders a custom `message` when provided.
 *   3. Renders the optional `description` line only when provided.
 *   4. Never renders a retry button (no onRetry prop exists on this component).
 *   5. Renders the LockKeyhole icon (not AlertTriangle, which ErrorCard uses).
 */

import React from "react";
import { FeatureUnavailable } from "@/components/ui/state";

// ── Helpers ───────────────────────────────────────────────────────────────────

function collectText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");
  const element = node as React.ReactElement;
  if (!element.props) return "";
  return collectText((element.props as { children?: React.ReactNode }).children);
}

/** Recursively collect every element "type" (component/tag) found in the tree. */
function collectTypes(node: React.ReactNode): unknown[] {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap(collectTypes);
  const element = node as React.ReactElement;
  const types: unknown[] = [element.type];
  const children = (element.props as { children?: React.ReactNode } | undefined)?.children;
  if (children) types.push(...collectTypes(children));
  return types;
}

/** Recursively collect every "button" element found in the tree (by type or by component name heuristics). */
function collectButtons(node: React.ReactNode): React.ReactElement[] {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap(collectButtons);
  const element = node as React.ReactElement;
  const buttons: React.ReactElement[] = [];
  const typeName =
    typeof element.type === "string"
      ? element.type
      : (element.type as { displayName?: string; name?: string })?.displayName ??
        (element.type as { name?: string })?.name ??
        "";
  if (typeName === "button" || typeName === "Button") buttons.push(element);
  const children = (element.props as { children?: React.ReactNode } | undefined)?.children;
  if (children) buttons.push(...collectButtons(children));
  return buttons;
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("FeatureUnavailable — message", () => {
  it("renders the default message when no message prop is given", () => {
    const el = FeatureUnavailable({});
    const text = collectText(el);
    expect(text).toContain("Tính năng đang được phát triển");
  });

  it("renders a custom message when provided", () => {
    const el = FeatureUnavailable({ message: "Bảng câu hỏi PHQ-9 chưa khả dụng" });
    const text = collectText(el);
    expect(text).toContain("Bảng câu hỏi PHQ-9 chưa khả dụng");
  });

  it("does not render the default message when a custom message overrides it", () => {
    const el = FeatureUnavailable({ message: "Custom message" });
    const text = collectText(el);
    expect(text).not.toContain("Tính năng đang được phát triển");
    expect(text).toContain("Custom message");
  });
});

describe("FeatureUnavailable — description", () => {
  it("does not render a description paragraph when none is provided", () => {
    const el = FeatureUnavailable({ message: "Hello" });
    const text = collectText(el);
    expect(text).toBe("Hello");
  });

  it("renders the description text when provided", () => {
    const el = FeatureUnavailable({
      message: "Hello",
      description: "Vui lòng quay lại sau.",
    });
    const text = collectText(el);
    expect(text).toContain("Vui lòng quay lại sau.");
  });

  it("renders both message and description together, in order", () => {
    const el = FeatureUnavailable({
      message: "Tính năng đang được phát triển",
      description: "Bảng câu hỏi PHQ-9 sẽ sớm có mặt.",
    });
    const text = collectText(el);
    expect(text.indexOf("Tính năng đang được phát triển")).toBeLessThan(
      text.indexOf("Bảng câu hỏi PHQ-9 sẽ sớm có mặt.")
    );
  });
});

describe("FeatureUnavailable — no retry button", () => {
  it("never renders a <button> or Button element (no onRetry prop exists)", () => {
    const el = FeatureUnavailable({ message: "Hello", description: "World" });
    const buttons = collectButtons(el);
    expect(buttons).toHaveLength(0);
  });

  it("renders no clickable affordance text like 'Thử lại'", () => {
    const el = FeatureUnavailable({});
    const text = collectText(el);
    expect(text).not.toContain("Thử lại");
  });
});

describe("FeatureUnavailable — icon", () => {
  it("renders the LockKeyhole icon, not AlertTriangle", () => {
    const el = FeatureUnavailable({});
    const types = collectTypes(el);
    const typeNames = types.map((t) =>
      typeof t === "function" || typeof t === "object"
        ? ((t as { displayName?: string; name?: string })?.displayName ??
          (t as { name?: string })?.name ??
          "")
        : String(t)
    );
    expect(typeNames).toContain("LockKeyhole");
    // lucide-react's AlertTriangle export currently carries displayName "TriangleAlert"
    expect(typeNames).not.toContain("TriangleAlert");
    expect(typeNames).not.toContain("AlertTriangle");
  });
});

describe("FeatureUnavailable — return value", () => {
  it("returns a React element (not null)", () => {
    const el = FeatureUnavailable({});
    expect(el).not.toBeNull();
    expect(el).not.toBeUndefined();
  });

  it("applies a custom className to the outer Card", () => {
    const el = FeatureUnavailable({ className: "my-custom-class" });
    // Card is the root element; inspect its className prop directly.
    const root = el as React.ReactElement<{ className?: string }>;
    expect(root.props.className).toContain("my-custom-class");
  });
});
