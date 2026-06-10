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
            className={`rounded-3xl flex flex-row items-center p-6 ${
                isUpcoming
                    ? "border-2 border-dashed border-border/40 shadow-none bg-background/50 opacity-70"
                    : "card-lifted border-none"
            }`}
        >
            <div className={`shrink-0 pl-2 w-10 h-10 flex items-center justify-center text-2xl ${isUpcoming ? "opacity-30" : ""}`}>
                {isActive ? "🌬️" : isUpcoming ? "🌙" : "✏️"}
            </div>
            <div className="px-6 flex-1">
                <div className="flex justify-between items-end mb-2">
                    <h3 className={`text-[17px] font-bold tracking-tight ${isUpcoming ? "text-foreground/40" : "text-foreground"}`}>
                        {task.title}
                    </h3>
                    {(isActive || task.unlock_label) && (
                        <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground/40"}`}>
                            {isActive ? `Hoàn thành ${task.progress_pct}%` : task.unlock_label}
                        </span>
                    )}
                </div>
                {!isUpcoming && (
                    <Progress
                        value={task.progress_pct}
                        className={`h-2 mb-3 ${
                            isActive
                                ? "bg-primary/15 [&>div]:bg-primary"
                                : "bg-border/40 [&>div]:bg-primary/40"
                        }`}
                    />
                )}
                <p className={`text-sm ${isUpcoming ? "text-foreground/30 mt-3" : "text-foreground/50"}`}>
                    {task.subtitle}
                </p>
            </div>
            {isActive ? (
                <Button size="icon" className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 text-primary shrink-0 shadow-none border-none">
                    <Play className="w-5 h-5 fill-current" />
                </Button>
            ) : isUpcoming ? (
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-foreground/20" strokeWidth={2} />
                </div>
            ) : (
                <Button size="icon" variant="outline" className="w-12 h-12 rounded-full border-none bg-background text-foreground/40 shrink-0 shadow-none pointer-events-none">
                    <Lock className="w-5 h-5 fill-current" />
                </Button>
            )}
        </Card>
    );
}

export function CurrentHealingPath() {
    const { data, isLoading } = useHealingPath();

    return (
        <div>
            <h2 className="text-xl font-bold text-primary mb-4">Lộ trình chữa lành</h2>
            {isLoading ? (
                <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-foreground/20" />
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
