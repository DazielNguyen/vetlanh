import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function AIPromoCard() {
    return (
        <Card className="border-none shadow-sm rounded-3xl bg-[#FCEAEA] relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-40 text-[#F5D5D5]">
                <Heart className="w-40 h-40 fill-current" />
            </div>
            <CardContent className="p-6 relative z-10 space-y-4">
                <h3 className="text-xl font-bold text-[#6D8A96]">Bạn đang cảm thấy quá tải?</h3>
                <p className="text-sm text-slate-600 leading-relaxed pr-6">
                    Trợ lý AI của chúng tôi luôn sẵn sàng 24/7 để lắng nghe và hướng dẫn bạn qua các bài tập cân bằng cảm xúc.
                </p>
                <Button className="bg-white hover:bg-slate-50 text-slate-800 rounded-2xl py-6 px-4 font-bold shadow-sm w-fit border-none">
                    <span className="text-xs font-semibold text-slate-400 mr-2">chat</span> <span className="text-sm">Trò chuyện với AI</span>
                </Button>
            </CardContent>
        </Card>
    );
}
