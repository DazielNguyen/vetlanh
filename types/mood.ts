export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1–5
  energy?: number | null; // 1–5
  factors: string[];
  note?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMoodEntryRequest {
  date: string; // YYYY-MM-DD
  mood: number; // 1–5
  energy?: number;
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

// Keyed by date string YYYY-MM-DD → mood value 1–5
export type MoodHeatmapData = Record<string, number>;

export interface MoodTrendPoint {
  date: string;
  mood: number;
  energy?: number | null;
}

export interface MoodTrend {
  period: "week" | "month";
  data: MoodTrendPoint[];
}
