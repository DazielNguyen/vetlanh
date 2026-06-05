import { useQuery } from "@tanstack/react-query";
import { fetchSafetyPlan } from "@/lib/api/services/fetchSafetyPlan";
import { STALE } from "@/lib/api/queryConfig";

export const CRISIS_KEYS = {
  resources: ["crisis", "resources"] as const,
};

export function useCrisisResources() {
  return useQuery({
    queryKey: CRISIS_KEYS.resources,
    queryFn: fetchSafetyPlan.getCrisisResources,
    // Crisis hotlines change rarely — cache aggressively
    staleTime: STALE.LONG,
    retry: false,
  });
}
