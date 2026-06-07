"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { EASING } from "@/lib/motion";

const TESTIMONIALS = [
  {
    name: "Minh Anh",
    handle: "@minhanh_9x",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    quote: "Vết Lành giúp mình vượt qua những đêm mất ngủ vì stress công việc. Các bài tập rất tinh tế và hiệu quả.",
  },
  {
    name: "Hoàng Nam",
    handle: "@nam_healing",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    quote: "Cảm giác rất bình an khi sử dụng ứng dụng. Trợ lý AI thực sự thấu hiểu và gợi ý rất đúng tâm trạng.",
  },
  {
    name: "Thanh Trúc",
    handle: "@truc_zen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
    quote: "Lộ trình chữa lành giúp mình có mục tiêu rõ ràng mỗi ngày. Sau 2 tháng, mình đã thấy sự thay đổi rõ rệt.",
  },
];

export default function TestimonialSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const initial = prefersReduced ? {} : { y: 30, opacity: 0 };
  const animate = prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };
  const transition = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };

  return (
    <section id="cau-chuyen" className="py-32 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={initial}
          animate={animate}
          transition={transition()}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Câu chuyện chữa lành</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Cộng đồng <span className="font-dancing font-bold text-[1.1em]">Vết Lành</span> chia sẻ những thay đổi tích cực từ khi bắt đầu hành trình.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.handle}
              className="bg-[#FAFDFB] p-8 rounded-[32px] shadow-sm border border-slate-100"
              initial={initial}
              animate={animate}
              transition={transition(i * 0.1)}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-12 h-12 shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="rounded-full object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">{t.name}</h5>
                  <p className="text-xs text-slate-400">{t.handle}</p>
                </div>
              </div>
              <p className="text-slate-600 italic leading-relaxed">"{t.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
