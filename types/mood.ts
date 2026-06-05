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

export interface MoodInsights {
  summary: string;
  patterns: string[];
  suggestions: string[];
  entry_count: number;
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
