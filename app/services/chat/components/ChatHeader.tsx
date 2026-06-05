"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, PlusCircle, Trash2, Loader2, Info, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useConversations, useCreateConversation, useDeleteConversation } from "@/hooks/useChat";
import { formatRelativeTime } from "@/lib/utils/formatDate";
import type { Conversation } from "@/types/chat";

interface Props {
  conversationId: number | undefined;
  onConversationChange: (id: number | undefined) => void;
}

export function ChatHeader({ conversationId, onConversationChange }: Props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState<string | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search — avoid spamming the API on every keystroke
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setDebouncedQuery(undefined);
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(trimmed), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!open) setSearchQuery("");
  }, [open]);

  const { data: conversations } = useConversations(debouncedQuery);
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
      onError: () => toast.error("Không thể tạo cuộc hội thoại mới"),
    });
  }

  function selectNextAfterDelete(deletedId: number) {
    if (conversationId === deletedId) {
      const next = conversations?.find((c: Conversation) => c.id !== deletedId);
      onConversationChange(next?.id);
    }
  }

  function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    deleteConversation(id, {
      onSuccess: () => selectNextAfterDelete(id),
      onError: (err) => {
        const code = (err as { code?: number })?.code;
        if (code === 404) {
          // Already gone — still update UI navigation
          selectNextAfterDelete(id);
          toast.error("Hội thoại không còn tồn tại");
        } else {
          toast.error("Không thể xóa cuộc hội thoại");
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
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          <p className="text-xs text-slate-500 truncate max-w-50">{activeTitle}</p>
        </div>
      </div>

      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
        <Info className="w-5 h-5" />
      </Button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-lg border border-slate-100 z-50 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-primary/40 focus-within:bg-white transition-colors">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="flex-1 bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-300 hover:text-slate-500 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Conversation list */}
          <div className="p-2 space-y-0.5 max-h-64 overflow-y-auto">
            {(!conversations || conversations.length === 0) && (
              <p className="text-xs text-slate-400 px-3 py-2">
                {debouncedQuery ? "Không tìm thấy kết quả." : "Chưa có cuộc hội thoại nào."}
              </p>
            )}
            {conversations?.map((conv: Conversation) => (
              <div
                key={conv.id}
                onClick={() => {
                  onConversationChange(conv.id);
                  setOpen(false);
                }}
                className={`flex items-start justify-between px-3 py-2.5 rounded-xl cursor-pointer transition group ${
                  conv.id === conversationId
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex-1 min-w-0 mr-2">
                  <p className={`truncate text-sm font-medium ${conv.id === conversationId ? "text-primary" : "text-slate-800"}`}>
                    {conv.title ?? "Cuộc hội thoại mới"}
                  </p>
                  {conv.last_message_preview && (
                    <p className="truncate text-xs text-slate-400 mt-0.5 leading-tight">
                      {conv.last_message_preview}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {conv.last_message_at && (
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(conv.last_message_at)}
                    </span>
                  )}
                  <button
                    onClick={(e) => handleDelete(conv.id, e)}
                    className="text-slate-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New conversation button */}
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
