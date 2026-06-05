import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { fetchBadges } from "@/lib/api/services/fetchBadges";
import { STALE } from "@/lib/api/queryConfig";

export const BADGE_KEYS = {
  all: ["badges"] as const,
  list: ["badges", "list"] as const,
};

// Persist notified slugs in sessionStorage so remounting DashboardContent
// (e.g., navigating away and back) does not re-fire the same toasts.
// Falls back to a module-level Set if sessionStorage is unavailable (SSR).
const NOTIFIED_KEY = "badge_notified_slugs";

function getNotified(): Set<string> {
  try {
    const raw = sessionStorage.getItem(NOTIFIED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function markNotified(set: Set<string>, slug: string): void {
  set.add(slug);
  try {
    sessionStorage.setItem(NOTIFIED_KEY, JSON.stringify([...set]));
  } catch {
    // sessionStorage unavailable — toast may re-fire on remount, acceptable
  }
}

export function useBadges() {
  const notified = useRef<Set<string> | null>(null);

  const query = useQuery({
    queryKey: BADGE_KEYS.list,
    queryFn: fetchBadges.getBadges,
    staleTime: STALE.LONG,
  });

  useEffect(() => {
    if (!query.data) return;
    if (!notified.current) notified.current = getNotified();

    query.data.badges
      .filter((b) => b.is_new && !notified.current!.has(b.slug))
      .forEach((badge) => {
        markNotified(notified.current!, badge.slug);
        notified.current!.add(badge.slug);
        toast.success(`Huy hiệu mới: ${badge.label}`, {
          description: `Bạn đã đạt ${badge.milestone_days} ngày liên tiếp!`,
          duration: 6000,
        });
      });
  }, [query.data]);

  return query;
}
