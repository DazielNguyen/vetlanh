"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { StreamChatState } from "@/hooks/useStreamChat";

interface Props {
  stream: StreamChatState;
}

export function ChatInput({ stream }: Props) {
  const [text, setText] = useState("");
  const { isStreaming, suggestCheckin, sendMessage } = stream;

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    setText("");
    sendMessage(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
      {suggestCheckin && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
          <span className="text-sm text-emerald-800 font-medium">
            AI gợi ý bạn nên check-in tâm trạng hôm nay 🌿
          </span>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="text-emerald-700 border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs shrink-0 ml-3"
          >
            <Link href="/services/mood">Check-in ngay</Link>
          </Button>
        </div>
      )}

      <div className="flex items-end gap-3">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          placeholder="Nhập cảm xúc của bạn tại đây..."
          className="flex-1 resize-none px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: "48px", maxHeight: "120px" }}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={isStreaming || !text.trim()}
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-sm shrink-0 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-medium">
        <span className="font-dancing font-bold text-sm">Vết Lành</span> AI không thay thế chẩn đoán y khoa
      </p>
    </div>
  );
}
