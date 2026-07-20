"use client";

import { useState } from "react";
import Link from "next/link";
import { LifeBuoy, X, Brain, ShieldCheck, ClipboardList, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SAFETY_EXEMPT_FEATURES } from "@/lib/constants/progression";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  "/services/thought-records": Brain,
  "/services/safety-plan": ShieldCheck,
  "/services/assessment": ClipboardList,
};

/**
 * Persistent, always-visible entry point to the level-exempt safety features
 * (Thought Records, Safety Plan, PHQ-9). Never gated by LevelGate — this is
 * the separate ungated surface the safety exemption requires, reachable
 * regardless of the user's level or onboarding progress.
 */
export function SupportToolsEntryPoint() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Công cụ hỗ trợ"
        className="w-10 h-10 border border-primary/25 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 cursor-pointer hover:bg-primary/10 transition text-primary"
      >
        <LifeBuoy className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
          tabIndex={-1}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md p-6 space-y-4 dark:border dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                  <LifeBuoy className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white">Công cụ hỗ trợ</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-500">
              Các công cụ này luôn sẵn sàng, không phụ thuộc vào cấp độ của bạn.
            </p>

            <div className="space-y-3">
              {SAFETY_EXEMPT_FEATURES.map((feature) => {
                const Icon = FEATURE_ICONS[feature.href] ?? LifeBuoy;
                return (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/10 hover:bg-primary/5 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">
                      {feature.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <Button variant="outline" className="w-full rounded-2xl" onClick={() => setOpen(false)}>
              Đóng
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
