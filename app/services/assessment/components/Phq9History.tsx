"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { usePhq9History } from "@/hooks/usePhq9";
import { ErrorCard, FeatureUnavailable } from "@/components/ui/state";
import type { ApiError } from "@/lib/api/core";
import { formatDate } from "@/lib/utils/formatDate";
import { SEVERITY_LABELS, SEVERITY_COLORS } from "./phq9SeverityConfig";

const PAGE_SIZE = 5;

export function Phq9History() {
  const [offset, setOffset] = useState(0);
  const {
    data: items,
    isLoading,
    isError,
    error,
    refetch,
  } = usePhq9History({ limit: PAGE_SIZE, offset });

  if (isLoading) {
    return (
      <Card className="border-none card-lifted rounded-3xl">
        <CardContent className="p-6 flex items-center justify-center h-32">
          <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    if ((error as ApiError).code === 404) {
      return (
        <FeatureUnavailable
          message="Tính năng đang được phát triển"
          description="Lịch sử đánh giá PHQ-9 sẽ sớm có mặt. Vui lòng quay lại sau."
        />
      );
    }
    return (
      <ErrorCard
        message="Không thể tải lịch sử đánh giá."
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!items || items.length === 0) {
    return (
      <Card className="border-none card-lifted rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Xu hướng</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-400 dark:text-white/40 pb-6">
          Kết quả sẽ xuất hiện tại đây.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none card-lifted rounded-3xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">Xu hướng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className="flex h-24 items-end gap-2 rounded-2xl bg-hero-wordmark/4 px-4 pb-3 pt-5"
          aria-label="Biểu đồ điểm các lần gần đây"
        >
          {[...items].reverse().map((item) => (
            <div key={`bar-${item.id}`} className="group flex h-full flex-1 items-end">
              <div
                className="w-full rounded-t-lg bg-primary/35 transition-colors group-hover:bg-primary/55"
                style={{ height: `${Math.max(10, (item.score / 27) * 100)}%` }}
                title={`${item.score}/27`}
              />
            </div>
          ))}
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-1 py-3 border-b border-hero-wordmark/7 last:border-0"
          >
            <div>
              <p className="text-xs font-medium text-foreground/55">
                {formatDate(item.submitted_at)}
              </p>
              {item.score_delta !== null && (
                <p
                  className={`mt-1 flex items-center gap-1 text-[11px] font-semibold ${item.score_delta <= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}
                >
                  {item.score_delta <= 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <TrendingUp className="h-3 w-3" />
                  )}
                  {item.score_delta === 0 ? "Không đổi" : `${Math.abs(item.score_delta)} điểm`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`hidden text-[10px] font-semibold px-2 py-1 rounded-lg sm:inline-block ${
                  SEVERITY_COLORS[item.severity] ??
                  "text-slate-600 bg-slate-100 dark:text-white/60 dark:bg-white/10"
                }`}
              >
                {SEVERITY_LABELS[item.severity] ?? item.severity}
              </span>
              <span className="text-xl font-baloo font-bold tabular-nums text-foreground">
                {item.score}
              </span>
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
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="sr-only">Trang trước</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl flex-1"
            disabled={items.length < PAGE_SIZE}
            onClick={() => setOffset((p) => p + PAGE_SIZE)}
          >
            <span className="sr-only">Trang tiếp</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
