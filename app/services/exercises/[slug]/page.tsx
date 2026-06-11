"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Play, Square, CheckCircle, ChevronRight, Clock } from "lucide-react";
import { useExercise, useLogExercise, useUpdateExerciseLogFeeling, useFeelingOptions } from "@/hooks/useExercise";
import type { ExerciseStep, BreathingPhase, FeelingOption } from "@/types/exercise";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Feeling picker ────────────────────────────────────────────────────────────

const DEFAULT_FEELINGS: FeelingOption[] = [
  { key: "much_better", emoji: "😌", label: "Rất nhẹ" },
  { key: "better", emoji: "😊", label: "Nhẹ hơn" },
  { key: "same", emoji: "😐", label: "Bình thường" },
  { key: "worse", emoji: "😣", label: "Vẫn căng" },
];

interface FeelingPickerProps {
  feelings: FeelingOption[];
  onSelect: (key: string) => void;
  onSkip: () => void;
}

function FeelingPicker({ feelings, onSelect, onSkip }: FeelingPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="w-full space-y-3"
    >
      <p className="text-sm font-semibold text-foreground/70 text-center">
        Bạn cảm thấy thế nào sau buổi tập?
      </p>
      <div className="grid grid-cols-2 gap-2">
        {feelings.map((f) => (
          <button
            key={f.key}
            onClick={() => onSelect(f.key)}
            className="flex flex-col items-center gap-1 px-3 py-3 rounded-2xl border border-border/40 bg-white hover:border-primary/40 hover:bg-secondary/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="text-2xl leading-none">{f.emoji}</span>
            <span className="text-xs font-semibold text-foreground/70">{f.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onSkip}
        className="w-full text-xs font-semibold text-foreground/60 underline underline-offset-2 hover:text-foreground/70 transition"
      >
        Bỏ qua
      </button>
    </motion.div>
  );
}

// ─── Shared session utilities ─────────────────────────────────────────────────

type DoneState = "done_pending" | "done_logged";

function resolveFeelingAndComplete(
  feeling: string | undefined,
  elapsed: number,
  setDone: () => void,
  onComplete: (d: number, feeling?: string) => void
) {
  setDone();
  onComplete(elapsed, feeling);
}

interface SessionDoneViewProps {
  isLogging: boolean;
  doneState: DoneState;
  elapsed?: number;
  feelings: FeelingOption[];
  onFeelingResolved: (feeling?: string) => void;
}

function SessionDoneView({ isLogging, doneState, elapsed, feelings, onFeelingResolved }: SessionDoneViewProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center py-6">
      {doneState === "done_logged" && isLogging ? (
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      ) : (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="relative"
        >
          {/* celebratory pulse ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <CheckCircle
            className={`h-14 w-14 relative z-10 ${doneState === "done_pending" ? "text-primary/50" : "text-primary"}`}
          />
        </motion.div>
      )}
      <p className="text-lg font-bold text-foreground">Tuyệt vời! Buổi tập hoàn thành.</p>
      {elapsed != null && (
        <p className="text-sm text-foreground/65">Thời gian: {formatTime(elapsed)}</p>
      )}
      <AnimatePresence>
        {doneState === "done_pending" && (
          <FeelingPicker
            feelings={feelings}
            onSelect={(v) => onFeelingResolved(v)}
            onSkip={() => onFeelingResolved()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── General session timer ────────────────────────────────────────────────────

interface TimerSessionProps {
  feelings: FeelingOption[];
  onComplete: (durationSeconds: number, feeling?: string) => void;
  isLogging: boolean;
}

function TimerSession({ feelings, onComplete, isLogging }: TimerSessionProps) {
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
    doneElapsedRef.current = elapsedRef.current;
    setState("done_pending");
  }

  function cancel() {
    stop();
    setState("idle");
    setElapsed(0);
    elapsedRef.current = 0;
  }

  function handleFeelingResolved(feeling?: string) {
    resolveFeelingAndComplete(feeling, doneElapsedRef.current, () => setState("done_logged"), onComplete);
  }

  useEffect(() => () => stop(), []);

  if (state === "done_pending" || state === "done_logged") {
    return (
      <SessionDoneView
        isLogging={isLogging}
        doneState={state}
        elapsed={doneElapsedRef.current}
        feelings={feelings}
        onFeelingResolved={handleFeelingResolved}
      />
    );
  }

  return (
    <>
      {state === "running" && (
        <div className="flex flex-col items-center gap-2 py-6 bg-background/60 rounded-2xl">
          <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Đang chạy</p>
          <span className="text-5xl font-black text-foreground tabular-nums">{formatTime(elapsed)}</span>
        </div>
      )}
      {state === "idle" && (
        <Button onClick={start} className="w-full h-12 rounded-2xl font-bold text-base gap-2">
          <Play className="h-5 w-5" /> Bắt đầu buổi tập
        </Button>
      )}
      {state === "running" && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={cancel} className="flex-1 h-11 rounded-2xl gap-2 text-foreground/70">
            <Square className="h-4 w-4" /> Hủy
          </Button>
          <Button
            onClick={complete}
            className="flex-1 h-11 rounded-2xl font-bold gap-2 bg-primary hover:bg-primary/90"
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
        if (c <= 1) { clearTimer(); next(); return 0; }
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
        <span className="text-xs font-bold text-foreground/60 uppercase tracking-wide">
          Bước {stepIndex + 1} / {totalSteps}
        </span>
      </div>

      <p className="text-sm text-foreground/75 leading-relaxed">{step.instruction}</p>

      {isPmr && (
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-2xl bg-background/60 p-5 flex flex-col items-center gap-3">
              <Button onClick={startTense} className="w-full h-10 rounded-xl font-bold gap-2">
                <Play className="h-4 w-4" /> Bắt đầu bước này
              </Button>
            </motion.div>
          )}
          {phase === "tense" && (
            <motion.div key="tense"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="rounded-2xl bg-red-50/70 border border-red-200/60 p-5 flex flex-col items-center gap-3"
            >
              <p className="text-xs font-bold text-red-500 uppercase tracking-wide">Căng cơ</p>
              <span className="text-5xl font-black text-red-600 tabular-nums">{countdown}s</span>
              <p className="text-xs text-red-400/80">Giữ căng trong {step.tense_seconds} giây</p>
            </motion.div>
          )}
          {phase === "release" && (
            <motion.div key="release"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="rounded-2xl bg-primary/5 border border-primary/20 p-5 flex flex-col items-center gap-3"
            >
              <p className="text-xs font-bold text-primary uppercase tracking-wide">Thư giãn</p>
              <span className="text-5xl font-black text-primary tabular-nums">{countdown}s</span>
              <p className="text-xs text-primary/60">Thả lỏng trong {step.release_seconds} giây</p>
            </motion.div>
          )}
          {phase === "done" && (
            <motion.div key="done"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-primary/5 p-4 flex justify-center">
              <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> Bước này hoàn thành
              </p>
            </motion.div>
          )}
        </AnimatePresence>
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
  feelings: FeelingOption[];
  onComplete: (durationSeconds: number, feeling?: string) => void;
  isLogging: boolean;
}

function StepSession({ steps, feelings, onComplete, isLogging }: StepSessionProps) {
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
    resolveFeelingAndComplete(feeling, elapsedRef.current, () => setState("done_logged"), onComplete);
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
        feelings={feelings}
        onFeelingResolved={handleFeelingResolved}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 justify-center">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i < currentStep ? "bg-primary w-4" : i === currentStep ? "bg-primary w-6" : "bg-border/40 w-4"
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

// ─── Breathing session ────────────────────────────────────────────────────────
// r=88 in a 200×200 viewBox; circumference drives the SVG countdown ring
const BREATHING_CIRCUMFERENCE = 2 * Math.PI * 88;

// Colors per phase — hex values required for SVG stroke attribute and box-shadow
const PHASE_COLORS = {
  inhale: { orbBg: "bg-primary/20", border: "border-primary/50", glow: "rgba(120,157,188,0.28)", ring: "#789dbc" },
  hold:   { orbBg: "bg-[#F5C07A]/20", border: "border-[#F5C07A]/50", glow: "rgba(245,192,122,0.32)", ring: "#F5C07A" },
  exhale: { orbBg: "bg-secondary/40", border: "border-border/40", glow: "rgba(120,157,188,0.07)", ring: "#d6e8f5" },
  idle:   { orbBg: "bg-secondary/60", border: "border-border/30", glow: "rgba(120,157,188,0.04)", ring: "#d6e8f5" },
} as const;

type PhaseKey = keyof typeof PHASE_COLORS;

function classifyPhase(label: string): PhaseKey {
  if (label.startsWith("Hít")) return "inhale";
  if (label.startsWith("Giữ")) return "hold";
  if (label.startsWith("Thở")) return "exhale";
  return "inhale";
}

const DEFAULT_BREATHING_PHASES: BreathingPhase[] = [
  { label: "Hít vào...", seconds: 4 },
  { label: "Giữ lại...", seconds: 7 },
  { label: "Thở ra...", seconds: 8 },
];

function targetScaleForPhase(label: string, currentScale: number, expandScale: number): number {
  if (label.startsWith("Hít")) return expandScale;
  if (label.startsWith("Thở")) return 1;
  return currentScale;
}

interface BreathingSessionProps {
  phases: BreathingPhase[];
  feelings: FeelingOption[];
  onComplete: (durationSeconds: number, feeling?: string) => void;
  isLogging: boolean;
}

function BreathingSession({ phases, feelings, onComplete, isLogging }: BreathingSessionProps) {
  const [state, setState] = useState<"idle" | "running" | DoneState>("idle");
  const [currentPhaseLabel, setCurrentPhaseLabel] = useState(phases[0]?.label ?? "");
  const prefersReducedMotion = useReducedMotion();
  const prefersReducedMotionRef = useRef(!!prefersReducedMotion);
  const [scopeOrb, animateOrb] = useAnimate();
  const [scopeRing, animateRing] = useAnimate();
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  useEffect(() => { prefersReducedMotionRef.current = !!prefersReducedMotion; }, [prefersReducedMotion]);

  useEffect(() => {
    if (state !== "running") return;

    let cancelled = false;
    const activePhases = phases.length ? phases : DEFAULT_BREATHING_PHASES;

    async function runLoop() {
      let currentScale = 1;
      while (!cancelled) {
        for (const phase of activePhases) {
          if (!scopeOrb.current || !scopeRing.current || cancelled) return;
          const reduced = prefersReducedMotionRef.current;
          const dur = (s: number) => (reduced ? 0.01 : s);
          const expandScale = reduced ? 1 : 1.55;

          setCurrentPhaseLabel(phase.label);
          const targetScale = targetScaleForPhase(phase.label, currentScale, expandScale);
          const ease = phase.label.startsWith("Giữ") ? "linear" : "easeInOut";

          // Reset ring to full before each phase, then deplete in sync with orb
          await animateRing(scopeRing.current, { strokeDashoffset: 0 }, { duration: 0 });
          await Promise.all([
            animateOrb(scopeOrb.current, { scale: targetScale }, { duration: dur(phase.seconds), ease }),
            animateRing(scopeRing.current, { strokeDashoffset: BREATHING_CIRCUMFERENCE }, { duration: dur(phase.seconds), ease: "linear" }),
          ]);

          currentScale = targetScale;
          if (cancelled) return;
        }
      }
    }

    startTimeRef.current = Date.now();
    runLoop();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, phases]);

  function start() { setState("running"); }

  function finish() {
    elapsedRef.current = Math.round((Date.now() - startTimeRef.current) / 1000);
    setState("done_pending");
  }

  function handleFeelingResolved(feeling?: string) {
    resolveFeelingAndComplete(feeling, elapsedRef.current, () => setState("done_logged"), onComplete);
  }

  if (state === "done_pending" || state === "done_logged") {
    return (
      <SessionDoneView
        isLogging={isLogging}
        doneState={state}
        elapsed={elapsedRef.current}
        feelings={feelings}
        onFeelingResolved={handleFeelingResolved}
      />
    );
  }

  const phaseKey: PhaseKey = state === "running" ? classifyPhase(currentPhaseLabel) : "idle";
  const colors = PHASE_COLORS[phaseKey];

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Orb + SVG countdown ring */}
      <div className="relative flex items-center justify-center w-48 h-48">
        {/* Countdown ring — rotated so it starts at 12 o'clock */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 200"
          style={{ transform: "rotate(-90deg)" }}
          aria-hidden="true"
        >
          {/* Track circle */}
          <circle cx="100" cy="100" r="88" fill="none" stroke="#d6e8f5" strokeWidth="3" />
          {/* Progress circle — depletes from full to empty over the phase duration */}
          <circle
            ref={scopeRing}
            cx="100" cy="100" r="88"
            fill="none"
            stroke={colors.ring}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={BREATHING_CIRCUMFERENCE}
            strokeDashoffset={0}
            style={{ transition: "stroke 700ms ease" }}
          />
        </svg>

        {/* Breathing orb with ambient glow */}
        <div
          className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-colors duration-700 ${colors.border}`}
          style={{
            boxShadow: `0 0 36px 10px ${colors.glow}`,
            transition: "box-shadow 700ms ease, border-color 700ms ease",
          }}
        >
          <div
            ref={scopeOrb}
            className={`w-20 h-20 rounded-full transition-colors duration-700 ${colors.orbBg}`}
          />
        </div>
      </div>

      {/* Phase label — fades in/out on change */}
      <div className="min-h-7 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {state === "running" ? (
            <motion.p
              key={currentPhaseLabel}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-base font-semibold text-foreground/75 tracking-wide"
            >
              {currentPhaseLabel}
            </motion.p>
          ) : (
            <motion.p
              key="idle-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-foreground/45 text-center"
            >
              Tìm tư thế thoải mái và bắt đầu khi bạn sẵn sàng
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {state === "idle" && (
        <Button onClick={start} className="w-full h-12 rounded-2xl font-bold text-base gap-2">
          <Play className="h-5 w-5" /> Bắt đầu buổi thở
        </Button>
      )}
      {state === "running" && (
        <Button
          onClick={finish}
          className="w-full h-11 rounded-2xl font-bold gap-2 bg-primary hover:bg-primary/90"
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
  const { mutate: updateFeeling } = useUpdateExerciseLogFeeling();
  const { data: feelingOptionsData } = useFeelingOptions();
  const [sessionDone, setSessionDone] = useState(false);

  const feelings = feelingOptionsData?.length ? feelingOptionsData : DEFAULT_FEELINGS;

  function handleComplete(durationSeconds: number, feeling?: string) {
    setSessionDone(true);
    logSession(
      { exercise_slug: slug, duration_seconds: durationSeconds },
      {
        onSuccess: (log) => {
          if (feeling) updateFeeling({ logId: log.id, body: { post_session_feeling: feeling } });
        },
        onError: () => setSessionDone(false),
      }
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
      <div className="text-sm text-foreground/60 py-10 text-center">
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
        className="flex items-center gap-1.5 text-sm text-foreground/65 hover:text-foreground/75 transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </button>

      <Card className="card-lifted border-none rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-extrabold text-foreground">{exercise.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-background/60 text-foreground/70">
              {exercise.category}
            </span>
            {exercise.duration_seconds && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary/40 text-primary">
                <Clock className="w-3 h-3" strokeWidth={2} />
                {Math.round(exercise.duration_seconds / 60)} phút
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
          <p className="text-sm text-foreground/70 leading-relaxed">{exercise.description}</p>

          {isBreathing ? (
            <BreathingSession
              phases={exercise.phases?.length ? exercise.phases : DEFAULT_BREATHING_PHASES}
              feelings={feelings}
              onComplete={handleComplete}
              isLogging={isLogging}
            />
          ) : hasSteps ? (
            <StepSession steps={exercise.steps!} feelings={feelings} onComplete={handleComplete} isLogging={isLogging} />
          ) : (
            <TimerSession feelings={feelings} onComplete={handleComplete} isLogging={isLogging} />
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
