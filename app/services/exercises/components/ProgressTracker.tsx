"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, CalendarCheck, Trophy } from "lucide-react";
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
      <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden sticky top-6 bg-white">
        <div className="h-2 bg-linear-to-r from-emerald-400 to-[#6D8A96]" />
        <CardContent className="p-6 flex items-center justify-center h-40">
          <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
        </CardContent>
      </Card>
    );
  }

  const safeLogs = logs ?? [];
  const mins = totalMinutes(safeLogs);
  const streak = currentStreak(safeLogs);
  const recentLogs = safeLogs.slice(0, 5);

  return (
    <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden sticky top-6 bg-white">
      <div className="h-2 bg-linear-to-r from-emerald-400 to-[#6D8A96]" />
      <CardHeader className="pb-4 border-b border-slate-50">
        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Tiến trình của bạn
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#FAFDFB] border border-slate-100 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <p className="text-lg font-bold text-slate-800">
              {mins}
              <span className="text-sm font-medium text-slate-500 ml-1">phút</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Đã tập luyện</p>
          </div>

          <div className="bg-[#FAFDFB] border border-slate-100 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-5 h-5" />
            </div>
            <p className="text-lg font-bold text-slate-800">
              {streak}
              <span className="text-sm font-medium text-slate-500 ml-1">ngày</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Chuỗi liên tiếp</p>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <p className="text-sm font-bold text-slate-700 mb-3">Hoạt động gần đây</p>
          {recentLogs.length === 0 ? (
            <p className="text-xs text-slate-400">Chưa có buổi tập nào. Hãy bắt đầu ngay!</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl"
                >
                  <span className="font-semibold">{log.exercise_slug}</span>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>{Math.round(log.duration_seconds / 60)} phút</span>
                    <span>·</span>
                    <span>{log.completed_at ? getTodayLabel(log.completed_at) : "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center">
          Tổng: {safeLogs.length} buổi tập hoàn thành
        </p>
      </CardContent>
    </Card>
  );
}
