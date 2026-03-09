"use client";

import { Button } from "@/components/ui/button";
import { Send, Mic, Paperclip } from "lucide-react";

export function ChatInput() {
    return (
        <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Type your feelings here..."
                        className="w-full h-12 px-4 pr-24 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 w-8 h-8">
                            <Mic className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 w-8 h-8">
                            <Paperclip className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <Button size="icon" className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-sm">
                    <Send className="w-5 h-5" />
                </Button>
            </div>
            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-medium">
                Vết Lành AI is not a replacement for medical diagnosis
            </p>
        </div>
    );
}
