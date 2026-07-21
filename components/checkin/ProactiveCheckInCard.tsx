"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, MessageCircle } from "lucide-react";
import { EASING } from "@/lib/motion";
import { SafeCompanion } from "@/components/illustrations/SafeCompanion";
import { usePendingCheckIns, useDismissCheckIn } from "@/hooks/useCheckIns";

/**
 * Global, always-reachable card — not a chat message, not a sonner toast.
 * Mounted once app-wide (see phase-05's Design Decisions) so a proactive
 * check-in can't be missed just because the user isn't on the chat page,
 * and doesn't auto-expire the way a toast would.
 */
export function ProactiveCheckInCard() {
  const { checkIns } = usePendingCheckIns();
  const dismiss = useDismissCheckIn();
  const prefersReduced = useReducedMotion();

  const current = checkIns[0];

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={prefersReduced ? {} : { opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
          transition={prefersReduced ? { duration: 0.15 } : { duration: 0.3, ease: EASING }}
          className="fixed bottom-4 right-4 z-40 w-[min(92vw,340px)]"
        >
          <div className="card-lifted rounded-3xl border-none bg-background p-4 flex gap-3 items-start">
            <SafeCompanion state="empathetic" className="w-10 h-10 shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm text-foreground/80 leading-relaxed">{current.message}</p>
              <div className="flex items-center gap-2">
                <Link
                  href="/services/chat"
                  onClick={() => dismiss(current.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Trò chuyện ngay
                </Link>
              </div>
            </div>
            <button
              type="button"
              onClick={() => dismiss(current.id)}
              aria-label="Bỏ qua"
              className="text-foreground/30 hover:text-foreground/60 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
