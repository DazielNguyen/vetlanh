"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { EASING } from "@/lib/motion";
import HealingHeroIllustration from "./illustrations/HealingHeroIllustration";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();
  const transition = (delay: number) =>
    prefersReduced ? { duration: 0 } : { duration: 0.8, delay, ease: EASING };

  return (
    <section
      ref={ref}
      className="relative min-h-dvh w-full overflow-hidden bg-linear-to-b from-hero-sky-start to-hero-sky-end"
    >
      {/* Illustration — lazy-mounted once the Hero scrolls into view */}
      {isInView && (
        <HealingHeroIllustration className="absolute inset-0 h-full w-full" />
      )}

      {/* Gradient bleed into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-linear-to-b from-transparent to-hero-sky-end/80" />

      {/* Hero content — bottom grid */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-10 md:pb-16">
        <div className="grid grid-cols-12 items-end gap-4">

          {/* Brand name — left */}
          <div className="col-span-12 lg:col-span-7">
            <h1 className="font-baloo font-bold leading-[0.85] tracking-tight text-hero-wordmark text-[22vw] sm:text-[20vw] md:text-[16vw] lg:text-[13vw] xl:text-[11vw]">
              <WordsPullUp text="Vết Lành" />
            </h1>
          </div>

          {/* Tagline + CTA — right */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 pb-2 lg:pb-6">
            <motion.p
              initial={prefersReduced ? {} : { y: 20, opacity: 0 }}
              animate={prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : {}}
              transition={transition(0.5)}
              className="text-sm text-hero-wordmark/80 sm:text-base md:text-lg leading-relaxed max-w-sm"
            >
              Hệ sinh thái chăm sóc sức khỏe tinh thần toàn diện — AI luôn lắng nghe, bài tập chữa lành và lộ trình cá nhân hóa cho bạn.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={prefersReduced ? {} : { y: 20, opacity: 0 }}
              animate={prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : {}}
              transition={transition(0.7)}
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 self-start rounded-full bg-hero-wordmark/10 border border-hero-wordmark/25 backdrop-blur-sm py-2 pl-6 pr-2 text-sm font-semibold text-hero-wordmark transition-all hover:bg-hero-wordmark/15 hover:gap-3 sm:text-base"
              >
                Bắt đầu miễn phí
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hero-wordmark/15 transition-transform group-hover:scale-110">
                  <ArrowRight className="h-4 w-4 text-hero-wordmark" />
                </span>
              </Link>
              <Link
                href="#dich-vu"
                className="inline-flex items-center self-start rounded-full px-6 py-3 text-sm font-semibold text-hero-wordmark/70 hover:text-hero-wordmark transition-colors"
              >
                Khám phá dịch vụ
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
