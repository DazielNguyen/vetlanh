import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const experts = [
    {
        name: "Dr. Phạm Quang Vinh",
        title: "Chuyên gia Tâm lý trẻ em & vị thành niên",
        experience: "6 năm",
        rating: 4.7,
        price: "500.000đ/ca",
        avatar: "https://ui.shadcn.com/avatars/01.png",
        badge: null,
    },
    {
        name: "ThS. Đặng Minh Châu",
        title: "Chuyên gia Trị liệu nhận thức hành vi",
        experience: "10 năm",
        rating: 4.9,
        price: "750.000đ/ca",
        avatar: "https://ui.shadcn.com/avatars/02.png",
        badge: null,
    },
    {
        name: "ThS. Hoàng Quốc Tuấn",
        title: "Chuyên gia Trị liệu nghệ thuật",
        experience: "4 năm",
        rating: 4.5,
        price: "450.000đ/ca",
        avatar: "https://ui.shadcn.com/avatars/03.png",
        badge: "Mới",
    },
];

export function ExpertsList() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Tất cả chuyên gia</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Sắp xếp theo:</span>
                    <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option>Phổ biến nhất</option>
                        <option>Đánh giá cao nhất</option>
                        <option>Giá thấp nhất</option>
                    </select>
                </div>
            </div>

            {/* Expert rows */}
            <div className="space-y-3">
                {experts.map((expert) => (
                    <Card
                        key={expert.name}
                        className="border border-slate-100 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition"
                    >
                        {/* Avatar */}
                        <img
                            src={expert.avatar}
                            alt={expert.name}
                            className="w-12 h-12 rounded-full border border-slate-200 object-cover shrink-0"
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-800 text-sm truncate">{expert.name}</h3>
                                {expert.badge && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                                        {expert.badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 italic truncate">{expert.title}</p>
                        </div>

                        {/* Stats */}
                        <div className="hidden md:flex items-center gap-6 text-xs text-slate-500 shrink-0">
                            <div className="text-center">
                                <span className="block text-[10px] text-slate-400">Kinh nghiệm</span>
                                <span className="font-bold text-slate-700">{expert.experience}</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[10px] text-slate-400">Đánh giá</span>
                                <span className="font-bold text-slate-700 flex items-center gap-0.5 justify-center">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    {expert.rating}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-bold text-primary whitespace-nowrap shrink-0">{expert.price}</span>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-xs font-semibold">
                                Xem hồ sơ
                            </Button>
                            <Button size="sm" className="rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold">
                                Đặt lịch
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 pt-4">
                <Button variant="outline" size="icon" className="w-9 h-9 rounded-full border-slate-200">
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                {[1, 2, 3].map((page) => (
                    <Button
                        key={page}
                        variant={page === 1 ? "default" : "outline"}
                        size="icon"
                        className={`w-9 h-9 rounded-full text-xs font-bold ${page === 1 ? "bg-primary text-white" : "border-slate-200 text-slate-600"}`}
                    >
                        {page}
                    </Button>
                ))}
                <span className="text-slate-400 text-xs px-1">...</span>
                <Button variant="outline" size="icon" className="w-9 h-9 rounded-full border-slate-200 text-xs font-bold text-slate-600">
                    8
                </Button>
                <Button variant="outline" size="icon" className="w-9 h-9 rounded-full border-slate-200">
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
