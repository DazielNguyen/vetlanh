"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { useDailyPrompt, useNextPrompt } from "@/hooks/useJournalPrompts";

interface Props {
  onUsePrompt: (text: string) => void;
}

export function DailyPromptCard({ onUsePrompt }: Props) {
  const { data: dailyData, isLoading } = useDailyPrompt();
  // Track which prompt id to pass to /next — null means show daily prompt
  const [nextFromId, setNextFromId] = useState<number | null>(null);
  const { data: nextPrompt, isFetching: fetchingNext } = useNextPrompt(nextFromId);

  // Show next prompt if available, otherwise fall back to daily
  const displayedPrompt = nextPrompt ?? dailyData?.prompt;

  function handleRefresh() {
    const currentId = displayedPrompt?.id;
    if (currentId !== undefined) setNextFromId(currentId);
  }

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm rounded-3xl">
        <CardContent className="p-6 flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        </CardContent>
      </Card>
    );
  }

  if (!displayedPrompt) return null;

  return (
    <Card className="border-none shadow-sm rounded-3xl bg-gradient-to-br from-violet-50 to-indigo-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <CardTitle className="text-base font-bold text-violet-800">Gợi ý hôm nay</CardTitle>
          </div>
          <button
            onClick={handleRefresh}
            disabled={fetchingNext}
            className="text-violet-400 hover:text-violet-600 transition"
            title="Gợi ý tiếp theo"
          >
            <RefreshCw className={`h-4 w-4 ${fetchingNext ? "animate-spin" : ""}`} />
          </button>
        </div>
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">
          {displayedPrompt.topic}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700 leading-relaxed italic">"{displayedPrompt.text}"</p>
        <Button
          onClick={() => onUsePrompt(displayedPrompt.text)}
          className="w-full h-10 rounded-2xl font-bold bg-violet-600 hover:bg-violet-700"
        >
          Dùng gợi ý này
        </Button>
      </CardContent>
    </Card>
  );
}
