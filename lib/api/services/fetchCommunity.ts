import apiService from "../core";
import type { CommunityMatchStatusResponse, CommunityMessage } from "@/types/community";

export const fetchCommunity = {
  getMatchStatus: async (): Promise<CommunityMatchStatusResponse> => {
    const res = await apiService.get<CommunityMatchStatusResponse>("api/v1/community/match/status");
    return res.data;
  },

  optIn: async (): Promise<CommunityMatchStatusResponse> => {
    const res = await apiService.post<CommunityMatchStatusResponse>("api/v1/community/opt-in");
    return res.data;
  },

  optOut: async (): Promise<void> => {
    await apiService.post<void>("api/v1/community/opt-out");
  },

  getMessages: async (matchId: string): Promise<CommunityMessage[]> => {
    const res = await apiService.get<CommunityMessage[]>(`api/v1/community/match/${matchId}/messages`);
    return res.data;
  },

  sendMessage: async (matchId: string, content: string): Promise<CommunityMessage> => {
    const res = await apiService.post<CommunityMessage>(`api/v1/community/match/${matchId}/messages`, { content });
    return res.data;
  },

  exitMatch: async (matchId: string): Promise<void> => {
    await apiService.post<void>(`api/v1/community/match/${matchId}/exit`);
  },

  blockMatch: async (matchId: string): Promise<void> => {
    await apiService.post<void>(`api/v1/community/match/${matchId}/block`);
  },

  reportMatch: async (matchId: string, reason?: string): Promise<void> => {
    await apiService.post<void>(`api/v1/community/match/${matchId}/report`, reason ? { reason } : undefined);
  },
};
