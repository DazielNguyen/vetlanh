"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, CheckCircle, Loader2, RotateCcw, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CrisisResourcesButton } from "@/app/services/components/CrisisResourcesButton";
import { useUpdateGoals } from "@/hooks/useUser";
import { formatDate } from "@/lib/utils/formatDate";
import type { Phq9Result as Phq9ResultType } from "@/types/phq9";
import { SEVERITY_CONFIG, SEVERITY_LABELS } from "./phq9SeverityConfig";

interface Props {
  result: Phq9ResultType;
  onRetake: () => void;
}

export function Phq9Result({ result, onRetake }: Props) {
  const { mutate: updateGoals, isPending, isSuccess } = useUpdateGoals();
  const prefersReducedMotion = useReducedMotion();
  const config = SEVERITY_CONFIG[result.severity] ?? SEVERITY_CONFIG.Moderate;
  const hasGoals = result.suggested_goals.length > 0;
  const progress = Math.min(100, Math.max(0, (result.score / 27) * 100));
  const needsImmediateSupport = (result.answers[8] ?? 0) > 0;
  const strongestSignals = result.answers
    .map((answer, index) => ({ answer, question: result.questions[index], index }))
    .filter((item) => item.answer > 0 && item.question)
    .sort((a, b) => b.answer - a.answer)
    .slice(0, 3);

  function handleApplyGoals() {
    if (!isPending) updateGoals({ goals: result.suggested_goals });
  }

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden border-none card-lifted rounded-[2rem]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-illustration-sun-yellow/20 blur-3xl" />
        <CardContent className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <div className="relative grid h-40 w-40 shrink-0 place-items-center">
              <svg
                viewBox="0 0 120 120"
                className="absolute inset-0 h-full w-full -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="51"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  className="text-hero-wordmark/8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="51"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  pathLength="100"
                  className="text-primary"
                  initial={
                    prefersReducedMotion ? { pathLength: progress / 100 } : { pathLength: 0 }
                  }
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="text-center">
                <motion.span
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="block text-5xl font-baloo font-bold tabular-nums text-foreground"
                >
                  {result.score}
                </motion.span>
                <span className="text-xs font-semibold text-foreground/40">trên 27</span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-[0.14em] text-foreground/40">
                KẾT QUẢ GẦN NHẤT
              </p>
              <h2 className={`mt-2 text-3xl font-baloo font-bold tracking-tight ${config.color}`}>
                {SEVERITY_LABELS[result.severity] ?? result.severity}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/60">
                {config.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-lg bg-hero-wordmark/6 px-2.5 py-1 font-medium text-foreground/55">
                  {formatDate(result.submitted_at)}
                </span>
                {result.score_delta !== null && (
                  <span
                    className={`rounded-lg px-2.5 py-1 font-semibold ${result.score_delta <= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-900/25 dark:text-amber-300"}`}
                  >
                    {result.score_delta < 0
                      ? `Giảm ${Math.abs(result.score_delta)} điểm`
                      : result.score_delta > 0
                        ? `Tăng ${result.score_delta} điểm`
                        : "Không đổi"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {strongestSignals.length > 0 && (
        <Card className="border-none card-lifted rounded-3xl">
          <CardContent className="p-6">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Điều nên chú ý</h3>
                <p className="text-xs text-foreground/45">Những câu có tần suất cao nhất</p>
              </div>
              <span className="text-xs font-medium text-foreground/35">2 tuần qua</span>
            </div>
            <div className="space-y-4">
              {strongestSignals.map((item, index) => (
                <motion.div
                  key={item.index}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="line-clamp-1 text-xs font-medium text-foreground/65">
                      {item.question}
                    </p>
                    <span className="shrink-0 text-xs font-bold tabular-nums text-primary">
                      {item.answer}/3
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-hero-wordmark/7">
                    <motion.div
                      initial={prefersReducedMotion ? false : { scaleX: 0 }}
                      animate={{ scaleX: item.answer / 3 }}
                      transition={{ duration: 0.65, delay: 0.12 + index * 0.08 }}
                      className="h-full origin-left rounded-full bg-primary"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {needsImmediateSupport && (
        <Card className="border border-rose-200/70 bg-rose-50/80 shadow-none rounded-3xl dark:border-rose-900/40 dark:bg-rose-950/20">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm dark:bg-white/10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">
                Hỗ trợ đang ở đây
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-rose-800/70 dark:text-rose-200/65">
                Nếu bạn có thể gặp nguy hiểm ngay lúc này, hãy liên hệ một người tin cậy hoặc đường
                dây hỗ trợ.
              </p>
            </div>
            <CrisisResourcesButton />
          </CardContent>
        </Card>
      )}

      {hasGoals && (
        <Card className="border-none card-lifted rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground">Bước nhỏ tiếp theo</h3>
            <div className="mt-4 space-y-2.5">
              {result.suggested_goals.slice(0, 3).map((goal) => (
                <div
                  key={goal}
                  className="flex items-start gap-3 rounded-xl bg-illustration-mint/10 p-3 text-sm text-foreground/75"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-illustration-mint/30 text-emerald-800">
                    <Check className="h-3 w-3" />
                  </span>
                  {goal}
                </div>
              ))}
            </div>
            <Button
              onClick={handleApplyGoals}
              disabled={isPending || isSuccess}
              className="mt-5 h-11 w-full rounded-full bg-hero-wordmark font-semibold text-white hover:bg-hero-wordmark/90"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4" /> Đã thêm vào mục tiêu
                </>
              ) : (
                "Dùng gợi ý này"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={needsImmediateSupport ? "/services/safety-plan" : "/services/exercises"}
          className="group flex min-h-14 items-center justify-between rounded-2xl bg-primary/10 px-5 text-sm font-semibold text-primary transition hover:bg-primary/15"
        >
          {needsImmediateSupport ? "Mở kế hoạch an toàn" : "Chọn bài tập phù hợp"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <button
          type="button"
          onClick={onRetake}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-hero-wordmark/10 bg-white/45 text-sm font-semibold text-foreground/55 transition hover:bg-white/70 hover:text-foreground dark:border-white/10 dark:bg-white/5"
        >
          <RotateCcw className="h-4 w-4" /> Làm lại đánh giá
        </button>
      </div>

      <p className="px-2 text-[11px] leading-relaxed text-foreground/35">
        PHQ-9 là công cụ sàng lọc, không thay thế chẩn đoán của chuyên gia.
      </p>
    </div>
  );
}
