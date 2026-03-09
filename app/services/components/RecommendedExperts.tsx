import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2 } from "lucide-react";

export function RecommendedExperts() {
    return (
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
    );
}
