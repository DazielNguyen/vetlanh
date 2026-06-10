"use client";

import { Pencil, Trash2, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils/formatDate";
import { useDeleteThoughtRecord } from "@/hooks/useThoughtRecords";
import type { ThoughtRecord } from "@/types/thoughtRecord";

interface Props {
  record: ThoughtRecord;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export function ThoughtRecordCard({ record, isSelected, onSelect, onEdit }: Props) {
  const { mutate: deleteRecord, isPending: isDeleting } = useDeleteThoughtRecord();

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    deleteRecord(record.id);
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    onEdit();
  }

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${
        isSelected
          ? "bg-secondary/50 border border-primary/20"
          : "bg-background/60 hover:bg-secondary/30"
      }`}
    >
      <p className="text-sm font-semibold text-foreground truncate">{record.situation}</p>
      <p className="text-xs text-foreground/50 mt-0.5 truncate italic">{record.automatic_thought}</p>
      <div className="flex items-center justify-between mt-1.5">
        <p className="text-[10px] text-foreground/30">{record.created_at ? formatDate(record.created_at) : "Chưa có ngày"}</p>
        <div className="flex items-center gap-1">
          <span
            role="button"
            onClick={handleEdit}
            className="p-1 rounded-lg text-foreground/30 hover:text-primary hover:bg-primary/10 transition"
          >
            <Pencil className="w-3 h-3" strokeWidth={2} />
          </span>
          <span
            role="button"
            onClick={handleDelete}
            className="p-1 rounded-lg text-foreground/30 hover:text-red-400 hover:bg-red-50 transition"
          >
            {isDeleting ? (
              <Loader2 className="w-3 h-3 animate-spin" strokeWidth={2} />
            ) : (
              <Trash2 className="w-3 h-3" strokeWidth={2} />
            )}
          </span>
        </div>
      </div>
    </button>
  );
}
