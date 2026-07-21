"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASING } from "@/lib/motion";
import StaggerChars from "@/components/ui/stagger-chars";
import { SupportToolsEntryPoint } from "@/components/progression/SupportToolsEntryPoint";
import { SafeCompanion } from "@/components/illustrations/SafeCompanion";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Xin chào";
  return "Chào buổi tối";
}

function getTodayLabel(): string {
  return new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function WelcomeHeader({ greeting: backendGreeting }: { greeting?: string }) {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [todayLabel, setTodayLabel] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setGreeting(backendGreeting ?? getTimeGreeting());
    setTodayLabel(getTodayLabel());
  }, [backendGreeting]);

  const t = (delay: number) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, delay, ease: EASING };

  return (
    <section
      ref={ref}
      className="col-span-12 rounded-[2rem] overflow-hidden relative min-h-64 border border-hero-wordmark/10 bg-linear-to-br from-[#ffe7be] via-[#fff3db] to-[#dff2e7] shadow-[0_24px_60px_-38px_rgba(91,55,31,0.45)] dark:from-white/7 dark:via-white/4 dark:to-emerald-950/20 dark:border-white/10"
    >
      <div className="absolute -top-20 -right-12 w-72 h-72 bg-illustration-sun-yellow/35 rounded-full blur-3xl pointer-events-none dark:bg-emerald-500/8" />
      <div className="absolute -bottom-20 left-[38%] w-56 h-56 bg-illustration-mint/30 rounded-full blur-3xl pointer-events-none dark:bg-emerald-500/5" />
      <div className="absolute left-8 top-7 h-2.5 w-2.5 rounded-full bg-illustration-coral/55" />
      <div className="absolute left-14 top-11 h-1.5 w-1.5 rounded-full bg-illustration-mint" />

      {/* Always-visible, ungated entry point to safety-exempt tools */}
      <div className="absolute top-4 right-4 z-20">
        <SupportToolsEntryPoint />
      </div>

      <div className="hidden md:block absolute bottom-4 right-8 z-10 pointer-events-none">
        <SafeCompanion state="happy" className="w-28 h-28" />
      </div>

      <div className="relative z-10 px-7 py-9 md:px-10 md:py-11">
        <div className="max-w-3xl">
          {greeting !== null ? (
            <>
              <motion.p
                initial={prefersReduced ? {} : { y: 12, opacity: 0 }}
                animate={prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : {}}
                transition={t(0)}
                className="text-xs font-semibold text-hero-wordmark/50 dark:text-white/45 tracking-[0.16em] uppercase mb-3"
              >
                {todayLabel}
              </motion.p>

              <motion.div
                initial={prefersReduced ? {} : { y: 20, opacity: 0 }}
                animate={prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : {}}
                transition={t(0.08)}
                className="flex items-baseline gap-2"
              >
                <StaggerChars
                  text={greeting ?? ""}
                  direction="up"
                  delay={0.04}
                  duration={0.7}
                  disabled={prefersReduced ?? false}
                  className="text-4xl md:text-5xl font-baloo font-bold text-hero-wordmark dark:text-white tracking-[-0.04em]"
                />
                <span className="text-3xl">☀️</span>
              </motion.div>

              <motion.p
                initial={prefersReduced ? {} : { y: 16, opacity: 0 }}
                animate={prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : {}}
                transition={t(0.16)}
                className="text-hero-wordmark/65 dark:text-white/55 mt-2.5 text-sm md:text-base max-w-lg leading-relaxed"
              >
                Mỗi bước nhỏ đều đáng ghi nhận. Hôm nay mình bắt đầu bằng điều nhẹ nhàng nhất nhé.
              </motion.p>

              <motion.div
                initial={prefersReduced ? {} : { y: 12, opacity: 0 }}
                animate={prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : {}}
                transition={t(0.26)}
                className="flex items-center gap-3 mt-7 flex-wrap"
              >
                <Link
                  href="/services/mood"
                  className="group inline-flex items-center gap-2 rounded-full border border-hero-wordmark/20 bg-hero-wordmark px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-hero-wordmark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:translate-y-0"
                >
                  Check-in hôm nay
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link
                  href="/services/exercises"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-hero-wordmark/65 transition-colors hover:text-hero-wordmark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-white/60 dark:hover:text-white"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  Chọn một bài tập ngắn
                </Link>
              </motion.div>
            </>
          ) : (
            /* Skeleton — prevents layout shift while JS boots */
            <div className="space-y-3">
              <div className="h-3.5 w-40 rounded-full bg-primary/10 animate-pulse" />
              <div className="h-12 w-80 rounded-xl bg-primary/10 animate-pulse" />
              <div className="h-4 w-64 rounded-full bg-primary/8 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
