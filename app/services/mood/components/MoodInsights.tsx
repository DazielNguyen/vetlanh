"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, Lock, TrendingUp, Calendar, Zap } from "lucide-react";
import { useMoodInsights } from "@/hooks/useMood";
import type { InsightItem } from "@/types/mood";

const MIN_ENTRIES = 7;

const INSIGHT_CONFIG: Record<InsightItem["type"], { icon: React.ElementType; iconColor: string; bg: string }> = {
  overall_average: { icon: TrendingUp, iconColor: "text-slate-500", bg: "bg-slate-100" },
  day_of_week:    { icon: Calendar,    iconColor: "text-amber-500",  bg: "bg-amber-50"  },
  factor_correlation: { icon: Zap,     iconColor: "text-emerald-500", bg: "bg-emerald-50" },
};

export function MoodInsights() {
  const { data, isLoading, error } = useMoodInsights();

  return (
    <Card className="border-none shadow-sm rounded-3xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Nhận xét từ AI
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-28">
            <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
          </div>

        ) : error ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Không thể tải nhận xét. Vui lòng thử lại sau.
          </p>

        ) : data && !data.has_enough_data ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Chưa đủ dữ liệu</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bạn cần thêm{" "}
              <span className="font-bold text-primary">
                {Math.max(0, MIN_ENTRIES - (data.total_entries ?? 0))} ngày
              </span>{" "}
              check-in nữa để mở khoá nhận xét AI cá nhân hoá.
            </p>
          </div>

        ) : data?.insights && data.insights.length > 0 ? (
          <div className="space-y-3">
            {data.insights.map((item, i) => {
              const cfg = INSIGHT_CONFIG[item.type];
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <cfg.icon className={`w-4 h-4 ${cfg.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-relaxed">{item.text}</p>
                    {item.delta !== null && (
                      <span
                        className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          item.delta >= 0
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-red-600 bg-red-50"
                        }`}
                      >
                        {item.delta >= 0 ? "+" : ""}{item.delta} điểm
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        ) : null}
      </CardContent>
    </Card>
  );
}
