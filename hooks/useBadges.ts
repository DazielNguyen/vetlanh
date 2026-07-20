import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { fetchBadges } from "@/lib/api/services/fetchBadges";
import { STALE } from "@/lib/api/queryConfig";
import { getLevelForXp, getXpToNextLevel } from "@/lib/constants/progression";

export const BADGE_KEYS = {
  all: ["badges"] as const,
  list: ["badges", "list"] as const,
};

// Generic "has this already been shown" dedup, backed by sessionStorage so
// remounting DashboardContent (e.g., navigating away and back) does not
// re-fire the same toast/celebration. Falls back to the given default if
// sessionStorage is unavailable (SSR).
function readDedupState<T>(key: string, parse: (raw: string) => T, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw !== null ? parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeDedupState(key: string, raw: string): void {
  try {
    sessionStorage.setItem(key, raw);
  } catch {
    // sessionStorage unavailable — dedup may not persist across remounts, acceptable
  }
}

const NOTIFIED_KEY = "badge_notified_slugs";
const getNotified = () => readDedupState(NOTIFIED_KEY, (raw) => new Set(JSON.parse(raw) as string[]), new Set<string>());
const markNotified = (set: Set<string>, slug: string) => {
  set.add(slug);
  writeDedupState(NOTIFIED_KEY, JSON.stringify([...set]));
};

// Highest level already celebrated — levels only ever go up, so a single
// number is enough (unlike the per-slug Set above).
const CELEBRATED_LEVEL_KEY = "celebrated_max_level";
const getCelebratedLevel = () => readDedupState(CELEBRATED_LEVEL_KEY, Number, 0);
const markCelebratedLevel = (level: number) => writeDedupState(CELEBRATED_LEVEL_KEY, String(level));

/**
 * Read-only badges/XP/level data — no side effects. Use this in components
 * that only need to *display* progress (LevelGate, XpLevelIndicator) so
 * mounting several of them doesn't create several independent copies of the
 * toast/celebration effects below (those must only run once per page — see
 * useBadges()).
 */
export function useBadgesData() {
  const query = useQuery({
    queryKey: BADGE_KEYS.list,
    queryFn: fetchBadges.getBadges,
    staleTime: STALE.LONG,
  });

  // Prefer BE-provided xp/level/xp_to_next_level; derive client-side from the
  // shared progression table when the BE hasn't sent them yet (Phase 2 BE
  // dependency — see phase-02-xp-level-system.md Risks).
  const xp = query.data?.xp ?? 0;
  const level = query.data?.level ?? getLevelForXp(xp);
  const xpToNextLevel = query.data?.xp_to_next_level ?? getXpToNextLevel(xp);

  return { ...query, xp, level, xpToNextLevel };
}

/**
 * Full badges hook — data plus the badge-toast and level-up-celebration side
 * effects. Call this exactly once per page (DashboardContent) so the
 * notification dedup logic only ever runs against one component instance.
 */
export function useBadges() {
  const notified = useRef<Set<string> | null>(null);
  const celebratedLevel = useRef<number | null>(null);
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);

  const { level, xp, xpToNextLevel, ...query } = useBadgesData();

  useEffect(() => {
    if (!query.data) return;
    if (!notified.current) notified.current = getNotified();

    query.data.badges
      .filter((b) => b.is_new && !notified.current!.has(b.slug))
      .forEach((badge) => {
        markNotified(notified.current!, badge.slug);
        toast.success(`Huy hiệu mới: ${badge.label}`, {
          description: `Bạn đã đạt ${badge.milestone_days} ngày liên tiếp!`,
          duration: 6000,
        });
      });
  }, [query.data]);

  useEffect(() => {
    if (!query.data) return;
    if (celebratedLevel.current === null) celebratedLevel.current = getCelebratedLevel();

    if (level > celebratedLevel.current) {
      celebratedLevel.current = level;
      markCelebratedLevel(level);
      setLevelUpTo(level);
    }
  }, [query.data, level]);

  return {
    ...query,
    xp,
    level,
    xpToNextLevel,
    levelUpTo,
    dismissLevelUp: () => setLevelUpTo(null),
  };
}
