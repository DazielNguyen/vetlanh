/**
 * Unit tests for app/services/components/WelcomeHeader.tsx
 *
 * WelcomeHeader is a pure presentational component.  We call it as a function
 * and inspect the React element tree — no jsdom required.
 *
 * Key behaviours:
 *  1. Renders the `greeting` prop when provided.
 *  2. Renders the fallback text "Chào mừng trở lại" when `greeting` is undefined.
 */

import React from "react";
import { WelcomeHeader } from "@/app/services/components/WelcomeHeader";

// ── Helper: shallow text extraction ──────────────────────────────────────────

/**
 * Recursively collect all string / number children from a React element tree.
 * This lets us assert on visible text without a DOM or renderToString.
 */
function collectText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");

  const element = node as React.ReactElement;
  if (!element.props) return "";
  return collectText(element.props.children);
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("WelcomeHeader — greeting prop", () => {
  it("renders the provided greeting text", () => {
    const el = WelcomeHeader({ greeting: "Xin chào, Duy!" });
    const text = collectText(el);
    expect(text).toContain("Xin chào, Duy!");
  });

  it("renders a different custom greeting string", () => {
    const el = WelcomeHeader({ greeting: "Chào buổi sáng!" });
    const text = collectText(el);
    expect(text).toContain("Chào buổi sáng!");
  });

  it("renders the fallback text when greeting is undefined", () => {
    const el = WelcomeHeader({});
    const text = collectText(el);
    expect(text).toContain("Chào mừng trở lại");
  });

  it("renders the fallback text when called with no props", () => {
    // TypeScript allows passing {} because greeting is optional
    const el = WelcomeHeader({} as { greeting?: string });
    const text = collectText(el);
    expect(text).toContain("Chào mừng trở lại");
  });

  it("does NOT render the fallback when a greeting is given", () => {
    const el = WelcomeHeader({ greeting: "Hello!" });
    const text = collectText(el);
    // The h1 content should be the custom greeting, not the fallback
    expect(text).not.toContain("Chào mừng trở lại");
  });

  it("always renders the subtitle paragraph", () => {
    const el = WelcomeHeader({ greeting: "Hi" });
    const text = collectText(el);
    expect(text).toContain("Hãy hít thở thật sâu");
  });

  it("returns a React element (not null or undefined)", () => {
    const el = WelcomeHeader({ greeting: "Test" });
    expect(el).not.toBeNull();
    expect(el).not.toBeUndefined();
  });
});
