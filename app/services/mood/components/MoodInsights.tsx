"use client";

import Link from "next/link";
import { ArrowUpRight, BarChart3, CheckCircle2, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMoodInsights } from "@/hooks/useMood";
import type { InsightItem } from "@/types/mood";

const MIN_ENTRIES = 7;

function pickPrimaryInsight(insights: InsightItem[]): InsightItem | undefined {
  return (
    insights.find((item) => item.type === "factor_correlation") ??
    insights.find((item) => item.type === "day_of_week") ??
    insights[0]
  );
}

function isSafeRelativeUrl(url: string | undefined): url is string {
  return Boolean(url?.startsWith("/") && !url.startsWith("//"));
}

export function MoodInsights() {
  const { data, isLoading, error } = useMoodInsights();

  if (isLoading) {
    return (
      <Card className="border-none bg-[#f3f6f2] shadow-none dark:bg-white/5">
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-none bg-slate-50 shadow-none dark:bg-white/5">
        <CardContent className="p-6 text-sm leading-relaxed text-slate-500 dark:text-white/50">
          Chưa thể đọc xu hướng lúc này. Check-in của bạn vẫn đã được lưu an toàn.
        </CardContent>
      </Card>
    );
  }

  if (data?.status === "processing") {
    return (
      <Card className="border-none bg-[#f3f6f2] shadow-none dark:bg-white/5">
        <CardContent className="space-y-3 p-6" aria-live="polite">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-white/75">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Đang nhìn lại cùng bạn
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-white/45">
            Vết Lành đang đối chiếu check-in hôm nay với những ngày gần đây.
          </p>
          <Skeleton className="h-14 w-full rounded-2xl" />
        </CardContent>
      </Card>
    );
  }

  const primaryInsight = pickPrimaryInsight(data?.insights ?? []);
  const reflection = data?.reflection;
  const hasReflection = Boolean(reflection?.observation || primaryInsight?.text);

  if (!data || !hasReflection) {
    const completed = Math.min(data?.total_entries ?? 0, MIN_ENTRIES);
    const remaining = Math.max(0, MIN_ENTRIES - completed);

    return (
      <Card className="overflow-hidden border-none bg-[#f3f6f2] shadow-none dark:bg-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-white">
            <BarChart3 className="h-4 w-4 text-primary" />
            Đang hiểu bạn từng ngày
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6 pt-1">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-white/60">
            Mỗi lần check-in giúp Vết Lành nhận ra điều gì đang nâng đỡ hoặc làm bạn mệt hơn.
          </p>
          <div className="space-y-2">
            <div
              className="flex gap-1.5"
              aria-label={`${completed} trên ${MIN_ENTRIES} lần check-in`}
            >
              {Array.from({ length: MIN_ENTRIES }, (_, index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${index < completed ? "bg-primary" : "bg-slate-200 dark:bg-white/10"}`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-white/40">
              {remaining > 0
                ? `Thêm ${remaining} lần để mở phần nhìn lại theo tuần.`
                : "Đang chuẩn bị phần nhìn lại của bạn."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const observation = reflection?.observation ?? primaryInsight?.text ?? "";
  const prompt =
    data.follow_up_prompt ?? `Giúp tôi hiểu thêm về xu hướng tâm trạng này: ${observation}`;
  const fallbackChatUrl = `/services/chat?prompt=${encodeURIComponent(prompt)}`;
  const actionUrl = isSafeRelativeUrl(data.next_action?.url)
    ? data.next_action.url
    : fallbackChatUrl;
  const secondaryInsights = (data.insights ?? [])
    .filter((item) => item !== primaryInsight)
    .slice(0, 2);

  return (
    <Card className="relative overflow-hidden border-none bg-[#eef4ec] shadow-none dark:bg-emerald-950/20">
      <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/80 text-primary shadow-sm dark:bg-white/10">
              <BarChart3 className="h-4 w-4" />
            </span>
            Điều mình nhận thấy
          </CardTitle>
          <span className="text-[11px] font-medium text-slate-500 dark:text-white/40">
            {data.generated_by === "agent" ? "AI đồng hành" : `${data.total_entries} lần check-in`}
          </span>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-5 px-6 pb-6 pt-0">
        <div className="space-y-2">
          {reflection?.acknowledgement && (
            <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-white/75">
              {reflection.acknowledgement}
            </p>
          )}
          <p className="text-[15px] font-semibold leading-6 text-slate-800 text-pretty dark:text-white">
            {observation}
          </p>
          {(reflection?.evidence || primaryInsight?.delta != null) && (
            <p className="flex items-start gap-1.5 text-xs leading-relaxed text-slate-500 dark:text-white/45">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              {reflection?.evidence ??
                `${primaryInsight?.delta && primaryInsight.delta > 0 ? "+" : ""}${primaryInsight?.delta} điểm so với mức trung bình`}
            </p>
          )}
        </div>

        {secondaryInsights.length > 0 && (
          <div className="space-y-2 border-t border-slate-700/10 pt-4 dark:border-white/10">
            {secondaryInsights.map((item) => (
              <p
                key={`${item.type}-${item.text}`}
                className="text-xs leading-relaxed text-slate-600 dark:text-white/55"
              >
                {item.text}
              </p>
            ))}
          </div>
        )}

        <Link
          href={actionUrl}
          className="group flex items-center justify-between gap-3 rounded-xl bg-slate-800 px-4 py-3 text-white outline-none transition duration-200 hover:-translate-y-0.5 hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:translate-y-0 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {data.next_action?.title ?? "Cùng AI nhìn kỹ hơn"}
              </span>
              {data.next_action?.description && (
                <span className="mt-0.5 block truncate text-[11px] text-white/60 dark:text-slate-500">
                  {data.next_action.description}
                </span>
              )}
            </span>
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>

        {data.generated_by === "agent" && (
          <p className="text-[10px] leading-relaxed text-slate-500 dark:text-white/35">
            Gợi ý này nhằm hỗ trợ tự quan sát, không phải chẩn đoán y khoa.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
