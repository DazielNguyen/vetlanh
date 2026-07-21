"use client";

import { useState } from "react";
import { Check, Clock3, Loader2 } from "lucide-react";
import { usePhq9Reminder, usePhq9Latest } from "@/hooks/usePhq9";
import { Phq9Form } from "./components/Phq9Form";
import { Phq9Result } from "./components/Phq9Result";
import { Phq9History } from "./components/Phq9History";
import type { Phq9Result as Phq9ResultType } from "@/types/phq9";

export default function AssessmentPage() {
  const { data: reminder, isLoading: loadingReminder } = usePhq9Reminder();
  const { data: latest, isLoading: loadingLatest } = usePhq9Latest();

  // Result from a just-completed submission in this session
  const [freshResult, setFreshResult] = useState<Phq9ResultType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const isLoading = loadingReminder || loadingLatest;

  // Show form when: due, no previous assessment (latest is null/404), or user forced it
  const assessmentDue = reminder?.due ?? false;
  const hasPrevious = !!latest;
  const shouldShowForm = showForm || assessmentDue || (!hasPrevious && !loadingLatest);

  // Active result: freshly submitted → else latest from BE
  const activeResult = freshResult ?? latest;

  function handleComplete(result: Phq9ResultType) {
    setFreshResult(result);
    setShowForm(false);
  }

  function handleRetake() {
    setFreshResult(null);
    setShowForm(true);
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary/35" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-7 pb-12">
      <header className="animate-in fade-in slide-in-from-bottom-3 duration-500">
        <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-primary/75">
          NHÌN LẠI 2 TUẦN
        </p>
        <h1 className="max-w-2xl text-3xl font-baloo font-bold tracking-[-0.04em] text-foreground md:text-4xl">
          Hiểu mình trong 2 phút
        </h1>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-foreground/45">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-600" /> 9 câu chạm nhanh
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-primary" /> Tự lưu tiến độ
          </span>
        </div>
      </header>

      {/* Next due banner — only when not due and has a previous result */}
      {!assessmentDue && hasPrevious && reminder?.next_due_in_days != null && (
        <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-hero-wordmark/8 bg-white/45 px-5 py-3">
          <p className="text-xs font-medium text-foreground/55">Lần tiếp theo</p>
          <p className="text-sm font-semibold text-foreground">
            Sau {reminder.next_due_in_days} ngày
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(17rem,0.75fr)]">
        <div>
          {shouldShowForm ? (
            <Phq9Form onComplete={handleComplete} />
          ) : (
            activeResult && <Phq9Result result={activeResult} onRetake={handleRetake} />
          )}
        </div>

        <aside className="lg:sticky lg:top-24">
          <Phq9History />
        </aside>
      </div>
    </div>
  );
}
