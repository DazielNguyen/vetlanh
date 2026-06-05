"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useJournalEntry, useDeleteJournal } from "@/hooks/useJournal";
import { formatDate } from "@/lib/utils/formatDate";

interface Props {
  id: number;
  onEdit: (id: number) => void;
  onDeleted: () => void;
}

export function JournalEntry({ id, onEdit, onDeleted }: Props) {
  const { data: entry, isLoading } = useJournalEntry(id);
  const { mutate: deleteEntry, isPending: isDeleting } = useDeleteJournal();

  function handleDelete() {
    deleteEntry(id, { onSuccess: onDeleted });
  }

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm rounded-3xl">
        <CardContent className="p-6 flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        </CardContent>
      </Card>
    );
  }

  if (!entry) return null;

  return (
    <Card className="border-none shadow-sm rounded-3xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-slate-800 break-words">
              {entry.title ?? "Không có tiêu đề"}
            </CardTitle>
            <p className="text-xs text-slate-400 mt-1">
              {formatDate(entry.created_at)} · {entry.word_count} từ
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl gap-1"
              onClick={() => onEdit(id)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl gap-1 text-red-500 hover:text-red-600 hover:border-red-200"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Xóa
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
          {entry.content}
        </p>
      </CardContent>
    </Card>
  );
}
