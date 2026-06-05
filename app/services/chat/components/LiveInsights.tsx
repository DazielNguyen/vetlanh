"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useMoodSummary } from "@/hooks/useMood";
import { useRecommendedExercises } from "@/hooks/useExercise";

// sentiment_score 1 → 20%, 5 → 100%
function scoreToHeight(score: number): number {
  return (score / 5) * 100;
}

export function LiveInsights() {
  const { data: moodSummary, isLoading: loadingMood } = useMoodSummary(7);
  // Fallback to "anxious" — can be replaced with derived mood from latest check-in
  const { data: recommended, isLoading: loadingExercises } = useRecommendedExercises({ mood: "anxious", limit: 3 });

  return (
    <div className="hidden xl:flex flex-col w-72 shrink-0 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-primary font-bold text-sm">
        <span>📊</span> Phân tích trực tiếp
      </div>

      {/* Mood trend chart */}
      <Card className="border-none shadow-sm rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Xu hướng tâm trạng</h3>
            <span className="text-primary text-xs">📈</span>
          </div>

          {loadingMood ? (
            <div className="flex items-center justify-center h-16">
              <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
            </div>
          ) : !moodSummary || moodSummary.length === 0 ? (
            <div className="flex items-end gap-1.5 h-16">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-sm bg-slate-100 h-full" />
              ))}
            </div>
          ) : (
            <div className="flex items-end gap-1.5 h-16">
              {moodSummary.map((entry) => (
                <div
                  key={entry.date}
                  className="flex-1 rounded-sm bg-primary/30"
                  style={{ height: `${scoreToHeight(entry.sentiment_score)}%` }}
                  title={`${entry.date}: ${entry.sentiment_score}/5`}
                />
              ))}
            </div>
          )}

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {moodSummary && moodSummary.length > 0
              ? `${moodSummary.length} ngày gần đây có dữ liệu tâm trạng.`
              : "Chưa có dữ liệu tâm trạng. Hãy check-in hôm nay!"}
          </p>
        </CardContent>
      </Card>

      {/* Recommended exercises */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bài tập đề xuất</h3>

        {loadingExercises ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
          </div>
        ) : !recommended || recommended.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-2">Chưa có bài tập phù hợp.</p>
        ) : (
          recommended.map((exercise) => {
            const mins = exercise.duration_minutes ?? (exercise.duration_seconds ? Math.round(exercise.duration_seconds / 60) : null);
            return (
              <Link
                key={exercise.slug}
                href={`/services/exercises/${exercise.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-slate-50 hover:border-primary/20 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-base">🧘</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{exercise.title}</p>
                  {mins != null && (
                    <p className="text-[10px] text-slate-400">{mins} phút</p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Crisis support — no BE endpoint, uses tel: link per spec */}
      <Card className="border-none shadow-none rounded-2xl bg-slate-800 text-white overflow-hidden">
        <CardContent className="p-4 text-center space-y-2">
          <p className="text-xs text-slate-300">Cần hỗ trợ khẩn cấp?</p>
          <Button
            asChild
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-none"
          >
            <a href="tel:18006898" className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Hỗ trợ khủng hoảng
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
