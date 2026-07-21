"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { MessageSquare, Dumbbell, Activity, Map, BookOpen } from "lucide-react";
import Image from "next/image";
import { EASING } from "@/lib/motion";
import { FloatingBlob, FloatingSparkle, FloatingCloud, useSectionParallax } from "./decor/FloatingAccents";

const SMALL_FEATURES = [
  {
    icon: <Dumbbell className="w-5 h-5 text-hero-wordmark" />,
    title: "Bài tập tâm lý",
    desc: "Bài tập thở, thiền và PMR cho từng mức độ căng thẳng.",
  },
  {
    icon: <Activity className="w-5 h-5 text-hero-wordmark" />,
    title: "Theo dõi cảm xúc",
    desc: "Biểu đồ tâm trạng theo ngày, phát hiện xu hướng sớm.",
  },
  {
    icon: <Map className="w-5 h-5 text-hero-wordmark" />,
    title: "Lộ trình cá nhân",
    desc: "Nhiệm vụ mở khóa dần, tiến bộ từng ngày.",
  },
  {
    icon: <BookOpen className="w-5 h-5 text-hero-wordmark" />,
    title: "Nhật ký & Tư duy",
    desc: "Ghi lại suy nghĩ, xây dựng góc nhìn tích cực.",
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();
  const parallaxSlow = useSectionParallax(ref, 30);
  const parallaxFast = useSectionParallax(ref, 45);

  const t = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };
  const iv = prefersReduced ? {} : { y: 30, opacity: 0 };
  const av = (in_view: boolean) =>
    prefersReduced ? {} : in_view ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };

  return (
    <section id="dich-vu" className="relative py-32 overflow-hidden bg-linear-to-b from-hero-sky-end/40 via-background to-background" ref={ref}>
      {isInView && (
        <>
          <motion.div className="pointer-events-none absolute inset-0" style={{ y: parallaxSlow }}>
            <FloatingBlob color="bg-illustration-sun-yellow/40" className="top-14 right-[5%]" size={190} duration={9} />
            <FloatingCloud className="top-10 left-[3%]" scale={1.2} duration={11} />
          </motion.div>
          <motion.div className="pointer-events-none absolute inset-0" style={{ y: parallaxFast }}>
            <FloatingSparkle className="bottom-20 left-[7%]" color="var(--color-illustration-coral)" size={30} delay={0.6} />
          </motion.div>
        </>
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-aligned header — breaks center-symmetry */}
        <motion.div
          className="mb-14"
          initial={iv}
          animate={av(isInView)}
          transition={t()}
        >
          <p className="text-xs font-semibold text-hero-wordmark/45 tracking-widest uppercase mb-3">Dịch vụ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-hero-wordmark leading-tight">
            Mọi thứ bạn cần<br />
            <span className="text-hero-wordmark/55">trên hành trình chữa lành</span>
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
                Trò chuyện 24/7 với AI lắng nghe và gợi ý bài tập phù hợp — không phán xét, chỉ thấu hiểu.
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
            className="card-glass-warm relative rounded-[32px] p-7 hover:bg-white/50 transition-all group overflow-hidden"
            initial={iv}
            animate={av(isInView)}
            transition={t(0.15)}
          >
            {/* Decorative blurred orb */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-hero-wordmark/10 border border-hero-wordmark/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-5 h-5 text-hero-wordmark" />
              </div>
              <h3 className="text-lg font-bold text-hero-wordmark mb-2">Bài tập tâm lý</h3>
              <p className="text-hero-wordmark/65 text-sm leading-relaxed mb-6">
                Bài tập thở, thiền và PMR cho từng mức độ căng thẳng.
              </p>
              {/* Visual: breathing ring animation */}
              <div className="flex items-center gap-2 opacity-60">
                {[12, 18, 24, 30, 24].map((size, i) => (
                  <div
                    key={i}
                    className="rounded-full border border-hero-wordmark/40"
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
              className="card-glass-warm rounded-[28px] p-6 hover:bg-white/50 transition-all group"
              initial={iv}
              animate={av(isInView)}
              transition={t(0.22 + i * 0.08)}
            >
              <div className="w-10 h-10 rounded-xl bg-hero-wordmark/10 border border-hero-wordmark/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-hero-wordmark mb-2">{f.title}</h3>
              <p className="text-hero-wordmark/60 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
