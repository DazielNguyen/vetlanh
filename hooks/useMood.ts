import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchMood, type MoodEntriesParams } from "@/lib/api/services/fetchMood";
import { STALE } from "@/lib/api/queryConfig";
import type { CreateMoodEntryRequest } from "@/types/mood";

export const MOOD_KEYS = {
  all: ["mood"] as const,
  entries: ["mood", "entries"] as const,
  entriesFiltered: (params: MoodEntriesParams) => ["mood", "entries", params] as const,
  heatmap: (year: number, month: number) => ["mood", "heatmap", year, month] as const,
  trend: (period: "week" | "month") => ["mood", "trend", period] as const,
  insights: ["mood", "insights"] as const,
};

export function useMoodEntries(params?: MoodEntriesParams) {
  return useQuery({
    queryKey: params ? MOOD_KEYS.entriesFiltered(params) : MOOD_KEYS.entries,
    queryFn: () => fetchMood.getEntries(params),
    staleTime: STALE.SHORT,
  });
}

export function useMoodHeatmap(year: number, month: number) {
  return useQuery({
    queryKey: MOOD_KEYS.heatmap(year, month),
    queryFn: () => fetchMood.getHeatmap(year, month),
    staleTime: STALE.SHORT,
  });
}

export function useMoodTrend(period: "week" | "month") {
  return useQuery({
    queryKey: MOOD_KEYS.trend(period),
    queryFn: () => fetchMood.getTrend(period),
    staleTime: STALE.SHORT,
  });
}

export function useMoodInsights() {
  return useQuery({
    queryKey: MOOD_KEYS.insights,
    queryFn: fetchMood.getInsights,
    staleTime: STALE.SHORT,
    // Don't retry on 400 — BE returns 400 when user has fewer than 7 entries
    retry: false,
  });
}

export function useLogMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateMoodEntryRequest) => fetchMood.createOrUpdateEntry(body),
    onSuccess: (_, variables) => {
      // Invalidate flat entries list and the heatmap month matching the logged date
      // Invalidate all mood queries: entries (all param variants), heatmap, trend, and insights
      queryClient.invalidateQueries({ queryKey: MOOD_KEYS.all });
      toast.success("Đã lưu tâm trạng hôm nay");
    },
    onError: () => {
      toast.error("Lưu tâm trạng thất bại, vui lòng thử lại");
    },
  });
}
