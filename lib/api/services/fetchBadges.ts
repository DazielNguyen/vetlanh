import apiService from "../core";
import type { BadgesData } from "@/types/dashboard";

export const fetchBadges = {
  getBadges: async (): Promise<BadgesData> => {
    const response = await apiService.get<BadgesData>("api/v1/badges");
    return response.data;
  },
};
