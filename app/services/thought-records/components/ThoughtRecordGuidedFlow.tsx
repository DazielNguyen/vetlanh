"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { useCreateThoughtRecord } from "@/hooks/useThoughtRecords";
import { GuidedFlowShell } from "@/components/guided-flow/GuidedFlowShell";
import type { CompanionState } from "@/components/illustrations/CompanionCharacter";
import type { ThoughtRecordRequest } from "@/types/thoughtRecord";

const QUESTIONS: { key: keyof ThoughtRecordRequest; label: string; prompt: string }[] = [
  {
    key: "situation",
    label: "Tình huống",
    prompt: "Chuyện gì đã xảy ra khiến bạn nghĩ về điều này? Bạn đang ở đâu, làm gì, với ai?",
  },
  {
    key: "automatic_thought",
    label: "Suy nghĩ tự động",
    prompt: "Ngay lúc đó, suy nghĩ đầu tiên xuất hiện trong đầu bạn là gì?",
  },
  {
    key: "emotion",
    label: "Cảm xúc",
    prompt: "Bạn cảm thấy cảm xúc gì? Cường độ khoảng bao nhiêu phần trăm?",
  },
  {
    key: "evidence_for",
    label: "Bằng chứng ủng hộ",
    prompt: "Có điều gì cho thấy suy nghĩ đó là đúng không?",
  },
  {
    key: "evidence_against",
    label: "Bằng chứng phản bác",
    prompt: "Có điều gì cho thấy suy nghĩ đó có thể không đúng không?",
  },
];

const EMPTY: ThoughtRecordRequest = {
  situation: "",
  automatic_thought: "",
  emotion: "",
  evidence_for: "",
  evidence_against: "",
};

interface Props {
  /** Switch to the static form, carrying over whatever was captured so far. */
  onExitToStatic: (partial: Partial<ThoughtRecordRequest>) => void;
  onSaved: () => void;
}

/**
 * Scripted (non-LLM) question-by-question wizard — see phase-04's Design
 * Decisions for why this doesn't call the real chat endpoint. Nothing is
 * persisted until the final review is confirmed, so abandoning mid-flow
 * discards cleanly with no partial record (per Step 6, low-stakes form).
 */
export function ThoughtRecordGuidedFlow({ onExitToStatic, onSaved }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ThoughtRecordRequest>(EMPTY);
  const [draft, setDraft] = useState("");
  const { mutate: create, isPending } = useCreateThoughtRecord();

  const isReview = step === QUESTIONS.length;
  const current = QUESTIONS[step];

  const summary = QUESTIONS.slice(0, step).map((q) => ({ label: q.label, value: answers[q.key] }));

  const companionState: CompanionState = isReview ? "idle" : draft.trim() ? "listening" : "thinking";

  function confirmStep() {
    if (!current || !draft.trim()) return;
    setAnswers((prev) => ({ ...prev, [current.key]: draft.trim() }));
    setDraft("");
    setStep((s) => s + 1);
  }

  function editStep(index: number) {
    setDraft(answers[QUESTIONS[index].key]);
    setStep(index);
  }

  function handleSave() {
    create(answers, { onSuccess: onSaved });
  }

  return (
    <GuidedFlowShell
      title="Ghi chú suy nghĩ cùng trợ lý"
      stepIndex={step}
      totalSteps={QUESTIONS.length}
      companionState={companionState}
      summary={isReview ? [] : summary}
      onExitToStatic={() => onExitToStatic({ ...answers, ...(current ? { [current.key]: draft.trim() || undefined } : {}) })}
      footer={
        isReview ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl"
              onClick={() => setStep(QUESTIONS.length - 1)}
              disabled={isPending}
            >
              Quay lại
            </Button>
            <Button type="button" className="rounded-2xl font-bold" onClick={handleSave} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lưu ghi chú"}
            </Button>
          </>
        ) : (
          <>
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                onClick={() => editStep(step - 1)}
              >
                Quay lại
              </Button>
            )}
            <Button type="button" className="rounded-2xl font-bold" onClick={confirmStep} disabled={!draft.trim()}>
              Tiếp theo
            </Button>
          </>
        )
      }
    >
      {isReview ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground/70">Xem lại trước khi lưu</p>
          {QUESTIONS.map((q, i) => (
            <div key={q.key} className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-2xl bg-secondary/30">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground/50">{q.label}</p>
                <p className="text-sm text-foreground/80 mt-0.5">{answers[q.key]}</p>
              </div>
              <button
                type="button"
                onClick={() => editStep(i)}
                className="text-foreground/30 hover:text-primary transition-colors shrink-0"
                aria-label={`Sửa ${q.label}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground/80">{current.prompt}</p>
          <textarea
            autoFocus
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Nhập câu trả lời của bạn..."
            className="w-full resize-none px-4 py-3 rounded-2xl border border-border/40 bg-background/60 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>
      )}
    </GuidedFlowShell>
  );
}
