import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const pastAppointments = [
    {
        expert: "Dr. Phạm Quang Vinh",
        title: "Child & Adolescent Psychologist",
        date: "05/03/2026",
        time: "09:00 - 10:00",
        rating: 5,
        avatar: "/images/placeholder-user.jpg",
    },
    {
        expert: "ThS. Đặng Minh Châu",
        title: "CBT Specialist",
        date: "28/02/2026",
        time: "16:00 - 17:00",
        rating: 4,
        avatar: "/images/placeholder-user.jpg",
    },
];

export function PastAppointments() {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Lịch sử buổi tư vấn</h2>
            <div className="space-y-3">
                {pastAppointments.map((apt) => (
                    <Card key={apt.expert} className="border border-slate-100 shadow-sm rounded-2xl">
                        <CardContent className="p-4 flex items-center gap-4">
                            <img src={apt.avatar} alt={apt.expert} className="w-12 h-12 rounded-full border border-slate-200 object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-800 text-sm truncate">{apt.expert}</h3>
                                <p className="text-[11px] text-slate-400 italic">{apt.title}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span>{apt.date}</span>
                                    <span>{apt.time}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < apt.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                                ))}
                            </div>
                            <Button size="sm" variant="outline" className="rounded-xl border-slate-200 text-xs font-semibold shrink-0">
                                Xem lại
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
