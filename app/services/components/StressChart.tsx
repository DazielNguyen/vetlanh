"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
    { day: "T2", stress: 30 },
    { day: "T3", stress: 40 },
    { day: "T4", stress: 35 },
    { day: "T5", stress: 60 },
    { day: "T6", stress: 30 },
    { day: "T7", stress: 80 },
    { day: "CN", stress: 45 },
];

export function StressChart() {
    return (
        <div className="h-[200px] w-full mt-8">
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
                        stroke="#789DBC"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "#789DBC", stroke: "white", strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
