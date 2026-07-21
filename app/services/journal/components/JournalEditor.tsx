"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import {
  useCreateJournal,
  useUpdateJournal,
  useAutoSaveJournal,
  useJournalEntry,
} from "@/hooks/useJournal";

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
      update({ title: title.trim() || null, content: content.trim() }, { onSuccess: onSaved });
    } else {
      create({ title: title.trim() || null, content: content.trim() }, { onSuccess: onSaved });
    }
  }

  if (isEdit && loadingExisting) {
    return (
      <Card className="card-lifted border-none rounded-[2rem]">
        <CardContent className="p-6 flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-primary/35" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-lifted border-none rounded-[2rem]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-baloo text-xl font-bold text-foreground">
            {isEdit ? "Chỉnh sửa ghi chép" : "Điều gì đang ở trong lòng bạn?"}
          </CardTitle>
          {isEdit && (
            <span className="flex items-center gap-1 text-xs text-foreground/40">
              {isAutoSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Đang lưu...
                </>
              ) : savedIndicator ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" /> Đã lưu
                </>
              ) : null}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/65">
              Tiêu đề <span className="font-normal text-foreground/35">(không bắt buộc)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Đặt tên cho khoảnh khắc này"
              className="w-full rounded-2xl border border-hero-wordmark/10 bg-[#fff9ef]/70 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 transition focus:border-primary/25 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/65">Ghi lại</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Hôm nay bạn muốn ghi lại điều gì?"
              rows={9}
              className="w-full resize-none rounded-2xl border border-hero-wordmark/10 bg-[#fff9ef]/70 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-foreground/30 transition focus:border-primary/25 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/10"
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
                "Lưu ghi chép"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
