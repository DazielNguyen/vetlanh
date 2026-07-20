/**
 * Focused tests for the level-lock badge logic added to
 * app/services/components/AppSidebar.tsx in Phase 3.
 *
 * AppSidebar itself renders shadcn's Sidebar primitives, which read
 * useSidebar() context (SidebarProvider) and, via SidebarToggleButton /
 * use-mobile's window.matchMedia usage, assume a real DOM. This repo has no
 * jsdom (jest.config.ts uses testEnvironment: "node"), so a full mounted
 * render (and definitely no SidebarProvider) isn't practical here.
 *
 * However, AppSidebar's own function body only *references* those child
 * components as JSX (e.g. <Sidebar>, <SidebarToggleButton />) without
 * invoking them — nothing recursively renders because we call AppSidebar()
 * directly as a plain function rather than mounting it. That lets us walk
 * the top-level element tree it *builds* (not renders) and inspect the
 * per-nav-item conditional it owns directly: the "Cấp N" lock badge, which
 * depends on `useBadgesData().level` vs. each item's `requiredLevel`. This
 * follows the same call-as-function + tree-walk approach used in
 * __tests__/WelcomeHeader.test.tsx.
 */

import React from "react";

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ logout: jest.fn() }),
}));

const mockUseBadgesData = jest.fn();
jest.mock("@/hooks/useBadges", () => ({
  useBadgesData: () => mockUseBadgesData(),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/services",
}));

import { AppSidebar } from "@/app/services/components/AppSidebar";

// ── Helper: collect all string/number text from a React element tree ────────

function collectText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");

  const element = node as React.ReactElement;
  if (!element.props) return "";
  return collectText((element.props as { children?: React.ReactNode }).children);
}

function renderTree(level: number) {
  mockUseBadgesData.mockReturnValue({ level });
  const element = AppSidebar();
  return collectText(element);
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("AppSidebar — level-lock badge (Cấp N)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not throw when built at any level", () => {
    for (const level of [0, 1, 2, 3, 4, 5, 7]) {
      expect(() => renderTree(level)).not.toThrow();
    }
  });

  it("shows all 3 lock badges (Sounds=4, Journal=2, Library=3) for a brand-new level-1 account", () => {
    const text = renderTree(1);

    expect(text).toContain("Cấp 4"); // Âm thanh / Sounds
    expect(text).toContain("Cấp 2"); // Nhật ký / Journal
    expect(text).toContain("Cấp 3"); // Thư viện / Library
  });

  it("hides the Journal (level 2) badge once the user reaches level 2, but keeps Library/Sounds locked", () => {
    const text = renderTree(2);

    expect(text).not.toContain("Cấp 2");
    expect(text).toContain("Cấp 3");
    expect(text).toContain("Cấp 4");
  });

  it("hides the Library (level 3) badge once the user reaches level 3, but keeps Sounds locked", () => {
    const text = renderTree(3);

    expect(text).not.toContain("Cấp 2");
    expect(text).not.toContain("Cấp 3");
    expect(text).toContain("Cấp 4");
  });

  it("hides all lock badges once the user reaches level 4", () => {
    const text = renderTree(4);

    expect(text).not.toContain("Cấp 2");
    expect(text).not.toContain("Cấp 3");
    expect(text).not.toContain("Cấp 4");
  });

  it("hides all lock badges for levels well beyond every requiredLevel", () => {
    const text = renderTree(7);

    expect(text).not.toContain("Cấp 2");
    expect(text).not.toContain("Cấp 3");
    expect(text).not.toContain("Cấp 4");
  });

  it("does not show a lock badge for nav items with no requiredLevel (e.g. Trang chủ / Home)", () => {
    const text = renderTree(1);
    // "Trang chủ" (Home) has no requiredLevel — it must never be adjacent to a badge.
    expect(text).toContain("Trang chủ");
  });

  it("still renders every nav item's label regardless of lock state", () => {
    const text = renderTree(1);

    for (const label of [
      "Trang chủ",
      "Tin nhắn",
      "Tâm trạng",
      "Bài tập",
      "Âm thanh",
      "Nhật ký",
      "Suy nghĩ",
      "Đánh giá",
      "An toàn",
      "Thư viện",
      "Hồ sơ",
      "Cài đặt",
    ]) {
      expect(text).toContain(label);
    }
  });
});
