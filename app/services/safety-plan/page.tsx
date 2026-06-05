"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { useSafetyPlan, useUpsertSafetyPlan } from "@/hooks/useSafetyPlan";
import type { SafetyPlan } from "@/types/safetyPlan";

const SECTIONS: { key: keyof SafetyPlan; label: string; description: string; placeholder: string }[] = [
  {
    key: "warning_signs",
    label: "Dấu hiệu cảnh báo",
    description: "Những suy nghĩ, cảm xúc, hành vi hoặc tình huống báo hiệu bạn đang gặp khó khăn.",
    placeholder: "VD: Mất ngủ nhiều đêm liên tiếp, cảm thấy vô vọng, thu mình lại...",
  },
  {
    key: "coping_activities",
    label: "Hoạt động đối phó",
    description: "Những việc bạn có thể tự làm để cảm thấy tốt hơn khi gặp khó khăn.",
    placeholder: "VD: Đi bộ 15 phút, nghe nhạc yêu thích, viết nhật ký...",
  },
  {
    key: "trusted_contacts",
    label: "Người tin cậy",
    description: "Những người bạn có thể liên hệ khi cần hỗ trợ — tên và số điện thoại.",
    placeholder: "VD: Mẹ — 0901 234 567\nBạn thân Minh — 0912 345 678",
  },
  {
    key: "reasons_to_live",
    label: "Lý do để sống",
    description: "Những điều quan trọng và có ý nghĩa nhất với bạn trong cuộc sống.",
    placeholder: "VD: Gia đình, thú cưng, những ước mơ chưa thực hiện...",
  },
];

const EMPTY: SafetyPlan = {
  warning_signs: "",
  coping_activities: "",
  trusted_contacts: "",
  reasons_to_live: "",
};

export default function SafetyPlanPage() {
  const { data: plan, isLoading } = useSafetyPlan();
  const { mutate: upsert, isPending } = useUpsertSafetyPlan();

  const [form, setForm] = useState<SafetyPlan>(EMPTY);

  // Pre-fill form when existing plan loads
  useEffect(() => {
    if (plan) setForm(plan);
  }, [plan]);

  function handleChange(key: keyof SafetyPlan, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isPending) return;
    upsert(form);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="w-full pb-10 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Kế hoạch an toàn
        </h1>
        <p className="text-slate-500 mt-1">
          Kế hoạch cá nhân giúp bạn vượt qua những thời điểm khó khăn nhất.
        </p>
      </div>

      {!plan && (
        <Card className="border-none shadow-sm rounded-3xl bg-emerald-50 border-emerald-100">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800 mb-1">Tạo kế hoạch an toàn đầu tiên</p>
              <p className="text-sm text-emerald-700">
                Điền vào các mục bên dưới để tạo kế hoạch cá nhân. Kế hoạch này chỉ có bạn thấy
                và có thể cập nhật bất cứ lúc nào.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800">
            {plan ? "Kế hoạch của tôi" : "Kế hoạch mới"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {SECTIONS.map(({ key, label, description, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">{label}</label>
                <p className="text-xs text-slate-400">{description}</p>
                <textarea
                  rows={4}
                  value={form[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full resize-none px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            ))}

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
