"use client";

import { Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatHeader() {
    return (
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9E9D2] flex items-center justify-center">
                    <span className="text-lg">🌿</span>
                </div>
                <div>
                    <h2 className="font-bold text-slate-800 text-lg">VẾT LÀNH AI</h2>
                    <p className="text-xs text-emerald-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                        Luôn ở đây vì bạn
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                    <Search className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                    <Info className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
