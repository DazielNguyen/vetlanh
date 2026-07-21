"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { useBadges } from "@/hooks/useBadges";
import { useFirstRun } from "@/hooks/useFirstRun";
import { WelcomeHeader } from "./WelcomeHeader";
import { CompanionOnboarding } from "@/components/progression/CompanionOnboarding";
import { StressChart } from "./StressChart";
import { AIPromoCard } from "./AIPromoCard";
import { DailyQuote } from "./DailyQuote";
import { DailyWellnessChecklist } from "./DailyWellnessChecklist";
import { ResourcesForYou } from "./ResourcesForYou";
import { QuickReliefCard } from "./QuickReliefCard";
import { AIRecommendationCard } from "./AIRecommendationCard";
import { WeeklyOverview } from "./WeeklyOverview";
import { ProUpgradeCard } from "./ProUpgradeCard";
import { CommunitySupport } from "./CommunitySupport";
import { LevelUpCelebration } from "@/components/progression/LevelUpCelebration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardTilt, CardTiltContent } from "@/components/ui/card-tilt";
import { motion, useMotionValue, useMotionTemplate } from "motion/react";
import type { DashboardData } from "@/types/dashboard";

function SpotlightBentoCell({
    children,
    className,
    style,
}: {
    children: React.ReactNode;
    className: string;
    style?: React.CSSProperties;
}) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const bgImage = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, rgba(120, 157, 188, 0.10), transparent)`;

    return (
        <div
            className={`${className} group relative h-full`}
            style={style}
            onMouseMove={(e) => {
                const { left, top } = e.currentTarget.getBoundingClientRect();
                mouseX.set(e.clientX - left);
                mouseY.set(e.clientY - top);
            }}
        >
            <motion.div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20"
                style={{ backgroundImage: bgImage }}
            />
            {children}
        </div>
    );
}

const STRESS_LEVEL_LABEL: Record<NonNullable<DashboardData["stress_level"]>, string> = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
};

// Cards in order — index drives the animation stagger delay
const BENTO_CELLS: Array<{
    colSpan: string;
    tilt?: boolean;
    render: (dashboard: ReturnType<typeof useDashboard>["data"]) => React.ReactNode;
}> = [
    // Row 1: WelcomeHeader full-width (rendered inside the component itself as col-span-12)
    // Row 2: StressChart 8 cols + WeeklyOverview 4 cols = 12
    {
        colSpan: "col-span-12 lg:col-span-8",
        render: (dashboard) => (
            <Card className="border-none card-lifted rounded-3xl overflow-hidden h-full">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl text-primary font-bold">Mức độ căng thẳng</CardTitle>
                        <span className="text-xs text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">7 ngày qua</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-extrabold text-foreground">
                            {dashboard?.stress_level ? STRESS_LEVEL_LABEL[dashboard.stress_level] : "Thấp"}
                        </span>
                        <span className="text-sm text-emerald-500 font-medium">
                            {dashboard?.stress_trend_text ?? "~15% tuần này"}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <StressChart sparkline={dashboard?.sparkline} />
                </CardContent>
            </Card>
        ),
    },
    {
        colSpan: "col-span-12 lg:col-span-4",
        render: (dashboard) => <WeeklyOverview streakDays={dashboard?.streak_days} />,
    },
    // Row 3: AIPromoCard full width — with CardTilt 3D effect
    {
        colSpan: "col-span-12",
        tilt: true,
        render: () => <AIPromoCard />,
    },
    // Row 3b: QuickReliefCard (static top-N) 6 cols + AIRecommendationCard (personalized) 6 cols
    {
        colSpan: "col-span-12 md:col-span-6",
        render: () => <QuickReliefCard />,
    },
    {
        colSpan: "col-span-12 md:col-span-6",
        render: () => <AIRecommendationCard />,
    },
    // Row 4: DailyWellnessChecklist 7 cols + ProUpgradeCard 5 cols = 12
    {
        colSpan: "col-span-12 md:col-span-7",
        render: () => <DailyWellnessChecklist />,
    },
    {
        colSpan: "col-span-12 md:col-span-5",
        render: () => <ProUpgradeCard />,
    },
    // Row 5: 3 equal cards — DailyQuote, CommunitySupport, ResourcesForYou (4+4+4 = 12)
    {
        colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
        render: () => <DailyQuote />,
    },
    {
        colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
        render: () => <CommunitySupport />,
    },
    {
        colSpan: "col-span-12 md:col-span-12 lg:col-span-4",
        render: () => <ResourcesForYou />,
    },
];

export function DashboardContent() {
    const { data: dashboard } = useDashboard();
    const { levelUpTo, dismissLevelUp } = useBadges();
    const { isFirstRun, dismiss: dismissOnboarding } = useFirstRun();

    return (
        <div className="w-full h-full pb-10">
            <LevelUpCelebration levelUpTo={levelUpTo} dismissLevelUp={dismissLevelUp} />
            <div className="grid grid-cols-12 gap-6">
                {/* WelcomeHeader always full-width, stagger index 0 */}
                <SpotlightBentoCell
                    className="col-span-12 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-backwards"
                    style={{ "--tw-animation-delay": "0ms" } as React.CSSProperties}
                >
                    <WelcomeHeader greeting={dashboard?.greeting} />
                </SpotlightBentoCell>

                {isFirstRun && <CompanionOnboarding onDismiss={dismissOnboarding} />}

                {/* Remaining bento cells — spotlight on all, CardTilt on select cards */}
                {BENTO_CELLS.map((cell, i) => {
                    const inner = cell.render(dashboard);
                    const content = cell.tilt ? (
                        <CardTilt className="w-full" tiltMaxAngle={7} scale={1.02}>
                            <CardTiltContent className="w-full">{inner}</CardTiltContent>
                        </CardTilt>
                    ) : inner;

                    return (
                        <SpotlightBentoCell
                            key={i}
                            className={`${cell.colSpan} animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-backwards`}
                            style={{ "--tw-animation-delay": `${(i + 1) * 80}ms` } as React.CSSProperties}
                        >
                            {content}
                        </SpotlightBentoCell>
                    );
                })}
            </div>
        </div>
    );
}
