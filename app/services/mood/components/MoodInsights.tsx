"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, Lock } from "lucide-react";
import { useMoodInsights } from "@/hooks/useMood";
import type { ApiError } from "@/lib/api/core";

const MIN_ENTRIES_FOR_INSIGHTS = 7;

export function MoodInsights() {
    const { data: insights, isLoading, error } = useMoodInsights();

    // BE returns 400 when user has fewer than 7 entries — treat as "not enough data" state
    const apiError = error as unknown as ApiError | null;
    // Only 400 means "not enough data" per BE contract — 404 is a real routing/infra problem
    const isInsufficientData = apiError?.code === 400;

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
                ) : isInsufficientData ? (
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <p className="text-sm font-semibold text-slate-600">Chưa đủ dữ liệu</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Ghi lại ít nhất <span className="font-bold text-primary">{MIN_ENTRIES_FOR_INSIGHTS} ngày</span> tâm trạng để mở khoá nhận xét AI cá nhân hoá.
                        </p>
                    </div>
                ) : error ? (
                    <p className="text-sm text-slate-400 text-center py-6">
                        Không thể tải nhận xét. Vui lòng thử lại sau.
                    </p>
                ) : insights ? (
                    <div className="space-y-4">
                        {/* Summary */}
                        <p className="text-sm text-slate-700 leading-relaxed">{insights.summary}</p>

                        {/* Patterns */}
                        {insights.patterns.length > 0 && (
                            <div className="space-y-1.5">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Xu hướng</p>
                                <ul className="space-y-1">
                                    {insights.patterns.map((pattern) => (
                                        <li key={pattern} className="text-xs text-slate-600 flex items-start gap-2">
                                            <span className="text-primary mt-0.5">•</span>
                                            {pattern}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Suggestions */}
                        {insights.suggestions.length > 0 && (
                            <div className="space-y-1.5">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gợi ý</p>
                                <ul className="space-y-1">
                                    {insights.suggestions.map((suggestion) => (
                                        <li key={suggestion} className="text-xs text-slate-600 flex items-start gap-2">
                                            <span className="text-emerald-500 mt-0.5">✓</span>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
