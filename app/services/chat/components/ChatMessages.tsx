"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConversationMessages } from "@/hooks/useChat";
import { useQuickPrompts } from "@/hooks/useServices";
import { formatDate } from "@/lib/utils/formatDate";
import type { StreamChatState } from "@/hooks/useStreamChat";

const FALLBACK_PROMPTS = [
  "Tôi đang cảm thấy lo lắng và không biết phải làm gì",
  "Hôm nay tôi rất buồn và trống rỗng, bạn có thể lắng nghe không?",
  "Tôi đang tức giận và cần giải tỏa",
  "Tôi bị mất ngủ, giúp tôi thư giãn trước khi ngủ",
  "Đầu óc tôi đang rất bận rộn, tôi muốn tập chánh niệm",
];

const EMOTION_ICONS: Record<string, string> = {
  sad: "😔",
  anxious: "😰",
  angry: "😤",
  tired: "😩",
  happy: "😊",
  disgusted: "😞",
};

const EMOTION_LABELS: Record<string, string> = {
  sad: "Buồn",
  anxious: "Lo lắng",
  angry: "Tức giận",
  tired: "Mệt mỏi",
  happy: "Vui vẻ",
  disgusted: "Chán nản",
};

interface Props {
  conversationId: number | undefined;
  stream: StreamChatState;
  onPromptSelect: (text: string) => void;
  contextPrompts?: string[];
  compact?: boolean;
}

function UserBubble({
  content,
  timestamp,
  emotionTag,
}: {
  content: string;
  timestamp?: string;
  emotionTag?: { emotion: string; confidence: number } | null;
}) {
  return (
    <div className="flex items-start gap-3 max-w-[85%] ml-auto flex-row-reverse">
      <div className="w-8 h-8 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0 mt-1">
        <User className="w-4 h-4 text-primary" strokeWidth={2} />
      </div>
      <div className="text-right">
        <div className="bg-secondary/60 text-foreground px-5 py-3.5 rounded-2xl rounded-tr-md text-sm leading-relaxed text-left">
          {content}
        </div>
        {emotionTag && (
          <span className="inline-flex items-center gap-1 text-[11px] text-foreground/45 mt-1">
            {EMOTION_ICONS[emotionTag.emotion] ?? "🙂"}{" "}
            {EMOTION_LABELS[emotionTag.emotion] ?? emotionTag.emotion}
          </span>
        )}
        {timestamp && (
          <span className="text-[10px] text-foreground/40 mt-1 block">{timestamp}</span>
        )}
      </div>
    </div>
  );
}

function AssistantBubble({ content, timestamp }: { content: string; timestamp?: string }) {
  return (
    <div className="flex items-start gap-3 max-w-[85%]">
      <div className="w-8 h-8 rounded-2xl bg-secondary/60 flex items-center justify-center shrink-0 mt-1">
        <Image src="/images/logo.svg" alt="Vết Lành" width={16} height={16} />
      </div>
      <div>
        <div className="bg-primary text-white px-5 py-3.5 rounded-2xl rounded-tl-md text-sm leading-relaxed">
          {content}
        </div>
        {timestamp && (
          <span className="text-[10px] text-foreground/40 mt-1 block">{timestamp}</span>
        )}
      </div>
    </div>
  );
}

export function ChatMessages({
  conversationId,
  stream,
  onPromptSelect,
  contextPrompts,
  compact = false,
}: Props) {
  const { data: serverMessages, isLoading } = useConversationMessages(conversationId);
  const { data: promptsData } = useQuickPrompts();
  const quickPrompts = (promptsData ?? []).slice(0, 5).map((p) => p.text);
  const prompts = contextPrompts?.length
    ? contextPrompts
    : quickPrompts.length > 0
      ? quickPrompts
      : FALLBACK_PROMPTS;
  const bottomRef = useRef<HTMLDivElement>(null);
  const { localMessages, streamingText, isStreaming, error } = stream;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [serverMessages, localMessages, streamingText]);

  const isConversationEmpty =
    !!conversationId &&
    !isLoading &&
    (serverMessages ?? []).length === 0 &&
    localMessages.length === 0 &&
    !isStreaming;

  // Welcome state — no conversation, OR conversation exists but has no messages yet
  if (!conversationId || isConversationEmpty) {
    return (
      <div
        className={`flex flex-1 flex-col items-center justify-center px-3 ${compact ? "gap-5 pb-3" : "gap-8 pb-6"}`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={`${compact ? "h-12 w-12" : "h-16 w-16"} flex items-center justify-center rounded-2xl bg-secondary/60`}
          >
            <Image
              src="/images/logo.svg"
              alt="Vết Lành"
              width={compact ? 26 : 32}
              height={compact ? 26 : 32}
            />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-bold text-foreground text-lg">
              Xin chào! Tôi là{" "}
              <span className="font-baloo font-bold text-primary text-xl">Vết Lành</span> AI
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-foreground/50">
              Mình đang ở đây. Bạn có thể bắt đầu bằng điều nhỏ nhất đang cảm thấy.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <p className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider text-center">
            Bắt đầu bằng...
          </p>
          {prompts.slice(0, compact ? 3 : 5).map((prompt) => (
            <button
              key={prompt}
              onClick={() => onPromptSelect(prompt)}
              className="text-sm text-left px-4 py-3 rounded-2xl border border-border/40 bg-background/60 hover:border-primary/40 hover:bg-secondary/30 text-foreground/60 hover:text-primary transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-foreground/20" strokeWidth={2} />
      </div>
    );
  }

  const serverIds = new Set((serverMessages ?? []).map((m) => m.id));
  // Local text messages may be superseded once server messages reload; cards always show
  const pendingLocal = localMessages.filter(
    (m) => m.kind === "exercise" || m.kind === "crisis" || !serverIds.has(Number(m.id))
  );

  // ID of the last user message across server + pending — emotion tag is only shown there
  const lastServerUserMsgId = [...(serverMessages ?? [])]
    .reverse()
    .find((m) => m.role === "user")?.id;
  const lastLocalUserMsg = [...pendingLocal]
    .reverse()
    .find((m) => m.kind === "text" && m.role === "user");
  const lastUserMsgId: string = lastLocalUserMsg
    ? lastLocalUserMsg.id
    : lastServerUserMsgId !== undefined
      ? String(lastServerUserMsgId)
      : "";

  return (
    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
      {(serverMessages ?? []).map((msg) =>
        msg.role === "user" ? (
          <UserBubble
            key={msg.id}
            content={msg.content}
            timestamp={formatDate(msg.created_at)}
            emotionTag={String(msg.id) === lastUserMsgId ? stream.lastEmotion : null}
          />
        ) : (
          <AssistantBubble
            key={msg.id}
            content={msg.content}
            timestamp={formatDate(msg.created_at)}
          />
        )
      )}

      {pendingLocal.map((msg) => {
        if (msg.kind === "exercise") {
          const totalSeconds = msg.card.steps.reduce(
            (sum, s) => sum + (s.duration_seconds ?? 0),
            0
          );
          const minutes = Math.ceil(totalSeconds / 60);
          return (
            <div key={msg.id} className="flex items-start gap-3 max-w-[85%]">
              <div className="w-8 h-8 shrink-0" />
              <Card className="card-lifted border-none rounded-2xl overflow-hidden flex-1">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                    Gợi ý bài tập
                  </p>
                  <h4 className="font-bold text-foreground">{msg.card.title}</h4>
                  <p className="text-xs text-foreground/50 leading-relaxed">
                    {msg.card.description}
                  </p>
                  {minutes > 0 && (
                    <p className="flex items-center gap-1 text-xs text-primary">
                      <Clock className="w-3 h-3" strokeWidth={2} />
                      {minutes} phút
                    </p>
                  )}
                  <Button
                    asChild
                    size="sm"
                    className="w-full rounded-xl bg-secondary hover:bg-secondary/80 text-foreground shadow-none font-semibold"
                  >
                    <Link href={`/services/exercises/${msg.card.id}`}>Bắt đầu bài tập</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        }
        if (msg.kind === "crisis") {
          return (
            <div key={msg.id} className="flex items-start gap-3 max-w-[85%]">
              <div className="w-8 h-8 shrink-0" />
              <Card className="card-lifted border-none rounded-2xl overflow-hidden flex-1">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-red-500/80 uppercase tracking-wide">
                    Hỗ trợ khẩn cấp
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Mình đang ở đây cùng bạn. Nếu bạn cần hỗ trợ ngay, hãy tìm đến người thân hoặc
                    chuyên gia tâm lý gần nhất.
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        }
        return msg.role === "user" ? (
          <UserBubble
            key={msg.id}
            content={msg.content}
            emotionTag={msg.id === lastUserMsgId ? stream.lastEmotion : null}
          />
        ) : (
          <AssistantBubble key={msg.id} content={msg.content} />
        );
      })}

      {/* Streaming in-progress assistant message */}
      {isStreaming && (
        <div className="flex items-start gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-2xl bg-secondary/60 flex items-center justify-center shrink-0 mt-1">
            <Image src="/images/logo.svg" alt="Vết Lành" width={16} height={16} />
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

      {error && <p className="text-xs text-red-500 text-center py-2">{error}</p>}

      <div ref={bottomRef} />
    </div>
  );
}
