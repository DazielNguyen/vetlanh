import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/lib/api/services/fetchUser";
import { USER_KEYS } from "@/hooks/useUser";
import { STALE } from "@/lib/api/queryConfig";

export function useAvailableGoals() {
  const query = useQuery({
    queryKey: USER_KEYS.availableGoals,
    queryFn: fetchUser.getAvailableGoals,
    staleTime: STALE.LONG,
  });

  return { goals: query.data ?? [], isLoading: query.isLoading };
}
