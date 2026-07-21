"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCheckIns } from "@/lib/api/services/fetchCheckIns";
import { getHubConnection, onHubReconnected } from "@/lib/realtime/signalr";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsAuthenticated } from "@/lib/redux/slices/authSlice";
import { skipRetryOn } from "@/lib/api/queryConfig";
import type { ProactiveCheckIn } from "@/types/checkIn";

export const CHECKIN_KEYS = {
  pending: ["checkins", "pending"] as const,
  dismissedIds: ["checkins", "dismissedIds"] as const,
};

/**
 * Combines a one-shot catch-up fetch (for check-ins broadcast while the tab
 * was closed) with a live SignalR listener (for check-ins broadcast while
 * connected) into a single deduplicated list. Not polling — staleTime keeps
 * this to exactly one GET per app session; new items only arrive via the
 * push event after that.
 *
 * Filters out anything already dismissed this session (see useDismissCheckIn)
 * — guards against the pending GET resolving *after* a dismiss and briefly
 * resurrecting an item the user already acted on, before the BE excludes it.
 */
export function usePendingCheckIns() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: CHECKIN_KEYS.pending,
    queryFn: fetchCheckIns.getPending,
    enabled: isAuthenticated,
    staleTime: Infinity,
    // BE endpoint doesn't exist yet at the time of this phase — fail silently
    // rather than retrying/erroring, so the card just has nothing to show.
    retry: skipRetryOn(404),
    select: (data) => {
      const dismissed = queryClient.getQueryData<Set<string>>(CHECKIN_KEYS.dismissedIds);
      return dismissed ? data.filter((c) => !dismissed.has(c.id)) : data;
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const connection = getHubConnection();

    const handleCheckIn = (checkIn: ProactiveCheckIn) => {
      const dismissed = queryClient.getQueryData<Set<string>>(CHECKIN_KEYS.dismissedIds);
      if (dismissed?.has(checkIn.id)) return;

      queryClient.setQueryData<ProactiveCheckIn[]>(CHECKIN_KEYS.pending, (prev) => {
        const existing = prev ?? [];
        if (existing.some((c) => c.id === checkIn.id)) return existing;
        return [...existing, checkIn];
      });
    };

    connection.on("ReceiveProactiveCheckIn", handleCheckIn);

    // A check-in broadcast while the connection was down would otherwise be
    // missed permanently (staleTime: Infinity means no automatic refetch) —
    // refetch on reconnect to resync.
    const unsubscribeReconnect = onHubReconnected(() => {
      queryClient.invalidateQueries({ queryKey: CHECKIN_KEYS.pending });
    });

    return () => {
      connection.off("ReceiveProactiveCheckIn", handleCheckIn);
      unsubscribeReconnect();
    };
  }, [isAuthenticated, queryClient]);

  return { checkIns: query.data ?? [], isLoading: query.isLoading };
}

/**
 * Optimistic dismiss — hides immediately, fires the ack in the background.
 * Not awaited/retried like Safety Plan's draft-save: worst case on failure
 * is the same check-in reappearing once more next session, not lost data.
 */
export function useDismissCheckIn() {
  const queryClient = useQueryClient();

  return function dismissCheckIn(id: string) {
    queryClient.setQueryData<Set<string>>(CHECKIN_KEYS.dismissedIds, (prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    queryClient.setQueryData<ProactiveCheckIn[]>(CHECKIN_KEYS.pending, (prev) =>
      (prev ?? []).filter((c) => c.id !== id)
    );
    fetchCheckIns.dismiss(id).catch((err) => {
      console.warn("[useDismissCheckIn] failed to persist dismiss", err);
    });
  };
}
