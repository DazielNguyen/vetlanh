import apiService from "../core";
import type {
  MoodEntry,
  CreateMoodEntryRequest,
  MoodInsights,
  MoodHeatmapData,
  MoodSummaryEntry,
  MoodTrend,
} from "@/types/mood";

export interface MoodEntriesParams {
  start?: string;
  end?: string;
  limit?: number;
  offset?: number;
}

interface RawHeatmapResponse {
  year: number;
  month: number;
  days: { date: string; mood_score: number }[];
}

export const fetchMood = {
  createOrUpdateEntry: async (body: CreateMoodEntryRequest): Promise<MoodEntry> => {
    const response = await apiService.post<MoodEntry>("api/v1/mood/entries", body);
    return response.data;
  },

  getEntries: async (params?: MoodEntriesParams): Promise<MoodEntry[]> => {
    const response = await apiService.get<MoodEntry[]>("api/v1/mood/entries", params);
    return response.data;
  },

  getInsights: async (): Promise<MoodInsights> => {
    const response = await apiService.get<MoodInsights>("api/v1/mood/insights");
    return response.data;
  },

  // BE returns sparse { days: [{date, mood_score}] } — transform to Record for O(1) lookup in component
  getHeatmap: async (year: number, month: number): Promise<MoodHeatmapData> => {
    const response = await apiService.get<RawHeatmapResponse>("api/v1/mood/heatmap", { year, month });
    const map: MoodHeatmapData = {};
    for (const d of response.data.days) {
      map[d.date] = d.mood_score;
    }
    return map;
  },

  getTrend: async (period: "week" | "month"): Promise<MoodTrend> => {
    const response = await apiService.get<MoodTrend>("api/v1/mood/trend", { period });
    return response.data;
  },

  getMoodSummary: async (days = 7): Promise<MoodSummaryEntry[]> => {
    const response = await apiService.get<MoodSummaryEntry[]>("api/v1/users/me/mood-summary", { days });
    return response.data;
  },
};
