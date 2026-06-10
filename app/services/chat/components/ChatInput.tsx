"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
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
    <div className="pt-4 border-t border-border/40 mt-4 space-y-2">
      {suggestCheckin && (
        <div className="flex items-center justify-between bg-secondary/40 border border-secondary rounded-xl px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-sm text-foreground/70 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2} />
            AI gợi ý bạn nên check-in tâm trạng hôm nay
          </span>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="text-primary border-primary/30 hover:bg-primary/10 rounded-lg text-xs shrink-0 ml-3"
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
          className="flex-1 resize-none px-4 py-3 rounded-2xl border border-border/40 bg-background/60 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: "48px", maxHeight: "120px" }}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={isStreaming || !text.trim()}
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-sm shrink-0 disabled:opacity-50"
        >
          <Send className="w-5 h-5" strokeWidth={2} />
        </Button>
      </div>

      <p className="text-[10px] text-foreground/40 text-center uppercase tracking-widest font-medium">
        <span className="font-dancing font-bold text-sm">Vết Lành</span> AI không thay thế chẩn đoán y khoa
      </p>
    </div>
  );
}
