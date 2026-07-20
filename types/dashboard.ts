// Dashboard types — matches FastAPI /dashboard response shape.
// recommended_exercises intentionally uses a minimal type to avoid collision
// with the full Exercise type introduced in Phase 7.

export interface RecommendedExercise {
  id: number | string;
  title: string;
  duration_minutes?: number;
  category?: string;
}

export interface Phq9Reminder {
  due: boolean;
  last_completed_at?: string | null;
  next_due_at?: string | null;
}

export interface DashboardData {
  greeting: string;
  streak_days: number;
  today_checked_in: boolean;
  last_mood: number | null;
  sparkline: number[];
  stress_level?: "low" | "medium" | "high";
  stress_trend_text?: string;
  recommended_exercises: RecommendedExercise[];
  phq9_reminder: Phq9Reminder;
}

export interface BadgeItem {
  slug: string;
  label: string;
  milestone_days: number;
  unlocked: boolean;
  is_new: boolean;
}

export interface BadgesData {
  streak_days: number;
  badges: BadgeItem[];
  // Optional: BE doesn't send these yet (Phase 2 dependency). When absent,
  // useBadges() derives them client-side from lib/constants/progression.ts.
  xp?: number;
  level?: number;
  xp_to_next_level?: number;
}
