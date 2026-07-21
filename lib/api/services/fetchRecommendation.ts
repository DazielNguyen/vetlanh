import apiService from "../core";
import type { DashboardRecommendation } from "@/types/recommendation";

export const fetchRecommendation = {
  getPersonalized: async (): Promise<DashboardRecommendation | null> => {
    const res = await apiService.get<DashboardRecommendation | null>(
      "api/v1/dashboard/personalized-recommendation"
    );
    return res.data;
  },
};
