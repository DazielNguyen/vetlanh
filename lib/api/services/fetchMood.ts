import apiService from "../core";
import type {
  MoodEntry,
  CreateMoodEntryRequest,
  MoodInsights,
  MoodHeatmapData,
  MoodTrend,
} from "@/types/mood";

export interface MoodEntriesParams {
  start?: string;
  end?: string;
  limit?: number;
  offset?: number;
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

  getHeatmap: async (year: number, month: number): Promise<MoodHeatmapData> => {
    const response = await apiService.get<MoodHeatmapData>("api/v1/mood/heatmap", { year, month });
    return response.data;
  },

  getTrend: async (period: "week" | "month"): Promise<MoodTrend> => {
    const response = await apiService.get<MoodTrend>("api/v1/mood/trend", { period });
    return response.data;
  },
};
