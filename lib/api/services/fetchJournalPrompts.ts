import apiService from "../core";
import type { DailyPromptResponse, JournalPrompt } from "@/types/journal";

export const fetchJournalPrompts = {
  getDailyPrompt: async (): Promise<DailyPromptResponse> => {
    const response = await apiService.get<DailyPromptResponse>("api/v1/journal/prompts/daily");
    return response.data;
  },

  getNextPrompt: async (): Promise<JournalPrompt> => {
    const response = await apiService.get<JournalPrompt>("api/v1/journal/prompts/next");
    return response.data;
  },

  getPromptsByTopic: async (topic: string): Promise<JournalPrompt[]> => {
    const response = await apiService.get<JournalPrompt[]>("api/v1/journal/prompts", { topic });
    return response.data;
  },
};
