"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecommendedExercises } from "@/hooks/useExercise";

const CATEGORY_EMOJI: Record<string, string> = {
  breathing: "🌬️",
  meditation: "🧘",
  grounding: "🌱",
  cbt: "💭",
  relaxation: "🌊",
};

function formatDuration(seconds?: number, minutes?: number): string {
  if (minutes != null && minutes > 0) return `${Math.round(minutes)} phút`;
  if (seconds != null && seconds > 0) return `${Math.round(seconds / 60)} phút`;
  return "";
}

export function QuickReliefCard() {
  const { data: exercises, isLoading, isError } = useRecommendedExercises({ limit: 3 });

  if (!isLoading && (isError || !exercises?.length)) return null;

  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-linear-to-br from-[#FEF9F2] to-[#E8F7EE] dark:bg-none dark:from-transparent dark:to-transparent dark:bg-white/5 card-tilt">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-amber-700 dark:text-emerald-400">
          <Zap className="h-4 w-4 fill-amber-400 text-amber-500 dark:fill-emerald-400 dark:text-emerald-400" />
          Giảm căng thẳng ngay
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={`skeleton-${i}`} className="h-20 rounded-2xl" />
              ))
            : (exercises ?? []).map((exercise) => {
                const duration = formatDuration(exercise.duration_seconds, exercise.duration_minutes);
                return (
                  <Link
                    key={exercise.slug}
                    href={`/services/exercises/${exercise.slug}`}
                    className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white dark:bg-white/5 border border-border/40 hover:border-primary/40 hover:shadow-md transition group dark:border-white/10 dark:hover:border-emerald-500/40"
                  >
                    <span className="text-xl leading-none">
                      {CATEGORY_EMOJI[exercise.category] ?? "✨"}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-white/80 line-clamp-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {exercise.title}
                    </span>
                    {duration && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-white/50 self-start border border-slate-100 dark:border-white/10">
                        ⏱ {duration}
                      </span>
                    )}
                  </Link>
                );
              })}
        </div>
      </CardContent>
    </Card>
  );
}
