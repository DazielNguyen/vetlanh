/**
 * Unit tests for
 * app/services/thought-records/components/ThoughtRecordForm.tsx
 *
 * Focused on the new `initialValues?: Partial<ThoughtRecordRequest>` prop
 * added for the guided-flow "switch to static form" handoff — merged into
 * the form's initial `useState` when not editing (no `editId`).
 *
 * Rendered with react-dom/server's renderToStaticMarkup (no jsdom in this
 * repo), following __tests__/SafetyPlanPage.render.test.tsx's pattern of
 * mocking the React-Query-backed hooks directly.
 *
 * SCOPE NOTE: `form` is seeded once via
 * `useState({ ...EMPTY, ...initialValues })`, which SSR happily runs (unlike
 * useEffect, which SSR skips) — so the merge itself IS directly observable
 * in the rendered markup for the create (non-editing) path. The *editing*
 * path's effect (`useEffect(() => { if (existing) setForm(existing) ... })`)
 * never runs under SSR either way, so this file cannot show that
 * `initialValues` is ignored once real `existing` data loads in the browser
 * — that overwrite is effect-driven and out of reach without jsdom. It only
 * confirms the documented contract for the reachable non-editing path.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ThoughtRecordRequest } from "@/types/thoughtRecord";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockUseThoughtRecordHints = jest.fn(() => ({ data: undefined }));
const mockUseThoughtRecord = jest.fn(() => ({ data: undefined, isLoading: false }));
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockUseCreateThoughtRecord = jest.fn(() => ({ mutate: mockCreate, isPending: false }));
const mockUseUpdateThoughtRecord = jest.fn(() => ({ mutate: mockUpdate, isPending: false }));

jest.mock("@/hooks/useThoughtRecords", () => ({
  useThoughtRecordHints: () => mockUseThoughtRecordHints(),
  useThoughtRecord: (id: string | undefined) => mockUseThoughtRecord(id),
  useCreateThoughtRecord: () => mockUseCreateThoughtRecord(),
  useUpdateThoughtRecord: () => mockUseUpdateThoughtRecord(),
}));

// ── SUT import ────────────────────────────────────────────────────────────────

import { ThoughtRecordForm } from "@/app/services/thought-records/components/ThoughtRecordForm";

function render(overrides: Partial<React.ComponentProps<typeof ThoughtRecordForm>> = {}) {
  const onSaved = overrides.onSaved ?? jest.fn();
  const onCancel = overrides.onCancel ?? jest.fn();
  return renderToStaticMarkup(React.createElement(ThoughtRecordForm, { onSaved, onCancel, ...overrides }));
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseThoughtRecordHints.mockReturnValue({ data: undefined });
  mockUseThoughtRecord.mockReturnValue({ data: undefined, isLoading: false });
  mockUseCreateThoughtRecord.mockReturnValue({ mutate: mockCreate, isPending: false });
  mockUseUpdateThoughtRecord.mockReturnValue({ mutate: mockUpdate, isPending: false });
});

describe("ThoughtRecordForm — initialValues prop (new, non-editing path)", () => {
  it("renders without throwing when initialValues is omitted", () => {
    expect(() => render()).not.toThrow();
  });

  it("pre-fills the situation textarea with initialValues.situation when creating (no editId)", () => {
    const initialValues: Partial<ThoughtRecordRequest> = { situation: "Họp nhóm căng thẳng" };
    const markup = render({ initialValues });
    expect(markup).toMatch(/<textarea[^>]*>Họp nhóm căng thẳng<\/textarea>/);
  });

  it("pre-fills multiple fields at once from a partial initialValues object", () => {
    const initialValues: Partial<ThoughtRecordRequest> = {
      situation: "Bị sếp phê bình",
      automatic_thought: "Mình thật vô dụng",
      emotion: "Buồn 80%",
    };
    const markup = render({ initialValues });
    expect(markup).toContain("Bị sếp phê bình");
    expect(markup).toContain("Mình thật vô dụng");
    expect(markup).toContain("Buồn 80%");
  });

  it("leaves fields not present in initialValues empty", () => {
    const initialValues: Partial<ThoughtRecordRequest> = { situation: "Chỉ có tình huống" };
    const markup = render({ initialValues });
    // evidence_for / evidence_against textareas should be empty (no inner text)
    const textareas = markup.match(/<textarea[^>]*>[^<]*<\/textarea>/g) ?? [];
    const nonEmpty = textareas.filter((t) => !/><\/textarea>$/.test(t));
    expect(nonEmpty).toHaveLength(1);
    expect(nonEmpty[0]).toContain("Chỉ có tình huống");
  });

  it("renders all fields empty when neither initialValues nor an existing record is present", () => {
    const markup = render();
    const textareas = markup.match(/<textarea[^>]*>[^<]*<\/textarea>/g) ?? [];
    expect(textareas.every((t) => /><\/textarea>$/.test(t))).toBe(true);
  });

  it("does not call create just from mounting with initialValues pre-filled", () => {
    render({ initialValues: { situation: "abc" } });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("shows the 'new note' title (not 'edit') when creating with initialValues but no editId", () => {
    const markup = render({ initialValues: { situation: "abc" } });
    expect(markup).toContain("Ghi chú suy nghĩ mới");
    expect(markup).not.toContain("Chỉnh sửa ghi chú");
  });
});

describe("ThoughtRecordForm — editing path (unaffected by initialValues)", () => {
  it("shows a loading spinner while an existing record is loading, regardless of initialValues", () => {
    mockUseThoughtRecord.mockReturnValue({ data: undefined, isLoading: true });
    const markup = render({ editId: "123", initialValues: { situation: "should be irrelevant while loading" } });
    expect(markup).toContain("animate-spin");
    expect(markup).not.toContain("should be irrelevant while loading");
  });
});
