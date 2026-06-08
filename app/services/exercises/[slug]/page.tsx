"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
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

// ─── Feeling picker (shared across all session types) ────────────────────────

const FEELINGS = [
  { value: "much_better", emoji: "😌", label: "Rất nhẹ" },
  { value: "better", emoji: "😊", label: "Nhẹ hơn" },
  { value: "same", emoji: "😐", label: "Bình thường" },
  { value: "worse", emoji: "😣", label: "Vẫn căng" },
];

interface FeelingPickerProps {
  onSelect: (value: string) => void;
  onSkip: () => void;
}

function FeelingPicker({ onSelect, onSkip }: FeelingPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="w-full space-y-3"
    >
      <p className="text-sm font-semibold text-slate-600 text-center">
        Bạn cảm thấy thế nào sau buổi tập?
      </p>
      <div className="grid grid-cols-2 gap-2">
        {FEELINGS.map((f) => (
          <button
            key={f.value}
            onClick={() => onSelect(f.value)}
            className="flex flex-col items-center gap-1 px-3 py-3 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 transition"
          >
            <span className="text-2xl leading-none">{f.emoji}</span>
            <span className="text-xs font-semibold text-slate-600">{f.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onSkip}
        className="w-full text-xs font-semibold text-slate-400 underline underline-offset-2 hover:text-slate-600 transition"
      >
        Bỏ qua
      </button>
    </motion.div>
  );
}

// ─── Shared session utilities ─────────────────────────────────────────────────

type DoneState = "done_pending" | "done_logged";

function resolveFeelingAndComplete(
  slug: string,
  feeling: string | undefined,
  elapsed: number,
  setDone: () => void,
  onComplete: (d: number) => void
) {
  if (feeling) localStorage.setItem(`feeling_after_${slug}_last`, feeling);
  setDone();
  onComplete(elapsed);
}

interface SessionDoneViewProps {
  isLogging: boolean;
  doneState: DoneState;
  elapsed?: number;
  onFeelingResolved: (feeling?: string) => void;
}

function SessionDoneView({ isLogging, doneState, elapsed, onFeelingResolved }: SessionDoneViewProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center py-6">
      {doneState === "done_logged" && isLogging ? (
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      ) : doneState === "done_pending" ? (
        <CheckCircle className="h-10 w-10 text-emerald-200" />
      ) : (
        <CheckCircle className="h-12 w-12 text-emerald-500" />
      )}
      <p className="text-lg font-bold text-slate-800">Tuyệt vời! Buổi tập hoàn thành.</p>
      {elapsed != null && (
        <p className="text-sm text-slate-500">Thời gian: {formatTime(elapsed)}</p>
      )}
      <AnimatePresence>
        {doneState === "done_pending" && (
          <FeelingPicker
            onSelect={(v) => onFeelingResolved(v)}
            onSkip={() => onFeelingResolved()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── General session timer (non-step exercises) ──────────────────────────────

interface TimerSessionProps {
  slug: string;
  onComplete: (durationSeconds: number) => void;
  isLogging: boolean;
}

function TimerSession({ slug, onComplete, isLogging }: TimerSessionProps) {
  const [state, setState] = useState<"idle" | "running" | DoneState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const doneElapsedRef = useRef(0);

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
    doneElapsedRef.current = elapsedRef.current; // capture before any queued interval tick
    setState("done_pending");
  }

  function cancel() {
    stop();
    setState("idle");
    setElapsed(0);
    elapsedRef.current = 0;
  }

  function handleFeelingResolved(feeling?: string) {
    resolveFeelingAndComplete(slug, feeling, doneElapsedRef.current, () => setState("done_logged"), onComplete);
  }

  useEffect(() => () => stop(), []);

  if (state === "done_pending" || state === "done_logged") {
    return (
      <SessionDoneView
        isLogging={isLogging}
        doneState={state}
        elapsed={doneElapsedRef.current}
        onFeelingResolved={handleFeelingResolved}
      />
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
          {/* transitions to done_pending on click — unmounts before isLogging=true, so no disabled guard needed */}
          <Button
            onClick={complete}
            className="flex-1 h-11 rounded-2xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCircle className="h-4 w-4" /> Hoàn thành
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
  slug: string;
  steps: ExerciseStep[];
  onComplete: (durationSeconds: number) => void;
  isLogging: boolean;
}

function StepSession({ slug, steps, onComplete, isLogging }: StepSessionProps) {
  const [state, setState] = useState<"idle" | "running" | DoneState>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  function start() {
    setState("running");
    startTimeRef.current = Date.now();
  }

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      elapsedRef.current = Math.round((Date.now() - startTimeRef.current) / 1000);
      setState("done_pending");
    }
  }

  function handleFeelingResolved(feeling?: string) {
    resolveFeelingAndComplete(slug, feeling, elapsedRef.current, () => setState("done_logged"), onComplete);
  }

  if (state === "idle") {
    return (
      <Button onClick={start} className="w-full h-12 rounded-2xl font-bold text-base gap-2">
        <Play className="h-5 w-5" /> Bắt đầu buổi tập ({steps.length} bước)
      </Button>
    );
  }

  if (state === "done_pending" || state === "done_logged") {
    return (
      <SessionDoneView
        isLogging={isLogging}
        doneState={state}
        elapsed={elapsedRef.current}
        onFeelingResolved={handleFeelingResolved}
      />
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

// ─── 4-7-8 Breathing session ──────────────────────────────────────────────────
// tense_seconds / release_seconds are PMR-only fields; breathing exercises always use hardcoded 4-7-8.

const BREATH_INHALE = 4;
const BREATH_HOLD = 7;
const BREATH_EXHALE = 8;
const PHASE_LABEL: Record<"inhale" | "hold" | "exhale", string> = {
  inhale: "Hít vào...",
  hold: "Giữ lại...",
  exhale: "Thở ra...",
};

interface BreathingSessionProps {
  slug: string;
  onComplete: (durationSeconds: number) => void;
  isLogging: boolean;
}

function BreathingSession({ slug, onComplete, isLogging }: BreathingSessionProps) {
  const [state, setState] = useState<"idle" | "running" | DoneState>("idle");
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const prefersReducedMotion = useReducedMotion();
  const prefersReducedMotionRef = useRef(!!prefersReducedMotion);
  const [scope, animate] = useAnimate();
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  useEffect(() => { prefersReducedMotionRef.current = !!prefersReducedMotion; }, [prefersReducedMotion]);

  useEffect(() => {
    if (state !== "running") return;

    let cancelled = false;

    async function runLoop() {
      while (!cancelled) {
        if (!scope.current) return;
        const reduced = prefersReducedMotionRef.current;
        const dur = (s: number) => (reduced ? 0.01 : s);
        const expandScale = reduced ? 1 : 1.6;

        setBreathPhase("inhale");
        await animate(scope.current, { scale: expandScale }, { duration: dur(BREATH_INHALE), ease: "easeInOut" });
        if (cancelled || !scope.current) return;

        setBreathPhase("hold");
        await animate(scope.current, { scale: expandScale }, { duration: dur(BREATH_HOLD), ease: "linear" });
        if (cancelled || !scope.current) return;

        setBreathPhase("exhale");
        await animate(scope.current, { scale: 1 }, { duration: dur(BREATH_EXHALE), ease: "easeInOut" });
        if (cancelled || !scope.current) return;
      }
    }

    startTimeRef.current = Date.now();
    runLoop();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // animate is stable; prefersReducedMotion is read via ref so OS toggle takes effect next cycle
  }, [state]);

  function start() {
    setState("running");
  }

  function finish() {
    elapsedRef.current = Math.round((Date.now() - startTimeRef.current) / 1000);
    setState("done_pending");
  }

  function handleFeelingResolved(feeling?: string) {
    resolveFeelingAndComplete(slug, feeling, elapsedRef.current, () => setState("done_logged"), onComplete);
  }

  if (state === "done_pending" || state === "done_logged") {
    return (
      <SessionDoneView
        isLogging={isLogging}
        doneState={state}
        elapsed={elapsedRef.current}
        onFeelingResolved={handleFeelingResolved}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div ref={scope} className="w-36 h-36 rounded-full bg-emerald-100 border-4 border-emerald-400 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-emerald-400 opacity-60" />
      </div>

      {state === "running" && (
        <p className="text-base font-semibold text-slate-600 tracking-wide">{PHASE_LABEL[breathPhase]}</p>
      )}

      {state === "idle" && (
        <Button onClick={start} className="w-full h-12 rounded-2xl font-bold text-base gap-2">
          <Play className="h-5 w-5" /> Bắt đầu buổi thở
        </Button>
      )}

      {state === "running" && (
        <Button
          onClick={finish}
          className="w-full h-11 rounded-2xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckCircle className="h-4 w-4" /> Kết thúc buổi tập
        </Button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExerciseDetailPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();

  const { data: exercise, isLoading } = useExercise(slug);
  const { mutate: logSession, isPending: isLogging } = useLogExercise();
  const [sessionDone, setSessionDone] = useState(false);

  function handleComplete(durationSeconds: number) {
    setSessionDone(true);
    logSession(
      { exercise_slug: slug, duration_seconds: durationSeconds },
      { onError: () => setSessionDone(false) }
    );
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

  const isBreathing = exercise.category === "breathing";
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

          {/* Priority: breathing → steps → timer */}
          {isBreathing ? (
            <BreathingSession slug={slug} onComplete={handleComplete} isLogging={isLogging} />
          ) : hasSteps ? (
            <StepSession slug={slug} steps={exercise.steps!} onComplete={handleComplete} isLogging={isLogging} />
          ) : (
            <TimerSession slug={slug} onComplete={handleComplete} isLogging={isLogging} />
          )}

          {!isLogging && !sessionDone && (
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
