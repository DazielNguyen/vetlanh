"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateJournal, useUpdateJournal, useJournalEntry } from "@/hooks/useJournal";

interface Props {
  id?: string;
  initialPromptText?: string;
  onSaved: () => void;
  onCancel: () => void;
}

export function JournalEditor({ id, initialPromptText, onSaved, onCancel }: Props) {
  const isEdit = !!id;

  const { data: existing, isLoading: loadingExisting } = useJournalEntry(id ?? null);
  const { mutate: create, isPending: isCreating } = useCreateJournal();
  const { mutate: update, isPending: isUpdating } = useUpdateJournal(id ?? "");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(initialPromptText ?? "");

  // Seed form from existing entry in edit mode — only once
  useEffect(() => {
    if (existing && isEdit) {
      setTitle(existing.title);
      setContent(existing.content);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing]);

  const isPending = isCreating || isUpdating;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim() || isPending) return;

    if (isEdit) {
      update(
        { title: title.trim(), content: content.trim() },
        { onSuccess: onSaved }
      );
    } else {
      create(
        { title: title.trim(), content: content.trim() },
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
        <CardTitle className="text-lg font-bold text-slate-800">
          {isEdit ? "Chỉnh sửa nhật ký" : "Viết nhật ký mới"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Tiêu đề <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề nhật ký..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Nội dung <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Hôm nay bạn muốn ghi lại điều gì?"
              rows={10}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition leading-relaxed"
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
              disabled={!title.trim() || !content.trim() || isPending}
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
