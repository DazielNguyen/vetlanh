import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchExercise } from "@/lib/api/services/fetchExercise";
import { STALE } from "@/lib/api/queryConfig";
import { DASHBOARD_KEYS } from "@/hooks/useDashboard";
import type { ExerciseListParams, RecommendedParams, LogExerciseRequest } from "@/types/exercise";

export const EXERCISE_KEYS = {
  all: ["exercise"] as const,
  list: ["exercise", "list"] as const,
  listFiltered: (params: ExerciseListParams) => ["exercise", "list", params] as const,
  recommended: (params?: RecommendedParams) => ["exercise", "recommended", params] as const,
  detail: (slug: string) => ["exercise", "detail", slug] as const,
  logs: ["exercise", "logs"] as const,
};

export function useExerciseList(params?: ExerciseListParams) {
  return useQuery({
    queryKey: params && (params.mood || params.category)
      ? EXERCISE_KEYS.listFiltered(params)
      : EXERCISE_KEYS.list,
    queryFn: () => fetchExercise.listExercises(params),
    staleTime: STALE.LONG,
  });
}

export function useRecommendedExercises(params?: RecommendedParams) {
  return useQuery({
    queryKey: EXERCISE_KEYS.recommended(params),
    queryFn: () => fetchExercise.getRecommended(params),
    staleTime: STALE.SHORT,
  });
}

export function useExercise(slug: string | null) {
  return useQuery({
    queryKey: EXERCISE_KEYS.detail(slug ?? ""),
    queryFn: () => fetchExercise.getExercise(slug!),
    enabled: !!slug,
    staleTime: STALE.LONG,
  });
}

export function useExerciseLogs() {
  return useQuery({
    queryKey: EXERCISE_KEYS.logs,
    queryFn: fetchExercise.getLogHistory,
    staleTime: STALE.SHORT,
  });
}

export function useLogExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LogExerciseRequest) => fetchExercise.logCompletion(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISE_KEYS.logs });
      // Dashboard streak depends on exercise completion
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.dashboard });
      toast.success("Đã ghi lại buổi tập");
    },
    onError: () => {
      toast.error("Ghi lại buổi tập thất bại, vui lòng thử lại");
    },
  });
}
