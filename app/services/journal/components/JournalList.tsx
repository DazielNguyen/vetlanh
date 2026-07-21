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
    <Card className="card-lifted border-none rounded-[2rem]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-baloo text-lg font-bold text-foreground">Gần đây</CardTitle>
          <Button size="sm" onClick={onNew} className="h-8 rounded-xl gap-1 text-xs font-semibold">
            <PlusCircle className="h-3.5 w-3.5" />
            Ghi nhanh
          </Button>
        </div>

        {/* Search */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/35" />
          <input
            type="text"
            placeholder="Tìm ghi chép..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-hero-wordmark/10 bg-[#fff9ef]/70 py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-foreground/30 transition focus:border-primary/25 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/10"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-5 w-5 animate-spin text-primary/35" />
          </div>
        ) : !entries || entries.length === 0 ? (
          <p className="py-5 text-center text-sm text-muted-foreground">
            {debouncedSearch
              ? "Không tìm thấy ghi chép phù hợp."
              : "Chưa có ghi chép nào. Một dòng cũng là khởi đầu."}
          </p>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelect(entry.id)}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${
                selectedId === entry.id
                  ? "border border-primary/20 bg-primary/10"
                  : "border border-transparent bg-[#fff9ef]/65 hover:border-hero-wordmark/8 hover:bg-[#fff3db] dark:bg-white/5 dark:hover:bg-white/10"
              }`}
            >
              <p className="truncate text-sm font-semibold text-foreground">
                {entry.title ?? "Một ghi chép nhỏ"}
              </p>
              <p className="mt-0.5 truncate text-xs text-foreground/50">{entry.content}</p>
              <p className="mt-1 text-[10px] text-foreground/30">{formatDate(entry.created_at)}</p>
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
