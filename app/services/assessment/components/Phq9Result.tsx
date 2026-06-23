"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { useUpdateGoals } from "@/hooks/useUser";
import type { Phq9Result as Phq9ResultType } from "@/types/phq9";
import { SEVERITY_CONFIG, SEVERITY_LABELS } from "./phq9SeverityConfig";

interface Props {
  result: Phq9ResultType;
  onRetake: () => void;
}

export function Phq9Result({ result, onRetake }: Props) {
  const { mutate: updateGoals, isPending, isSuccess } = useUpdateGoals();
  const config = SEVERITY_CONFIG[result.severity] ?? SEVERITY_CONFIG["Moderate"];
  const hasGoals = result.suggested_goals.length > 0;

  function handleApplyGoals() {
    if (isPending) return;
    updateGoals({ goals: result.suggested_goals });
  }

  return (
    <div className="space-y-6">
      {/* Score card */}
      <Card className={`border rounded-3xl ${config.bg}`}>
        <CardHeader>
          <CardTitle className={`text-lg font-bold ${config.color}`}>
            Kết quả đánh giá PHQ-9
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-3">
            <span className={`text-6xl font-extrabold ${config.color}`}>{result.score}</span>
            <span className={`text-xl font-semibold mb-1 ${config.color}`}>
              / 27 — {SEVERITY_LABELS[result.severity] ?? result.severity}
            </span>
          </div>
          <p className={`text-sm font-medium ${config.color}`}>{config.description}</p>
        </CardContent>
      </Card>

      {/* Suggested goals */}
      {hasGoals && (
        <Card className="border-none shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
              Mục tiêu gợi ý cho bạn
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-white/50">
              Dựa trên kết quả, hệ thống gợi ý những mục tiêu sau:
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {result.suggested_goals.map((goal) => (
                <li key={goal} className="flex items-center gap-2 text-sm text-slate-700 dark:text-white/80">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  {goal}
                </li>
              ))}
            </ul>
            <Button
              onClick={handleApplyGoals}
              disabled={isPending || isSuccess}
              className="w-full h-10 rounded-2xl font-bold"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Đã áp dụng mục tiêu
                </span>
              ) : (
                "Áp dụng mục tiêu này"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <Button variant="outline" onClick={onRetake} className="w-full h-10 rounded-2xl">
        Làm lại bài đánh giá
      </Button>
    </div>
  );
}
