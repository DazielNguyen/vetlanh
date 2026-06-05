"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Brain } from "lucide-react";
import { useThoughtRecords } from "@/hooks/useThoughtRecords";
import { ThoughtRecordCard } from "./components/ThoughtRecordCard";
import { ThoughtRecordForm } from "./components/ThoughtRecordForm";

const PAGE_SIZE = 10;

type View =
  | { mode: "idle" }
  | { mode: "create" }
  | { mode: "edit"; id: string };

export default function ThoughtRecordsPage() {
  const [view, setView] = useState<View>({ mode: "idle" });
  const [offset, setOffset] = useState(0);

  const { data: records, isLoading } = useThoughtRecords({ limit: PAGE_SIZE, offset });

  const selectedId = view.mode === "edit" ? view.id : undefined;
  const showForm = view.mode === "create" || view.mode === "edit";

  function handleSaved() {
    setView({ mode: "idle" });
  }

  return (
    <div className="w-full pb-10 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Ghi chú suy nghĩ
        </h1>
        <p className="text-slate-500 mt-1">
          Nhận ra và thách thức những suy nghĩ tiêu cực bằng mô hình CBT 5 cột.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: list */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm rounded-3xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-800">Ghi chú của tôi</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setView({ mode: "create" })}
                  className="h-8 rounded-xl gap-1 text-xs font-semibold"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Tạo mới
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
                </div>
              ) : !records || records.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">
                  Chưa có ghi chú nào. Hãy tạo ghi chú đầu tiên!
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

        {/* Right: intro or form */}
        <div className="lg:col-span-3">
          {!showForm && (
            <Card className="border-none shadow-sm rounded-3xl">
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 mb-1">Bắt đầu ghi chú suy nghĩ</h2>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Kỹ thuật CBT 5 cột giúp bạn phân tích tình huống, nhận ra suy nghĩ tự động
                    và tìm bằng chứng để nhìn nhận vấn đề cân bằng hơn.
                  </p>
                </div>
                <Button
                  onClick={() => setView({ mode: "create" })}
                  className="rounded-2xl px-6 font-bold"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Tạo ghi chú mới
                </Button>
              </CardContent>
            </Card>
          )}

          {showForm && (
            <ThoughtRecordForm
              editId={view.mode === "edit" ? view.id : undefined}
              onSaved={handleSaved}
              onCancel={() => setView({ mode: "idle" })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
