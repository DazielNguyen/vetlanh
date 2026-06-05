/**
 * Unit tests for types/dashboard.ts
 *
 * Because TypeScript interfaces are erased at runtime, these tests verify
 * that the *shape* of objects that conform to the exported interfaces is
 * consistent with what the API contracts require.  The assertions are purely
 * runtime checks — they confirm the structure rather than the type system.
 */

import type {
  DashboardData,
  BadgeItem,
  BadgesData,
  RecommendedExercise,
  Phq9Reminder,
} from "@/types/dashboard";

// ─── RecommendedExercise ──────────────────────────────────────────────────────

describe("RecommendedExercise interface", () => {
  it("accepts a minimal object with id and title", () => {
    const exercise: RecommendedExercise = { id: 1, title: "Thiền định" };
    expect(exercise.id).toBe(1);
    expect(exercise.title).toBe("Thiền định");
    expect(exercise.duration_minutes).toBeUndefined();
    expect(exercise.category).toBeUndefined();
  });

  it("accepts a string id", () => {
    const exercise: RecommendedExercise = { id: "abc-123", title: "Thở sâu" };
    expect(typeof exercise.id).toBe("string");
  });

  it("accepts all optional fields", () => {
    const exercise: RecommendedExercise = {
      id: 7,
      title: "Yoga",
      duration_minutes: 30,
      category: "relaxation",
    };
    expect(exercise.duration_minutes).toBe(30);
    expect(exercise.category).toBe("relaxation");
  });
});

// ─── Phq9Reminder ─────────────────────────────────────────────────────────────

describe("Phq9Reminder interface", () => {
  it("accepts a minimal object with only the required due field", () => {
    const reminder: Phq9Reminder = { due: true };
    expect(reminder.due).toBe(true);
    expect(reminder.last_completed_at).toBeUndefined();
    expect(reminder.next_due_at).toBeUndefined();
  });

  it("accepts due: false", () => {
    const reminder: Phq9Reminder = { due: false };
    expect(reminder.due).toBe(false);
  });

  it("accepts null for nullable string fields", () => {
    const reminder: Phq9Reminder = {
      due: true,
      last_completed_at: null,
      next_due_at: null,
    };
    expect(reminder.last_completed_at).toBeNull();
    expect(reminder.next_due_at).toBeNull();
  });

  it("accepts ISO date strings", () => {
    const reminder: Phq9Reminder = {
      due: false,
      last_completed_at: "2026-05-20T10:00:00Z",
      next_due_at: "2026-06-19T10:00:00Z",
    };
    expect(reminder.last_completed_at).toBe("2026-05-20T10:00:00Z");
    expect(reminder.next_due_at).toBe("2026-06-19T10:00:00Z");
  });
});

// ─── DashboardData ────────────────────────────────────────────────────────────

describe("DashboardData interface", () => {
  const makeDashboard = (overrides: Partial<DashboardData> = {}): DashboardData => ({
    greeting: "Chào mừng trở lại, Duy!",
    streak_days: 5,
    today_checked_in: false,
    last_mood: null,
    sparkline: [],
    recommended_exercises: [],
    phq9_reminder: { due: false },
    ...overrides,
  });

  it("constructs a valid full dashboard object", () => {
    const dashboard = makeDashboard({
      greeting: "Xin chào!",
      streak_days: 10,
      today_checked_in: true,
      last_mood: 72,
      sparkline: [50, 60, 55, 70, 65],
      recommended_exercises: [{ id: 1, title: "Thiền" }],
      phq9_reminder: { due: true },
    });

    expect(dashboard.greeting).toBe("Xin chào!");
    expect(dashboard.streak_days).toBe(10);
    expect(dashboard.today_checked_in).toBe(true);
    expect(dashboard.last_mood).toBe(72);
    expect(dashboard.sparkline).toHaveLength(5);
    expect(dashboard.recommended_exercises).toHaveLength(1);
    expect(dashboard.phq9_reminder.due).toBe(true);
  });

  it("allows last_mood to be null", () => {
    const dashboard = makeDashboard({ last_mood: null });
    expect(dashboard.last_mood).toBeNull();
  });

  it("allows an empty sparkline array", () => {
    const dashboard = makeDashboard({ sparkline: [] });
    expect(dashboard.sparkline).toEqual([]);
  });

  it("allows an empty recommended_exercises array", () => {
    const dashboard = makeDashboard({ recommended_exercises: [] });
    expect(dashboard.recommended_exercises).toEqual([]);
  });

  it("sparkline values are numbers", () => {
    const dashboard = makeDashboard({ sparkline: [0, 25, 50, 75, 100] });
    dashboard.sparkline.forEach((v) => expect(typeof v).toBe("number"));
  });
});

// ─── BadgeItem ────────────────────────────────────────────────────────────────

describe("BadgeItem interface", () => {
  const makeBadge = (overrides: Partial<BadgeItem> = {}): BadgeItem => ({
    slug: "streak-7",
    label: "Tuần lễ đầu tiên",
    milestone_days: 7,
    unlocked: true,
    is_new: false,
    ...overrides,
  });

  it("constructs a valid BadgeItem", () => {
    const badge = makeBadge();
    expect(badge.slug).toBe("streak-7");
    expect(badge.label).toBe("Tuần lễ đầu tiên");
    expect(badge.milestone_days).toBe(7);
    expect(badge.unlocked).toBe(true);
    expect(badge.is_new).toBe(false);
  });

  it("is_new can be true for a newly unlocked badge", () => {
    const badge = makeBadge({ is_new: true });
    expect(badge.is_new).toBe(true);
  });

  it("unlocked can be false for a locked badge", () => {
    const badge = makeBadge({ unlocked: false, is_new: false });
    expect(badge.unlocked).toBe(false);
  });

  it("milestone_days is a positive integer", () => {
    const badge = makeBadge({ milestone_days: 30 });
    expect(badge.milestone_days).toBeGreaterThan(0);
    expect(Number.isInteger(badge.milestone_days)).toBe(true);
  });
});

// ─── BadgesData ───────────────────────────────────────────────────────────────

describe("BadgesData interface", () => {
  it("constructs a valid BadgesData with a list of badges", () => {
    const data: BadgesData = {
      streak_days: 14,
      badges: [
        { slug: "streak-7", label: "7 ngày", milestone_days: 7, unlocked: true, is_new: false },
        { slug: "streak-14", label: "14 ngày", milestone_days: 14, unlocked: true, is_new: true },
      ],
    };
    expect(data.streak_days).toBe(14);
    expect(data.badges).toHaveLength(2);
    expect(data.badges[1].is_new).toBe(true);
  });

  it("allows an empty badges array", () => {
    const data: BadgesData = { streak_days: 0, badges: [] };
    expect(data.badges).toEqual([]);
  });

  it("streak_days can be zero", () => {
    const data: BadgesData = { streak_days: 0, badges: [] };
    expect(data.streak_days).toBe(0);
  });
});
