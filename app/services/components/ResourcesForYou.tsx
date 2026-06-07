"use client";

import { BookOpen, Headphones, Video } from "lucide-react";
import { useRecommendedResources } from "@/hooks/useServices";
import type { Resource } from "@/types/services";

const TYPE_CONFIG: Record<Resource["type"], { icon: React.ReactNode; bg: string }> = {
    article: { icon: <BookOpen className="w-16 h-16 opacity-50" />, bg: "bg-[#FAF5EE] border-[#F0EBE1] text-slate-300" },
    audio:   { icon: <Headphones className="w-16 h-16 opacity-60" />, bg: "bg-[#EEF5EF] border-[#E1F0E3] text-emerald-200" },
    video:   { icon: <Video className="w-16 h-16 opacity-50" />, bg: "bg-[#EEF0FA] border-[#E1E3F0] text-indigo-200" },
};

export function ResourcesForYou() {
    const { data: resources } = useRecommendedResources(2);

    return (
        <div className="space-y-4 mt-8">
            <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold text-primary">Tài nguyên cho bạn</h2>
                <a href="/services/exercises" className="text-xs font-bold text-slate-400 hover:text-primary transition">Xem thư viện</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(resources ?? []).map((resource) => {
                    const { bg, icon } = TYPE_CONFIG[resource.type] ?? TYPE_CONFIG.article;
                    const Wrapper = resource.url ? "a" : "div";
                    const linkProps = resource.url
                        ? { href: resource.url, target: "_blank", rel: "noopener noreferrer" }
                        : {};
                    return (
                        <Wrapper key={resource.id} className="group cursor-pointer" {...linkProps}>
                            <div className={`aspect-4/3 rounded-3xl flex flex-col justify-end p-4 relative overflow-hidden mb-3 border hover:shadow-md transition-shadow ${bg}`}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {icon}
                                </div>
                                <div className="bg-white/90 backdrop-blur rounded-full px-3 py-1 w-fit text-xs font-bold text-slate-700 relative z-10 shadow-sm">
                                    {resource.duration_label}
                                </div>
                            </div>
                            <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">{resource.title}</h4>
                        </Wrapper>
                    );
                })}
            </div>
        </div>
    );
}
