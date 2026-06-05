"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConversationMessages } from "@/hooks/useChat";
import { formatDate } from "@/lib/utils/formatDate";
import type { StreamChatState } from "@/hooks/useStreamChat";

interface Props {
  conversationId: string | undefined;
  stream: StreamChatState;
}

function UserBubble({ content, timestamp }: { content: string; timestamp?: string }) {
  return (
    <div className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1 text-sm">
        👤
      </div>
      <div className="text-right">
        <div className="bg-[#C9E9D2]/60 text-slate-800 px-5 py-3.5 rounded-2xl rounded-tr-md text-sm leading-relaxed text-left">
          {content}
        </div>
        {timestamp && (
          <span className="text-[10px] text-slate-400 mt-1 block">{timestamp}</span>
        )}
      </div>
    </div>
  );
}

function AssistantBubble({ content, timestamp }: { content: string; timestamp?: string }) {
  return (
    <div className="flex items-start gap-3 max-w-[85%]">
      <div className="w-8 h-8 rounded-full bg-[#C9E9D2] flex items-center justify-center shrink-0 mt-1 text-sm">
        🌿
      </div>
      <div>
        <div className="bg-primary text-white px-5 py-3.5 rounded-2xl rounded-tl-md text-sm leading-relaxed">
          {content}
        </div>
        {timestamp && (
          <span className="text-[10px] text-slate-400 mt-1 block">{timestamp}</span>
        )}
      </div>
    </div>
  );
}

export function ChatMessages({ conversationId, stream }: Props) {
  const { data: serverMessages, isLoading } = useConversationMessages(conversationId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { localMessages, streamingText, isStreaming, error } = stream;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [serverMessages, localMessages, streamingText]);

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
        Chọn hoặc tạo cuộc hội thoại mới để bắt đầu.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
      </div>
    );
  }

  const serverIds = new Set((serverMessages ?? []).map((m) => m.id));
  // Local text messages may be superseded once server messages reload; exercise cards always show
  const pendingLocal = localMessages.filter(
    (m) => m.kind === "exercise" || !serverIds.has(m.id)
  );

  return (
    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
      {(serverMessages ?? []).map((msg) =>
        msg.role === "user" ? (
          <UserBubble key={msg.id} content={msg.content} timestamp={formatDate(msg.created_at)} />
        ) : (
          <AssistantBubble key={msg.id} content={msg.content} timestamp={formatDate(msg.created_at)} />
        )
      )}

      {pendingLocal.map((msg) => {
        if (msg.kind === "exercise") {
          return (
            <div key={msg.id} className="flex items-start gap-3 max-w-[85%]">
              <div className="w-8 h-8 shrink-0" />
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden flex-1">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Gợi ý bài tập
                  </p>
                  <h4 className="font-bold text-slate-800">{msg.card.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{msg.card.description}</p>
                  {msg.card.duration_seconds && (
                    <p className="text-xs text-emerald-600">
                      ⏱ {Math.round(msg.card.duration_seconds / 60)} phút
                    </p>
                  )}
                  <Button
                    asChild
                    size="sm"
                    className="w-full rounded-xl bg-[#C9E9D2] hover:bg-[#C9E9D2]/80 text-slate-800 shadow-none font-semibold"
                  >
                    <Link href={`/services/exercises/${msg.card.slug}`}>Bắt đầu bài tập</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        }
        return msg.role === "user" ? (
          <UserBubble key={msg.id} content={msg.content} />
        ) : (
          <AssistantBubble key={msg.id} content={msg.content} />
        );
      })}

      {/* Streaming in-progress assistant message */}
      {isStreaming && (
        <div className="flex items-start gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-[#C9E9D2] flex items-center justify-center shrink-0 mt-1 text-sm">
            🌿
          </div>
          <div>
            {streamingText ? (
              <div className="bg-primary text-white px-5 py-3.5 rounded-2xl rounded-tl-md text-sm leading-relaxed">
                {streamingText}
                <span className="inline-block w-0.5 h-4 bg-white/60 ml-0.5 animate-pulse" />
              </div>
            ) : (
              <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tl-md flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 text-center py-2">{error}</p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
