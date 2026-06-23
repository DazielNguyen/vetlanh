"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Search } from "lucide-react";
import { useJournalList } from "@/hooks/useJournal";
import { formatDate } from "@/lib/utils/formatDate";

const PAGE_SIZE = 10;

interface Props {
  selectedId?: number;
  onSelect: (id: number) => void;
  onNew: () => void;
}

export function JournalList({ selectedId, onSelect, onNew }: Props) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [offset, setOffset] = useState(0);

  // Debounce search — 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setOffset(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const params = {
    ...(debouncedSearch && { q: debouncedSearch }),
    limit: PAGE_SIZE,
    offset,
  };

  const { data: entries, isLoading } = useJournalList(params);

  return (
    <Card className="border-none shadow-sm rounded-3xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-800 dark:text-white">Nhật ký của tôi</CardTitle>
          <Button size="sm" onClick={onNew} className="h-8 rounded-xl gap-1 text-xs font-semibold">
            <PlusCircle className="h-3.5 w-3.5" />
            Viết mới
          </Button>
        </div>

        {/* Search */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-white/40" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white dark:focus:bg-white/10 transition"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
          </div>
        ) : !entries || entries.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-white/40 py-4 text-center">
            {debouncedSearch ? "Không tìm thấy kết quả." : "Chưa có nhật ký nào. Hãy viết ngay!"}
          </p>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelect(entry.id)}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${
                selectedId === entry.id
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10"
              }`}
            >
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{entry.title ?? "Không có tiêu đề"}</p>
              <p className="text-xs text-slate-400 dark:text-white/40 mt-0.5 truncate">{entry.content}</p>
              <p className="text-[10px] text-slate-300 dark:text-white/30 mt-1">{formatDate(entry.created_at)}</p>
            </button>
          ))
        )}

        {/* Pagination */}
        {entries && entries.length > 0 && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl"
              disabled={offset === 0}
              onClick={() => setOffset((p) => Math.max(0, p - PAGE_SIZE))}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl"
              disabled={entries.length < PAGE_SIZE}
              onClick={() => setOffset((p) => p + PAGE_SIZE)}
            >
              Tiếp
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
