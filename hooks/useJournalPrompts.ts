import { useQuery } from "@tanstack/react-query";
import { fetchJournalPrompts } from "@/lib/api/services/fetchJournalPrompts";
import { STALE } from "@/lib/api/queryConfig";

export const PROMPT_KEYS = {
  all: ["journal-prompts"] as const,
  daily: ["journal-prompts", "daily"] as const,
  next: ["journal-prompts", "next"] as const,
  byTopic: (topic: string) => ["journal-prompts", "topic", topic] as const,
};

export function useDailyPrompt() {
  return useQuery({
    queryKey: PROMPT_KEYS.daily,
    queryFn: fetchJournalPrompts.getDailyPrompt,
    // Prompt changes at most once per day
    staleTime: STALE.LONG,
  });
}

export function useNextPrompt() {
  return useQuery({
    queryKey: PROMPT_KEYS.next,
    queryFn: fetchJournalPrompts.getNextPrompt,
    staleTime: STALE.SHORT,
  });
}

export function usePromptsByTopic(topic: string | null) {
  return useQuery({
    queryKey: PROMPT_KEYS.byTopic(topic ?? ""),
    queryFn: () => fetchJournalPrompts.getPromptsByTopic(topic!),
    enabled: !!topic,
    staleTime: STALE.LONG,
  });
}
