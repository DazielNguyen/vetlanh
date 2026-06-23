"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck, Plus, X } from "lucide-react";
import { useSafetyPlan, useUpsertSafetyPlan } from "@/hooks/useSafetyPlan";
import { ErrorCard } from "@/components/ui/state";
import type { SafetyPlan, TrustedContact } from "@/types/safetyPlan";

const LIST_SECTIONS: {
  key: "warning_signs" | "coping_activities";
  label: string;
  description: string;
  placeholder: string;
}[] = [
  {
    key: "warning_signs",
    label: "Dấu hiệu cảnh báo",
    description: "Những suy nghĩ, cảm xúc, hành vi hoặc tình huống báo hiệu bạn đang gặp khó khăn.",
    placeholder: "VD: Mất ngủ nhiều đêm liên tiếp",
  },
  {
    key: "coping_activities",
    label: "Hoạt động đối phó",
    description: "Những việc bạn có thể tự làm để cảm thấy tốt hơn khi gặp khó khăn.",
    placeholder: "VD: Đi bộ 15 phút",
  },
];

const EMPTY: SafetyPlan = {
  warning_signs: [],
  coping_activities: [],
  trusted_contacts: [],
  reasons_to_live: "",
};

export default function SafetyPlanPage() {
  const { data: plan, isLoading, isError, refetch } = useSafetyPlan();
  const { mutate: upsert, isPending } = useUpsertSafetyPlan();

  const [form, setForm] = useState<SafetyPlan>(EMPTY);

  // Pre-fill form when existing plan loads
  useEffect(() => {
    if (plan) setForm(plan);
  }, [plan]);

  function addListItem(key: "warning_signs" | "coping_activities", value: string): boolean {
    const trimmed = value.trim();
    if (!trimmed) return false;
    setForm((prev) => ({ ...prev, [key]: [...prev[key], trimmed] }));
    return true;
  }

  function removeListItem(key: "warning_signs" | "coping_activities", index: number) {
    setForm((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  }

  function addContact(contact: TrustedContact): boolean {
    if (!contact.name.trim() || !contact.phone.trim()) return false;
    setForm((prev) => ({ ...prev, trusted_contacts: [...prev.trusted_contacts, contact] }));
    return true;
  }

  function removeContact(index: number) {
    setForm((prev) => ({
      ...prev,
      trusted_contacts: prev.trusted_contacts.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isPending) return;
    // Strip read-only server fields — BE's SafetyPlanUpsert schema doesn't accept id/updated_at
    const { id: _id, updated_at: _updatedAt, ...payload } = form;
    upsert(payload);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-2xl">
        <ErrorCard message="Không thể tải kế hoạch an toàn." onRetry={() => { void refetch(); }} />
      </div>
    );
  }

  return (
    <div className="w-full pb-10 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          Kế hoạch an toàn
        </h1>
        <p className="text-foreground/70 mt-1">
          Kế hoạch cá nhân giúp bạn vượt qua những thời điểm khó khăn nhất.
        </p>
      </div>

      {!plan && (
        <Card className="border-none shadow-sm rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Tạo kế hoạch an toàn đầu tiên</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                Điền vào các mục bên dưới để tạo kế hoạch cá nhân. Kế hoạch này chỉ có bạn thấy
                và có thể cập nhật bất cứ lúc nào.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
            {plan ? "Kế hoạch của tôi" : "Kế hoạch mới"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {LIST_SECTIONS.map(({ key, label, description, placeholder }) => (
              <ListSection
                key={key}
                label={label}
                description={description}
                placeholder={placeholder}
                items={form[key]}
                onAdd={(value) => addListItem(key, value)}
                onRemove={(index) => removeListItem(key, index)}
              />
            ))}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-white/80">Người tin cậy</label>
              <p className="text-xs text-slate-400 dark:text-white/40">
                Những người bạn có thể liên hệ khi cần hỗ trợ — tên và số điện thoại.
              </p>
              <ContactList contacts={form.trusted_contacts} onAdd={addContact} onRemove={removeContact} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-white/80">Lý do để sống</label>
              <p className="text-xs text-slate-400 dark:text-white/40">
                Những điều quan trọng và có ý nghĩa nhất với bạn trong cuộc sống.
              </p>
              <textarea
                rows={4}
                value={form.reasons_to_live ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, reasons_to_live: e.target.value }))}
                placeholder="VD: Gia đình, thú cưng, những ước mơ chưa thực hiện..."
                className="w-full resize-none px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-slate-700 dark:text-white placeholder-slate-300 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:focus:bg-white/10 transition"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 rounded-2xl font-bold"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : plan ? (
                "Cập nhật kế hoạch"
              ) : (
                "Lưu kế hoạch"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ListSection({
  label,
  description,
  placeholder,
  items,
  onAdd,
  onRemove,
}: {
  label: string;
  description: string;
  placeholder: string;
  items: string[];
  onAdd: (value: string) => boolean;
  onRemove: (index: number) => void;
}) {
  const [draft, setDraft] = useState("");

  function submitDraft() {
    if (onAdd(draft)) setDraft("");
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700 dark:text-white/80">{label}</label>
      <p className="text-xs text-slate-400 dark:text-white/40">{description}</p>

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-sm text-slate-700 dark:text-white/80"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-slate-400 hover:text-rose-500 dark:text-white/40 dark:hover:text-rose-400 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitDraft();
            }
          }}
          placeholder={placeholder}
          className="rounded-xl"
        />
        <Button type="button" variant="outline" size="icon" onClick={submitDraft} className="rounded-xl shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function ContactList({
  contacts,
  onAdd,
  onRemove,
}: {
  contacts: TrustedContact[];
  onAdd: (contact: TrustedContact) => boolean;
  onRemove: (index: number) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function submitDraft() {
    if (onAdd({ name, phone })) {
      setName("");
      setPhone("");
    }
  }

  return (
    <div className="space-y-2">
      {contacts.length > 0 && (
        <ul className="space-y-2">
          {contacts.map((contact, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-sm text-slate-700 dark:text-white/80"
            >
              <span>
                {contact.name} — {contact.phone}
              </span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-slate-400 hover:text-rose-500 dark:text-white/40 dark:hover:text-rose-400 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên"
          className="rounded-xl"
        />
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Số điện thoại"
          className="rounded-xl"
        />
        <Button type="button" variant="outline" size="icon" onClick={submitDraft} className="rounded-xl shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
