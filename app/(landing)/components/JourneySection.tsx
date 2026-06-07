"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { EASING } from "@/lib/motion";

const STEPS = [
  {
    num: "1",
    bg: "bg-[#6D8A96] text-white",
    title: "Trò chuyện với Trợ lý AI",
    desc: "Chia sẻ cảm xúc của bạn bất cứ lúc nào. AI sẽ lắng nghe, phân tích mức độ căng thẳng và đề xuất bài tập phù hợp.",
  },
  {
    num: "2",
    bg: "bg-[#E1F0E3] text-emerald-700",
    title: "Thực hành & Theo dõi tiến trình",
    desc: "Hoàn thành các bài tập tâm lý, ghi nhật ký và theo dõi biểu đồ cảm xúc để hiểu bản thân hơn mỗi ngày.",
  },
  {
    num: "3",
    bg: "bg-rose-50 text-rose-600",
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
    <section className="py-32 bg-[#FAFDFB] overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div initial={initial} animate={animate} transition={transition()}>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-5 leading-tight">Hành trình chữa lành diễn ra như thế nào?</h2>
              <p className="text-lg text-slate-500 mb-10">Ba bước đơn giản để thấu hiểu bản thân và tìm lại sự cân bằng.</p>
            </motion.div>
            <div className="space-y-8">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.num}
                  className="flex gap-6 items-start"
                  initial={initial}
                  animate={animate}
                  transition={transition(0.15 + i * 0.1)}
                >
                  <div className={`w-10 h-10 rounded-full ${s.bg} shrink-0 flex items-center justify-center font-bold shadow-sm`}>
                    {s.num}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h4>
                    <p className="text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div
              className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white aspect-4/5"
              initial={prefersReduced ? {} : { x: 40, opacity: 0 }}
              animate={prefersReduced ? {} : isInView ? { x: 0, opacity: 1 } : { x: 40, opacity: 0 }}
              transition={transition(0.2)}
            >
              <Image
                src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1000&auto=format&fit=crop"
                alt="Hành trình chữa lành"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E1F0E3] rounded-full blur-3xl -z-10 opacity-60" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#F2F6F8] rounded-full blur-3xl -z-10 opacity-80" />
          </div>
        </div>
      </div>
    </section>
  );
}
