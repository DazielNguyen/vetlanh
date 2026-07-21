import { useQuery } from "@tanstack/react-query";
import { fetchRecommendation } from "@/lib/api/services/fetchRecommendation";
import { STALE, skipRetryOn } from "@/lib/api/queryConfig";

export const RECOMMENDATION_KEYS = {
  personalized: ["recommendation", "personalized"] as const,
};

/**
 * BE derives the recommendation from mood/journal/PHQ-9 history server-side —
 * staleTime of a day, no refetchInterval, so this refreshes on the next app
 * open after 24h rather than polling.
 */
export function usePersonalizedRecommendation() {
  return useQuery({
    queryKey: RECOMMENDATION_KEYS.personalized,
    queryFn: fetchRecommendation.getPersonalized,
    staleTime: STALE.DAILY,
    // BE endpoint doesn't exist yet at the time of this phase — fail silently
    // so the card falls back to null rather than retrying/erroring.
    retry: skipRetryOn(404),
  });
}
