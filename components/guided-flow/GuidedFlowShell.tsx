"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EASING } from "@/lib/motion";
import { SafeCompanion } from "@/components/illustrations/SafeCompanion";
import type { CompanionState } from "@/components/illustrations/CompanionCharacter";

export interface GuidedFlowAnswer {
  label: string;
  value: string;
}

interface GuidedFlowShellProps {
  title: string;
  stepIndex: number;
  totalSteps: number;
  companionState: CompanionState;
  summary: GuidedFlowAnswer[];
  onExitToStatic: () => void;
  crisisButton?: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Presentational shell shared by the Thought Record and Safety Plan guided
 * flows — progress + companion header, running summary of confirmed
 * answers, a slot for the current question, and a footer slot each flow
 * fills with its own Back/Next/Save logic. No form state lives here.
 */
export function GuidedFlowShell({
  title,
  stepIndex,
  totalSteps,
  companionState,
  summary,
  onExitToStatic,
  crisisButton,
  footer,
  children,
}: GuidedFlowShellProps) {
  const prefersReduced = useReducedMotion();

  return (
    <Card className="card-lifted border-none rounded-3xl">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <SafeCompanion state={companionState} className="w-10 h-10 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{title}</p>
              <p className="text-xs text-foreground/40">
                Câu {Math.min(stepIndex + 1, totalSteps)}/{totalSteps}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onExitToStatic}
            className="text-xs font-semibold text-foreground/40 hover:text-foreground/70 transition-colors shrink-0 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dùng biểu mẫu thường
          </button>
        </div>

        <div className="h-1.5 rounded-full bg-secondary/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/60 transition-[width] duration-300"
            style={{ width: `${(Math.min(stepIndex, totalSteps) / totalSteps) * 100}%` }}
          />
        </div>

        {summary.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {summary.map((item) => (
              <span
                key={item.label}
                className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/40 text-foreground/60 truncate max-w-[200px]"
                title={`${item.label}: ${item.value}`}
              >
                {item.label}: {item.value}
              </span>
            ))}
          </div>
        )}

        <motion.div
          key={stepIndex}
          initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.3, ease: EASING }}
        >
          {children}
        </motion.div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div>{crisisButton}</div>
          <div className="flex gap-3">{footer}</div>
        </div>
      </CardContent>
    </Card>
  );
}
