"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { MessageCircleMore, Sparkles, X } from "lucide-react";
import { SafeCompanion } from "@/components/illustrations/SafeCompanion";
import { ChatHeader } from "@/app/services/chat/components/ChatHeader";
import { ChatMessages } from "@/app/services/chat/components/ChatMessages";
import { ChatInput } from "@/app/services/chat/components/ChatInput";
import { useChatSession } from "@/hooks/useChatSession";
import { OPEN_SERVICE_CHAT_EVENT } from "@/lib/chatAssistant";

const CONTEXTS = [
  {
    match: "/services/mood",
    label: "Tâm trạng",
    prompts: [
      "Giúp tôi nhìn lại cảm xúc hôm nay",
      "Tâm trạng gần đây của tôi có điều gì đáng chú ý?",
      "Gợi ý một bước nhỏ phù hợp với năng lượng của tôi",
    ],
  },
  {
    match: "/services/assessment",
    label: "Đánh giá",
    prompts: [
      "Giúp tôi hiểu kết quả đánh giá theo cách dễ chịu hơn",
      "Tôi nên làm gì tiếp theo sau bài đánh giá?",
      "Hãy cùng tôi chọn một bước nhỏ hôm nay",
    ],
  },
  {
    match: "/services/exercises",
    label: "Bài tập",
    prompts: [
      "Dựa vào cảm xúc hiện tại, tôi nên thử bài nào?",
      "Tôi chỉ có vài phút để dịu lại",
      "Hướng dẫn tôi bắt đầu một bài thở ngắn",
    ],
  },
  {
    match: "/services/journal",
    label: "Ghi chép",
    prompts: [
      "Giúp tôi bắt đầu viết từ cảm xúc hiện tại",
      "Hỏi tôi một câu để nhìn lại hôm nay",
      "Tôi có một suy nghĩ khó gọi thành lời",
    ],
  },
  {
    match: "/services/thought-records",
    label: "Gỡ rối suy nghĩ",
    prompts: [
      "Cùng tôi gỡ rối suy nghĩ này từng bước",
      "Giúp tôi tìm một góc nhìn cân bằng hơn",
      "Tôi chưa biết nên bắt đầu từ tình huống hay cảm xúc",
    ],
  },
  {
    match: "/services/sounds",
    label: "Âm thanh",
    prompts: [
      "Tôi nên nghe gì để thư giãn lúc này?",
      "Giúp tôi chọn âm thanh trước khi ngủ",
      "Tôi cần một khoảng nghỉ thật ngắn",
    ],
  },
  {
    match: "/services/safety-plan",
    label: "An toàn",
    prompts: [
      "Ở lại và giúp tôi đi qua lúc này",
      "Cùng tôi tìm một người có thể liên hệ",
      "Giúp tôi chọn một bước an toàn ngay bây giờ",
    ],
  },
] as const;

const DEFAULT_CONTEXT = {
  label: "Trang dịch vụ",
  prompts: [
    "Lắng nghe điều đang làm tôi bận lòng",
    "Giúp tôi gọi tên cảm xúc hiện tại",
    "Gợi ý một việc nhỏ tôi có thể làm ngay",
  ],
};

function FloatingChatPanel({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { conversationId, setConversationId, sendMessage, stream, companionState } =
    useChatSession();
  const context = useMemo(
    () => CONTEXTS.find((item) => pathname.startsWith(item.match)) ?? DEFAULT_CONTEXT,
    [pathname]
  );

  useEffect(() => {
    function openAssistant(event: Event) {
      setOpen(true);
      const prompt = (event as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (prompt) void sendMessage(prompt);
    }
    window.addEventListener(OPEN_SERVICE_CHAT_EVENT, openAssistant);
    return () => window.removeEventListener(OPEN_SERVICE_CHAT_EVENT, openAssistant);
  }, [sendMessage]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Đóng trợ lý"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-hero-wordmark/15 backdrop-blur-[2px] sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              aria-label="Trợ lý Vết Lành"
              className="fixed inset-x-3 bottom-3 z-50 flex h-[min(82dvh,46rem)] flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-[#fffaf1]/96 p-4 shadow-[0_28px_80px_rgba(61,43,30,0.24)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#111713]/96 sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[min(74dvh,43rem)] sm:w-[27rem]"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <div className="mb-2 flex items-center justify-between gap-3 px-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-illustration-mint/20 px-2.5 py-1 text-[11px] font-semibold text-foreground/60">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Đang đồng hành tại {context.label}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-hero-wordmark/7 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  aria-label="Thu nhỏ trợ lý"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ChatHeader
                conversationId={conversationId}
                onConversationChange={setConversationId}
                companionState={companionState}
                compact
              />
              <ChatMessages
                conversationId={conversationId}
                stream={stream}
                onPromptSelect={sendMessage}
                contextPrompts={[...context.prompts]}
                compact
              />
              <ChatInput stream={stream} compact />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Thu nhỏ Vết Lành AI" : "Mở Vết Lành AI"}
        aria-expanded={open}
        className="group fixed bottom-5 right-5 z-50 flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border border-white/80 bg-[#fff3db] shadow-[0_18px_44px_rgba(94,61,40,0.24)] transition-shadow hover:shadow-[0_22px_52px_rgba(94,61,40,0.3)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 dark:border-white/10 dark:bg-[#17221c] sm:bottom-6 sm:right-6"
        whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.03 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="absolute inset-[-0.35rem] -z-10 rounded-full border border-primary/15 opacity-0 transition-opacity group-hover:opacity-100" />
        {!open && !prefersReducedMotion && (
          <span className="absolute inset-[-0.45rem] -z-10 animate-ping rounded-full border border-illustration-coral/25 [animation-duration:2.8s]" />
        )}
        {open ? (
          <X className="h-6 w-6 text-hero-wordmark dark:text-white" />
        ) : (
          <>
            <SafeCompanion state={companionState} className="h-14 w-14" />
            <MessageCircleMore className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-full bg-primary p-1 text-white shadow-sm" />
            <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-[#fff3db] bg-emerald-500 dark:border-[#17221c]" />
          </>
        )}
      </motion.button>
    </>
  );
}

export function ServiceChatAssistant() {
  const pathname = usePathname();
  if (pathname.startsWith("/services/chat")) return null;
  return <FloatingChatPanel pathname={pathname} />;
}
