// Dashboard & Services types

export interface DailyQuote {
  text: string;
  author: string | null;
}

export interface Resource {
  id: string;
  title: string;
  type: "article" | "audio" | "video";
  duration_label: string;
  url: string | null;
}

export interface CommunityFeatured {
  message: string;
  author_display: string;
  active_users_count: number;
}

export type HealingTaskStatus = "active" | "locked" | "upcoming";

export interface HealingTask {
  id: string;
  title: string;
  subtitle: string;
  progress_pct: number;
  status: HealingTaskStatus;
  unlock_label: string | null;
}

export interface HealingPath {
  tasks: HealingTask[];
}

export interface WellnessItem {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
}

export interface WellnessChecklist {
  date: string;
  items: WellnessItem[];
}

export interface QuickPrompt {
  id: string;
  text: string;
}

export interface FilterOption {
  key: string;
  label: string;
  emoji?: string;
}
