"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCommunity } from "@/lib/api/services/fetchCommunity";
import { getHubConnection, onHubReconnected } from "@/lib/realtime/signalr";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsAuthenticated } from "@/lib/redux/slices/authSlice";
import { STALE, skipRetryOn } from "@/lib/api/queryConfig";
import type { CommunityMatch, CommunityMatchStatusResponse } from "@/types/community";

export const COMMUNITY_KEYS = {
  status: ["community", "status"] as const,
};

const OPTED_OUT: CommunityMatchStatusResponse = { status: "opted_out", match: null };

/**
 * Hybrid one-shot GET + SignalR push, mirroring useCheckIns.ts — status can also
 * change from this same tab's own opt-in/exit/block/report actions, not just push
 * events, so staleTime is short rather than Infinity.
 */
export function useCommunityMatchStatus() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: COMMUNITY_KEYS.status,
    queryFn: fetchCommunity.getMatchStatus,
    enabled: isAuthenticated,
    staleTime: STALE.SHORT,
    // BE endpoint doesn't exist yet at the time of this phase — fail silently
    // so the feature shows the opt-in screen rather than an error state.
    retry: skipRetryOn(404),
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const connection = getHubConnection();

    const handleMatched = (match: CommunityMatch) => {
      queryClient.setQueryData<CommunityMatchStatusResponse>(COMMUNITY_KEYS.status, {
        status: "matched",
        match,
      });
    };

    const handleMatchEnded = (payload: { matchId: string }) => {
      queryClient.setQueryData<CommunityMatchStatusResponse>(COMMUNITY_KEYS.status, (prev) => {
        // Guard against a stale/out-of-order event for a match that's already
        // been superseded by a newer one — never blindly overwrite.
        if (prev?.match && prev.match.matchId !== payload.matchId) return prev;
        return { status: "waiting", match: null };
      });
    };

    connection.on("ReceiveCommunityMatch", handleMatched);
    connection.on("CommunityMatchEnded", handleMatchEnded);

    // A match/end event fired while the connection was down would otherwise
    // be missed permanently — refetch on reconnect to resync.
    const unsubscribeReconnect = onHubReconnected(() => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_KEYS.status });
    });

    return () => {
      connection.off("ReceiveCommunityMatch", handleMatched);
      connection.off("CommunityMatchEnded", handleMatchEnded);
      unsubscribeReconnect();
    };
  }, [isAuthenticated, queryClient]);

  return {
    status: query.data?.status ?? OPTED_OUT.status,
    match: query.data?.match ?? null,
    isLoading: query.isLoading,
  };
}

/**
 * Opt-in/opt-out are deliberate, confirmed actions (not fire-and-forget like
 * exit/block/report below) — the UI waits for the response because opting in
 * can immediately resolve to a match rather than the waiting state.
 */
export function useCommunityOptInOut() {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const optIn = async () => {
    setIsPending(true);
    try {
      const result = await fetchCommunity.optIn();
      queryClient.setQueryData<CommunityMatchStatusResponse>(COMMUNITY_KEYS.status, result);
    } finally {
      setIsPending(false);
    }
  };

  const optOut = async () => {
    setIsPending(true);
    try {
      await fetchCommunity.optOut();
      queryClient.setQueryData<CommunityMatchStatusResponse>(COMMUNITY_KEYS.status, OPTED_OUT);
    } finally {
      setIsPending(false);
    }
  };

  return { optIn, optOut, isPending };
}

/**
 * Exit/block/report clear local match state immediately and fire the network
 * call in the background — no confirmation dialog, no waiting on the request,
 * per the crisis-safety decision in phase-07's Design Decisions. Worst case on
 * failure is a stale match record server-side, never a user stuck waiting.
 */
export function useCommunityMatchActions() {
  const queryClient = useQueryClient();

  const clearToWaiting = () => {
    queryClient.setQueryData<CommunityMatchStatusResponse>(COMMUNITY_KEYS.status, {
      status: "waiting",
      match: null,
    });
  };

  return {
    exitMatch: (matchId: string) => {
      clearToWaiting();
      fetchCommunity.exitMatch(matchId).catch((err) => {
        console.warn("[useCommunityMatchActions] exit failed to persist", err);
      });
    },
    blockMatch: (matchId: string) => {
      clearToWaiting();
      fetchCommunity.blockMatch(matchId).catch((err) => {
        console.warn("[useCommunityMatchActions] block failed to persist", err);
      });
    },
    reportMatch: (matchId: string, reason?: string) => {
      clearToWaiting();
      fetchCommunity.reportMatch(matchId, reason).catch((err) => {
        console.warn("[useCommunityMatchActions] report failed to persist", err);
      });
    },
  };
}
