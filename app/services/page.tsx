import { WelcomeHeader } from "./components/WelcomeHeader";
import { StressChart } from "./components/StressChart";
import { CurrentHealingPath } from "./components/CurrentHealingPath";
import { AIPromoCard } from "./components/AIPromoCard";
import { RecommendedExperts } from "./components/RecommendedExperts";
import { DailyQuote } from "./components/DailyQuote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
    title: "Dashboard",
    description: "Bảng điều khiển chăm sóc sức khỏe tâm lý cá nhân của bạn.",
};

export default function ServicesDashboard() {
    return (
        <div className="w-full h-full pb-10">
            <WelcomeHeader name="Minh" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN - Main Activity */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Stress Level Chart Wrapper */}
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="pb-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl text-primary font-bold">Stress Level</CardTitle>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-4xl font-extrabold text-slate-800">Low</span>
                                        <span className="text-sm text-emerald-500 font-medium">~15% this week</span>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">Last 7 days</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <StressChart />
                        </CardContent>
                    </Card>

                    <CurrentHealingPath />
                </div>

                {/* RIGHT COLUMN - Sidebar Elements */}
                <div className="space-y-8">
                    <AIPromoCard />
                    <RecommendedExperts />
                    <DailyQuote />
                </div>
            </div>
        </div>
    );
}
