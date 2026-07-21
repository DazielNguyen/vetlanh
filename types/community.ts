export type CommunityMatchStatus = "opted_out" | "waiting" | "matched";

// Deliberately carries nothing beyond an opaque matchId and a display handle —
// no partner user id, avatar, or profile reference exists anywhere in this type.
export interface CommunityMatch {
  matchId: string;
  partnerHandle: string;
  matchedAt: string;
}

export interface CommunityMatchStatusResponse {
  status: CommunityMatchStatus;
  match: CommunityMatch | null;
}

export interface CommunityMessage {
  id: string;
  matchId: string;
  content: string;
  isMine: boolean;
  createdAt: string;
}

export interface CommunityReport {
  id: string;
  matchId: string;
  reporterHandle: string;
  reportedHandle: string;
  reason: string | null;
  reportedAt: string;
  slaDeadline: string;
  status: "open" | "resolved";
}
