/**
 * Unit tests for app/services/components/Phq9ReminderBanner.tsx
 *
 * Phq9ReminderBanner is a static presentational component.
 * We call it as a function and inspect the React element tree — no jsdom needed.
 *
 * Key behaviours:
 *  1. Renders a banner with the correct heading text.
 *  2. Contains a link pointing to /services/assessment.
 *  3. Renders the "Làm ngay" call-to-action.
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

// next/link renders as a passthrough anchor-like element in the test environment
jest.mock("next/link", () => {
  const React = require("react");
  // Expose href as a prop so we can inspect it from the element tree
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

// ── SUT imports ───────────────────────────────────────────────────────────────

import React from "react";
import { Phq9ReminderBanner } from "@/app/services/components/Phq9ReminderBanner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function collectText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");
  const element = node as React.ReactElement;
  if (!element.props) return "";
  return collectText(element.props.children);
}

/**
 * Collect all `href` props found anywhere in the React element tree.
 */
function collectHrefs(node: React.ReactNode): string[] {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap(collectHrefs);
  const element = node as React.ReactElement;
  const hrefs: string[] = [];
  if (element.props?.href) hrefs.push(String(element.props.href));
  if (element.props?.children) hrefs.push(...collectHrefs(element.props.children));
  return hrefs;
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("Phq9ReminderBanner — content", () => {
  it("renders the primary heading text", () => {
    const el = Phq9ReminderBanner();
    const text = collectText(el);
    expect(text).toContain("Đã đến lúc kiểm tra sức khỏe tâm lý");
  });

  it("renders the subtitle / description text", () => {
    const el = Phq9ReminderBanner();
    const text = collectText(el);
    expect(text).toContain("PHQ-9");
  });

  it("renders the call-to-action button label 'Làm ngay'", () => {
    const el = Phq9ReminderBanner();
    const text = collectText(el);
    expect(text).toContain("Làm ngay");
  });

  it("returns a React element (not null)", () => {
    const el = Phq9ReminderBanner();
    expect(el).not.toBeNull();
    expect(el).not.toBeUndefined();
  });
});

describe("Phq9ReminderBanner — link", () => {
  it("contains a link with href /services/assessment", () => {
    const el = Phq9ReminderBanner();
    const hrefs = collectHrefs(el);
    expect(hrefs).toContain("/services/assessment");
  });

  it("has exactly one link pointing to /services/assessment", () => {
    const el = Phq9ReminderBanner();
    const hrefs = collectHrefs(el);
    const assessmentLinks = hrefs.filter((h) => h === "/services/assessment");
    expect(assessmentLinks).toHaveLength(1);
  });

  it("does not link to any other assessment path", () => {
    const el = Phq9ReminderBanner();
    const hrefs = collectHrefs(el);
    // All hrefs should either be /services/assessment or nothing unexpected
    hrefs.forEach((href) => {
      expect(href).toBe("/services/assessment");
    });
  });
});
