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
    ? (topicPrompts?.[topicIndex] ?? null)
    : (nextPrompt ?? dailyData?.prompt);

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
      <Card className="card-lifted border-none rounded-[2rem]">
        <CardContent className="p-6 flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-primary/35" />
        </CardContent>
      </Card>
    );
  }

  // While fetching topic prompts keep card visible with spinner instead of disappearing
  if (!displayedPrompt) {
    if (fetchingTopic) {
      return (
        <Card className="card-lifted border-none rounded-[2rem]">
          <CardContent className="p-6 flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-primary/35" />
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <Card className="card-lifted overflow-hidden rounded-[2rem] border-none bg-[#fff3db]/85 dark:bg-white/6">
      <CardHeader className="pb-2 pt-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-illustration-sun-yellow/35">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            <CardTitle className="font-baloo text-lg font-bold text-foreground">
              Một câu để bắt đầu
            </CardTitle>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="rounded-xl p-2 text-foreground/35 transition-all hover:rotate-12 hover:bg-hero-wordmark/6 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
                    ? "bg-hero-wordmark text-white"
                    : "bg-white/60 text-hero-wordmark/65 hover:bg-white dark:bg-white/8 dark:text-white/65 dark:hover:bg-white/12"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        <span className="text-[11px] font-semibold tracking-[0.14em] text-primary/65 uppercase">
          {displayedPrompt.topic}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="max-w-xl text-lg font-medium leading-relaxed text-foreground/85 text-pretty">
          “{displayedPrompt.text}”
        </p>
        <Button
          onClick={() => onUsePrompt(displayedPrompt.text)}
          className="h-11 w-full rounded-2xl bg-hero-wordmark font-bold text-white shadow-[0_10px_24px_rgba(61,43,30,0.14)] transition-all hover:-translate-y-0.5 hover:bg-hero-wordmark/90 active:translate-y-0 dark:bg-primary dark:hover:bg-primary/90"
        >
          Viết từ gợi ý này
        </Button>
      </CardContent>
    </Card>
  );
}
