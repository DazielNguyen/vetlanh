export type EnergyLevel = "low" | "medium" | "high";

export interface MoodSummaryEntry {
  date: string; // YYYY-MM-DD
  sentiment_score: number; // 1–5
}

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1–5
  energy?: EnergyLevel | null;
  factors: string[];
  note?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMoodEntryRequest {
  date: string; // YYYY-MM-DD
  mood: number; // 1–5
  energy?: EnergyLevel;
  factors?: string[];
  note?: string;
}

export interface InsightItem {
  type: "overall_average" | "day_of_week" | "factor_correlation";
  text: string;
  delta: number | null;
}

export interface MoodCoachReflection {
  acknowledgement: string;
  observation: string;
  evidence: string | null;
  confidence: "low" | "medium" | "high";
}

export interface MoodCoachAction {
  type: "exercise" | "journal" | "chat" | "rest";
  title: string;
  description: string | null;
  url: string;
}

export interface MoodInsights {
  total_entries: number;
  has_enough_data: boolean;
  insights: InsightItem[];
  // Optional agentic fields. The current rules-based endpoint can continue
  // returning only the fields above until the backend rollout is complete.
  generated_by?: "rules" | "agent";
  status?: "processing" | "ready" | "unavailable";
  analysis_for_entry_id?: string | null;
  generated_at?: string;
  reflection?: MoodCoachReflection | null;
  next_action?: MoodCoachAction | null;
  follow_up_prompt?: string | null;
}

// Processed map: YYYY-MM-DD → mood value 1–5
export type MoodHeatmapData = Record<string, number>;

export interface MoodTrendPoint {
  date: string;
  mood: number | null;
  energy?: EnergyLevel | null;
  factors: string[];
  note?: string | null;
}

export interface MoodTrend {
  period: "week" | "month";
  start: string;
  end: string;
  entries: MoodTrendPoint[];
  best_day: string | null;
  worst_day: string | null;
  average_mood: number | null;
}
