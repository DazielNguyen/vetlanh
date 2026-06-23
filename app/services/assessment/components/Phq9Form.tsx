"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePhq9Questions, useSubmitPhq9 } from "@/hooks/usePhq9";
import { ErrorCard, FeatureUnavailable } from "@/components/ui/state";
import type { ApiError } from "@/lib/api/core";
import type { Phq9Result } from "@/types/phq9";

const DRAFT_KEY = "phq9_draft_answers";

const ANSWER_OPTIONS = [
  { value: 0, label: "Không có" },
  { value: 1, label: "Vài ngày" },
  { value: 2, label: "Hơn nửa số ngày" },
  { value: 3, label: "Hầu hết các ngày" },
] as const;

interface Props {
  onComplete: (result: Phq9Result) => void;
}

export function Phq9Form({ onComplete }: Props) {
  const { data: questions, isLoading, isError, error, refetch } = usePhq9Questions();
  const { mutate: submit, isPending } = useSubmitPhq9();

  // Lazy init from localStorage — avoids a second effect that would
  // immediately overwrite the restored value on the first render cycle.
  const [answers, setAnswers] = useState<(number | undefined)[]>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist draft on every change
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
    }
  }, [answers]);

  function setAnswer(index: number, value: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  const answeredCount = answers.filter((a) => a !== undefined).length;
  const allAnswered = questions != null && answeredCount === questions.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allAnswered || isPending || !questions) return;
    const payload = questions.map((_, i) => answers[i] as number);
    submit(
      { answers: payload },
      {
        onSuccess: (result) => {
          localStorage.removeItem(DRAFT_KEY);
          onComplete(result);
        },
      }
    );
  }

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm rounded-3xl">
        <CardContent className="p-6 flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
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
    return <ErrorCard message="Không thể tải câu hỏi PHQ-9." onRetry={() => { void refetch(); }} />;
  }

  if (!questions || questions.length === 0) return null;

  return (
    <Card className="border-none shadow-sm rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Đánh giá PHQ-9</CardTitle>
        <p className="text-sm text-slate-500 dark:text-white/50">
          Trong 2 tuần qua, bạn có thường xuyên gặp phải những vấn đề sau không?
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((questionText, index) => (
            <div key={index} className="space-y-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-white/80">
                {index + 1}. {questionText}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ANSWER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAnswer(index, option.value)}
                    className={`py-2 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                      answers[index] === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:hover:border-white/20"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-2">
            <p className="text-xs text-slate-400 dark:text-white/40 mb-4">
              Đã trả lời: {answeredCount}/{questions.length} câu hỏi
            </p>
            <Button
              type="submit"
              disabled={!allAnswered || isPending}
              className="w-full h-11 rounded-2xl font-bold"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xem kết quả"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
