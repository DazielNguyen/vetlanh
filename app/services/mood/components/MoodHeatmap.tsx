"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMoodHeatmap } from "@/hooks/useMood";

const VI_MONTHS = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

// Short weekday headers (Mon–Sun ordering)
const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// Maps mood value 1–5 to a background color class
function moodColor(mood: number): string {
    if (mood >= 5) return "bg-emerald-400";
    if (mood >= 4) return "bg-emerald-200";
    if (mood >= 3) return "bg-yellow-200";
    if (mood >= 2) return "bg-orange-200";
    return "bg-red-200";
}

function moodEmoji(mood: number): string {
    if (mood >= 5) return "😄";
    if (mood >= 4) return "🙂";
    if (mood >= 3) return "😐";
    if (mood >= 2) return "😕";
    return "😞";
}

// Returns day cells for a calendar month.
// Each cell is null (empty padding) or a day number.
// Week starts Monday (ISO).
function buildCalendarGrid(year: number, month: number): (number | null)[] {
    const firstDay = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    // getDay(): 0=Sun, 1=Mon … 6=Sat → convert to Mon-first index
    const startOffset = (firstDay.getDay() + 6) % 7;
    const cells: (number | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    // Pad to full week rows
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
}

export function MoodHeatmap() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    const { data: heatmap, isLoading } = useMoodHeatmap(year, month);
    const cells = buildCalendarGrid(year, month);

    function prevMonth() {
        if (month === 1) { setYear((y) => y - 1); setMonth(12); }
        else setMonth((m) => m - 1);
    }

    function nextMonth() {
        const now = new Date();
        // Don't navigate past current month
        if (year === now.getFullYear() && month === now.getMonth() + 1) return;
        if (month === 12) { setYear((y) => y + 1); setMonth(1); }
        else setMonth((m) => m + 1);
    }

    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
    const todayDate = today.getDate();

    return (
        <Card className="border-none shadow-sm rounded-3xl">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
                        {VI_MONTHS[month - 1]} {year}
                    </CardTitle>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={prevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-xl"
                            onClick={nextMonth}
                            disabled={isCurrentMonth}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
                    </div>
                ) : (
                    <>
                        {/* Weekday header row */}
                        <div className="grid grid-cols-7 mb-1">
                            {WEEKDAY_LABELS.map((d) => (
                                <div key={d} className="text-center text-[10px] font-bold text-slate-400 dark:text-white/40 py-1">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7 gap-1">
                            {cells.map((day, i) => {
                                if (day === null) {
                                    return <div key={`pad-${i}`} />;
                                }
                                const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                const moodVal = heatmap?.[dateStr];
                                const isToday = isCurrentMonth && day === todayDate;

                                return (
                                    <div
                                        key={dateStr}
                                        title={moodVal ? `${moodEmoji(moodVal)} ${moodVal}/5` : "Chưa ghi lại"}
                                        className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-semibold transition ${
                                            moodVal ? moodColor(moodVal) + " text-slate-700 dark:text-slate-900" : "bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/40"
                                        } ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}`}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-2 mt-3 justify-end">
                            <span className="text-[10px] text-slate-400 dark:text-white/40">Tâm trạng:</span>
                            {[1, 2, 3, 4, 5].map((v) => (
                                <div
                                    key={v}
                                    title={`${v}/5`}
                                    className={`w-4 h-4 rounded-sm ${moodColor(v)}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
