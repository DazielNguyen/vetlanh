"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { EASING } from "@/lib/motion";
import { FloatingBlob, FloatingSparkle, FloatingCloud, useSectionParallax } from "./decor/FloatingAccents";

const TESTIMONIALS = [
  {
    name: "Minh Anh",
    handle: "@minhanh_gen",
    role: "Sinh viên năm 3",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    quote: "Vết Lành giúp mình vượt qua những đêm mất ngủ vì stress học hành. Chỉ 5 phút bài tập thở mà cảm thấy khác hẳn.",
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
  const parallaxSlow = useSectionParallax(ref, 30);
  const parallaxFast = useSectionParallax(ref, 45);

  const t = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };
  const iv = prefersReduced ? {} : { y: 30, opacity: 0 };
  const av = prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };

  const [featured, ...rest] = TESTIMONIALS;

  return (
    <section id="cau-chuyen" className="relative py-32 overflow-hidden bg-linear-to-b from-background via-illustration-sky-blue/10 to-background" ref={ref}>
      {isInView && (
        <>
          <motion.div className="pointer-events-none absolute inset-0" style={{ y: parallaxSlow }}>
            <FloatingBlob color="bg-illustration-sky-blue/40" className="top-12 right-[4%]" size={170} duration={9.5} />
            <FloatingCloud className="top-14 left-[5%]" scale={1.1} duration={10.5} />
          </motion.div>
          <motion.div className="pointer-events-none absolute inset-0" style={{ y: parallaxFast }}>
            <FloatingSparkle className="bottom-16 left-[10%]" color="var(--color-illustration-sun-yellow)" size={30} delay={0.4} />
          </motion.div>
        </>
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-14"
          initial={iv}
          animate={av}
          transition={t()}
        >
          <p className="text-xs font-semibold text-hero-wordmark/45 tracking-widest uppercase mb-3">Câu chuyện</p>
          <h2 className="text-3xl md:text-4xl font-bold text-hero-wordmark leading-tight">
            Hành trình của mọi người
          </h2>
          <p className="mt-3 text-hero-wordmark/60 text-base max-w-lg">
            Cộng đồng <span className="font-baloo font-bold text-[1.1em] text-hero-wordmark/80">Vết Lành</span> chia sẻ những thay đổi tích cực.
          </p>
        </motion.div>

        {/* Asymmetric layout: large featured left + 2 stacked right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Featured testimonial — 2/3 width */}
          <motion.div
            className="card-glass-warm md:col-span-2 relative overflow-hidden rounded-[32px] p-8 md:p-10 flex flex-col justify-between min-h-72"
            initial={iv}
            animate={av}
            transition={t(0.08)}
          >
            {/* Large decorative quote mark */}
            <div className="absolute top-6 right-8 text-[120px] leading-none font-serif text-hero-wordmark/8 select-none pointer-events-none">
              "
            </div>

            <div>
              <p className="text-hero-wordmark/90 text-lg md:text-xl leading-relaxed font-light mb-8 max-w-xl">
                "{featured.quote}"
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0">
                <Image
                  src={featured.avatar}
                  alt={featured.name}
                  fill
                  className="rounded-2xl object-cover ring-2 ring-hero-wordmark/15"
                  sizes="56px"
                />
              </div>
              <div>
                <h5 className="font-bold text-hero-wordmark text-base">{featured.name}</h5>
                <p className="text-sm text-hero-wordmark/55">{featured.role}</p>
                <p className="text-xs text-hero-wordmark/35 mt-0.5">{featured.handle}</p>
              </div>
              {/* Verified badge */}
              <div className="ml-auto shrink-0 bg-hero-wordmark/10 border border-hero-wordmark/20 rounded-full px-3 py-1 text-xs text-hero-wordmark/60">
                Đã xác minh
              </div>
            </div>
          </motion.div>

          {/* Right column — 2 stacked smaller quotes */}
          <div className="flex flex-col gap-5">
            {rest.map((t_item, i) => (
              <motion.div
                key={t_item.handle}
                className="card-glass-warm flex-1 rounded-[28px] p-7 hover:bg-white/50 transition-all"
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
                      className="rounded-xl object-cover ring-1 ring-hero-wordmark/15"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-hero-wordmark text-sm">{t_item.name}</h5>
                    <p className="text-xs text-hero-wordmark/45">{t_item.role}</p>
                  </div>
                </div>
                <p className="text-hero-wordmark/75 text-sm italic leading-relaxed">"{t_item.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
