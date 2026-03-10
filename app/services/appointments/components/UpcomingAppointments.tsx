import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, MapPin } from "lucide-react";

const upcomingAppointments = [
    {
        expert: "TS. Nguyễn Hồng Nhung",
        title: "Clinical Psychologist",
        date: "Thứ 3, 12/03/2026",
        time: "14:00 - 15:00",
        type: "Online",
        typeIcon: Video,
        status: "Sắp diễn ra",
        statusColor: "bg-emerald-50 text-emerald-600",
        avatar: "/images/placeholder-user.jpg",
    },
    {
        expert: "ThS. Lê Minh Đức",
        title: "Family Therapist",
        date: "Thứ 5, 14/03/2026",
        time: "10:00 - 11:00",
        type: "Tại phòng khám",
        typeIcon: MapPin,
        status: "Đã xác nhận",
        statusColor: "bg-blue-50 text-blue-600",
        avatar: "/images/placeholder-user.jpg",
    },
];

export function UpcomingAppointments() {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Lịch hẹn sắp tới
            </h2>
            <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                    <Card key={apt.expert} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                        <CardContent className="p-5 flex items-center gap-4">
                            <img src={apt.avatar} alt={apt.expert} className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="font-bold text-slate-800 text-sm truncate">{apt.expert}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${apt.statusColor}`}>{apt.status}</span>
                                </div>
                                <p className="text-xs text-slate-400 italic">{apt.title}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {apt.date}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.time}</span>
                                    <span className="flex items-center gap-1"><apt.typeIcon className="w-3.5 h-3.5" /> {apt.type}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                                <Button size="sm" className="rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold">
                                    Tham gia
                                </Button>
                                <Button size="sm" variant="outline" className="rounded-xl border-slate-200 text-xs font-semibold">
                                    Đổi lịch
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
