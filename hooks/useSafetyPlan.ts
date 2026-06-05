import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchSafetyPlan } from "@/lib/api/services/fetchSafetyPlan";
import { STALE, skipRetryOn } from "@/lib/api/queryConfig";
import type { ApiError } from "@/lib/api/core";
import type { SafetyPlan } from "@/types/safetyPlan";

export const SAFETY_KEYS = {
  plan: ["safety-plan"] as const,
};

export function useSafetyPlan() {
  return useQuery({
    queryKey: SAFETY_KEYS.plan,
    queryFn: async (): Promise<SafetyPlan | null> => {
      try {
        return await fetchSafetyPlan.getSafetyPlan();
      } catch (err: unknown) {
        // ApiError (from core.ts interceptor) is a flat object with .code, not .response.status
        if ((err as ApiError).code === 404) return null;
        throw err;
      }
    },
    staleTime: STALE.SHORT,
    retry: skipRetryOn(404),
  });
}

export function useUpsertSafetyPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SafetyPlan) => fetchSafetyPlan.upsertSafetyPlan(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: SAFETY_KEYS.plan });
      const snapshot = queryClient.getQueryData<SafetyPlan | null>(SAFETY_KEYS.plan);
      queryClient.setQueryData(SAFETY_KEYS.plan, body);
      return { snapshot };
    },
    onError: (_err, _body, ctx) => {
      queryClient.setQueryData(SAFETY_KEYS.plan, ctx?.snapshot ?? null);
      toast.error("Lưu thất bại — kế hoạch an toàn trước đó đã được khôi phục");
    },
    onSuccess: () => {
      toast.success("Đã lưu kế hoạch an toàn");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SAFETY_KEYS.plan });
    },
  });
}
