import { useQuery } from "@tanstack/react-query";
import { fetchSounds, type SoundCategory } from "@/lib/api/services/fetchSounds";
import { STALE } from "@/lib/api/queryConfig";

export type { Sound, SoundCategory } from "@/lib/api/services/fetchSounds";

export const SOUND_KEYS = {
  all: ["sounds"] as const,
  list: (category?: SoundCategory) => ["sounds", "list", category ?? "all"] as const,
  detail: (id: string) => ["sounds", "detail", id] as const,
};

export function useSounds(category?: SoundCategory) {
  return useQuery({
    queryKey: SOUND_KEYS.list(category),
    queryFn: () => fetchSounds.list(category),
    staleTime: STALE.LONG,
  });
}

export function useSound(id: string) {
  return useQuery({
    queryKey: SOUND_KEYS.detail(id),
    queryFn: () => fetchSounds.getById(id),
    staleTime: STALE.LONG,
    enabled: !!id,
  });
}
