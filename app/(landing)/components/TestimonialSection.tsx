"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { EASING } from "@/lib/motion";

const TESTIMONIALS = [
  {
    name: "Minh Anh",
    handle: "@minhanh_gen",
    role: "Sinh viên năm 3",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    quote: "Vết Lành giúp mình vượt qua những đêm mất ngủ vì stress học hành. Các bài tập thở rất tinh tế — chỉ 5 phút mà mình cảm thấy khác hẳn. Mình thường dùng lúc 2 giờ sáng và nó thực sự hiệu quả.",
    featured: true,
  },
  {
    name: "Hoàng Nam",
    handle: "@nam_healing",
    role: "Nhân viên văn phòng",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    quote: "Trợ lý AI thực sự thấu hiểu và gợi ý rất đúng tâm trạng. Không cảm giác đang nói chuyện với robot.",
    featured: false,
  },
  {
    name: "Thanh Trúc",
    handle: "@truc_zen",
    role: "Freelancer sáng tạo",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    quote: "Sau 2 tháng theo lộ trình cá nhân, mình đã thấy sự thay đổi rõ rệt về cách mình phản ứng với áp lực.",
    featured: false,
  },
];

export default function TestimonialSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const t = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };
  const iv = prefersReduced ? {} : { y: 30, opacity: 0 };
  const av = prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };

  const [featured, ...rest] = TESTIMONIALS;

  return (
    <section id="cau-chuyen" className="relative py-32 overflow-hidden" ref={ref}>
      <Image src="/images/bg3.png" alt="" fill className="object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-28 bg-linear-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28 bg-linear-to-b from-transparent to-black/70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-14"
          initial={iv}
          animate={av}
          transition={t()}
        >
          <p className="text-xs font-semibold text-white/45 tracking-widest uppercase mb-3">Câu chuyện</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Hành trình của mọi người
          </h2>
          <p className="mt-3 text-white/60 text-base max-w-lg">
            Cộng đồng <span className="font-dancing font-bold text-[1.1em] text-white/80">Vết Lành</span> chia sẻ những thay đổi tích cực.
          </p>
        </motion.div>

        {/* Asymmetric layout: large featured left + 2 stacked right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Featured testimonial — 2/3 width */}
          <motion.div
            className="md:col-span-2 relative overflow-hidden rounded-[32px] bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-10 flex flex-col justify-between min-h-72"
            initial={iv}
            animate={av}
            transition={t(0.08)}
          >
            {/* Large decorative quote mark */}
            <div className="absolute top-6 right-8 text-[120px] leading-none font-serif text-white/6 select-none pointer-events-none">
              "
            </div>

            <div>
              <p className="text-white/90 text-lg md:text-xl leading-relaxed font-light mb-8 max-w-xl">
                "{featured.quote}"
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0">
                <Image
                  src={featured.avatar}
                  alt={featured.name}
                  fill
                  className="rounded-2xl object-cover ring-2 ring-white/25"
                  sizes="56px"
                />
              </div>
              <div>
                <h5 className="font-bold text-white text-base">{featured.name}</h5>
                <p className="text-sm text-white/55">{featured.role}</p>
                <p className="text-xs text-white/35 mt-0.5">{featured.handle}</p>
              </div>
              {/* Verified badge */}
              <div className="ml-auto shrink-0 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-white/60">
                Đã xác minh
              </div>
            </div>
          </motion.div>

          {/* Right column — 2 stacked smaller quotes */}
          <div className="flex flex-col gap-5">
            {rest.map((t_item, i) => (
              <motion.div
                key={t_item.handle}
                className="flex-1 rounded-[28px] bg-white/7 backdrop-blur-md border border-white/15 p-7 hover:bg-white/12 hover:border-white/25 transition-all"
                initial={iv}
                animate={av}
                transition={t(0.15 + i * 0.1)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-10 h-10 shrink-0">
                    <Image
                      src={t_item.avatar}
                      alt={t_item.name}
                      fill
                      className="rounded-xl object-cover ring-1 ring-white/25"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">{t_item.name}</h5>
                    <p className="text-xs text-white/45">{t_item.role}</p>
                  </div>
                </div>
                <p className="text-white/75 text-sm italic leading-relaxed">"{t_item.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
