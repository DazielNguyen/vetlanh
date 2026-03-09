import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Brain, AlertTriangle } from "lucide-react";

export function LiveInsights() {
    return (
        <div className="hidden xl:flex flex-col w-72 shrink-0 space-y-6">
            {/* Live Insights Header */}
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span>📊</span> Live Insights
            </div>

            {/* Mood Pattern */}
            <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 text-sm">Mood Pattern</h3>
                        <span className="text-primary text-xs">📈</span>
                    </div>
                    <div className="flex items-end gap-1.5 h-16">
                        {[40, 60, 35, 70, 50, 80, 45].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-sm bg-primary/20"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                        Your mood has dipped by 15% today. Take a deep breath.
                    </p>
                </CardContent>
            </Card>

            {/* Recommended Exercises */}
            <div className="space-y-3">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recommended Exercises</h3>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-slate-50">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Wind className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">4-7-8 Breathing</p>
                        <p className="text-[10px] text-slate-400">3 mins • Stress Relief</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-slate-50">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Focus Meditation</p>
                        <p className="text-[10px] text-slate-400">10 mins • Better Sleep</p>
                    </div>
                </div>
            </div>

            {/* Crisis Support */}
            <Card className="border-none shadow-none rounded-2xl bg-slate-800 text-white overflow-hidden">
                <CardContent className="p-4 text-center space-y-2">
                    <p className="text-xs text-slate-300">Need immediate help?</p>
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-none flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Crisis Support
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
