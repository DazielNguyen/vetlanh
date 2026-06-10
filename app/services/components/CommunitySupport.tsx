"use client";

import { Card } from "@/components/ui/card";
import { useCommunityFeatured } from "@/hooks/useServices";

const AVATAR_COLORS = [
    { bg: "bg-secondary/60", text: "text-primary" },
    { bg: "bg-accent/60", text: "text-rose-500" },
    { bg: "bg-[#E8E4F4]/70", text: "text-violet-500" },
    { bg: "bg-[#FFF0D4]/80", text: "text-amber-600" },
];

const MOCK_INITIALS = ["LA", "MT", "BH", "TN"];

export function CommunitySupport() {
    const { data } = useCommunityFeatured();

    const message = data?.message ?? "Bạn mạnh mẽ hơn bạn nghĩ. Tiếp tục bước đi nhé!";
    const author = data?.author_display ?? "Lan A.";
    const activeCount = data?.active_users_count ?? 4;

    return (
        <div className="h-full flex flex-col space-y-4">
            <h2 className="text-xl font-bold text-primary">Hỗ trợ Cộng đồng</h2>
            <Card className="border-none card-lifted rounded-3xl overflow-hidden p-6 hover:shadow-md transition-shadow cursor-pointer flex-1 flex flex-col">
                {/* Avatar row */}
                <div className="flex items-center gap-1.5 mb-4">
                    {MOCK_INITIALS.map((init, i) => {
                        const { bg, text } = AVATAR_COLORS[i % AVATAR_COLORS.length];
                        return (
                            <div
                                key={init}
                                className={`w-8 h-8 rounded-full ${bg} ${text} flex items-center justify-center text-[10px] font-extrabold shrink-0 ring-2 ring-white`}
                                style={{ marginLeft: i > 0 ? "-6px" : "0" }}
                            >
                                {init}
                            </div>
                        );
                    })}
                    <span className="text-xs text-foreground/40 font-medium ml-3">{activeCount} đang hoạt động</span>
                </div>

                <div className="bg-background/60 p-4 rounded-2xl rounded-tl-none flex-1 flex flex-col justify-center">
                    <p className="text-sm italic text-foreground/60 leading-relaxed mb-2">
                        "{message}"
                    </p>
                    <p className="text-xs font-bold text-foreground/40">- {author}</p>
                </div>

                <div className="mt-4">
                    <span className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider">
                        Tham gia thảo luận
                    </span>
                </div>
            </Card>
        </div>
    );
}
