"use client";

import { Loader2, Sparkles, Clock, Flame } from "lucide-react";
import { useExerciseLogs } from "@/hooks/useExercise";
import { formatDate } from "@/lib/utils/formatDate";

function getTodayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Hôm nay";
  if (diff === 1) return "Hôm qua";
  return formatDate(dateStr);
}

function humanizeSlug(slug: string): string {
  const words = slug.split("-");
  return words.map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w)).join(" ");
}

function totalMinutes(logs: { duration_seconds: number }[]): number {
  return Math.round(logs.reduce((sum, l) => sum + l.duration_seconds, 0) / 60);
}

function currentStreak(logs: { completed_at: string | null }[]): number {
  if (logs.length === 0) return 0;
  // Sort descending; skip logs where completed_at is null (exercise not yet finished)
  const dates = [...new Set(
    logs.filter((l): l is { completed_at: string } => l.completed_at != null).map((l) => l.completed_at.slice(0, 10))
  )].sort().reverse();

  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  let expected = today;

  for (const date of dates) {
    if (date === expected) {
      streak++;
      const d = new Date(expected);
      d.setDate(d.getDate() - 1);
      expected = d.toISOString().slice(0, 10);
    } else {
      break;
    }
  }
  return streak;
}

export function ProgressTracker() {
  const { data: logs, isLoading } = useExerciseLogs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="h-5 w-5 animate-spin text-foreground/20" />
      </div>
    );
  }

  const safeLogs = logs ?? [];
  const mins = totalMinutes(safeLogs);
  const streak = currentStreak(safeLogs);
  const recentLogs = safeLogs.filter((log) => log.duration_seconds > 0).slice(0, 5);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
      {/* Title + stats */}
      <div className="flex items-center gap-6 shrink-0">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2 shrink-0">
          <Sparkles className="w-5 h-5" strokeWidth={2} />
          Tiến trình
        </h2>

        <div className="flex items-center gap-5 pl-6 border-l border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-secondary/60 text-primary flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-base font-bold text-foreground leading-none">
                {mins}<span className="text-xs font-medium text-foreground/50 ml-1">phút</span>
              </p>
              <p className="text-xs text-foreground/50 mt-1">Đã tập luyện</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-secondary/60 text-primary flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <p className="text-base font-bold text-foreground leading-none">
                {streak}<span className="text-xs font-medium text-foreground/50 ml-1">ngày</span>
              </p>
              <p className="text-xs text-foreground/50 mt-1">Chuỗi liên tiếp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity - horizontal scroll */}
      <div className="flex-1 min-w-0 lg:pl-6 lg:border-l border-border/40">
        {recentLogs.length === 0 ? (
          <p className="text-xs text-foreground/40">Chưa có buổi tập nào. Hãy bắt đầu ngay!</p>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-2 text-xs text-foreground/60 bg-background/60 px-3 py-2 rounded-xl shrink-0"
              >
                <span className="font-semibold text-foreground">{humanizeSlug(log.exercise_slug)}</span>
                <span className="text-foreground/40">{Math.round(log.duration_seconds / 60)} phút</span>
                {log.completed_at && <span className="text-foreground/40">{getTodayLabel(log.completed_at)}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
