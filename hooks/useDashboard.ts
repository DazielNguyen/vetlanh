import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/lib/api/services/fetchDashboard";
import { STALE } from "@/lib/api/queryConfig";

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  dashboard: ["dashboard", "data"] as const,
};

export function useDashboard() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.dashboard,
    queryFn: fetchDashboard.getDashboard,
    staleTime: STALE.SHORT,
  });
}
