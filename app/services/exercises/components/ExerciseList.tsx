import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wind, PlayCircle, BookHeart, PersonStanding, Flame, Headphones } from "lucide-react";

export function ExerciseList() {
    const exercises = [
        {
            id: 1,
            title: "Bài tập Thở 4-7-8",
            description: "Giảm căng thẳng ngay lập tức bằng phương pháp hít vào 4s, nín thở 7s và thở ra 8s.",
            duration: "5 phút",
            icon: Wind,
            color: "bg-blue-50 text-blue-600",
            buttonColor: "bg-blue-600 hover:bg-blue-700",
        },
        {
            id: 2,
            title: "Thiền quét cơ thể (Body Scan)",
            description: "Thư giãn sâu từng nhóm cơ, giúp bạn dễ vào giấc ngủ và giải phóng áp lực tích tụ.",
            duration: "15 phút",
            icon: PersonStanding,
            color: "bg-emerald-50 text-emerald-600",
            buttonColor: "bg-emerald-600 hover:bg-emerald-700",
        },
        {
            id: 3,
            title: "Viết Nhật ký (Journaling)",
            description: "Giải tỏa những vòng suy nghĩ lặp đi lặp lại bằng cách ghi chép tự do cảm xúc hiện tại.",
            duration: "10 phút",
            icon: BookHeart,
            color: "bg-rose-50 text-rose-600",
            buttonColor: "bg-rose-500 hover:bg-rose-600",
        },
        {
            id: 4,
            title: "Âm thanh Chữa lành",
            description: "Lắng nghe playlist tiếng mưa rơi, sóng vỗ hay tần số Solfeggio 432Hz giúp cân bằng.",
            duration: "20 phút",
            icon: Headphones,
            color: "bg-purple-50 text-purple-600",
            buttonColor: "bg-purple-600 hover:bg-purple-700",
        },
        {
            id: 5,
            title: "Giãn cơ nhẹ nhàng tại bàn",
            description: "Dành cho dân văn phòng, giảm đau mỏi vai gáy và reset lại tâm trí giữa giờ làm.",
            duration: "7 phút",
            icon: Flame,
            color: "bg-amber-50 text-amber-600",
            buttonColor: "bg-amber-600 hover:bg-amber-700",
        }
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Lựa chọn bài tập hôm nay</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercises.map((exercise) => (
                    <Card key={exercise.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden group bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${exercise.color}`}>
                                    <exercise.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-600 transition-colors">{exercise.title}</h3>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{exercise.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
                                            ⏱ {exercise.duration}
                                        </span>
                                        <Button size="sm" className={`rounded-xl shadow-sm text-white font-bold px-4 ${exercise.buttonColor}`}>
                                            <PlayCircle className="w-4 h-4 mr-1.5" /> Bắt đầu
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
