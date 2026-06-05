"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { useDailyPrompt } from "@/hooks/useJournalPrompts";
import { useQueryClient } from "@tanstack/react-query";
import { PROMPT_KEYS } from "@/hooks/useJournalPrompts";

interface Props {
  onUsePrompt: (text: string) => void;
}

export function DailyPromptCard({ onUsePrompt }: Props) {
  const { data, isLoading } = useDailyPrompt();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: PROMPT_KEYS.daily });
    setRefreshing(false);
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

  if (!data) return null;

  const { prompt } = data;

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
            disabled={refreshing}
            className="text-violet-400 hover:text-violet-600 transition"
            title="Làm mới gợi ý"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">
          {prompt.topic}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700 leading-relaxed italic">"{prompt.text}"</p>
        <Button
          onClick={() => onUsePrompt(prompt.text)}
          className="w-full h-10 rounded-2xl font-bold bg-violet-600 hover:bg-violet-700"
        >
          Dùng gợi ý này
        </Button>
      </CardContent>
    </Card>
  );
}
