import { Card, CardContent } from "@/components/ui/card";

export function WeeklyOverview() {
    return (
        <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Tổng quan tuần lễ</h2>
            <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white overflow-hidden">
                <CardContent className="p-6 grid grid-cols-2 gap-4 divide-x divide-slate-100">
                    <div>
                        <div className="text-4xl font-black text-primary mb-1">128</div>
                        <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">Phút<br />Chánh niệm</div>
                    </div>
                    <div className="pl-4">
                        <div className="text-4xl font-black text-emerald-600 mb-1">12</div>
                        <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">Bài tập<br />Đã hoàn thành</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
