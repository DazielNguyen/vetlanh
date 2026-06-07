"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchServices } from "@/lib/api/services/fetchServices";
import { STALE } from "@/lib/api/queryConfig";
import type { WellnessChecklist } from "@/types/services";

export const SERVICES_KEYS = {
  quote: ["services", "quote"] as const,
  resources: (limit: number) => ["services", "resources", limit] as const,
  community: ["services", "community"] as const,
  healingPath: ["services", "healing-path"] as const,
  wellness: (date: string) => ["services", "wellness", date] as const,
  quickPrompts: ["services", "quick-prompts"] as const,
  exerciseCategories: ["services", "exercise-categories"] as const,
  exerciseMoodFilters: ["services", "exercise-mood-filters"] as const,
};

export function useDailyQuote() {
  return useQuery({
    queryKey: SERVICES_KEYS.quote,
    queryFn: fetchServices.getDailyQuote,
    staleTime: STALE.LONG,
  });
}

export function useRecommendedResources(limit = 2) {
  return useQuery({
    queryKey: SERVICES_KEYS.resources(limit),
    queryFn: () => fetchServices.getRecommendedResources(limit),
    staleTime: STALE.LONG,
  });
}

export function useCommunityFeatured() {
  return useQuery({
    queryKey: SERVICES_KEYS.community,
    queryFn: fetchServices.getCommunityFeatured,
    staleTime: STALE.SHORT,
  });
}

export function useHealingPath() {
  return useQuery({
    queryKey: SERVICES_KEYS.healingPath,
    queryFn: fetchServices.getHealingPath,
    staleTime: STALE.SHORT,
  });
}

export function useWellnessChecklist(date: string) {
  return useQuery({
    queryKey: SERVICES_KEYS.wellness(date),
    queryFn: () => fetchServices.getWellnessChecklist(date),
    staleTime: STALE.SHORT,
  });
}

export function useToggleWellnessItem(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, completed }: { itemId: string; completed: boolean }) =>
      fetchServices.updateWellnessItem(itemId, completed),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(
        SERVICES_KEYS.wellness(date),
        (old: WellnessChecklist | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item) =>
              item.id === updatedItem.id ? updatedItem : item
            ),
          };
        }
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_KEYS.wellness(date) });
    },
  });
}

export function useQuickPrompts() {
  return useQuery({
    queryKey: SERVICES_KEYS.quickPrompts,
    queryFn: fetchServices.getQuickPrompts,
    staleTime: STALE.LONG,
  });
}

export function useExerciseCategories() {
  return useQuery({
    queryKey: SERVICES_KEYS.exerciseCategories,
    queryFn: fetchServices.getExerciseCategories,
    staleTime: STALE.LONG,
  });
}

export function useExerciseMoodFilters() {
  return useQuery({
    queryKey: SERVICES_KEYS.exerciseMoodFilters,
    queryFn: fetchServices.getExerciseMoodFilters,
    staleTime: STALE.LONG,
  });
}
