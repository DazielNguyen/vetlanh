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
          ? "bg-primary/10 border border-primary/20"
          : "bg-slate-50 hover:bg-slate-100"
      }`}
    >
      <p className="text-sm font-semibold text-slate-800 truncate">{record.situation}</p>
      <p className="text-xs text-slate-500 mt-0.5 truncate italic">{record.automatic_thought}</p>
      <div className="flex items-center justify-between mt-1.5">
        <p className="text-[10px] text-slate-300">{formatDate(record.created_at)}</p>
        <div className="flex items-center gap-1">
          <span
            role="button"
            onClick={handleEdit}
            className="p-1 rounded-lg text-slate-300 hover:text-primary hover:bg-primary/10 transition"
          >
            <Pencil className="w-3 h-3" />
          </span>
          <span
            role="button"
            onClick={handleDelete}
            className="p-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition"
          >
            {isDeleting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
          </span>
        </div>
      </div>
    </button>
  );
}
