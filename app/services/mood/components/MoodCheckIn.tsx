"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Loader2, SlidersHorizontal } from "lucide-react";
import { useMoodEntries, useLogMood } from "@/hooks/useMood";
import { getTodayDateString } from "@/lib/utils/formatDate";
import type { EnergyLevel } from "@/types/mood";

const MOOD_OPTIONS = [
  { value: 1, emoji: "😞", label: "Rất tệ" },
  { value: 2, emoji: "😕", label: "Không tốt" },
  { value: 3, emoji: "😐", label: "Bình thường" },
  { value: 4, emoji: "🙂", label: "Tốt" },
  { value: 5, emoji: "😄", label: "Rất tốt" },
] as const;

const ENERGY_OPTIONS = [
  { value: "low" as const, label: "Thấp", emoji: "😴" },
  { value: "medium" as const, label: "Trung bình", emoji: "😊" },
  { value: "high" as const, label: "Cao", emoji: "⚡" },
];

const PRESET_FACTORS = [
  { value: "work", label: "Công việc" },
  { value: "sleep", label: "Giấc ngủ" },
  { value: "exercise", label: "Tập thể dục" },
  { value: "diet", label: "Ăn uống" },
  { value: "relationships", label: "Các mối quan hệ" },
  { value: "weather", label: "Thời tiết" },
  { value: "health", label: "Sức khỏe" },
  { value: "finance", label: "Tài chính" },
  { value: "study", label: "Học tập" },
];

export function MoodCheckIn() {
  const today = getTodayDateString();
  const { data: entries, isLoading: loadingEntries } = useMoodEntries({ start: today, end: today });
  const { mutate: logMood, isPending } = useLogMood();

  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [factors, setFactors] = useState<Set<string>>(new Set());
  const [note, setNote] = useState("");
  const [savedMood, setSavedMood] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Initialize from today's existing entry — only once when data loads
  const initialized = useRef(false);
  useEffect(() => {
    if (!entries || initialized.current) return;
    initialized.current = true;
    const todayEntry = entries.find((e) => e.date === today);
    if (todayEntry) {
      setMood(todayEntry.mood);
      setSavedMood(todayEntry.mood);
      setEnergy(todayEntry.energy ?? null);
      setFactors(new Set(todayEntry.factors));
      setNote(todayEntry.note ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const isEditMode = !!entries?.find((e) => e.date === today);

  function toggleFactor(value: string) {
    setFactors((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function saveMood(nextMood: number, closeDetails = false) {
    if (isPending) return;
    logMood(
      {
        date: today,
        mood: nextMood,
        ...(energy !== null && { energy }),
        factors: [...factors],
        ...(note.trim() && { note: note.trim() }),
      },
      {
        onSuccess: () => {
          setSavedMood(nextMood);
          if (closeDetails) setShowDetails(false);
        },
      }
    );
  }

  function handleMoodSelect(nextMood: number) {
    setMood(nextMood);
    saveMood(nextMood);
  }

  function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mood) return;
    saveMood(mood, true);
  }

  if (loadingEntries) {
    return (
      <Card className="border-none shadow-sm rounded-3xl">
        <CardContent className="p-6 flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-none bg-white/90 shadow-[0_18px_50px_-32px_rgba(51,65,85,0.45)] dark:bg-white/5">
      <CardHeader className="space-y-1 pb-3">
        <CardTitle className="text-xl font-semibold tracking-tight text-slate-800 dark:text-white">
          Hôm nay bạn đang cảm thấy thế nào?
        </CardTitle>
        <p className="max-w-xl text-sm leading-relaxed text-slate-500 dark:text-white/50">
          Chạm vào cảm xúc gần nhất với bạn. Vết Lành sẽ tự ghi nhận ngay.
        </p>
      </CardHeader>
      <CardContent className="space-y-5 px-6 pb-7 pt-0">
        <div className="grid grid-cols-5 gap-2 sm:gap-3" aria-label="Chọn tâm trạng hôm nay">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={isPending}
              aria-pressed={mood === option.value}
              aria-label={option.label}
              onClick={() => handleMoodSelect(option.value)}
              className={`group flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-3 outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.97] disabled:cursor-wait disabled:opacity-60 sm:min-h-24 ${
                mood === option.value
                  ? "-translate-y-1 border-primary/40 bg-primary/10 shadow-[0_12px_24px_-18px_rgba(79,70,229,0.7)]"
                  : "border-slate-200/70 bg-slate-50/70 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/5 dark:border-white/10 dark:bg-white/5"
              }`}
            >
              <span className="text-2xl transition-transform duration-200 group-hover:scale-110 sm:text-3xl">
                {option.emoji}
              </span>
              <span className="hidden text-[11px] font-medium text-slate-500 dark:text-white/50 sm:block">
                {option.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
          <div
            className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/50"
            aria-live="polite"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Đang ghi nhận...
              </>
            ) : savedMood ? (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <Check className="h-3 w-3" />
                </span>
                {isEditMode ? "Đã cập nhật hôm nay" : "Đã ghi nhận hôm nay"}
              </>
            ) : (
              <span>{today}</span>
            )}
          </div>

          <button
            type="button"
            aria-expanded={showDetails}
            onClick={() => setShowDetails((value) => !value)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-primary outline-none transition hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {showDetails ? "Ẩn bớt" : "Thêm bối cảnh"}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {showDetails && (
          <form
            onSubmit={handleDetailsSubmit}
            className="animate-in fade-in slide-in-from-top-2 space-y-5 border-t border-slate-200/70 pt-5 duration-200 dark:border-white/10"
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-600 dark:text-white/70">
                Mức năng lượng
              </p>
              <div className="flex gap-2">
                {ENERGY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setEnergy(energy === option.value ? null : option.value)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                      energy === option.value
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 hover:border-slate-200 dark:hover:border-white/20"
                    }`}
                  >
                    <span className="text-lg">{option.emoji}</span>
                    <span className="text-[10px] font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-600 dark:text-white/70">
                Điều gì ảnh hưởng nhiều nhất?
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_FACTORS.map((factor) => (
                  <button
                    key={factor.value}
                    type="button"
                    onClick={() => toggleFactor(factor.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                      factors.has(factor.value)
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:border-primary/50"
                    }`}
                  >
                    {factor.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-600 dark:text-white/70">
                Bạn muốn ghi lại điều gì?
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Hôm nay bạn có muốn ghi lại điều gì không?"
                rows={3}
                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 px-4 py-3 text-sm text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white dark:focus:bg-white/10 transition"
              />
            </div>

            <Button
              type="submit"
              disabled={!mood || isPending}
              className="h-10 w-full rounded-xl font-semibold"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lưu phần bổ sung"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
