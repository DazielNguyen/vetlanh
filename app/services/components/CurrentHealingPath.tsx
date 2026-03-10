import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wind, PenLine, Play, Lock, Moon } from "lucide-react";

export function CurrentHealingPath() {
    return (
        <div>
            <h2 className="text-xl font-bold text-[#6D8A96] mb-4">Lộ trình chữa lành</h2>
            <div className="space-y-4">

                {/* Task 1 - Active */}
                <Card className="border border-slate-100 shadow-sm rounded-[24px] flex flex-row items-center p-6 bg-white">
                    <div className="text-[#6D8A96] shrink-0 pl-2">
                        <Wind className="w-8 h-8" strokeWidth={2} />
                    </div>
                    <div className="px-6 flex-1">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-[17px] font-bold text-[#1E293B] tracking-tight">Bài tập thở nâng cao</h3>
                            <span className="text-sm font-medium text-[#7C9AB3]">Hoàn thành 75%</span>
                        </div>
                        <Progress value={75} className="h-2 bg-[#E1F0E3] [&>div]:bg-[#A7E2C3] mb-3" />
                        <p className="text-sm text-slate-500">Bài tập thở hàng ngày giúp điều hòa cảm xúc.</p>
                    </div>
                    <Button size="icon" className="w-12 h-12 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 shrink-0 shadow-none">
                        <Play className="w-5 h-5 fill-current" />
                    </Button>
                </Card>

                {/* Task 2 - Locked */}
                <Card className="border border-slate-100 shadow-sm rounded-[24px] flex flex-row items-center p-6 bg-white">
                    <div className="text-[#1E293B] shrink-0 pl-2">
                        <PenLine className="w-8 h-8" strokeWidth={2} />
                    </div>
                    <div className="px-6 flex-1">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-[17px] font-bold text-[#1E293B] tracking-tight">Viết nhật ký phản chiếu</h3>
                            <span className="text-sm font-medium text-slate-400">Tiếp theo: Ngày 4</span>
                        </div>
                        <Progress value={30} className="h-2 bg-[#F1F5F9] [&>div]:bg-[#D1E0D7] mb-3" />
                        <p className="text-sm text-slate-500">Khám phá các mẫu hình trong chu kỳ suy nghĩ của bạn.</p>
                    </div>
                    <Button size="icon" variant="outline" className="w-12 h-12 rounded-full border-none bg-[#F8FAFC] text-slate-600 shrink-0 shadow-none pointer-events-none">
                        <Lock className="w-5 h-5 fill-current text-[#475569]" />
                    </Button>
                </Card>

                {/* Task 3 - Upcoming (Dashed border) */}
                <Card className="border-2 border-dashed border-slate-200 shadow-none rounded-[24px] flex flex-row items-center p-6 bg-[#FCFDFD] opacity-80">
                    <div className="text-[#94A3B8] shrink-0 pl-2">
                        <Moon className="w-8 h-8 fill-current opacity-30" strokeWidth={2} />
                    </div>
                    <div className="px-6 flex-1">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-[17px] font-bold text-[#64748B] tracking-tight">Tiếp theo: Thói quen ngủ</h3>
                            <span className="text-sm font-medium text-[#94A3B8]">Mở khóa lúc 20:00</span>
                        </div>
                        {/* No progress bar for upcoming step */}
                        <p className="text-sm text-[#94A3B8] mt-3">Thói quen thư giãn 10 phút để có giấc ngủ ngon.</p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4 text-[#CBD5E1]" strokeWidth={2} />
                    </div>
                </Card>

            </div>
        </div>
    );
}
