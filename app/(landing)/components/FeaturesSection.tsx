"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { MessageSquare, Dumbbell, Activity, Map, BookOpen } from "lucide-react";
import Image from "next/image";
import { EASING } from "@/lib/motion";

const SMALL_FEATURES = [
  {
    icon: <Dumbbell className="w-5 h-5 text-white" />,
    title: "Bài tập tâm lý",
    desc: "Thư viện bài tập thở, thiền định và PMR được thiết kế cho từng mức độ căng thẳng.",
  },
  {
    icon: <Activity className="w-5 h-5 text-white" />,
    title: "Theo dõi cảm xúc",
    desc: "Biểu đồ trực quan theo dõi tâm trạng theo ngày, phát hiện xu hướng sớm.",
  },
  {
    icon: <Map className="w-5 h-5 text-white" />,
    title: "Lộ trình cá nhân",
    desc: "Hành trình cá nhân hóa với các nhiệm vụ mở khóa dần dần, tiến bộ từng ngày.",
  },
  {
    icon: <BookOpen className="w-5 h-5 text-white" />,
    title: "Nhật ký & Tư duy",
    desc: "Ghi lại suy nghĩ, phân tích kiểu tư duy tiêu cực và xây dựng góc nhìn tích cực.",
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const t = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };
  const iv = prefersReduced ? {} : { y: 30, opacity: 0 };
  const av = (in_view: boolean) =>
    prefersReduced ? {} : in_view ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };

  return (
    <section id="dich-vu" className="relative py-32 overflow-hidden" ref={ref}>
      <Image src="/images/bg1.png" alt="" fill className="object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-28 bg-linear-to-b from-black/80 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28 bg-linear-to-b from-transparent to-black/70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-aligned header — breaks center-symmetry */}
        <motion.div
          className="mb-14"
          initial={iv}
          animate={av(isInView)}
          transition={t()}
        >
          <p className="text-xs font-semibold text-white/45 tracking-widest uppercase mb-3">Dịch vụ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Mọi thứ bạn cần<br />
            <span className="text-white/55">trên hành trình chữa lành</span>
          </h2>
        </motion.div>

        {/* Asymmetric bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Hero card — AI Chat (2/3 width) */}
          <motion.div
            className="md:col-span-2 relative overflow-hidden rounded-[32px] min-h-80 flex flex-col justify-end p-8 group"
            initial={iv}
            animate={av(isInView)}
            transition={t(0.08)}
          >
            <div className="absolute inset-0">
              <Image
                src="https://picsum.photos/seed/calm-forest-morning/800/500"
                alt=""
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/10" />
              <div className="absolute inset-0 bg-[#789dbc]/10" />
            </div>

            <div className="relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-5">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Trợ lý AI thông minh</h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-md mb-5">
                Trò chuyện 24/7 với AI lắng nghe, phân tích cảm xúc và gợi ý bài tập phù hợp tức thì. Không phán xét — chỉ có sự thấu hiểu.
              </p>
              {/* Mock chat bubble preview */}
              <div className="space-y-2.5 max-w-sm">
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/25 shrink-0" />
                  <div className="bg-white/12 backdrop-blur-sm border border-white/15 rounded-2xl rounded-bl-sm px-4 py-2.5 text-xs text-white/80">
                    Hôm nay mình cảm thấy rất mệt và lo lắng...
                  </div>
                </div>
                <div className="flex items-end gap-2 justify-end">
                  <div className="bg-primary/30 backdrop-blur-sm border border-primary/25 rounded-2xl rounded-br-sm px-4 py-2.5 text-xs text-white">
                    Mình hiểu rồi. Hãy thử bài thở 4-7-8 nhé, 5 phút thôi...
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary/40 shrink-0 flex items-center justify-center text-[9px] text-white font-bold">
                    AI
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bài tập card (1/3 width) */}
          <motion.div
            className="relative rounded-[32px] bg-white/8 backdrop-blur-md border border-white/15 p-7 hover:bg-white/13 transition-all group overflow-hidden"
            initial={iv}
            animate={av(isInView)}
            transition={t(0.15)}
          >
            {/* Decorative blurred orb */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Bài tập tâm lý</h3>
              <p className="text-white/65 text-sm leading-relaxed mb-6">
                Thư viện bài tập thở, thiền định và PMR thiết kế cho từng mức độ căng thẳng.
              </p>
              {/* Visual: breathing ring animation */}
              <div className="flex items-center gap-2 opacity-60">
                {[12, 18, 24, 30, 24].map((size, i) => (
                  <div
                    key={i}
                    className="rounded-full border border-white/40"
                    style={{ width: size, height: size }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom row — 3 equal smaller cards */}
          {SMALL_FEATURES.slice(1).map((f, i) => (
            <motion.div
              key={f.title}
              className="rounded-[28px] bg-white/7 backdrop-blur-md border border-white/12 p-6 hover:bg-white/12 hover:border-white/20 transition-all group"
              initial={iv}
              animate={av(isInView)}
              transition={t(0.22 + i * 0.08)}
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
