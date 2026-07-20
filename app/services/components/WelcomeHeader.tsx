"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASING } from "@/lib/motion";
import StaggerChars from "@/components/ui/stagger-chars";
import { SupportToolsEntryPoint } from "@/components/progression/SupportToolsEntryPoint";

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

const MOODS = [
    { emoji: "😞", label: "Rất tệ" },
    { emoji: "😐", label: "Bình thường" },
    { emoji: "🙂", label: "Ổn" },
    { emoji: "😊", label: "Vui" },
    { emoji: "✨", label: "Tuyệt vời" },
] as const;

export function WelcomeHeader({ greeting: backendGreeting }: { greeting?: string }) {
    const [greeting, setGreeting] = useState<string | null>(null);
    const [todayLabel, setTodayLabel] = useState<string | null>(null);
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const prefersReduced = useReducedMotion();

    useEffect(() => {
        setGreeting(backendGreeting ?? getTimeGreeting());
        setTodayLabel(getTodayLabel());
    }, [backendGreeting]);

    const t = (delay: number) =>
        prefersReduced ? { duration: 0 } : { duration: 0.7, delay, ease: EASING };

    return (
        <div ref={ref} className="col-span-12 rounded-3xl overflow-hidden relative min-h-40">
            {/* Glass surface matching landing page card language */}
            <div className="absolute inset-0 bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(120,157,188,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]" />

            {/* Ambient blur orbs (same technique as landing page) */}
            <div className="absolute -top-12 -right-8 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 left-16 w-48 h-48 bg-secondary/25 rounded-full blur-3xl pointer-events-none" />

            {/* Always-visible, ungated entry point to safety-exempt tools */}
            <div className="absolute top-4 right-4 z-20">
                <SupportToolsEntryPoint />
            </div>

            <div className="relative z-10 px-8 py-8 md:py-10">
                <div className="max-w-3xl">
                    {greeting !== null ? (
                        <>
                            <motion.p
                                initial={prefersReduced ? {} : { y: 12, opacity: 0 }}
                                animate={prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : {}}
                                transition={t(0)}
                                className="text-xs font-semibold text-primary/60 tracking-widest uppercase mb-2"
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
                                    className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight"
                                />
                                <span className="text-3xl">🌿</span>
                            </motion.div>

                            <motion.p
                                initial={prefersReduced ? {} : { y: 16, opacity: 0 }}
                                animate={prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : {}}
                                transition={t(0.16)}
                                className="text-foreground/55 mt-2.5 text-sm md:text-base max-w-lg"
                            >
                                Hãy hít thở thật sâu. Bạn đang làm rất tốt hôm nay.
                            </motion.p>

                            {/* Mood row — pill buttons matching landing page style */}
                            <motion.div
                                initial={prefersReduced ? {} : { y: 12, opacity: 0 }}
                                animate={prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : {}}
                                transition={t(0.26)}
                                className="flex items-center gap-2 mt-6 flex-wrap"
                            >
                                <span className="text-xs font-medium text-foreground/40 mr-1">Hôm nay bạn cảm thấy?</span>
                                {MOODS.map((mood, i) => (
                                    <motion.button
                                        key={mood.emoji}
                                        onClick={() => setSelectedMood(i === selectedMood ? null : i)}
                                        whileTap={prefersReduced ? {} : { scale: 0.9 }}
                                        className={`h-9 px-3 rounded-full flex items-center gap-1.5 transition-all duration-200 border text-xs font-medium ${
                                            selectedMood === i
                                                ? "bg-primary/15 border-primary/50 text-primary scale-110 shadow-sm"
                                                : "bg-white/50 dark:bg-white/8 border-white/60 dark:border-white/15 hover:bg-white/70 dark:hover:bg-white/12 hover:border-primary/25 text-foreground/60 backdrop-blur-sm"
                                        }`}
                                        aria-label={mood.label}
                                    >
                                        <span className="text-sm">{mood.emoji}</span>
                                        {selectedMood === i && (
                                            <motion.span
                                                initial={{ width: 0, opacity: 0 }}
                                                animate={{ width: "auto", opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                {mood.label}
                                            </motion.span>
                                        )}
                                    </motion.button>
                                ))}
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
        </div>
    );
}
