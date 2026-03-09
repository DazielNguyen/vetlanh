import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProfileCard() {
    return (
        <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <div className="h-24 bg-gradient-to-br from-primary/30 to-[#C9E9D2]/50" />
                <CardContent className="p-5 -mt-12 text-center space-y-3">
                    <img
                        src="https://ui.shadcn.com/avatars/02.png"
                        alt="Avatar"
                        className="w-20 h-20 rounded-full border-4 border-white shadow-md mx-auto object-cover"
                    />
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-800">Nguyễn Minh</h2>
                        <p className="text-xs text-slate-400">minh.nguyen@email.com</p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">Free Plan</span>
                    </div>
                    <Button variant="outline" className="w-full rounded-xl border-slate-200 text-sm font-semibold">
                        Nâng cấp Pro
                    </Button>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold text-slate-800">Thống kê</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Ngày tham gia</span>
                            <span className="font-semibold text-slate-700">01/01/2026</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Buổi tư vấn</span>
                            <span className="font-semibold text-slate-700">8 buổi</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Bài tập hoàn thành</span>
                            <span className="font-semibold text-slate-700">24 bài</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Streak hiện tại</span>
                            <span className="font-semibold text-emerald-600">🔥 12 ngày</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
