"use client";

import { LevelGate } from "@/components/progression/LevelGate";
import { useCommunityMatchStatus } from "@/hooks/useCommunityMatch";
import { CommunityOptIn } from "./components/CommunityOptIn";
import { CommunityWaiting } from "./components/CommunityWaiting";
import { CommunityConversation } from "./components/CommunityConversation";
import { Loader2 } from "lucide-react";

function CommunityContent() {
  const { status, match, isLoading } = useCommunityMatchStatus();

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/20" strokeWidth={2} />
      </div>
    );
  }

  if (status === "matched" && match) {
    return <CommunityConversation match={match} />;
  }

  if (status === "waiting") {
    return <CommunityWaiting />;
  }

  return <CommunityOptIn />;
}

export default function CommunityPage() {
  return (
    <LevelGate requiredLevel={5}>
      <div className="w-full pb-10">
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Cộng đồng</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Kết nối ẩn danh với một người khác đang trải qua điều tương tự — bạn không cần phải một mình.
          </p>
        </div>
        <CommunityContent />
      </div>
    </LevelGate>
  );
}
