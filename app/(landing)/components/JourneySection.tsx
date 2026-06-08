"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { EASING } from "@/lib/motion";

const STEPS = [
  {
    num: "1",
    bg: "bg-white/20 border-white/30",
    text: "text-white",
    title: "Trò chuyện với Trợ lý AI",
    desc: "Chia sẻ cảm xúc của bạn bất cứ lúc nào. AI sẽ lắng nghe, phân tích mức độ căng thẳng và đề xuất bài tập phù hợp.",
  },
  {
    num: "2",
    bg: "bg-white/20 border-white/30",
    text: "text-white",
    title: "Thực hành & Theo dõi tiến trình",
    desc: "Hoàn thành các bài tập tâm lý, ghi nhật ký và theo dõi biểu đồ cảm xúc để hiểu bản thân hơn mỗi ngày.",
  },
  {
    num: "3",
    bg: "bg-white/20 border-white/30",
    text: "text-white",
    title: "Chữa lành theo lộ trình cá nhân",
    desc: "Khám phá lộ trình chữa lành được cá nhân hóa, mở khóa từng nhiệm vụ và xây dựng thói quen chăm sóc tinh thần bền vững.",
  },
];

export default function JourneySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const initial = prefersReduced ? {} : { y: 30, opacity: 0 };
  const animate = prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };
  const transition = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      <Image src="/images/bg2.png" alt="" fill className="object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-28 bg-linear-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28 bg-linear-to-b from-transparent to-black/70" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div initial={initial} animate={animate} transition={transition()}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">Hành trình chữa lành diễn ra như thế nào?</h2>
              <p className="text-lg text-white/75 mb-10">Ba bước đơn giản để thấu hiểu bản thân và tìm lại sự cân bằng.</p>
            </motion.div>
            <div className="space-y-8">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.num}
                  className="flex gap-5 items-start rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 shadow-lg hover:bg-white/15 transition-all"
                  initial={initial}
                  animate={animate}
                  transition={transition(0.15 + i * 0.1)}
                >
                  <div className={`w-10 h-10 rounded-full ${s.bg} ${s.text} shrink-0 flex items-center justify-center font-bold backdrop-blur-sm border`}>
                    {s.num}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
                    <p className="text-white/75 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div
              className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/30 aspect-4/5"
              initial={prefersReduced ? {} : { x: 40, opacity: 0 }}
              animate={prefersReduced ? {} : isInView ? { x: 0, opacity: 1 } : { x: 40, opacity: 0 }}
              transition={transition(0.2)}
            >
              <Image
                src="/images/healing.gif"
                alt="Hành trình chữa lành"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10 opacity-60" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10 opacity-80" />
          </div>
        </div>
      </div>
    </section>
  );
}
