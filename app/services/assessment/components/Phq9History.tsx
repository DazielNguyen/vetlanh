"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePhq9History } from "@/hooks/usePhq9";
import { ErrorCard } from "@/components/ui/state";
import { formatDate } from "@/lib/utils/formatDate";
import { SEVERITY_LABELS, SEVERITY_COLORS } from "./phq9SeverityConfig";

const PAGE_SIZE = 5;

export function Phq9History() {
  const [offset, setOffset] = useState(0);
  const { data: items, isLoading, isError, refetch } = usePhq9History({ limit: PAGE_SIZE, offset });

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm rounded-3xl">
        <CardContent className="p-6 flex items-center justify-center h-32">
          <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return <ErrorCard message="Không thể tải lịch sử đánh giá." onRetry={() => { void refetch(); }} />;
  }

  if (!items || items.length === 0) {
    return (
      <Card className="border-none shadow-sm rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800 dark:text-white">Lịch sử đánh giá</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-400 dark:text-white/40 pb-6">
          Chưa có lịch sử đánh giá nào.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm rounded-3xl">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-800 dark:text-white">Lịch sử đánh giá</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5"
          >
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-white/80">
                {formatDate(item.submitted_at)}
              </p>
              {item.score_delta !== null && (
                <p className={`text-xs font-semibold mt-0.5 ${item.score_delta < 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {item.score_delta < 0 ? `▼ ${Math.abs(item.score_delta)} điểm` : `▲ ${item.score_delta} điểm`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  SEVERITY_COLORS[item.severity] ?? "text-slate-600 bg-slate-100"
                }`}
              >
                {SEVERITY_LABELS[item.severity] ?? item.severity}
              </span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-white">{item.score}</span>
            </div>
          </div>
        ))}

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl flex-1"
            disabled={offset === 0}
            onClick={() => setOffset((p) => Math.max(0, p - PAGE_SIZE))}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl flex-1"
            disabled={items.length < PAGE_SIZE}
            onClick={() => setOffset((p) => p + PAGE_SIZE)}
          >
            Tiếp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
