import { Card, CardContent } from "@/components/ui/card";
import { useWellnessChecklist } from "@/hooks/useServices";
import { getTodayDateString } from "@/lib/utils/formatDate";
import { XpLevelIndicator } from "@/components/progression/XpLevelIndicator";

export function WeeklyOverview({ streakDays }: { streakDays?: number }) {
    const days = streakDays ?? 0;
    const showFire = days > 3;

    const { data: checklist } = useWellnessChecklist(getTodayDateString());
    const items = checklist?.items ?? [];
    const completedCount = items.filter((item) => item.completed).length;

    return (
        <div className="space-y-4 h-full">
            <Card className="border-none card-lifted rounded-3xl overflow-hidden h-full">
                <CardContent className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4 divide-x divide-border/40">
                        <div>
                            <div className="text-4xl font-black mb-1" style={{ color: "var(--amber-accent)" }}>
                                {days}{showFire ? " 🔥" : ""}
                            </div>
                            <div className="text-[10px] sm:text-xs font-bold text-foreground/40 uppercase tracking-widest leading-tight">
                                Ngày<br />Liên tiếp
                            </div>
                        </div>
                        <div className="pl-4">
                            <div className="text-4xl font-black text-primary mb-1">
                                {completedCount}
                                <span className="text-foreground/30">/{items.length}</span>
                            </div>
                            <div className="text-[10px] sm:text-xs font-bold text-foreground/40 uppercase tracking-widest leading-tight">
                                Bài tập<br />Hôm nay
                            </div>
                        </div>
                    </div>
                    <XpLevelIndicator />
                </CardContent>
            </Card>
        </div>
    );
}
