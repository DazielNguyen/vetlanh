import { StressChart } from "./components/StressChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Wind, BookOpen, Play, Lock, Heart, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
    title: "Dashboard",
    description: "Bảng điều khiển chăm sóc sức khỏe tâm lý cá nhân của bạn.",
};

export default function ServicesDashboard() {
    return (
        <div className="w-full h-full pb-10">

            {/* Header Greeting */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome back, Minh</h1>
                <p className="text-slate-500 mt-1">Take a deep breath. You are doing great today.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN - Main Activity */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Stress Level Chart */}
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

                    {/* Current Healing Path */}
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

                </div>

                {/* RIGHT COLUMN - Sidebar Elements */}
                <div className="space-y-8">

                    {/* AI Assistant Promo */}
                    <Card className="border-none shadow-sm rounded-3xl bg-[#FFE3E3]/40 relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 opacity-20 text-red-300">
                            <Heart className="w-40 h-40" />
                        </div>
                        <CardContent className="p-6 relative z-10">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Feeling overwhelmed?</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                Our AI companion is available 24/7 to listen and guide you through immediate grounding exercises.
                            </p>
                            <Button className="w-full bg-white hover:bg-white/90 text-slate-800 rounded-xl py-6 font-bold shadow-sm border border-slate-100">
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mr-2">chat</span> Talk to AI Assistant
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recommended Experts */}
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-xl font-bold text-primary">Recommended Experts</h2>
                            <a href="#" className="text-xs font-bold text-slate-400 hover:text-primary transition">See All</a>
                        </div>
                        <div className="space-y-3">
                            <Card className="border-none shadow-sm rounded-2xl flex items-center p-3 gap-4 hover:shadow-md transition cursor-pointer">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src="https://ui.shadcn.com/avatars/03.png" />
                                    <AvatarFallback>AN</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                        Dr. An Nguyen
                                    </h4>
                                    <p className="text-xs text-slate-500 italic">Trauma Specialist</p>
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                            </Card>

                            <Card className="border-none shadow-sm rounded-2xl flex items-center p-3 gap-4 hover:shadow-md transition cursor-pointer">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src="https://ui.shadcn.com/avatars/04.png" />
                                    <AvatarFallback>TM</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                        Prof. Tran Minh
                                    </h4>
                                    <p className="text-xs text-slate-500 italic">Mindfulness Coach</p>
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                            </Card>
                        </div>
                    </div>

                    {/* Quote of the day */}
                    <Card className="border-dashed border-2 border-slate-200 shadow-none rounded-3xl bg-transparent">
                        <CardContent className="p-8 text-center flex flex-col items-center">
                            <svg className="w-8 h-8 text-primary/30 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                            <p className="text-sm font-medium italic text-slate-500 leading-relaxed">
                                "Healing is not linear, but every step forward is a victory."
                            </p>
                        </CardContent>
                    </Card>

                </div>
            </div>

        </div>
    );
}
