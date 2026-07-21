import apiService from "../core";
import type { ProactiveCheckIn } from "@/types/checkIn";

export const fetchCheckIns = {
  getPending: async (): Promise<ProactiveCheckIn[]> => {
    const res = await apiService.get<ProactiveCheckIn[]>("api/v1/checkins/pending");
    return res.data;
  },

  dismiss: async (id: string): Promise<void> => {
    await apiService.post<void>(`api/v1/checkins/${id}/dismiss`);
  },
};
