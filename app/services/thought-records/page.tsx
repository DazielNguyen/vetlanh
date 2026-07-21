"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Feather, Loader2, PlusCircle, Sparkles } from "lucide-react";
import { useThoughtRecords } from "@/hooks/useThoughtRecords";
import { ThoughtRecordCard } from "./components/ThoughtRecordCard";
import { ThoughtRecordForm } from "./components/ThoughtRecordForm";
import { ThoughtRecordGuidedFlow } from "./components/ThoughtRecordGuidedFlow";
import type { ThoughtRecordRequest } from "@/types/thoughtRecord";

const PAGE_SIZE = 10;

type View =
  | { mode: "idle" }
  | { mode: "create" }
  | { mode: "guided" }
  | { mode: "edit"; id: string };

export default function ThoughtRecordsPage() {
  const [view, setView] = useState<View>({ mode: "idle" });
  const [offset, setOffset] = useState(0);
  const [guidedPrefill, setGuidedPrefill] = useState<Partial<ThoughtRecordRequest>>();

  const { data: records, isLoading } = useThoughtRecords({ limit: PAGE_SIZE, offset });

  const selectedId = view.mode === "edit" ? view.id : undefined;
  const showForm = view.mode === "create" || view.mode === "edit";

  function handleSaved() {
    setGuidedPrefill(undefined);
    setView({ mode: "idle" });
  }

  function handleExitGuidedToStatic(partial: Partial<ThoughtRecordRequest>) {
    setGuidedPrefill(partial);
    setView({ mode: "create" });
  }

  return (
    <div className="w-full space-y-7 pb-10">
      <header className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link
          href="/services/journal"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/45 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <ArrowLeft className="h-4 w-4" />
          Ghi chép
        </Link>
        <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-primary/70 uppercase">
          Đi chậm từng bước
        </p>
        <h1 className="max-w-2xl font-baloo text-3xl font-bold tracking-[-0.04em] text-foreground md:text-4xl">
          Gỡ rối một suy nghĩ
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Nhìn lại tình huống, cảm xúc và bằng chứng để tìm một góc nhìn cân bằng hơn.
        </p>
      </header>

      <nav
        aria-label="Cách ghi chép"
        className="inline-flex rounded-2xl border border-hero-wordmark/10 bg-white/45 p-1.5 dark:bg-white/5"
      >
        <Link
          href="/services/journal"
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-foreground/50 transition-colors hover:bg-white/60 hover:text-foreground dark:hover:bg-white/8"
        >
          <Feather className="h-4 w-4" />
          Ghi nhanh
        </Link>
        <span className="flex items-center gap-2 rounded-xl bg-illustration-mint/25 px-4 py-2 text-sm font-bold text-foreground shadow-[0_6px_18px_rgba(61,43,30,0.06)]">
          <Brain className="h-4 w-4 text-primary" />
          Gỡ rối suy nghĩ
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: list */}
        <div className="lg:col-span-2">
          <Card className="card-lifted rounded-[2rem] border-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-baloo text-lg font-bold text-foreground">
                  Đã gỡ rối
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setView({ mode: "create" })}
                  className="h-8 rounded-xl gap-1 text-xs font-semibold"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Bắt đầu
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
                </div>
              ) : !records || records.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Chưa có ghi chép nào. Khi cần, mình bắt đầu từ một tình huống nhỏ.
                </p>
              ) : (
                records.map((record) => (
                  <ThoughtRecordCard
                    key={record.id}
                    record={record}
                    isSelected={selectedId === record.id}
                    onSelect={() => setView({ mode: "edit", id: record.id })}
                    onEdit={() => setView({ mode: "edit", id: record.id })}
                  />
                ))
              )}

              {(offset > 0 || (records && records.length > 0)) && (
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
                    disabled={!records || records.length < PAGE_SIZE}
                    onClick={() => setOffset((p) => p + PAGE_SIZE)}
                  >
                    Tiếp
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: intro, static form, or guided flow */}
        <div className="lg:col-span-3">
          {view.mode === "idle" && (
            <Card className="card-lifted overflow-hidden rounded-[2rem] border-none bg-[#fff3db]/70 dark:bg-white/6">
              <CardContent className="flex flex-col items-start gap-5 p-7 text-left md:p-9">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-illustration-mint/30">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="mb-1 font-baloo text-xl font-bold text-foreground">
                    Bạn muốn bắt đầu thế nào?
                  </h2>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    Chọn trợ lý để được hỏi từng câu. Nếu đã quen, bạn có thể mở biểu mẫu đầy đủ.
                  </p>
                </div>
                <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                  <Button
                    onClick={() => {
                      setGuidedPrefill(undefined);
                      setView({ mode: "create" });
                    }}
                    variant="outline"
                    className="rounded-2xl px-6 font-bold"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Mở biểu mẫu
                  </Button>
                  <Button
                    onClick={() => setView({ mode: "guided" })}
                    className="rounded-2xl px-6 font-bold shadow-[0_10px_24px_rgba(169,87,63,0.14)]"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Trợ lý dẫn từng bước
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {view.mode === "guided" && (
            <ThoughtRecordGuidedFlow
              onExitToStatic={handleExitGuidedToStatic}
              onSaved={handleSaved}
            />
          )}

          {showForm && (
            <ThoughtRecordForm
              editId={view.mode === "edit" ? view.id : undefined}
              initialValues={view.mode === "create" ? guidedPrefill : undefined}
              onSaved={handleSaved}
              onCancel={() => setView({ mode: "idle" })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
