"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useWellnessChecklist, useToggleWellnessItem } from "@/hooks/useServices";
import { getTodayDateString } from "@/lib/utils/formatDate";

export function DailyWellnessChecklist() {
    const today = getTodayDateString();
    const { data, isLoading } = useWellnessChecklist(today);
    const { mutate: toggle } = useToggleWellnessItem(today);

    return (
        <div className="h-full flex flex-col space-y-4">
            <h2 className="text-xl font-bold text-primary">Danh sách Sức khỏe Hàng ngày</h2>
            {isLoading ? (
                <div className="flex items-center justify-center h-20">
                    <Loader2 className="h-5 w-5 animate-spin text-foreground/20" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start">
                    {(data?.items ?? []).map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => toggle({ itemId: item.id, completed: !item.completed })}
                            className={`card-lifted border-none rounded-2xl cursor-pointer transition-all duration-300 ${
                                item.completed
                                    ? "border-secondary/60 opacity-70 hover:opacity-85"
                                    : "border-border/40 hover:border-primary/30"
                            }`}
                        >
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                                    item.completed ? "bg-secondary/50" : "border-2 border-border bg-background"
                                }`}>
                                    {item.completed && <Check className="w-5 h-5 text-emerald-600" />}
                                </div>
                                <div className="transition-all duration-300">
                                    <h4 className={`font-bold text-sm transition-all duration-300 ${item.completed ? "line-through text-foreground/40" : "text-foreground"}`}>
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-foreground/50">{item.subtitle}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
