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

export interface MoodInsights {
  total_entries: number;
  has_enough_data: boolean;
  insights: InsightItem[];
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
