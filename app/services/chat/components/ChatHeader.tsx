"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, PlusCircle, Trash2, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useConversations, useCreateConversation, useDeleteConversation, CHAT_KEYS } from "@/hooks/useChat";
import type { Conversation } from "@/types/chat";

interface Props {
  conversationId: string | undefined;
  onConversationChange: (id: string) => void;
}

export function ChatHeader({ conversationId, onConversationChange }: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: conversations } = useConversations();
  const { mutate: createConversation, isPending: isCreating } = useCreateConversation();
  const { mutate: deleteConversation } = useDeleteConversation();

  const activeTitle =
    conversations?.find((c: Conversation) => c.id === conversationId)?.title ??
    "Cuộc hội thoại mới";

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  function handleCreate() {
    createConversation(undefined, {
      onSuccess: (conv: Conversation) => {
        onConversationChange(conv.id);
        setOpen(false);
      },
    });
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    deleteConversation(id, {
      onSuccess: () => {
        if (conversationId === id) {
          // Read fresh cache after deletion — avoids stale-closure bug
          const fresh = queryClient.getQueryData<Conversation[]>(CHAT_KEYS.conversations);
          const next = fresh?.find((c) => c.id !== id);
          if (next) onConversationChange(next.id);
        }
      },
    });
  }

  return (
    <div ref={dropdownRef} className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 relative">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#C9E9D2] flex items-center justify-center">
          <span className="text-lg">🌿</span>
        </div>
        <div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 font-bold text-slate-800 text-lg hover:text-primary transition"
          >
            <span className="font-dancing font-bold text-[1.2rem] mr-1">Vết Lành</span> AI
            <ChevronDown
              className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          <p className="text-xs text-slate-500 truncate max-w-50">{activeTitle}</p>
        </div>
      </div>

      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
        <Info className="w-5 h-5" />
      </Button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-lg border border-slate-100 z-50 overflow-hidden">
          <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
            {(!conversations || conversations.length === 0) && (
              <p className="text-xs text-slate-400 px-3 py-2">Chưa có cuộc hội thoại nào.</p>
            )}
            {conversations?.map((conv: Conversation) => (
              <div
                key={conv.id}
                onClick={() => {
                  onConversationChange(conv.id);
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-sm transition ${
                  conv.id === conversationId
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <span className="truncate flex-1">{conv.title}</span>
                <button
                  onClick={(e) => handleDelete(conv.id, e)}
                  className="ml-2 text-slate-300 hover:text-red-400 transition shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 p-2">
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition disabled:opacity-50"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              Cuộc hội thoại mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
