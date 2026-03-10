import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock } from "lucide-react";

const featuredExperts = [
    {
        name: "TS. Nguyễn Hồng Nhung",
        title: "Chuyên gia Tâm lý lâm sàng",
        badge: "Đánh giá cao nhất",
        badgeColor: "bg-primary/10 text-primary",
        rating: 4.9,
        experience: "12 năm kinh nghiệm",
        tags: ["Lo âu", "Sang chấn", "+2"],
        price: "850.000đ / buổi",
        avatar: "/images/placeholder-user.jpg",
    },
    {
        name: "ThS. Lê Minh Đức",
        title: "Chuyên gia Tâm lý gia đình",
        badge: "Phổ biến nhất",
        badgeColor: "bg-emerald-50 text-emerald-600",
        rating: 4.8,
        experience: "8 năm kinh nghiệm",
        tags: ["Mối quan hệ", "Trầm cảm", "+1"],
        price: "600.000đ / buổi",
        avatar: "/images/placeholder-user.jpg",
    },
    {
        name: "TS. Trần Thị Lan Anh",
        title: "Chuyên gia Sang chấn",
        badge: "Đánh giá rất cao",
        badgeColor: "bg-amber-50 text-amber-600",
        rating: 5.0,
        experience: "15 năm kinh nghiệm",
        tags: ["PTSD", "Sang chấn", "+3"],
        price: "1.200.000đ / buổi",
        avatar: "/images/placeholder-user.jpg",
    },
];

export function FeaturedExperts() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span>🏅</span> Chuyên gia nổi bật
                </h2>
                <a href="#" className="text-sm text-primary font-semibold hover:underline">
                    Xem tất cả
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredExperts.map((expert) => (
                    <Card
                        key={expert.name}
                        className="border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition overflow-hidden"
                    >
                        <CardContent className="p-5 space-y-4">
                            {/* Badge + Rating */}
                            <div className="flex items-center justify-between">
                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${expert.badgeColor}`}>
                                    {expert.badge}
                                </span>
                                <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    {expert.rating}
                                </div>
                            </div>

                            {/* Avatar + Info */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={expert.avatar}
                                    alt={expert.name}
                                    className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover"
                                />
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{expert.name}</h3>
                                    <p className="text-xs text-slate-400 italic">{expert.title}</p>
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock className="w-3.5 h-3.5" />
                                {expert.experience}
                            </div>

                            {/* Tags */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {expert.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Price */}
                            <p className="text-sm font-bold text-primary">{expert.price}</p>

                            {/* CTAs */}
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="flex-1 rounded-xl text-sm font-semibold border-slate-200">
                                    Chi tiết
                                </Button>
                                <Button className="flex-1 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-white">
                                    Đặt lịch ngay
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
