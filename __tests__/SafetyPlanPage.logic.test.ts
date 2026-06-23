/**
 * Logic tests for the ListSection / ContactList add/remove handlers and the
 * pre-fill effect in app/services/safety-plan/page.tsx.
 *
 * This repo's Jest config has no jsdom (testEnvironment: "node"), so DOM
 * events (typing, Enter keydown, clicks) cannot be dispatched against a real
 * render. ListSection/ContactList are also not exported from the page module.
 * Following the existing convention in __tests__/useSafetyPlan.test.ts (which
 * extracts hook logic verbatim into standalone functions and tests those
 * directly), this file mirrors the *exact* handler bodies from page.tsx:
 *
 *   addListItem   — trims input, no-ops on empty/whitespace-only string
 *   removeListItem — filters out by index
 *   addContact    — requires both name and phone to be non-empty after trim
 *   removeContact  — filters out by index
 *   ListSection's submitDraft  — calls onAdd(draft) then clears draft
 *   ContactList's submitDraft  — calls onAdd({name, phone}) then clears both
 *   pre-fill effect — setForm(plan) only when plan is truthy
 *
 * Any drift between this file and page.tsx should be caught by
 * SafetyPlanPage.render.test.tsx (structural rendering) and by code review.
 */

import type { SafetyPlan, TrustedContact } from "@/types/safetyPlan";

// ── Mirrored logic (verbatim from app/services/safety-plan/page.tsx) ──────────

const EMPTY: SafetyPlan = {
  warning_signs: [],
  coping_activities: [],
  trusted_contacts: [],
  reasons_to_live: "",
};

function addListItem(
  form: SafetyPlan,
  key: "warning_signs" | "coping_activities",
  value: string
): SafetyPlan {
  const trimmed = value.trim();
  if (!trimmed) return form;
  return { ...form, [key]: [...form[key], trimmed] };
}

function removeListItem(
  form: SafetyPlan,
  key: "warning_signs" | "coping_activities",
  index: number
): SafetyPlan {
  return { ...form, [key]: form[key].filter((_, i) => i !== index) };
}

function addContact(form: SafetyPlan, contact: TrustedContact): SafetyPlan {
  if (!contact.name.trim() || !contact.phone.trim()) return form;
  return { ...form, trusted_contacts: [...form.trusted_contacts, contact] };
}

function removeContact(form: SafetyPlan, index: number): SafetyPlan {
  return {
    ...form,
    trusted_contacts: form.trusted_contacts.filter((_, i) => i !== index),
  };
}

/** Mirrors ListSection's internal submitDraft(): onAdd(draft) then clear. */
function listSectionSubmitDraft(draft: string, onAdd: (value: string) => void): string {
  onAdd(draft);
  return ""; // setDraft("")
}

/** Mirrors ContactList's internal submitDraft(): onAdd({name, phone}) then clear both. */
function contactListSubmitDraft(
  name: string,
  phone: string,
  onAdd: (contact: TrustedContact) => void
): { name: string; phone: string } {
  onAdd({ name, phone });
  return { name: "", phone: "" };
}

/** Mirrors the pre-fill useEffect: `if (plan) setForm(plan)`. */
function prefillEffect(plan: SafetyPlan | null | undefined, currentForm: SafetyPlan): SafetyPlan {
  return plan ? plan : currentForm;
}

// ── Tests: addListItem / removeListItem ────────────────────────────────────────

describe("addListItem", () => {
  it("appends a trimmed value to the target list", () => {
    const result = addListItem(EMPTY, "warning_signs", "Mất ngủ");
    expect(result.warning_signs).toEqual(["Mất ngủ"]);
  });

  it("trims leading/trailing whitespace before adding", () => {
    const result = addListItem(EMPTY, "warning_signs", "  Mệt mỏi  ");
    expect(result.warning_signs).toEqual(["Mệt mỏi"]);
  });

  it("is a no-op for an empty string", () => {
    const result = addListItem(EMPTY, "warning_signs", "");
    expect(result).toBe(EMPTY);
    expect(result.warning_signs).toEqual([]);
  });

  it("is a no-op for a whitespace-only string", () => {
    const result = addListItem(EMPTY, "coping_activities", "    ");
    expect(result).toBe(EMPTY);
    expect(result.coping_activities).toEqual([]);
  });

  it("does not mutate the other list when adding to one key", () => {
    const base: SafetyPlan = { ...EMPTY, coping_activities: ["Đi bộ"] };
    const result = addListItem(base, "warning_signs", "Mất ngủ");
    expect(result.coping_activities).toEqual(["Đi bộ"]);
    expect(result.warning_signs).toEqual(["Mất ngủ"]);
  });

  it("appends to an already-populated list, preserving order", () => {
    const base: SafetyPlan = { ...EMPTY, warning_signs: ["A", "B"] };
    const result = addListItem(base, "warning_signs", "C");
    expect(result.warning_signs).toEqual(["A", "B", "C"]);
  });
});

describe("removeListItem", () => {
  it("removes the item at the given index", () => {
    const base: SafetyPlan = { ...EMPTY, warning_signs: ["A", "B", "C"] };
    const result = removeListItem(base, "warning_signs", 1);
    expect(result.warning_signs).toEqual(["A", "C"]);
  });

  it("is a no-op (returns equivalent list) when index is out of bounds", () => {
    const base: SafetyPlan = { ...EMPTY, warning_signs: ["A"] };
    const result = removeListItem(base, "warning_signs", 5);
    expect(result.warning_signs).toEqual(["A"]);
  });

  it("results in an empty list when removing the only item", () => {
    const base: SafetyPlan = { ...EMPTY, coping_activities: ["Only one"] };
    const result = removeListItem(base, "coping_activities", 0);
    expect(result.coping_activities).toEqual([]);
  });
});

// ── Tests: addContact / removeContact ───────────────────────────────────────────

describe("addContact", () => {
  it("adds a contact when both name and phone are non-empty", () => {
    const result = addContact(EMPTY, { name: "Mẹ", phone: "0900000001" });
    expect(result.trusted_contacts).toEqual([{ name: "Mẹ", phone: "0900000001" }]);
  });

  it("is a no-op when name is empty", () => {
    const result = addContact(EMPTY, { name: "", phone: "0900000001" });
    expect(result).toBe(EMPTY);
    expect(result.trusted_contacts).toEqual([]);
  });

  it("is a no-op when phone is empty", () => {
    const result = addContact(EMPTY, { name: "Mẹ", phone: "" });
    expect(result).toBe(EMPTY);
  });

  it("is a no-op when name is whitespace-only", () => {
    const result = addContact(EMPTY, { name: "   ", phone: "0900000001" });
    expect(result.trusted_contacts).toEqual([]);
  });

  it("is a no-op when phone is whitespace-only", () => {
    const result = addContact(EMPTY, { name: "Mẹ", phone: "   " });
    expect(result.trusted_contacts).toEqual([]);
  });

  it("appends to an existing contact list", () => {
    const base: SafetyPlan = {
      ...EMPTY,
      trusted_contacts: [{ name: "Mẹ", phone: "0900000001" }],
    };
    const result = addContact(base, { name: "Bố", phone: "0900000002" });
    expect(result.trusted_contacts).toEqual([
      { name: "Mẹ", phone: "0900000001" },
      { name: "Bố", phone: "0900000002" },
    ]);
  });
});

describe("removeContact", () => {
  it("removes the contact at the given index", () => {
    const base: SafetyPlan = {
      ...EMPTY,
      trusted_contacts: [
        { name: "Mẹ", phone: "1" },
        { name: "Bố", phone: "2" },
      ],
    };
    const result = removeContact(base, 0);
    expect(result.trusted_contacts).toEqual([{ name: "Bố", phone: "2" }]);
  });

  it("is a no-op when index is out of bounds", () => {
    const base: SafetyPlan = { ...EMPTY, trusted_contacts: [{ name: "Mẹ", phone: "1" }] };
    const result = removeContact(base, 9);
    expect(result.trusted_contacts).toEqual([{ name: "Mẹ", phone: "1" }]);
  });
});

// ── Tests: ListSection submitDraft (Enter-key / button click path) ─────────────

describe("ListSection submitDraft (Enter-key and button-click path)", () => {
  it("calls onAdd with the current draft value", () => {
    const onAdd = jest.fn();
    listSectionSubmitDraft("Mất ngủ", onAdd);
    expect(onAdd).toHaveBeenCalledWith("Mất ngủ");
  });

  it("calls onAdd even with an empty draft — onAdd itself decides to no-op (see addListItem tests)", () => {
    const onAdd = jest.fn();
    listSectionSubmitDraft("", onAdd);
    expect(onAdd).toHaveBeenCalledWith("");
  });

  it("clears the draft after submitting, regardless of whether onAdd succeeded", () => {
    const onAdd = jest.fn();
    const nextDraft = listSectionSubmitDraft("anything", onAdd);
    expect(nextDraft).toBe("");
  });
});

// ── Tests: ContactList submitDraft (button click path) ──────────────────────────

describe("ContactList submitDraft", () => {
  it("calls onAdd with the current name and phone draft", () => {
    const onAdd = jest.fn();
    contactListSubmitDraft("Mẹ", "0900000001", onAdd);
    expect(onAdd).toHaveBeenCalledWith({ name: "Mẹ", phone: "0900000001" });
  });

  it("clears both name and phone drafts after submitting", () => {
    const onAdd = jest.fn();
    const next = contactListSubmitDraft("Mẹ", "0900000001", onAdd);
    expect(next).toEqual({ name: "", phone: "" });
  });

  it("calls onAdd even with empty fields — onAdd itself decides to no-op (see addContact tests)", () => {
    const onAdd = jest.fn();
    contactListSubmitDraft("", "", onAdd);
    expect(onAdd).toHaveBeenCalledWith({ name: "", phone: "" });
  });
});

// ── Tests: pre-fill effect (`if (plan) setForm(plan)`) ──────────────────────────

describe("pre-fill effect", () => {
  it("adopts the loaded plan when it is truthy", () => {
    const plan: SafetyPlan = {
      warning_signs: ["A"],
      coping_activities: [],
      trusted_contacts: [],
      reasons_to_live: "Vì gia đình",
    };
    const result = prefillEffect(plan, EMPTY);
    expect(result).toEqual(plan);
  });

  it("keeps the current form unchanged when plan is null (new-plan case)", () => {
    const result = prefillEffect(null, EMPTY);
    expect(result).toBe(EMPTY);
  });

  it("keeps the current form unchanged when plan is undefined (still loading)", () => {
    const result = prefillEffect(undefined, EMPTY);
    expect(result).toBe(EMPTY);
  });
});
