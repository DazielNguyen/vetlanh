"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity } from "lucide-react";

// Vietnamese short weekday names indexed by getDay() (0=Sunday)
const VI_DAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] as const;

function getLastNDayLabels(n: number): string[] {
    const today = new Date();
    return Array.from({ length: n }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (n - 1 - i));
        return VI_DAY[d.getDay()];
    });
}

interface StressChartProps {
    sparkline?: number[];
}

export function StressChart({ sparkline }: StressChartProps) {
    if (!sparkline || sparkline.length === 0) {
        return (
            <div className="h-50 w-full mt-8 flex flex-col items-center justify-center gap-2 text-foreground/30">
                <Activity className="h-8 w-8" strokeWidth={1.5} />
                <p className="text-sm font-medium">Chưa có dữ liệu tâm trạng</p>
                <p className="text-xs text-foreground/25">Hoàn thành bài tập đầu tiên để bắt đầu theo dõi</p>
            </div>
        );
    }

    const labels = getLastNDayLabels(sparkline.length);
    const data = sparkline.map((value, i) => ({ day: labels[i], stress: value }));

    return (
        <div className="h-50 w-full mt-8">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        dy={10}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ display: 'none' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="stress"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "var(--primary)", stroke: "white", strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
