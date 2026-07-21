"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, X, Pencil } from "lucide-react";
import { useUpsertSafetyPlan } from "@/hooks/useSafetyPlan";
import { GuidedFlowShell } from "@/components/guided-flow/GuidedFlowShell";
import { CrisisResourcesButton } from "@/app/services/components/CrisisResourcesButton";
import type { CompanionState } from "@/components/illustrations/CompanionCharacter";
import type { SafetyPlan, TrustedContact } from "@/types/safetyPlan";

type ListKey = "warning_signs" | "coping_activities";

type Step =
  | { type: "list"; key: ListKey; label: string; prompt: string; placeholder: string }
  | { type: "contacts"; label: string; prompt: string }
  | { type: "text"; key: "reasons_to_live"; label: string; prompt: string };

const STEPS: Step[] = [
  {
    type: "list",
    key: "warning_signs",
    label: "Dấu hiệu cảnh báo",
    prompt: "Những suy nghĩ, cảm xúc hay tình huống nào báo hiệu bạn đang gặp khó khăn?",
    placeholder: "VD: Mất ngủ nhiều đêm liên tiếp",
  },
  {
    type: "list",
    key: "coping_activities",
    label: "Hoạt động đối phó",
    prompt: "Bạn có thể tự làm gì để cảm thấy tốt hơn khi gặp khó khăn?",
    placeholder: "VD: Đi bộ 15 phút",
  },
  {
    type: "contacts",
    label: "Người tin cậy",
    prompt: "Khi cần hỗ trợ, bạn có thể liên hệ với ai? Cho mình tên và số điện thoại nhé.",
  },
  {
    type: "text",
    key: "reasons_to_live",
    label: "Lý do để sống",
    prompt: "Những điều gì quan trọng và có ý nghĩa nhất với bạn trong cuộc sống?",
  },
];

interface Props {
  /** The plan as it exists so far (GET result, or empty defaults) — the
   * flow seeds from this so re-entering after a partial draft resumes. */
  initialPlan: SafetyPlan;
  onExitToStatic: (partial: SafetyPlan) => void;
  onSaved: () => void;
}

/**
 * Scripted (non-LLM) wizard for the Safety Plan — see phase-04's Design
 * Decisions. Unlike the Thought Record flow, each confirmed step is
 * persisted immediately via the same full-PUT `upsert` mutation the static
 * form uses (Step 6's Safety Plan exception): abandoning after any step
 * still leaves that data saved and retrievable from the static form.
 */
export function SafetyPlanGuidedFlow({ initialPlan, onExitToStatic, onSaved }: Props) {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<SafetyPlan>(initialPlan);
  const [listDraft, setListDraft] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [textDraft, setTextDraft] = useState(initialPlan.reasons_to_live ?? "");
  const [stepError, setStepError] = useState(false);
  const { mutate: upsert, mutateAsync: upsertAsync, isPending } = useUpsertSafetyPlan();

  const isReview = step === STEPS.length;
  const current = STEPS[step];

  const hasDraftInput =
    current?.type === "text" ? textDraft.trim().length > 0 : current?.type === "list" ? listDraft.trim().length > 0 : false;
  const companionState: CompanionState = isReview ? "idle" : hasDraftInput ? "listening" : "thinking";

  // Folds any not-yet-added list/contact draft text into `base` so a user
  // who typed an answer but never pressed "+" doesn't lose it by clicking
  // "Tiếp theo" or exiting to the static form (the safety-relevant gap this
  // was added to close).
  function withPendingDrafts(base: SafetyPlan): SafetyPlan {
    let next = base;
    if (current?.type === "list" && listDraft.trim()) {
      next = { ...next, [current.key]: [...next[current.key], listDraft.trim()] };
    }
    if (current?.type === "contacts" && contactName.trim() && contactPhone.trim()) {
      next = { ...next, trusted_contacts: [...next.trusted_contacts, { name: contactName.trim(), phone: contactPhone.trim() }] };
    }
    return next;
  }

  function currentSnapshot(): SafetyPlan {
    const base = current?.type === "text" ? { ...plan, reasons_to_live: textDraft.trim() || plan.reasons_to_live } : plan;
    return withPendingDrafts(base);
  }

  function addListItem() {
    if (current?.type !== "list" || !listDraft.trim()) return;
    setPlan((prev) => ({ ...prev, [current.key]: [...prev[current.key], listDraft.trim()] }));
    setListDraft("");
  }

  function removeListItem(key: ListKey, index: number) {
    setPlan((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  }

  function addContact() {
    if (!contactName.trim() || !contactPhone.trim()) return;
    setPlan((prev) => ({
      ...prev,
      trusted_contacts: [...prev.trusted_contacts, { name: contactName.trim(), phone: contactPhone.trim() }],
    }));
    setContactName("");
    setContactPhone("");
  }

  function removeContact(index: number) {
    setPlan((prev) => ({ ...prev, trusted_contacts: prev.trusted_contacts.filter((_, i) => i !== index) }));
  }

  // Awaits the PUT before advancing — only a *confirmed* backend save
  // counts as "step confirmed" (Step 6's draft guarantee). On failure the
  // hook's onError already reverts the query cache and toasts; this just
  // keeps the wizard on the current step so the user can retry instead of
  // silently sailing past a save that never happened.
  async function confirmStep() {
    const next = current?.type === "text" ? { ...plan, reasons_to_live: textDraft.trim() || null } : withPendingDrafts(plan);
    setPlan(next);
    setListDraft("");
    setContactName("");
    setContactPhone("");
    setStepError(false);
    try {
      await upsertAsync(next);
      setStep((s) => s + 1);
    } catch {
      setStepError(true);
    }
  }

  function handleFinish() {
    const finalPlan: SafetyPlan = { ...plan, reasons_to_live: textDraft.trim() || null };
    upsert(finalPlan, { onSuccess: onSaved });
  }

  const summary = STEPS.slice(0, step).map((s) => {
    if (s.type === "list") return { label: s.label, value: `${plan[s.key].length} mục` };
    if (s.type === "contacts") return { label: s.label, value: `${plan.trusted_contacts.length} người` };
    return { label: s.label, value: plan.reasons_to_live ? "Đã ghi" : "Bỏ qua" };
  });

  return (
    <GuidedFlowShell
      title="Kế hoạch an toàn cùng trợ lý"
      stepIndex={step}
      totalSteps={STEPS.length}
      companionState={companionState}
      summary={isReview ? [] : summary}
      onExitToStatic={() => onExitToStatic(currentSnapshot())}
      crisisButton={<CrisisResourcesButton />}
      footer={
        isReview ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl"
              onClick={() => {
                setStepError(false);
                setStep(STEPS.length - 1);
              }}
              disabled={isPending}
            >
              Quay lại
            </Button>
            <Button type="button" className="rounded-2xl font-bold" onClick={handleFinish} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hoàn tất"}
            </Button>
          </>
        ) : (
          <>
            {stepError && (
              <span className="text-xs text-rose-500 self-center mr-1">Lưu thất bại, vui lòng thử lại</span>
            )}
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                onClick={() => {
                  setStepError(false);
                  setStep((s) => s - 1);
                }}
                disabled={isPending}
              >
                Quay lại
              </Button>
            )}
            <Button type="button" className="rounded-2xl font-bold" onClick={confirmStep} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tiếp theo"}
            </Button>
          </>
        )
      }
    >
      {isReview ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground/70">Xem lại trước khi lưu</p>
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-2xl bg-secondary/30">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground/50">{s.label}</p>
                {s.type === "list" && (
                  <p className="text-sm text-foreground/80 mt-0.5">
                    {plan[s.key].length > 0 ? plan[s.key].join(", ") : "(chưa có)"}
                  </p>
                )}
                {s.type === "contacts" && (
                  <p className="text-sm text-foreground/80 mt-0.5">
                    {plan.trusted_contacts.length > 0
                      ? plan.trusted_contacts.map((c) => `${c.name} (${c.phone})`).join(", ")
                      : "(chưa có)"}
                  </p>
                )}
                {s.type === "text" && <p className="text-sm text-foreground/80 mt-0.5">{textDraft || "(chưa có)"}</p>}
              </div>
              <button
                type="button"
                onClick={() => {
                  setStepError(false);
                  setStep(i);
                }}
                className="text-foreground/30 hover:text-primary transition-colors shrink-0"
                aria-label={`Sửa ${s.label}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : current?.type === "list" ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground/80">{current.prompt}</p>
          {plan[current.key].length > 0 && (
            <ul className="space-y-1.5">
              {plan[current.key].map((item, index) => (
                <li key={index} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-secondary/30 text-sm text-foreground/80">
                  <span>{item}</span>
                  <button type="button" onClick={() => removeListItem(current.key, index)} className="text-foreground/30 hover:text-rose-500 shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Input
              value={listDraft}
              onChange={(e) => setListDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addListItem();
                }
              }}
              placeholder={current.placeholder}
              className="rounded-xl"
            />
            <Button type="button" variant="outline" size="icon" onClick={addListItem} className="rounded-xl shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : current?.type === "contacts" ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground/80">{current.prompt}</p>
          {plan.trusted_contacts.length > 0 && (
            <ul className="space-y-1.5">
              {plan.trusted_contacts.map((contact: TrustedContact, index) => (
                <li key={index} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-secondary/30 text-sm text-foreground/80">
                  <span>{contact.name} — {contact.phone}</span>
                  <button type="button" onClick={() => removeContact(index)} className="text-foreground/30 hover:text-rose-500 shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addContact();
                }
              }}
              placeholder="Tên"
              className="rounded-xl"
            />
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addContact();
                }
              }}
              placeholder="Số điện thoại"
              className="rounded-xl"
            />
            <Button type="button" variant="outline" size="icon" onClick={addContact} className="rounded-xl shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : current?.type === "text" ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground/80">{current.prompt}</p>
          <textarea
            autoFocus
            rows={4}
            value={textDraft}
            onChange={(e) => setTextDraft(e.target.value)}
            placeholder="VD: Gia đình, thú cưng, những ước mơ chưa thực hiện..."
            className="w-full resize-none px-4 py-3 rounded-2xl border border-border/40 bg-background/60 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>
      ) : null}
    </GuidedFlowShell>
  );
}
