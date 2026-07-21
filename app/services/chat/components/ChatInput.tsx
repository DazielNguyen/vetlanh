"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, HeartHandshake, X } from "lucide-react";
import type { StreamChatState } from "@/hooks/useStreamChat";

interface Props {
  stream: StreamChatState;
  compact?: boolean;
}

export function ChatInput({ stream, compact = false }: Props) {
  const [text, setText] = useState("");
  const [expertDismissed, setExpertDismissed] = useState(false);
  const { isStreaming, suggestCheckin, depressionRisk, sendMessage } = stream;
  const showExpertBanner =
    !expertDismissed && (depressionRisk === "moderate" || depressionRisk === "severe");

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
    <div className={`${compact ? "mt-3 pt-3" : "mt-4 pt-4"} space-y-2 border-t border-border/40`}>
      {showExpertBanner && (
        <div className="flex items-center justify-between bg-[#F5C07A]/10 border border-[#F5C07A]/40 rounded-xl px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-sm text-foreground/70 font-medium">
            <HeartHandshake className="w-3.5 h-3.5 text-[#F5C07A] shrink-0" strokeWidth={2} />
            Bạn có muốn nói chuyện với chuyên gia không?
          </span>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="text-foreground/70 border-[#F5C07A]/50 hover:bg-[#F5C07A]/10 rounded-lg text-xs"
            >
              <Link href="/services/safety-plan">Xem hỗ trợ</Link>
            </Button>
            <button
              onClick={() => setExpertDismissed(true)}
              className="text-foreground/30 hover:text-foreground/60 transition"
              aria-label="Đóng"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
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
          placeholder="Bạn đang cảm thấy thế nào?"
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

      <p
        className={`${compact ? "text-[9px]" : "text-[10px]"} text-center font-medium uppercase tracking-widest text-foreground/40`}
      >
        <span className="font-baloo font-bold text-sm">Vết Lành</span> AI không thay thế chẩn đoán y
        khoa
      </p>
    </div>
  );
}
