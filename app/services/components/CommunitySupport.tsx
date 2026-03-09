import { Card, CardContent } from "@/components/ui/card";

export function CommunitySupport() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">Hỗ trợ Cộng đồng</h2>
            <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white overflow-hidden p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 shrink-0"></div>
                    <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none relative">
                        <p className="text-sm italic text-slate-600 leading-relaxed mb-2">
                            "Bạn mạnh mẽ hơn bạn nghĩ. Tiếp tục bước đi nhé!"
                        </p>
                        <p className="text-xs font-bold text-slate-400">- Lan A.</p>
                    </div>
                </div>
                <div className="mt-6">
                    <span className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider">
                        Tham gia thảo luận (4 người dùng đang hoạt động)
                    </span>
                </div>
            </Card>
        </div>
    );
}
