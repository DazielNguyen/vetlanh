import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wind, BookOpen, Play, Lock } from "lucide-react";

export function CurrentHealingPath() {
    return (
        <div>
            <h2 className="text-xl font-bold text-primary mb-4">Current Healing Path</h2>
            <div className="space-y-4">

                {/* Task 1 - Active */}
                <Card className="border-none shadow-sm rounded-2xl flex items-center p-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <Wind className="w-6 h-6" />
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-slate-800 tracking-tight">Breathwork Mastery</h3>
                            <span className="text-xs font-bold text-primary">75% Complete</span>
                        </div>
                        <Progress value={75} className="h-2 bg-slate-100 [&>div]:bg-emerald-300" />
                        <p className="text-xs text-slate-500 mt-2">Daily breathing routine for emotional regulation.</p>
                    </div>
                    <Button size="icon" className="w-12 h-12 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 ml-4 shrink-0 shadow-none">
                        <Play className="w-5 h-5 ml-1" />
                    </Button>
                </Card>

                {/* Task 2 - Locked */}
                <Card className="border-none shadow-sm rounded-2xl flex items-center p-4 opacity-70">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="ml-4 flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-slate-800 tracking-tight">Reflective Journaling</h3>
                            <span className="text-xs font-bold text-slate-400">Next: Day 4</span>
                        </div>
                        <Progress value={0} className="h-2 bg-slate-100" />
                        <p className="text-xs text-slate-500 mt-2">Unlock patterns in your thought cycles.</p>
                    </div>
                    <Button size="icon" variant="outline" className="w-12 h-12 rounded-full border-slate-200 text-slate-400 ml-4 shrink-0 shadow-none pointer-events-none">
                        <Lock className="w-4 h-4" />
                    </Button>
                </Card>

            </div>
        </div>
    );
}
