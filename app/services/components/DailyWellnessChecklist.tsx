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
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary">Danh sách Sức khỏe Hàng ngày</h2>
            {isLoading ? (
                <div className="flex items-center justify-center h-20">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data?.items ?? []).map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => toggle({ itemId: item.id, completed: !item.completed })}
                            className={`border shadow-sm rounded-2xl bg-white transition-colors cursor-pointer ${
                                item.completed ? "border-emerald-100 hover:border-emerald-200" : "border-slate-100 hover:border-slate-200"
                            }`}
                        >
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    item.completed ? "bg-emerald-100" : "border-2 border-slate-200 bg-slate-50"
                                }`}>
                                    {item.completed && <Check className="w-5 h-5 text-emerald-600" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                                    <p className="text-xs text-slate-500">{item.subtitle}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
