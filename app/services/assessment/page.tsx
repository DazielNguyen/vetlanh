"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="w-full pb-10 space-y-8">
      <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          Đánh giá sức khỏe tâm lý
        </h1>
        <p className="text-muted-foreground mt-1">
          Bảng câu hỏi PHQ-9 giúp theo dõi mức độ trầm cảm theo thời gian.
        </p>
      </div>

      {/* Next due banner — only when not due and has a previous result */}
      {!assessmentDue && hasPrevious && reminder?.next_due_in_days != null && (
        <div className="w-full bg-primary/5 border border-glass-border rounded-2xl px-5 py-4">
          <p className="text-sm font-semibold text-foreground">Đánh giá tiếp theo</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Còn{" "}
            <span className="font-semibold">{reminder.next_due_in_days} ngày</span>
            {" "}nữa đến lần kiểm tra tiếp theo.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {shouldShowForm ? (
            <Phq9Form onComplete={handleComplete} />
          ) : (
            activeResult && <Phq9Result result={activeResult} onRetake={handleRetake} />
          )}
        </div>

        <div>
          <Phq9History />
        </div>
      </div>
    </div>
  );
}
