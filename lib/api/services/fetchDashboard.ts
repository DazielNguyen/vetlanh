import apiService from "../core";
import type { DashboardData } from "@/types/dashboard";

export const fetchDashboard = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiService.get<DashboardData>("api/v1/dashboard");
    return response.data;
  },
};
