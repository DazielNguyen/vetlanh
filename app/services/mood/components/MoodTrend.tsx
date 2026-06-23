"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
} from "recharts";
import { useMoodTrend } from "@/hooks/useMood";

type Period = "week" | "month";

// Format date string YYYY-MM-DD to short Vietnamese label
function formatDateLabel(dateStr: string): string {
    const parts = dateStr.split("-");
    if (parts.length < 3) return dateStr;
    return `${parts[2]}/${parts[1]}`;
}

// Map BE energy string to a numeric value for the Y-axis (shared 1–5 scale with mood)
function energyToNum(e: string | null | undefined): number | null {
    if (e === "low") return 1;
    if (e === "medium") return 3;
    if (e === "high") return 5;
    return null;
}

export function MoodTrend() {
    const [period, setPeriod] = useState<Period>("week");
    const { data: trend, isLoading } = useMoodTrend(period);

    const chartData = trend?.entries.map((point) => ({
        date: formatDateLabel(point.date),
        mood: point.mood ?? null,
        energy: energyToNum(point.energy),
    })) ?? [];

    return (
        <Card className="border-none shadow-sm rounded-3xl">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-white">Xu hướng tâm trạng</CardTitle>
                    <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPeriod("week")}
                            className={`h-7 px-3 text-xs font-semibold rounded-lg transition ${
                                period === "week" ? "bg-white dark:bg-white/10 shadow-sm text-slate-800 dark:text-white" : "text-slate-500 dark:text-white/50"
                            }`}
                        >
                            7 ngày
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPeriod("month")}
                            className={`h-7 px-3 text-xs font-semibold rounded-lg transition ${
                                period === "month" ? "bg-white dark:bg-white/10 shadow-sm text-slate-800 dark:text-white" : "text-slate-500 dark:text-white/50"
                            }`}
                        >
                            30 ngày
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-40 text-sm text-slate-400 dark:text-white/40">
                        Chưa có dữ liệu tâm trạng trong giai đoạn này
                    </div>
                ) : (
                    <div className="h-44 w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -24, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                                    dy={8}
                                    interval={period === "month" ? 6 : 0}
                                />
                                <YAxis
                                    domain={[1, 5]}
                                    ticks={[1, 2, 3, 4, 5]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                                />
                                <ReferenceLine y={3} stroke="#e2e8f0" strokeDasharray="4 4" />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "none",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                        fontSize: "12px",
                                    }}
                                    formatter={(value: number, name: string) => [
                                        `${value}/5`,
                                        name === "mood" ? "Tâm trạng" : "Năng lượng",
                                    ]}
                                    labelStyle={{ color: "#64748b", fontWeight: 600 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="mood"
                                    stroke="#789DBC"
                                    strokeWidth={2.5}
                                    dot={{ r: 3, fill: "#789DBC", strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: "#789DBC", stroke: "white", strokeWidth: 2 }}
                                />
                                {chartData.some((d) => d.energy != null) && (
                                    <Line
                                        type="monotone"
                                        dataKey="energy"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        strokeDasharray="4 4"
                                        dot={false}
                                        activeDot={{ r: 4, fill: "#10b981", stroke: "white", strokeWidth: 2 }}
                                    />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Legend */}
                {chartData.length > 0 && (
                    <div className="flex gap-4 mt-2 justify-end">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-0.5 bg-[#789DBC]" />
                            <span className="text-[10px] text-slate-500 dark:text-white/40">Tâm trạng</span>
                        </div>
                        {chartData.some((d) => d.energy != null) && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-4 h-0.5 bg-emerald-500 border-dashed" />
                                <span className="text-[10px] text-slate-500 dark:text-white/40">Năng lượng</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
