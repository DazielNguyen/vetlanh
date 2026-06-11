"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Activity, Wind } from "lucide-react";
import { useMoodEntries } from "@/hooks/useMood";
import { useRecommendedExercises } from "@/hooks/useExercise";
import type { StreamChatState } from "@/hooks/useStreamChat";
import type { Emotion } from "@/types/chat";

const EMOTION_CONFIG: Record<string, { icon: string; label: string; bg: string; text: string }> = {
  sad:       { icon: "😔", label: "Buồn",     bg: "bg-blue-100/70",   text: "text-blue-600" },
  anxious:   { icon: "😰", label: "Lo lắng",  bg: "bg-amber-100/70",  text: "text-amber-600" },
  angry:     { icon: "😤", label: "Tức giận", bg: "bg-red-100/70",    text: "text-red-500" },
  tired:     { icon: "😩", label: "Mệt mỏi",  bg: "bg-violet-100/70", text: "text-violet-600" },
  happy:     { icon: "😊", label: "Vui vẻ",   bg: "bg-green-100/70",  text: "text-green-600" },
  disgusted: { icon: "😞", label: "Chán nản", bg: "bg-gray-100/70",   text: "text-gray-500" },
};

function emotionToMoodFilter(emotion: Emotion): string {
  if (emotion === "sad" || emotion === "disgusted") return "sad";
  if (emotion === "anxious") return "anxious";
  if (emotion === "angry") return "angry";
  if (emotion === "tired") return "need_energy";
  return "anxious";
}

// score 1–2 → sad, 3 → anxious, 4–5 → need_energy
function scoreToMoodFilter(score: number): string {
  if (score <= 2) return "sad";
  if (score >= 4) return "need_energy";
  return "anxious";
}

interface Props {
  stream: StreamChatState;
}

export function LiveInsights({ stream }: Props) {
  const { lastEmotion, emotionHistory } = stream;

  const { data: latestEntries } = useMoodEntries({ limit: 1 });
  const latestScore = latestEntries?.[0]?.mood;

  const derivedMood = lastEmotion
    ? emotionToMoodFilter(lastEmotion.emotion)
    : latestScore !== undefined
    ? scoreToMoodFilter(latestScore)
    : "anxious";

  const { data: recommended, isLoading: loadingExercises } = useRecommendedExercises({ mood: derivedMood, limit: 3 });

  return (
    <div className="hidden xl:flex flex-col w-72 shrink-0 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-primary font-bold text-sm">
        <Activity className="w-4 h-4" strokeWidth={2} /> Phân tích trực tiếp
      </div>

      {/* Chat emotion tracker */}
      <Card className="card-lifted border-none rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-foreground text-sm">Cảm xúc phiên này</h3>

          {emotionHistory.length === 0 ? (
            <p className="text-xs text-foreground/40 leading-relaxed">
              AI sẽ nhận diện cảm xúc của bạn qua từng tin nhắn và hiển thị tại đây.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {emotionHistory.map((e, i) => {
                const cfg = EMOTION_CONFIG[e.emotion];
                const isLatest = i === emotionHistory.length - 1;
                return cfg ? (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} ${isLatest ? "ring-1 ring-current/30" : "opacity-70"}`}
                  >
                    {cfg.icon} {cfg.label}
                  </span>
                ) : null;
              })}
            </div>
          )}

          {lastEmotion && EMOTION_CONFIG[lastEmotion.emotion] && (
            <p className="text-[11px] text-foreground/45 leading-relaxed">
              Gần nhất:{" "}
              <span className="font-semibold">
                {EMOTION_CONFIG[lastEmotion.emotion].icon} {EMOTION_CONFIG[lastEmotion.emotion].label}
              </span>{" "}
              · Độ tin cậy {Math.round(lastEmotion.confidence * 100)}%
            </p>
          )}
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
