"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { useDailyPrompt, useNextPrompt, usePromptsByTopic } from "@/hooks/useJournalPrompts";

interface Props {
  onUsePrompt: (text: string) => void;
}

export function DailyPromptCard({ onUsePrompt }: Props) {
  const { data: dailyData, isLoading } = useDailyPrompt();
  // Free-cycling mode: track which prompt id to pass to /next
  const [nextFromId, setNextFromId] = useState<number | null>(null);
  const { data: nextPrompt, isFetching: fetchingNext } = useNextPrompt(nextFromId);
  // Topic filter mode: selected topic + index within that topic's prompt list
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topicIndex, setTopicIndex] = useState(0);
  const { data: topicPrompts, isFetching: fetchingTopic } = usePromptsByTopic(selectedTopic);

  const isFetching = fetchingNext || fetchingTopic;

  // When a topic is active, cycle through its prompts by index.
  // When no topic, fall back to /next cycling then daily.
  const displayedPrompt = selectedTopic
    ? topicPrompts?.[topicIndex] ?? null
    : nextPrompt ?? dailyData?.prompt;

  function handleTopicSelect(topic: string) {
    if (selectedTopic === topic) {
      // Deselect — go back to daily prompt mode
      setSelectedTopic(null);
      setTopicIndex(0);
    } else {
      setSelectedTopic(topic);
      setTopicIndex(0);
      setNextFromId(null);
    }
  }

  function handleRefresh() {
    if (selectedTopic && topicPrompts && topicPrompts.length > 0) {
      setTopicIndex((prev) => (prev + 1) % topicPrompts.length);
    } else {
      const currentId = displayedPrompt?.id;
      if (currentId !== undefined) setNextFromId(currentId);
    }
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

  // While fetching topic prompts keep card visible with spinner instead of disappearing
  if (!displayedPrompt) {
    if (fetchingTopic) {
      return (
        <Card className="border-none shadow-sm rounded-3xl">
          <CardContent className="p-6 flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
          </CardContent>
        </Card>
      );
    }
    return null;
  }

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
            disabled={isFetching}
            className="text-violet-400 hover:text-violet-600 transition"
            title="Gợi ý tiếp theo"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Topic chips — sourced from BE via DailyPromptResponse.topics */}
        {dailyData?.topics && dailyData.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {dailyData.topics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicSelect(topic)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition ${
                  selectedTopic === topic
                    ? "bg-violet-600 text-white"
                    : "bg-violet-100 text-violet-600 hover:bg-violet-200"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        )}

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
