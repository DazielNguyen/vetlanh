"use client";

import Link from "next/link";
import { X, MessageSquare, Smile, Dumbbell, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { EASING } from "@/lib/motion";
import { SafeCompanion } from "@/components/illustrations/SafeCompanion";
import { openServiceChat } from "@/lib/chatAssistant";

interface Feature {
  label: string;
  description: string;
  href?: string;
  action?: "chat";
  icon: LucideIcon;
}

// Exactly the 3 first-run features per phase-03's scope — everything else
// stays level-gated. Support tools (Thought Records/Safety Plan/PHQ-9) are
// intentionally excluded: they're always reachable via SupportToolsEntryPoint
// and don't count against this 3-feature limit.
const FIRST_RUN_FEATURES: Feature[] = [
  {
    label: "Trò chuyện AI",
    description: "Chia sẻ điều bạn đang nghĩ",
    action: "chat",
    icon: MessageSquare,
  },
  {
    label: "Tâm trạng",
    description: "Ghi lại cảm xúc hôm nay",
    href: "/services/mood",
    icon: Smile,
  },
  {
    label: "Bài tập",
    description: "Thử một bài thư giãn ngắn",
    href: "/services/exercises",
    icon: Dumbbell,
  },
];

interface CompanionOnboardingProps {
  onDismiss: () => void;
}

export function CompanionOnboarding({ onDismiss }: CompanionOnboardingProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? {} : { y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.5, ease: EASING }}
      className="col-span-12 relative rounded-3xl overflow-hidden bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(120,157,188,0.12)] px-6 py-6 md:px-8 md:py-7"
    >
      <button
        onClick={onDismiss}
        aria-label="Đóng"
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-foreground/40 hover:text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        <SafeCompanion state="happy" className="w-16 h-16 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-foreground">Chào mừng bạn đến với Vết Lành!</p>
          <p className="text-sm text-foreground/55 mt-1">
            Hãy bắt đầu với 3 điều này — các tính năng khác sẽ mở dần khi bạn tích luỹ kinh nghiệm.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        {FIRST_RUN_FEATURES.map((feature) => {
          const content = (
            <>
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{feature.label}</p>
                <p className="text-xs text-foreground/50 truncate">{feature.description}</p>
              </div>
            </>
          );
          const className =
            "group flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/50 dark:bg-white/8 border border-white/60 dark:border-white/15 hover:border-primary/40 hover:bg-white/70 dark:hover:bg-white/12 transition-colors";

          return feature.action === "chat" ? (
            <button
              key={feature.label}
              type="button"
              onClick={() => openServiceChat()}
              className={`${className} text-left`}
            >
              {content}
            </button>
          ) : (
            <Link key={feature.label} href={feature.href!} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
