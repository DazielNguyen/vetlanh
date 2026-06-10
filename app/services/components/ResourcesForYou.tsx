"use client";

import Image from "next/image";
import { useRecommendedResources } from "@/hooks/useServices";
import type { Resource } from "@/types/services";

// TODO: replace all pexels URLs with hosted assets
const TYPE_IMAGE: Record<Resource["type"], { src: string; bg: string }> = {
    article: {
        src: "https://images.pexels.com/photos/3076516/pexels-photo-3076516.jpeg?auto=compress&cs=tinysrgb&w=600",
        bg: "bg-[#FAF5EE] border-[#F0EBE1]",
    },
    audio: {
        src: "https://images.pexels.com/photos/1172840/pexels-photo-1172840.jpeg?auto=compress&cs=tinysrgb&w=600",
        bg: "bg-[#EEF5EF] border-[#E1F0E3]",
    },
    video: {
        src: "https://images.pexels.com/photos/1423640/pexels-photo-1423640.jpeg?auto=compress&cs=tinysrgb&w=600",
        bg: "bg-[#EEF0FA] border-[#E1E3F0]",
    },
};

export function ResourcesForYou() {
    const { data: resources } = useRecommendedResources(2);

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold text-primary">Tài nguyên cho bạn</h2>
                <a
                    href="/services/exercises"
                    className="text-xs font-bold text-foreground/60 hover:text-primary transition rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                    Xem thư viện
                </a>
            </div>
            <div className="grid grid-cols-1 gap-4 flex-1 content-start">
                {(resources ?? []).map((resource) => {
                    const { src, bg } = TYPE_IMAGE[resource.type] ?? TYPE_IMAGE.article;
                    const linkable = Boolean(resource.url);
                    const Wrapper = linkable ? "a" : "div";
                    const linkProps = linkable
                        ? { href: resource.url, target: "_blank", rel: "noopener noreferrer" }
                        : {};

                    return (
                        <Wrapper
                            key={resource.id}
                            {...linkProps}
                            className={linkable ? "group rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" : undefined}
                        >
                            <div className={`aspect-4/3 rounded-3xl relative overflow-hidden mb-3 border transition-shadow ${linkable ? "hover:shadow-md" : ""} ${bg}`}>
                                <Image
                                    src={src}
                                    alt={resource.title}
                                    fill
                                    className={`object-cover ${linkable ? "transition-transform duration-300 group-hover:scale-105" : ""}`}
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                />
                                {resource.duration_label && (
                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-foreground shadow-sm z-10">
                                        {resource.duration_label}
                                    </div>
                                )}
                            </div>
                            <h4 className={`font-bold text-foreground line-clamp-2 ${linkable ? "group-hover:text-primary transition-colors" : ""}`}>
                                {resource.title}
                            </h4>
                        </Wrapper>
                    );
                })}
            </div>
        </div>
    );
}
