"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Activity, TrendingUp, Wind } from "lucide-react";
import { useMoodSummary, useMoodEntries } from "@/hooks/useMood";
import { useRecommendedExercises } from "@/hooks/useExercise";

// sentiment_score 1 → 20%, 5 → 100%
function scoreToHeight(score: number): number {
  return (score / 5) * 100;
}

// score 1–2 → sad, 3 → anxious (neutral fallback), 4–5 → need_energy
function scoreToMoodFilter(score: number): string {
  if (score <= 2) return "sad";
  if (score >= 4) return "need_energy";
  return "anxious";
}

// Build 7 fixed slots so missing check-in days show as visual gaps
function buildChartSlots(
  entries: { date: string; sentiment_score: number }[],
  days = 7
): { date: string; score: number | null }[] {
  const byDate = Object.fromEntries(entries.map((e) => [e.date, e.sentiment_score]));
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    return { date: dateStr, score: byDate[dateStr] ?? null };
  });
}

export function LiveInsights() {
  const { data: moodSummary, isLoading: loadingMood } = useMoodSummary(7);
  const { data: latestEntries } = useMoodEntries({ limit: 1 });
  const latestScore = latestEntries?.[0]?.mood;
  const derivedMood = latestScore !== undefined ? scoreToMoodFilter(latestScore) : "anxious";
  const { data: recommended, isLoading: loadingExercises } = useRecommendedExercises({ mood: derivedMood, limit: 3 });

  return (
    <div className="hidden xl:flex flex-col w-72 shrink-0 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-primary font-bold text-sm">
        <Activity className="w-4 h-4" strokeWidth={2} /> Phân tích trực tiếp
      </div>

      {/* Mood trend chart */}
      <Card className="card-lifted border-none rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-sm">Xu hướng tâm trạng</h3>
            <TrendingUp className="w-4 h-4 text-primary" strokeWidth={2} />
          </div>

          {loadingMood ? (
            <div className="flex items-center justify-center h-16">
              <Loader2 className="h-4 w-4 animate-spin text-foreground/20" strokeWidth={2} />
            </div>
          ) : (
            <div className="flex items-end gap-1.5 h-16">
              {buildChartSlots(moodSummary ?? []).map((slot) => (
                slot.score !== null ? (
                  <div
                    key={slot.date}
                    className="flex-1 rounded-sm bg-primary/40"
                    style={{ height: `${scoreToHeight(slot.score)}%` }}
                    title={`${slot.date}: ${slot.score}/5`}
                  />
                ) : (
                  <div
                    key={slot.date}
                    className="flex-1 rounded-sm bg-border/40"
                    style={{ height: "8px" }}
                    title={slot.date}
                  />
                )
              ))}
            </div>
          )}

          <p className="text-[11px] text-foreground/50 leading-relaxed">
            {moodSummary && moodSummary.length > 0
              ? `${moodSummary.length} ngày gần đây có dữ liệu tâm trạng.`
              : "Chưa có dữ liệu tâm trạng. Hãy check-in hôm nay!"}
          </p>
        </CardContent>
      </Card>

      {/* Recommended exercises */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider">Bài tập đề xuất</h3>

        {loadingExercises ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-foreground/20" strokeWidth={2} />
          </div>
        ) : !recommended || recommended.length === 0 ? (
          <p className="text-xs text-foreground/40 text-center py-2">Chưa có bài tập phù hợp.</p>
        ) : (
          recommended.map((exercise) => {
            const mins = exercise.duration_minutes ?? (exercise.duration_seconds ? Math.round(exercise.duration_seconds / 60) : null);
            return (
              <Link
                key={exercise.slug}
                href={`/services/exercises/${exercise.slug}`}
                className="card-lifted flex items-center gap-3 p-3 rounded-xl border-none hover:ring-1 hover:ring-primary/30 transition"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary/60 flex items-center justify-center shrink-0">
                  <Wind className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{exercise.title}</p>
                  {mins != null && (
                    <p className="text-[10px] text-foreground/40">{mins} phút</p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
