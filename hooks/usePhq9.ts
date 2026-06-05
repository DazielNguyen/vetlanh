import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchPhq9, type Phq9HistoryParams } from "@/lib/api/services/fetchPhq9";
import { STALE, skipRetryOn } from "@/lib/api/queryConfig";
import type { Phq9SubmitRequest } from "@/types/phq9";

export const PHQ9_KEYS = {
  all: ["phq9"] as const,
  questions: ["phq9", "questions"] as const,
  latest: ["phq9", "latest"] as const,
  history: ["phq9", "history"] as const,
  historyPaged: (params: Phq9HistoryParams) => ["phq9", "history", params] as const,
  reminder: ["phq9", "reminder"] as const,
};

export function usePhq9Questions() {
  return useQuery({
    queryKey: PHQ9_KEYS.questions,
    queryFn: fetchPhq9.getQuestions,
    staleTime: STALE.LONG,
  });
}

export function usePhq9Latest() {
  return useQuery({
    queryKey: PHQ9_KEYS.latest,
    queryFn: fetchPhq9.getLatest,
    staleTime: STALE.SHORT,
    // 404 = no previous assessment; treat as null data, not an error
    retry: skipRetryOn(404),
  });
}

export function usePhq9History(params?: Phq9HistoryParams) {
  return useQuery({
    queryKey: params ? PHQ9_KEYS.historyPaged(params) : PHQ9_KEYS.history,
    queryFn: () => fetchPhq9.getHistory(params),
    staleTime: STALE.SHORT,
  });
}

export function usePhq9Reminder() {
  return useQuery({
    queryKey: PHQ9_KEYS.reminder,
    queryFn: fetchPhq9.getReminder,
    staleTime: STALE.SHORT,
  });
}

export function useSubmitPhq9() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Phq9SubmitRequest) => fetchPhq9.submitAssessment(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHQ9_KEYS.latest });
      queryClient.invalidateQueries({ queryKey: PHQ9_KEYS.history });
      queryClient.invalidateQueries({ queryKey: PHQ9_KEYS.reminder });
    },
    onError: () => {
      toast.error("Gửi bài đánh giá thất bại, vui lòng thử lại");
    },
  });
}
