"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMoodEntries, useLogMood } from "@/hooks/useMood";

const MOOD_OPTIONS = [
    { value: 1, emoji: "😞", label: "Rất tệ" },
    { value: 2, emoji: "😕", label: "Không tốt" },
    { value: 3, emoji: "😐", label: "Bình thường" },
    { value: 4, emoji: "🙂", label: "Tốt" },
    { value: 5, emoji: "😄", label: "Rất tốt" },
] as const;

const ENERGY_OPTIONS = [1, 2, 3, 4, 5] as const;

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

function getTodayDate(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function MoodCheckIn() {
    const today = getTodayDate();
    const { data: entries, isLoading: loadingEntries } = useMoodEntries({ start: today, end: today });
    const { mutate: logMood, isPending } = useLogMood();

    const [mood, setMood] = useState<number | null>(null);
    const [energy, setEnergy] = useState<number | null>(null);
    const [factors, setFactors] = useState<Set<string>>(new Set());
    const [note, setNote] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Initialize from today's existing entry — only once when data loads
    const initialized = useRef(false);
    useEffect(() => {
        if (!entries || initialized.current) return;
        initialized.current = true;
        const todayEntry = entries.find((e) => e.date === today);
        if (todayEntry) {
            setMood(todayEntry.mood);
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

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!mood || isPending) return;
        logMood(
            {
                date: today,
                mood,
                ...(energy !== null && { energy }),
                factors: [...factors],
                ...(note.trim() && { note: note.trim() }),
            },
            { onSuccess: () => setSubmitted(true) }
        );
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

    if (submitted) {
        return (
            <Card className="border-none shadow-sm rounded-3xl">
                <CardContent className="p-6 flex flex-col items-center gap-3 text-center py-10">
                    <span className="text-5xl">
                        {MOOD_OPTIONS.find((o) => o.value === mood)?.emoji ?? "✅"}
                    </span>
                    <p className="text-lg font-bold text-slate-800">
                        {isEditMode ? "Đã cập nhật tâm trạng!" : "Đã ghi lại tâm trạng hôm nay!"}
                    </p>
                    <p className="text-sm text-slate-400">Hẹn gặp lại bạn vào ngày mai nhé 🌿</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 rounded-xl"
                        onClick={() => setSubmitted(false)}
                    >
                        Chỉnh sửa lại
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-sm rounded-3xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-slate-800">
                    {isEditMode ? "Chỉnh sửa tâm trạng hôm nay" : "Tâm trạng hôm nay của bạn?"}
                </CardTitle>
                <p className="text-xs text-slate-400">{today}</p>
            </CardHeader>
            <CardContent className="p-6 pt-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Mood selector */}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-600">Cảm xúc <span className="text-red-400">*</span></p>
                        <div className="flex gap-2">
                            {MOOD_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setMood(option.value)}
                                    className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all ${
                                        mood === option.value
                                            ? "border-primary bg-primary/5 scale-105"
                                            : "border-slate-100 bg-white hover:border-slate-200"
                                    }`}
                                    title={option.label}
                                >
                                    <span className="text-2xl">{option.emoji}</span>
                                    <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Energy level */}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-600">Mức năng lượng (tuỳ chọn)</p>
                        <div className="flex gap-2">
                            {ENERGY_OPTIONS.map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setEnergy(energy === level ? null : level)}
                                    className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                                        energy === level
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                            : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400">1 = kiệt sức, 5 = tràn đầy năng lượng</p>
                    </div>

                    {/* Factors */}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-600">Yếu tố ảnh hưởng (tuỳ chọn)</p>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_FACTORS.map((factor) => (
                                <button
                                    key={factor.value}
                                    type="button"
                                    onClick={() => toggleFactor(factor.value)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                                        factors.has(factor.value)
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
                                    }`}
                                >
                                    {factor.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-600">Ghi chú (tuỳ chọn)</p>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Hôm nay bạn có muốn ghi lại điều gì không?"
                            rows={3}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={!mood || isPending}
                        className="w-full h-11 rounded-2xl font-bold"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isEditMode ? (
                            "Cập nhật"
                        ) : (
                            "Lưu tâm trạng"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
