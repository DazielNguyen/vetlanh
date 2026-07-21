"use client";

import { useEffect, useRef, useState } from "react";
import { Send, LogOut, ShieldOff, Flag, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCommunityMessages, useSendCommunityMessage } from "@/hooks/useCommunityMessages";
import { useCommunityMatchActions } from "@/hooks/useCommunityMatch";
import type { CommunityMatch } from "@/types/community";

// Plain {content} JSX interpolation only — never a markdown/HTML renderer.
// This is the one surface with genuinely untrusted peer-generated text.
function MyBubble({ content }: { content: string }) {
  return (
    <div className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
      <div className="w-8 h-8 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0 mt-1">
        <User className="w-4 h-4 text-primary" strokeWidth={2} />
      </div>
      <div className="bg-secondary/60 text-foreground px-5 py-3.5 rounded-2xl rounded-tr-md text-sm leading-relaxed">
        {content}
      </div>
    </div>
  );
}

function PeerBubble({ content, handle }: { content: string; handle: string }) {
  return (
    <div className="flex items-start gap-3 max-w-[85%]">
      <div className="w-8 h-8 rounded-2xl bg-primary flex items-center justify-center shrink-0 mt-1">
        <span className="text-[10px] font-bold text-white">{(handle.slice(0, 2) || "?").toUpperCase()}</span>
      </div>
      <div className="bg-primary text-white px-5 py-3.5 rounded-2xl rounded-tl-md text-sm leading-relaxed">
        {content}
      </div>
    </div>
  );
}

export function CommunityConversation({ match }: { match: CommunityMatch }) {
  const { messages, isLoading } = useCommunityMessages(match.matchId);
  const sendMessage = useSendCommunityMessage(match.matchId);
  const { exitMatch, blockMatch, reportMatch } = useCommunityMatchActions();
  const [text, setText] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    sendMessage(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleReportSubmit() {
    reportMatch(match.matchId, reportReason.trim() || undefined);
    setReportOpen(false);
    setReportReason("");
  }

  return (
    <Card className="border-none card-lifted rounded-3xl overflow-hidden">
      <CardContent className="p-6 flex flex-col h-[70vh]">
        {/* Persistently visible safety controls — never nested in a menu */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">{(match.partnerHandle.slice(0, 2) || "?").toUpperCase()}</span>
            </div>
            <span className="text-sm font-bold text-foreground">{match.partnerHandle}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReportOpen((v) => !v)}
              className="text-foreground/50 hover:text-amber-500 gap-1.5 text-xs"
            >
              <Flag className="w-3.5 h-3.5" strokeWidth={2} />
              Báo cáo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => blockMatch(match.matchId)}
              className="text-foreground/50 hover:text-rose-500 gap-1.5 text-xs"
            >
              <ShieldOff className="w-3.5 h-3.5" strokeWidth={2} />
              Chặn
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exitMatch(match.matchId)}
              className="text-foreground/50 hover:text-foreground gap-1.5 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
              Thoát
            </Button>
          </div>
        </div>

        {reportOpen && (
          <div className="mb-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
            <p className="text-xs font-semibold text-foreground/70">
              Báo cáo sẽ kết thúc cuộc trò chuyện này ngay lập tức.
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Lý do (không bắt buộc)..."
              rows={2}
              className="w-full resize-none px-3 py-2 rounded-xl border border-border/40 bg-background/60 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setReportOpen(false)} className="rounded-xl text-xs">
                Huỷ
              </Button>
              <Button
                size="sm"
                onClick={handleReportSubmit}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs"
              >
                Gửi báo cáo & thoát
              </Button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {isLoading ? (
            <p className="text-xs text-foreground/40 text-center py-6">Đang tải...</p>
          ) : messages.length === 0 ? (
            <p className="text-xs text-foreground/40 text-center py-6">
              Hãy bắt đầu bằng một lời chào — {match.partnerHandle} cũng đang chờ được lắng nghe.
            </p>
          ) : (
            messages.map((m) =>
              m.isMine ? (
                <MyBubble key={m.id} content={m.content} />
              ) : (
                <PeerBubble key={m.id} content={m.content} handle={match.partnerHandle} />
              )
            )
          )}
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <div className="pt-4 border-t border-border/40 mt-4 flex items-end gap-3">
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            className="flex-1 resize-none px-4 py-3 rounded-2xl border border-border/40 bg-background/60 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-sm shrink-0 disabled:opacity-50"
          >
            <Send className="w-5 h-5" strokeWidth={2} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
