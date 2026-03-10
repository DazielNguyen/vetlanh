import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, CalendarCheck } from "lucide-react";

export function ProgressTracker() {
    return (
        <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden sticky top-6 bg-white">
            <div className="h-2 bg-gradient-to-r from-emerald-400 to-[#6D8A96]" />
            <CardHeader className="pb-4 border-b border-slate-50">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Tiến trình tuần này
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">

                {/* Weekly Goal Progress */}
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <div>
                            <p className="text-sm font-bold text-slate-700">Mục tiêu giảm stress</p>
                            <p className="text-xs text-slate-500 mt-1">3/5 ngày đạt mục tiêu</p>
                        </div>
                        <span className="text-3xl font-black text-emerald-600">60%</span>
                    </div>
                    <Progress value={60} className="h-3 bg-slate-100 [&>div]:bg-emerald-500 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FAFDFB] border border-slate-100 rounded-2xl p-4 text-center hover:shadow-sm transition-shadow">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                            <CalendarCheck className="w-5 h-5" />
                        </div>
                        <p className="text-lg font-bold text-slate-800">120<span className="text-sm font-medium text-slate-500 ml-1">phút</span></p>
                        <p className="text-xs text-slate-500 mt-1">Đã tập luyện</p>
                    </div>

                    <div className="bg-[#FAFDFB] border border-slate-100 rounded-2xl p-4 text-center hover:shadow-sm transition-shadow">
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <p className="text-lg font-bold text-slate-800">4<span className="text-sm font-medium text-slate-500 ml-1">chặng</span></p>
                        <p className="text-xs text-slate-500 mt-1">Chuỗi liên tiếp</p>
                    </div>
                </div>

                {/* Daily Status */}
                <div className="pt-2">
                    <p className="text-sm font-bold text-slate-700 mb-4">Thống kê 7 ngày qua</p>
                    <div className="flex justify-between gap-1">
                        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
                            <div key={day} className="flex flex-col items-center gap-2">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                                    ${i < 3 ? 'bg-emerald-100 text-emerald-700 shadow-sm' :
                                        i === 3 ? 'bg-slate-50 text-slate-400 border-2 border-slate-200 border-dashed' :
                                            'bg-slate-50 text-slate-300'}`}
                                >
                                    {i < 3 ? '✓' : ''}
                                </div>
                                <span className={`text-[11px] font-medium ${i < 3 ? 'text-emerald-700' : 'text-slate-400'}`}>{day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
