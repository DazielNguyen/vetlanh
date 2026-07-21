"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Loader2, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CrisisResourcesButton } from "@/app/services/components/CrisisResourcesButton";
import { usePhq9Questions, useSubmitPhq9 } from "@/hooks/usePhq9";
import { ErrorCard, FeatureUnavailable } from "@/components/ui/state";
import type { ApiError } from "@/lib/api/core";
import type { Phq9Result } from "@/types/phq9";

const DRAFT_KEY = "phq9_draft_answers";

const ANSWER_OPTIONS = [
  { value: 0, label: "Không", hint: "0", tone: "bg-[#eaf4ed]" },
  { value: 1, label: "Vài ngày", hint: "1", tone: "bg-[#f8edcf]" },
  { value: 2, label: "Hơn nửa thời gian", hint: "2", tone: "bg-[#f7dec8]" },
  { value: 3, label: "Gần như mỗi ngày", hint: "3", tone: "bg-[#f5d2c9]" },
] as const;

interface Props {
  onComplete: (result: Phq9Result) => void;
}

export function Phq9Form({ onComplete }: Props) {
  const { data: questions, isLoading, isError, error, refetch } = usePhq9Questions();
  const { mutate: submit, isPending } = useSubmitPhq9();
  const prefersReducedMotion = useReducedMotion();
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [answers, setAnswers] = useState<(number | undefined)[]>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"questions" | "review">("questions");
  const [isAdvancing, setIsAdvancing] = useState(false);

  const answeredCount = questions
    ? questions.filter((_, index) => answers[index] !== undefined).length
    : answers.filter((answer) => answer !== undefined).length;
  const allAnswered = questions != null && answeredCount === questions.length;
  const progress = questions?.length ? (answeredCount / questions.length) * 100 : 0;
  const needsImmediateSupport = (answers[8] ?? 0) > 0;

  useEffect(() => {
    if (answers.length > 0) localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    if (!questions?.length) return;
    const firstUnanswered = questions.findIndex((_, index) => answers[index] === undefined);
    if (firstUnanswered >= 0) setCurrentIndex(firstUnanswered);
    else if (answers.length >= questions.length) setPhase("review");
    // Only restore the initial position when questions arrive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    []
  );

  function chooseAnswer(value: number) {
    if (!questions || isAdvancing) return;

    setAnswers((previous) => {
      const next = [...previous];
      next[currentIndex] = value;
      return next;
    });
    setIsAdvancing(true);

    const delay = prefersReducedMotion ? 0 : 260;
    advanceTimer.current = setTimeout(() => {
      if (currentIndex < questions.length - 1) setCurrentIndex((index) => index + 1);
      else setPhase("review");
      setIsAdvancing(false);
    }, delay);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (phase !== "questions" || isPending || isAdvancing) return;
      const optionIndex = Number(event.key) - 1;
      if (optionIndex < 0 || optionIndex > 3) return;
      event.preventDefault();
      chooseAnswer(ANSWER_OPTIONS[optionIndex].value);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  function goBack() {
    if (isAdvancing) return;
    if (phase === "review") {
      setPhase("questions");
      setCurrentIndex(Math.max(0, (questions?.length ?? 1) - 1));
      return;
    }
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function editQuestion(index: number) {
    setCurrentIndex(index);
    setPhase("questions");
  }

  function handleSubmit() {
    if (!allAnswered || isPending || !questions) return;
    submit(
      { answers: questions.map((_, index) => answers[index] as number) },
      {
        onSuccess: (result) => {
          localStorage.removeItem(DRAFT_KEY);
          onComplete(result);
        },
      }
    );
  }

  const answerSummary = useMemo(
    () =>
      answers.slice(0, questions?.length ?? 0).map((answer, index) => ({
        index,
        answer: answer ?? 0,
      })),
    [answers, questions?.length]
  );

  if (isLoading) {
    return (
      <Card className="border-none card-lifted rounded-[2rem]">
        <CardContent className="flex h-80 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    if ((error as ApiError).code === 404) {
      return (
        <FeatureUnavailable
          message="Tính năng đang được phát triển"
          description="Bảng câu hỏi PHQ-9 sẽ sớm có mặt. Vui lòng quay lại sau."
        />
      );
    }
    return <ErrorCard message="Không thể tải câu hỏi PHQ-9." onRetry={() => void refetch()} />;
  }

  if (!questions?.length) return null;

  return (
    <Card className="relative overflow-hidden border-none card-lifted rounded-[2rem]">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-illustration-sun-yellow/18 blur-3xl" />
      <CardContent className="relative p-6 sm:p-8 md:p-10">
        <div className="mb-9 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold tracking-[0.15em] text-hero-wordmark/45 dark:text-white/40">
              {phase === "review" ? "XEM LẠI" : `CÂU ${currentIndex + 1} / ${questions.length}`}
            </p>
            <span className="text-xs font-medium tabular-nums text-foreground/45">
              {answeredCount}/{questions.length}
            </span>
          </div>
          <Progress
            value={progress}
            className="h-1.5 bg-hero-wordmark/8 [&_[data-slot=progress-indicator]]:bg-primary [&_[data-slot=progress-indicator]]:duration-500"
          />
          <div className="flex justify-between gap-1" aria-hidden="true">
            {questions.map((_, index) => (
              <span
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${answers[index] !== undefined ? "bg-primary/55" : "bg-hero-wordmark/8"}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {phase === "questions" ? (
            <motion.section
              key={`question-${currentIndex}`}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -24 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-[24rem]"
            >
              <p className="mb-3 text-sm text-foreground/50">Trong 2 tuần qua...</p>
              <h2 className="max-w-2xl text-balance text-2xl font-semibold leading-snug tracking-[-0.025em] text-foreground md:text-3xl">
                {questions[currentIndex]}
              </h2>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ANSWER_OPTIONS.map((option, index) => {
                  const selected = answers[currentIndex] === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                      disabled={isAdvancing}
                      aria-pressed={selected}
                      onClick={() => chooseAnswer(option.value)}
                      className={`group flex min-h-20 items-center gap-4 rounded-2xl border p-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-wait ${
                        selected
                          ? "border-primary/35 bg-primary/10 shadow-[0_14px_30px_-24px_rgba(169,87,63,0.6)]"
                          : "border-hero-wordmark/10 bg-white/55 hover:border-primary/25 dark:border-white/10 dark:bg-white/5"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-hero-wordmark ${option.tone}`}
                      >
                        {selected ? <Check className="h-4 w-4" /> : option.hint}
                      </span>
                      <span className="text-sm font-semibold text-foreground">{option.label}</span>
                      <span className="ml-auto hidden text-[10px] text-foreground/30 sm:block">
                        phím {index + 1}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-8 flex min-h-10 items-center justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-foreground/50 transition hover:bg-hero-wordmark/5 hover:text-foreground disabled:invisible"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Câu trước
                </button>
                <p className="text-[11px] text-foreground/35">Chọn đáp án để tiếp tục</p>
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="review"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="min-h-[24rem]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-illustration-mint/25 text-emerald-700">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-3xl font-baloo font-bold tracking-tight text-foreground">
                Bạn đã hoàn thành
              </h2>
              <p className="mt-1 text-sm text-foreground/50">Chạm vào một ô nếu muốn sửa.</p>

              <div className="mt-7 grid grid-cols-9 gap-1.5">
                {answerSummary.map(({ index, answer }) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => editQuestion(index)}
                    aria-label={`Sửa câu ${index + 1}, đang chọn mức ${answer}`}
                    className="group space-y-2 rounded-xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <span
                      className="block rounded-lg bg-primary/15 transition group-hover:bg-primary/25"
                      style={{ height: `${1.5 + answer * 0.65}rem` }}
                    />
                    <span className="block text-[10px] font-semibold text-foreground/40">
                      {index + 1}
                    </span>
                  </button>
                ))}
              </div>

              {needsImmediateSupport && (
                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-rose-200/70 bg-rose-50/75 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm dark:bg-white/10">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="flex-1 text-xs leading-relaxed text-rose-800 dark:text-rose-200">
                    Bạn không cần ở một mình với cảm giác này. Hỗ trợ luôn sẵn sàng ngay lúc này.
                  </p>
                  <CrisisResourcesButton />
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-between">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!allAnswered || isPending}
                  className="h-12 rounded-full bg-hero-wordmark px-6 font-semibold text-white hover:bg-hero-wordmark/90"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Xem kết quả <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-foreground/50 transition hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Sửa câu cuối
                </button>
              </div>

              {needsImmediateSupport && (
                <Link
                  href="/services/safety-plan"
                  className="mt-4 block text-center text-xs font-semibold text-rose-700 underline-offset-4 hover:underline dark:text-rose-300"
                >
                  Mở kế hoạch an toàn của tôi
                </Link>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
