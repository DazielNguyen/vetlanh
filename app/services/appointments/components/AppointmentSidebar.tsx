import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 5;
    return day >= 1 && day <= 31 ? day : null;
});
const highlightedDays = [12, 14, 20, 25];

export function AppointmentSidebar() {
    return (
        <div className="space-y-6">
            {/* Mini Calendar */}
            <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800">Tháng 3, 2026</h3>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-400"><ChevronLeft className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-400"><ChevronRight className="w-4 h-4" /></Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {daysOfWeek.map((d) => (
                            <span key={d} className="text-[10px] font-bold text-slate-400 pb-2">{d}</span>
                        ))}
                        {calendarDays.map((day, i) => (
                            <button
                                key={i}
                                className={`w-8 h-8 rounded-full text-xs font-medium mx-auto flex items-center justify-center transition ${!day ? "invisible" :
                                        day === 12 ? "bg-primary text-white font-bold" :
                                            highlightedDays.includes(day) ? "bg-primary/10 text-primary font-bold" :
                                                "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Book */}
            <Card className="border-none shadow-sm rounded-2xl bg-[#FFE3E3]/30">
                <CardContent className="p-5 text-center space-y-3">
                    <span className="text-3xl">📅</span>
                    <h3 className="font-bold text-slate-800">Đặt lịch nhanh</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Tìm chuyên gia phù hợp và đặt lịch hẹn ngay hôm nay.</p>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold">
                        Tìm chuyên gia
                    </Button>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardContent className="p-4 text-center">
                        <span className="text-2xl font-extrabold text-primary">8</span>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Buổi đã hoàn thành</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardContent className="p-4 text-center">
                        <span className="text-2xl font-extrabold text-emerald-500">2</span>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Lịch hẹn sắp tới</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
