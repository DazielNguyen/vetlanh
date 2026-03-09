import { Card, CardContent } from "@/components/ui/card";

export function DailyQuote() {
    return (
        <Card className="border-none shadow-md rounded-3xl bg-[#7C9AB3]">
            <CardContent className="p-8 text-left relative overflow-hidden">
                <div className="absolute top-4 left-4 text-white/20 text-6xl font-serif">"</div>
                <div className="relative z-10 pl-4">
                    <p className="text-sm md:text-base font-medium italic text-white leading-relaxed mb-6">
                        "Chữa lành không phải đường thẳng, nhưng mỗi bước tiến đều là một chiến thắng."
                    </p>
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                        Cảm hứng mỗi ngày
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
