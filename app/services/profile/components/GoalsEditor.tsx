"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useUpdateGoals } from "@/hooks/useUser";
import { useAvailableGoals } from "@/hooks/useAvailableGoals";

export function GoalsEditor() {
    const { data: user } = useCurrentUser();
    const { goals: availableGoals, isLoading } = useAvailableGoals();
    const { mutate: updateGoals, isPending } = useUpdateGoals();

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [dirty, setDirty] = useState(false);
    // Track whether initial server state has been loaded — only sync once from server,
    // then let local state own the truth to avoid race-resetting in-flight edits.
    const initialized = useRef(false);

    const serverGoalsKey = user?.goals?.join(",") ?? null;
    useEffect(() => {
        if (serverGoalsKey === null) return;
        if (initialized.current) return;
        initialized.current = true;
        setSelected(new Set(user!.goals ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serverGoalsKey]);

    function toggle(value: string) {
        if (isPending) return;
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(value)) next.delete(value);
            else next.add(value);
            return next;
        });
        setDirty(true);
    }

    function save() {
        updateGoals({ goals: [...selected] }, { onSuccess: () => setDirty(false) });
    }

    return (
        <Card className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Mục tiêu của bạn</h3>
                    {dirty && (
                        <Button size="sm" onClick={save} disabled={isPending} className="rounded-xl text-xs h-8">
                            {isPending ? "Đang lưu..." : "Lưu"}
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <p className="text-sm text-slate-400">Đang tải...</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {availableGoals.map((goal) => {
                            const active = selected.has(goal.value);
                            return (
                                <button
                                    key={goal.value}
                                    onClick={() => toggle(goal.value)}
                                    disabled={isPending}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition disabled:opacity-50 ${
                                        active
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
                                    }`}
                                >
                                    {goal.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
