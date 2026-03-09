import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function AIPromoCard() {
    return (
        <Card className="border-none shadow-sm rounded-3xl bg-[#FFE3E3]/40 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-20 text-red-300">
                <Heart className="w-40 h-40" />
            </div>
            <CardContent className="p-6 relative z-10">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Bạn đang cảm thấy quá tải?</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Trợ lý AI của chúng tôi luôn sẵn sàng 24/7 để lắng nghe và hướng dẫn bạn qua các bài tập cân bằng cảm xúc.
                </p>
                <Button className="w-full bg-white hover:bg-white/90 text-slate-800 rounded-xl py-6 font-bold shadow-sm border border-slate-100">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mr-2">chat</span> Trò chuyện với AI
                </Button>
            </CardContent>
        </Card>
    );
}
