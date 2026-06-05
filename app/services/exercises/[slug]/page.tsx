"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Play, Square, CheckCircle } from "lucide-react";
import { useExercise, useLogExercise } from "@/hooks/useExercise";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExerciseDetailPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();

  const { data: exercise, isLoading } = useExercise(slug);
  const { mutate: logSession, isPending: isLogging } = useLogExercise();

  const [sessionState, setSessionState] = useState<"idle" | "running" | "done">("idle");
  const [elapsed, setElapsed] = useState(0);

  // Timer uses ref to avoid re-renders on every tick
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  function startSession() {
    setSessionState("running");
    setElapsed(0);
    elapsedRef.current = 0;
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
  }

  function stopTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function completeSession() {
    stopTimer();
    const duration = elapsedRef.current;
    logSession(
      { exercise_slug: slug, duration_seconds: duration },
      { onSuccess: () => setSessionState("done") }
    );
  }

  function cancelSession() {
    stopTimer();
    setSessionState("idle");
    setElapsed(0);
    elapsedRef.current = 0;
  }

  // Clean up on unmount
  useEffect(() => () => stopTimer(), []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="text-sm text-slate-400 py-10 text-center">
        Không tìm thấy bài tập này.
      </div>
    );
  }

  return (
    <div className="w-full pb-10 max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </button>

      <Card className="border-none shadow-sm rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-extrabold text-slate-800">{exercise.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {exercise.category}
            </span>
            {exercise.duration_seconds && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                ⏱ {Math.round(exercise.duration_seconds / 60)} phút
              </span>
            )}
            {exercise.mood_tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">{exercise.description}</p>

          {/* Timer display */}
          {sessionState !== "idle" && (
            <div className="flex flex-col items-center gap-2 py-6 bg-slate-50 rounded-2xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {sessionState === "done" ? "Đã hoàn thành" : "Đang chạy"}
              </p>
              <span className="text-5xl font-black text-slate-800 tabular-nums">
                {formatTime(elapsed)}
              </span>
            </div>
          )}

          {/* CTA buttons */}
          {sessionState === "idle" && (
            <Button onClick={startSession} className="w-full h-12 rounded-2xl font-bold text-base gap-2">
              <Play className="h-5 w-5" />
              Bắt đầu buổi tập
            </Button>
          )}

          {sessionState === "running" && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={cancelSession}
                className="flex-1 h-11 rounded-2xl gap-2 text-slate-600"
              >
                <Square className="h-4 w-4" />
                Hủy
              </Button>
              <Button
                onClick={completeSession}
                disabled={isLogging}
                className="flex-1 h-11 rounded-2xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                {isLogging ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Hoàn thành
                  </>
                )}
              </Button>
            </div>
          )}

          {sessionState === "done" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
              <p className="text-lg font-bold text-slate-800">Tuyệt vời! Buổi tập đã được ghi lại.</p>
              <p className="text-sm text-slate-500">
                Thời gian: {formatTime(elapsed)}
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/services/exercises")}
                className="rounded-2xl"
              >
                Quay lại danh sách
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
