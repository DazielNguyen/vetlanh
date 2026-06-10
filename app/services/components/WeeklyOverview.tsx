import { Card, CardContent } from "@/components/ui/card";

export function WeeklyOverview({ streakDays }: { streakDays?: number }) {
    const days = streakDays ?? 0;
    const showFire = days > 3;

    return (
        <div className="space-y-4 h-full">
            <Card className="border-none card-lifted rounded-3xl overflow-hidden h-full">
                <CardContent className="p-6 grid grid-cols-2 gap-4 divide-x divide-border/40">
                    <div>
                        <div className="text-4xl font-black mb-1" style={{ color: "var(--amber-accent)" }}>
                            {days}{showFire ? " 🔥" : ""}
                        </div>
                        <div className="text-[10px] sm:text-xs font-bold text-foreground/40 uppercase tracking-widest leading-tight">
                            Ngày<br />Liên tiếp
                        </div>
                    </div>
                    <div className="pl-4">
                        <div className="text-4xl font-black text-foreground/20 mb-1">-</div>
                        <div className="text-[10px] sm:text-xs font-bold text-foreground/40 uppercase tracking-widest leading-tight">
                            Bài tập<br />Đã hoàn thành
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
