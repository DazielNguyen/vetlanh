"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Play, Square, CheckCircle, ChevronRight } from "lucide-react";
import { useExercise, useLogExercise } from "@/hooks/useExercise";
import type { ExerciseStep } from "@/types/exercise";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── General session timer (non-step exercises) ──────────────────────────────

interface TimerSessionProps {
  onComplete: (durationSeconds: number) => void;
  isLogging: boolean;
}

function TimerSession({ onComplete, isLogging }: TimerSessionProps) {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  function start() {
    setState("running");
    setElapsed(0);
    elapsedRef.current = 0;
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function complete() {
    stop();
    setState("done");
    onComplete(elapsedRef.current);
  }

  function cancel() {
    stop();
    setState("idle");
    setElapsed(0);
    elapsedRef.current = 0;
  }

  useEffect(() => () => stop(), []);

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-8">
        <CheckCircle className="h-12 w-12 text-emerald-500" />
        <p className="text-lg font-bold text-slate-800">Tuyệt vời! Buổi tập đã được ghi lại.</p>
        <p className="text-sm text-slate-500">Thời gian: {formatTime(elapsed)}</p>
      </div>
    );
  }

  return (
    <>
      {state === "running" && (
        <div className="flex flex-col items-center gap-2 py-6 bg-slate-50 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Đang chạy</p>
          <span className="text-5xl font-black text-slate-800 tabular-nums">{formatTime(elapsed)}</span>
        </div>
      )}
      {state === "idle" && (
        <Button onClick={start} className="w-full h-12 rounded-2xl font-bold text-base gap-2">
          <Play className="h-5 w-5" /> Bắt đầu buổi tập
        </Button>
      )}
      {state === "running" && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={cancel} className="flex-1 h-11 rounded-2xl gap-2 text-slate-600">
            <Square className="h-4 w-4" /> Hủy
          </Button>
          <Button
            onClick={complete}
            disabled={isLogging}
            className="flex-1 h-11 rounded-2xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {isLogging ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="h-4 w-4" /> Hoàn thành</>}
          </Button>
        </div>
      )}
    </>
  );
}

// ─── PMR step countdown ───────────────────────────────────────────────────────

type PmrPhase = "idle" | "tense" | "release" | "done";

interface StepCountdownProps {
  step: ExerciseStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  isLastStep: boolean;
}

function StepCountdown({ step, stepIndex, totalSteps, onNext, isLastStep }: StepCountdownProps) {
  const isPmr = step.tense_seconds != null;
  const [phase, setPhase] = useState<PmrPhase>("idle");
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function startPhase(duration: number, next: () => void) {
    setCountdown(duration);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearTimer();
          next();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  function startTense() {
    setPhase("tense");
    startPhase(step.tense_seconds!, () => {
      setPhase("release");
      startPhase(step.release_seconds!, () => setPhase("done"));
    });
  }

  useEffect(() => () => clearTimer(), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
          Bước {stepIndex + 1} / {totalSteps}
        </span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed">{step.instruction}</p>

      {isPmr && (
        <div className="rounded-2xl bg-slate-50 p-5 flex flex-col items-center gap-3">
          {phase === "idle" && (
            <Button onClick={startTense} className="w-full h-10 rounded-xl font-bold gap-2">
              <Play className="h-4 w-4" /> Bắt đầu bước này
            </Button>
          )}
          {phase === "tense" && (
            <>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Căng cơ</p>
              <span className="text-5xl font-black text-slate-800 tabular-nums">{countdown}s</span>
              <p className="text-xs text-slate-400">Giữ căng trong {step.tense_seconds} giây</p>
            </>
          )}
          {phase === "release" && (
            <>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Thư giãn</p>
              <span className="text-5xl font-black text-slate-800 tabular-nums">{countdown}s</span>
              <p className="text-xs text-slate-400">Thả lỏng trong {step.release_seconds} giây</p>
            </>
          )}
          {phase === "done" && (
            <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" /> Bước này hoàn thành
            </p>
          )}
        </div>
      )}

      <Button
        onClick={onNext}
        disabled={isPmr && phase !== "done"}
        className="w-full h-11 rounded-2xl font-bold gap-2"
      >
        {isLastStep ? (
          <><CheckCircle className="h-4 w-4" /> Hoàn thành bài tập</>
        ) : (
          <>Bước tiếp theo <ChevronRight className="h-4 w-4" /></>
        )}
      </Button>
    </div>
  );
}

// ─── Step-based session ───────────────────────────────────────────────────────

interface StepSessionProps {
  steps: ExerciseStep[];
  onComplete: (durationSeconds: number) => void;
  isLogging: boolean;
}

function StepSession({ steps, onComplete, isLogging }: StepSessionProps) {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const startTimeRef = useRef<number>(0);

  function start() {
    setState("running");
    startTimeRef.current = Date.now();
  }

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      setState("done");
      onComplete(elapsed);
    }
  }

  if (state === "idle") {
    return (
      <Button onClick={start} className="w-full h-12 rounded-2xl font-bold text-base gap-2">
        <Play className="h-5 w-5" /> Bắt đầu buổi tập ({steps.length} bước)
      </Button>
    );
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-8">
        {isLogging ? (
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        ) : (
          <>
            <CheckCircle className="h-12 w-12 text-emerald-500" />
            <p className="text-lg font-bold text-slate-800">Tuyệt vời! Buổi tập đã được ghi lại.</p>
          </>
        )}
      </div>
    );
  }

  // Step progress dots
  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 justify-center">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i < currentStep ? "bg-emerald-400 w-4" : i === currentStep ? "bg-primary w-6" : "bg-slate-200 w-4"
            }`}
          />
        ))}
      </div>
      <StepCountdown
        key={currentStep}
        step={steps[currentStep]}
        stepIndex={currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        isLastStep={currentStep === steps.length - 1}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExerciseDetailPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();

  const { data: exercise, isLoading } = useExercise(slug);
  const { mutate: logSession, isPending: isLogging } = useLogExercise();

  function handleComplete(durationSeconds: number) {
    logSession({ exercise_slug: slug, duration_seconds: durationSeconds });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="text-sm text-slate-400 py-10 text-center">
        Không tìm thấy bài tập này.
      </div>
    );
  }

  const hasSteps = !!(exercise.steps?.length);

  return (
    <div className="w-full pb-10 max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </button>

      <Card className="border-none shadow-sm rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-extrabold text-slate-800">{exercise.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {exercise.category}
            </span>
            {exercise.duration_seconds && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                ⏱ {Math.round(exercise.duration_seconds / 60)} phút
              </span>
            )}
            {exercise.mood_tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {tag}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">{exercise.description}</p>

          {hasSteps ? (
            <StepSession
              steps={exercise.steps!}
              onComplete={handleComplete}
              isLogging={isLogging}
            />
          ) : (
            <TimerSession onComplete={handleComplete} isLogging={isLogging} />
          )}

          {!isLogging && (
            <Button
              variant="outline"
              onClick={() => router.push("/services/exercises")}
              className="w-full rounded-2xl"
            >
              Quay lại danh sách
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
