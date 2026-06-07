import apiService from "../core";
import type {
  DailyQuote,
  Resource,
  CommunityFeatured,
  HealingPath,
  WellnessChecklist,
  WellnessItem,
  QuickPrompt,
  FilterOption,
} from "@/types/services";

export const fetchServices = {
  getDailyQuote: async (): Promise<DailyQuote> => {
    const res = await apiService.get<DailyQuote>("api/v1/dashboard/quote");
    return res.data;
  },

  getRecommendedResources: async (limit = 2): Promise<Resource[]> => {
    const res = await apiService.get<Resource[]>("api/v1/resources/recommended", { limit });
    return res.data;
  },

  getCommunityFeatured: async (): Promise<CommunityFeatured> => {
    const res = await apiService.get<CommunityFeatured>("api/v1/community/featured");
    return res.data;
  },

  getHealingPath: async (): Promise<HealingPath> => {
    const res = await apiService.get<HealingPath>("api/v1/user/healing-path");
    return res.data;
  },

  getWellnessChecklist: async (date: string): Promise<WellnessChecklist> => {
    const res = await apiService.get<WellnessChecklist>("api/v1/wellness/checklist", { date });
    return res.data;
  },

  updateWellnessItem: async (itemId: string, completed: boolean): Promise<WellnessItem> => {
    const res = await apiService.put<WellnessItem>(`api/v1/wellness/checklist/${itemId}`, { completed });
    return res.data;
  },

  getQuickPrompts: async (): Promise<QuickPrompt[]> => {
    const res = await apiService.get<QuickPrompt[]>("api/v1/chat/quick-prompts");
    return res.data;
  },

  getExerciseCategories: async (): Promise<FilterOption[]> => {
    const res = await apiService.get<FilterOption[]>("api/v1/exercises/categories");
    return res.data;
  },

  getExerciseMoodFilters: async (): Promise<FilterOption[]> => {
    const res = await apiService.get<FilterOption[]>("api/v1/exercises/mood-filters");
    return res.data;
  },
};
