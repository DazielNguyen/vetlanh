"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const messages = [
    {
        type: "ai",
        text: "Tôi nhận thấy gần đây bạn có vẻ căng thẳng hơn qua các lần check-in, bạn có muốn chia sẻ về điều đó không? Tôi ở đây để lắng nghe mà không phán xét.",
        time: "10:42",
    },
    {
        type: "user",
        text: "Ừ, công việc đang quá tải. Tôi không thể ngừng suy nghĩ vào ban đêm.",
        time: "10:45",
    },
];

const suggestedExperts = [
    {
        name: "TS. Sarah Phạm",
        title: "Chuyên gia Tâm lý lâm sàng",
        badge: "ĐÁNH GIÁ CAO",
        badgeColor: "text-red-500",
        status: "Có lịch hôm nay",
        statusColor: "text-emerald-500",
        avatar: "/images/placeholder-user.jpg",
    },
    {
        name: "ThS. Mark Nguyễn",
        title: "Chuyên gia Kiệt sức",
        badge: "CHÁNH NIỆM",
        badgeColor: "text-primary",
        status: "Lịch tiếp: Ngày mai",
        statusColor: "text-amber-500",
        avatar: "/images/placeholder-user.jpg",
    },
];

export function ChatMessages() {
    return (
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* AI Message */}
            <div className="flex items-start gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-[#C9E9D2] flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm">🌿</span>
                </div>
                <div>
                    <div className="bg-primary text-white px-5 py-3.5 rounded-2xl rounded-tl-md text-sm leading-relaxed">
                        {messages[0].text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">{messages[0].time}</span>
                </div>
            </div>

            {/* User Message */}
            <div className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-sm">👤</span>
                </div>
                <div className="text-right">
                    <div className="bg-[#C9E9D2]/60 text-slate-800 px-5 py-3.5 rounded-2xl rounded-tr-md text-sm leading-relaxed text-left">
                        {messages[1].text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">{messages[1].time}</span>
                </div>
            </div>

            {/* AI Suggestion Card */}
            <div className="flex items-start gap-3 max-w-[85%]">
                <div className="w-8 h-8 shrink-0" />
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden flex-1">
                    <CardContent className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Phát hiện mức căng thẳng cao</h3>
                                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                                    Có vẻ bạn cần sự hỗ trợ chuyên sâu hơn. Bạn có muốn kết nối với chuyên gia tâm lý để quản lý tình trạng kiệt sức này không?
                                </p>
                            </div>
                        </div>

                        <Button className="w-full bg-[#C9E9D2] hover:bg-[#C9E9D2]/80 text-slate-800 rounded-xl font-semibold shadow-none">
                            Tìm chuyên gia
                        </Button>

                        {/* Suggested Experts */}
                        <div className="grid grid-cols-2 gap-3">
                            {suggestedExperts.map((expert) => (
                                <div key={expert.name} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                                    <img src={expert.avatar} alt={expert.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-bold text-slate-800 truncate">{expert.name}</span>
                                            <span className={`text-[9px] font-bold ${expert.badgeColor} uppercase`}>{expert.badge}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400">{expert.title}</p>
                                        <p className={`text-[10px] font-medium ${expert.statusColor} flex items-center gap-0.5`}>
                                            {expert.status} <span>→</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Reaction */}
            <div className="flex items-center gap-2 ml-11">
                <button className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition text-xs">&lt;</button>
                <button className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-300 transition text-xs">👍</button>
            </div>
        </div>
    );
}
