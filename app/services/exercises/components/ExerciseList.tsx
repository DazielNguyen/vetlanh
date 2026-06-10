"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  PlayCircle,
  Bell,
  Sparkles,
  Wind,
  Brain,
  Anchor,
  NotebookPen,
  Waves,
  CloudRain,
  CloudDrizzle,
  Moon,
  Zap,
  Flame,
  X,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { useExerciseList } from "@/hooks/useExercise";
import { useExerciseReminder } from "@/hooks/useNotifications";
import { useExerciseCategories, useExerciseMoodFilters } from "@/hooks/useServices";

const FALLBACK_CATEGORIES = [
  { key: "breathing", label: "Hơi thở" },
  { key: "meditation", label: "Thiền" },
  { key: "grounding", label: "Hiện tại" },
  { key: "cbt", label: "CBT" },
  { key: "relaxation", label: "Thư giãn" },
];

const FALLBACK_MOODS = [
  { key: "anxious", label: "Lo lắng" },
  { key: "sad", label: "Buồn bã" },
  { key: "cant_sleep", label: "Khó ngủ" },
  { key: "need_energy", label: "Cần năng lượng" },
  { key: "angry", label: "Tức giận" },
];

// All filter chips share one icon family (lucide, strokeWidth 2) for a consistent look
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  breathing: Wind,
  meditation: Brain,
  grounding: Anchor,
  cbt: NotebookPen,
  relaxation: Waves,
};

const MOOD_ICONS: Record<string, LucideIcon> = {
  anxious: CloudRain,
  sad: CloudDrizzle,
  cant_sleep: Moon,
  need_energy: Zap,
  angry: Flame,
};

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const mins = Math.round(seconds / 60);
  return `${mins} phút`;
}

export function ExerciseList() {
  const [mood, setMood] = useState("");
  const [category, setCategory] = useState("");
  const { data: reminder } = useExerciseReminder();
  const { data: categoriesData } = useExerciseCategories();
  const { data: moodsData } = useExerciseMoodFilters();

  const categoryOptions = [{ key: "", label: "Tất cả" }, ...(categoriesData ?? FALLBACK_CATEGORIES)];
  const allMoods = moodsData ?? FALLBACK_MOODS;

  const params = {
    ...(mood && { mood }),
    ...(category && { category }),
  };

  const { data: exercises, isLoading } = useExerciseList(
    mood || category ? params : undefined
  );

  const chipClass = (active: boolean) =>
    `flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-2xl border transition ${
      active
        ? "bg-primary text-white border-primary shadow-sm"
        : "bg-background/60 text-foreground/60 border-border/40 hover:border-primary/40 hover:text-foreground"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-primary">Lựa chọn bài tập hôm nay</h2>
      </div>

      {/* Exercise reminder banner */}
      {reminder?.should_notify && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-secondary/40 border border-secondary">
          <Bell className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm font-semibold text-foreground/80">
            Đã đến giờ tập hôm nay! Chọn một bài tập bên dưới để bắt đầu.
          </p>
        </div>
      )}

      {/* Filters - one chip style across categories and moods, single scrollable row */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {categoryOptions.map((opt) => {
          const Icon = opt.key === "" ? Sparkles : CATEGORY_ICONS[opt.key] ?? Sparkles;
          return (
            <button key={`cat-${opt.key}`} onClick={() => setCategory(opt.key)} className={`${chipClass(category === opt.key)} shrink-0`}>
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              {opt.label}
            </button>
          );
        })}
        <div className="w-px bg-border/40 shrink-0 my-1" />
        {allMoods.map((opt) => {
          const Icon = MOOD_ICONS[opt.key] ?? Sparkles;
          return (
            <button key={`mood-${opt.key}`} onClick={() => setMood(opt.key)} className={`${chipClass(mood === opt.key)} shrink-0`}>
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              {opt.label}
            </button>
          );
        })}
        {mood && (
          <button onClick={() => setMood("")} className={`${chipClass(false)} shrink-0`}>
            <X className="w-3.5 h-3.5" strokeWidth={2} />
            Bỏ lọc
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-foreground/20" />
        </div>
      ) : !exercises || exercises.length === 0 ? (
        <p className="text-sm text-foreground/40 text-center py-8">
          Không có bài tập nào phù hợp với lựa chọn hiện tại.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {exercises.map((exercise) => (
            <Card
              key={exercise.slug}
              className="card-lifted border-none rounded-2xl overflow-hidden group"
            >
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                    {exercise.title}
                  </h3>
                  {exercise.duration_seconds && (
                    <p className="flex items-center gap-1 text-xs text-foreground/40 mt-1">
                      <Clock className="w-3 h-3" strokeWidth={2} />
                      {formatDuration(exercise.duration_seconds)}
                    </p>
                  )}
                </div>
                <Link
                  href={`/services/exercises/${exercise.slug}`}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white hover:bg-primary/90 transition shrink-0"
                >
                  <PlayCircle className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
