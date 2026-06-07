"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Lock, Loader2 } from "lucide-react";
import { useHealingPath } from "@/hooks/useServices";
import type { HealingTask } from "@/types/services";

function HealingTaskCard({ task }: { task: HealingTask }) {
    const isActive = task.status === "active";
    const isUpcoming = task.status === "upcoming";

    return (
        <Card
            className={`rounded-[24px] flex flex-row items-center p-6 ${
                isUpcoming
                    ? "border-2 border-dashed border-slate-200 shadow-none bg-[#FCFDFD] opacity-80"
                    : "border border-slate-100 shadow-sm bg-white"
            }`}
        >
            <div className={`shrink-0 pl-2 w-10 h-10 flex items-center justify-center text-2xl ${isUpcoming ? "opacity-30" : ""}`}>
                {isActive ? "🌬️" : isUpcoming ? "🌙" : "✏️"}
            </div>
            <div className="px-6 flex-1">
                <div className="flex justify-between items-end mb-2">
                    <h3 className={`text-[17px] font-bold tracking-tight ${isUpcoming ? "text-[#64748B]" : "text-[#1E293B]"}`}>
                        {task.title}
                    </h3>
                    {(isActive || task.unlock_label) && (
                        <span className={`text-sm font-medium ${isActive ? "text-[#7C9AB3]" : "text-slate-400"}`}>
                            {isActive ? `Hoàn thành ${task.progress_pct}%` : task.unlock_label}
                        </span>
                    )}
                </div>
                {!isUpcoming && (
                    <Progress
                        value={task.progress_pct}
                        className={`h-2 mb-3 ${
                            isActive
                                ? "bg-[#E1F0E3] [&>div]:bg-[#A7E2C3]"
                                : "bg-[#F1F5F9] [&>div]:bg-[#D1E0D7]"
                        }`}
                    />
                )}
                <p className={`text-sm ${isUpcoming ? "text-[#94A3B8] mt-3" : "text-slate-500"}`}>
                    {task.subtitle}
                </p>
            </div>
            {isActive ? (
                <Button size="icon" className="w-12 h-12 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 shrink-0 shadow-none">
                    <Play className="w-5 h-5 fill-current" />
                </Button>
            ) : isUpcoming ? (
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-[#CBD5E1]" strokeWidth={2} />
                </div>
            ) : (
                <Button size="icon" variant="outline" className="w-12 h-12 rounded-full border-none bg-[#F8FAFC] text-slate-600 shrink-0 shadow-none pointer-events-none">
                    <Lock className="w-5 h-5 fill-current text-[#475569]" />
                </Button>
            )}
        </Card>
    );
}

export function CurrentHealingPath() {
    const { data, isLoading } = useHealingPath();

    return (
        <div>
            <h2 className="text-xl font-bold text-[#6D8A96] mb-4">Lộ trình chữa lành</h2>
            {isLoading ? (
                <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                </div>
            ) : (
                <div className="space-y-4">
                    {(data?.tasks ?? []).map((task) => (
                        <HealingTaskCard key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
}
