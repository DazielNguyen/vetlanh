"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { openServiceChat } from "@/lib/chatAssistant";

export function AIPromoCard() {
  return (
    <div className="rounded-3xl overflow-hidden relative min-h-52 group">
      {/* Background: nature image like landing page sections */}
      {/* TODO: replace with hosted asset */}
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt=""
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 100vw"
        />
        {/* Same overlay technique as landing page FeaturesSection */}
        <div className="absolute inset-0 bg-hero-wordmark/58" />
        <div className="absolute inset-0 bg-linear-to-br from-illustration-coral/30 via-transparent to-illustration-mint/20" />
      </div>

      {/* Ambient blur orbs */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      {/* Content — white on dark like landing page cards */}
      <div className="relative z-10 p-7 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 h-full">
        <div className="space-y-3 max-w-lg">
          <h3 className="text-2xl md:text-3xl font-baloo font-bold text-white leading-tight">
            Dành một khoảng lặng cho mình
          </h3>
          <p className="text-white/75 text-sm md:text-base leading-relaxed">
            Kể điều đang ở trong lòng, hoặc để AI cùng bạn chọn một bước nhỏ giúp hôm nay nhẹ hơn.
          </p>
        </div>

        {/* CTA button matching landing page style exactly */}
        <button
          type="button"
          onClick={() => openServiceChat()}
          className="group/btn inline-flex items-center gap-2 self-start md:self-end shrink-0 rounded-full bg-white/15 border border-white/35 backdrop-blur-sm py-2 pl-5 pr-2 text-sm font-semibold text-white transition-all hover:bg-white/25 hover:gap-3"
        >
          Bắt đầu trò chuyện
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform group-hover/btn:scale-110">
            <ArrowRight className="h-3.5 w-3.5 text-white" />
          </span>
        </button>
      </div>
    </div>
  );
}
