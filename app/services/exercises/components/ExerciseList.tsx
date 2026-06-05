"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, PlayCircle } from "lucide-react";
import { useExerciseList } from "@/hooks/useExercise";

const CATEGORY_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "breathing", label: "Hơi thở" },
  { value: "meditation", label: "Thiền" },
  { value: "journaling", label: "Nhật ký" },
  { value: "movement", label: "Vận động" },
  { value: "sound", label: "Âm thanh" },
];

const MOOD_OPTIONS = [
  { value: "", label: "Tất cả tâm trạng" },
  { value: "anxious", label: "Lo lắng" },
  { value: "sad", label: "Buồn bã" },
  { value: "stressed", label: "Căng thẳng" },
  { value: "tired", label: "Mệt mỏi" },
];

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const mins = Math.round(seconds / 60);
  return `${mins} phút`;
}

export function ExerciseList() {
  const [mood, setMood] = useState("");
  const [category, setCategory] = useState("");

  const params = {
    ...(mood && { mood }),
    ...(category && { category }),
  };

  const { data: exercises, isLoading } = useExerciseList(
    mood || category ? params : undefined
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Lựa chọn bài tập hôm nay</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCategory(opt.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                category === opt.value
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {MOOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMood(opt.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                mood === opt.value
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        </div>
      ) : !exercises || exercises.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">
          Không có bài tập nào phù hợp với lựa chọn hiện tại.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((exercise) => (
            <Card
              key={exercise.slug}
              className="border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden group bg-white"
            >
              <CardContent className="p-6">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-600 transition-colors">
                    {exercise.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {exercise.description}
                  </p>

                  {exercise.mood_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exercise.mood_tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    {exercise.duration_seconds && (
                      <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
                        ⏱ {formatDuration(exercise.duration_seconds)}
                      </span>
                    )}
                    <Link
                      href={`/services/exercises/${exercise.slug}`}
                      className="flex items-center gap-1.5 text-sm font-bold text-white bg-primary px-4 py-2 rounded-xl hover:bg-primary/90 transition ml-auto"
                    >
                      <PlayCircle className="w-4 h-4" /> Bắt đầu
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
