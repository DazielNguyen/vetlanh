"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { useCreateJournal, useUpdateJournal, useAutoSaveJournal, useJournalEntry } from "@/hooks/useJournal";

interface Props {
  id?: number;
  initialPromptText?: string;
  onSaved: () => void;
  onCancel: () => void;
}

export function JournalEditor({ id, initialPromptText, onSaved, onCancel }: Props) {
  const isEdit = !!id;

  const { data: existing, isLoading: loadingExisting } = useJournalEntry(id ?? null);
  const { mutate: create, isPending: isCreating } = useCreateJournal();
  const { mutate: update, isPending: isUpdating } = useUpdateJournal(id ?? 0);
  const { mutate: autoSave, isPending: isAutoSaving } = useAutoSaveJournal(id ?? 0);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(initialPromptText ?? "");
  const [savedIndicator, setSavedIndicator] = useState(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seed form from existing entry in edit mode — only once
  useEffect(() => {
    if (existing && isEdit) {
      setTitle(existing.title ?? "");
      setContent(existing.content);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing]);

  // Auto-save: debounce 2s after content/title changes, edit mode only
  useEffect(() => {
    if (!isEdit || !id) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    autoSaveTimerRef.current = setTimeout(() => {
      const body: { title?: string | null; content?: string } = {};
      if (title.trim() !== (existing?.title ?? "")) body.title = title.trim() || null;
      if (content !== existing?.content) body.content = content;
      if (Object.keys(body).length === 0) return;

      autoSave(body, {
        onSuccess: () => {
          setSavedIndicator(true);
          setTimeout(() => setSavedIndicator(false), 2000);
        },
      });
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  const isPending = isCreating || isUpdating;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || isPending) return;

    if (isEdit) {
      update(
        { title: title.trim() || null, content: content.trim() },
        { onSuccess: onSaved }
      );
    } else {
      create(
        { title: title.trim() || null, content: content.trim() },
        { onSuccess: onSaved }
      );
    }
  }

  if (isEdit && loadingExisting) {
    return (
      <Card className="border-none shadow-sm rounded-3xl">
        <CardContent className="p-6 flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm rounded-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
            {isEdit ? "Chỉnh sửa nhật ký" : "Viết nhật ký mới"}
          </CardTitle>
          {isEdit && (
            <span className="text-xs text-slate-400 dark:text-white/40 flex items-center gap-1">
              {isAutoSaving ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Đang lưu...</>
              ) : savedIndicator ? (
                <><Check className="h-3 w-3 text-emerald-500" /> Đã lưu</>
              ) : null}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600 dark:text-white/60">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề nhật ký... (tuỳ chọn)"
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white dark:focus:bg-white/10 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600 dark:text-white/60">
              Nội dung <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Hôm nay bạn muốn ghi lại điều gì?"
              rows={10}
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 px-4 py-3 text-sm text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white dark:focus:bg-white/10 transition leading-relaxed"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-10 rounded-2xl"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!content.trim() || isPending}
              className="flex-1 h-10 rounded-2xl font-bold"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEdit ? (
                "Lưu thay đổi"
              ) : (
                "Lưu nhật ký"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
