"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  useThoughtRecordHints,
  useThoughtRecord,
  useCreateThoughtRecord,
  useUpdateThoughtRecord,
} from "@/hooks/useThoughtRecords";
import type { ThoughtRecordRequest } from "@/types/thoughtRecord";

const FIELDS: { key: keyof ThoughtRecordRequest; label: string; description: string }[] = [
  {
    key: "situation",
    label: "1. Tình huống",
    description: "Điều gì đã xảy ra? Bạn đang ở đâu, làm gì, với ai?",
  },
  {
    key: "automatic_thought",
    label: "2. Suy nghĩ tự động",
    description: "Suy nghĩ đầu tiên xuất hiện trong đầu bạn là gì?",
  },
  {
    key: "emotion",
    label: "3. Cảm xúc",
    description: "Bạn cảm thấy gì? (VD: lo âu, buồn, tức giận) — cường độ 0–100%",
  },
  {
    key: "evidence_for",
    label: "4. Bằng chứng ủng hộ",
    description: "Điều gì cho thấy suy nghĩ đó là đúng?",
  },
  {
    key: "evidence_against",
    label: "5. Bằng chứng phản bác",
    description: "Điều gì cho thấy suy nghĩ đó có thể không đúng?",
  },
];

const EMPTY: ThoughtRecordRequest = {
  situation: "",
  automatic_thought: "",
  emotion: "",
  evidence_for: "",
  evidence_against: "",
};

interface Props {
  editId?: string;
  onSaved: () => void;
  onCancel: () => void;
}

export function ThoughtRecordForm({ editId, onSaved, onCancel }: Props) {
  const isEditing = !!editId;
  const { data: hints } = useThoughtRecordHints();
  const { data: existing, isLoading: isLoadingExisting } = useThoughtRecord(editId);
  const { mutate: create, isPending: isCreating } = useCreateThoughtRecord();
  const { mutate: update, isPending: isUpdating } = useUpdateThoughtRecord();

  const [form, setForm] = useState<ThoughtRecordRequest>(EMPTY);

  useEffect(() => {
    if (existing) {
      setForm({
        situation: existing.situation,
        automatic_thought: existing.automatic_thought,
        emotion: existing.emotion,
        evidence_for: existing.evidence_for,
        evidence_against: existing.evidence_against,
      });
    } else {
      setForm(EMPTY);
    }
  }, [existing, editId]);

  function getHint(field: keyof ThoughtRecordRequest): string {
    return Array.isArray(hints) ? (hints.find((h) => h.field === field)?.hint ?? "") : "";
  }

  function handleChange(field: keyof ThoughtRecordRequest, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const isPending = isCreating || isUpdating;
  const isComplete = FIELDS.every((f) => form[f.key].trim().length > 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isComplete || isPending) return;

    if (isEditing) {
      update({ id: editId, body: form }, { onSuccess: onSaved });
    } else {
      create(form, { onSuccess: onSaved });
    }
  }

  if (isEditing && isLoadingExisting) {
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
          {isEditing ? "Chỉnh sửa ghi chú" : "Ghi chú suy nghĩ mới"}
        </CardTitle>
        <p className="text-sm text-slate-500">
          Mô hình CBT 5 cột giúp bạn nhận ra và thách thức những suy nghĩ tiêu cực.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {FIELDS.map(({ key, label, description }) => {
            const hint = getHint(key);
            return (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">{label}</label>
                <p className="text-xs text-slate-400">{description}</p>
                {hint && (
                  <p className="text-xs text-primary/70 italic bg-primary/5 px-3 py-1.5 rounded-xl">
                    Gợi ý: {hint}
                  </p>
                )}
                <textarea
                  rows={3}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={description}
                  className="w-full resize-none px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            );
          })}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 rounded-2xl"
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!isComplete || isPending}
              className="flex-1 h-11 rounded-2xl font-bold"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                "Cập nhật"
              ) : (
                "Lưu ghi chú"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
