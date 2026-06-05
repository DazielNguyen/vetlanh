"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { useBadges } from "@/hooks/useBadges";
import { WelcomeHeader } from "./WelcomeHeader";
import { StressChart } from "./StressChart";
import { CurrentHealingPath } from "./CurrentHealingPath";
import { AIPromoCard } from "./AIPromoCard";
import { RecommendedExperts } from "./RecommendedExperts";
import { DailyQuote } from "./DailyQuote";
import { DailyWellnessChecklist } from "./DailyWellnessChecklist";
import { ResourcesForYou } from "./ResourcesForYou";
import { WeeklyOverview } from "./WeeklyOverview";
import { CommunitySupport } from "./CommunitySupport";
import { Phq9ReminderBanner } from "./Phq9ReminderBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardContent() {
    const { data: dashboard } = useDashboard();
    useBadges();

    return (
        <div className="w-full h-full pb-10">
            <WelcomeHeader greeting={dashboard?.greeting} />

            {dashboard?.phq9_reminder?.due && <Phq9ReminderBanner />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="pb-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl text-primary font-bold">Mức độ căng thẳng</CardTitle>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-4xl font-extrabold text-slate-800">Thấp</span>
                                        <span className="text-sm text-emerald-500 font-medium">~15% tuần này</span>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">7 ngày qua</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <StressChart sparkline={dashboard?.sparkline} />
                        </CardContent>
                    </Card>

                    <DailyWellnessChecklist />
                    <CurrentHealingPath />
                    <ResourcesForYou />
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-8">
                    <AIPromoCard />
                    <WeeklyOverview streakDays={dashboard?.streak_days} />
                    <RecommendedExperts />
                    <CommunitySupport />
                    <DailyQuote />
                </div>
            </div>
        </div>
    );
}
