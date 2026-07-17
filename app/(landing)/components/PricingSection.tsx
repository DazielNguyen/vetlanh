"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import { EASING } from "@/lib/motion";
import { PACKAGES, PRO_FEATURES, DEFAULT_PACKAGE_KEY, getPackage } from "@/lib/constants/packages";

const FREE_FEATURES = [
  "Trò chuyện với Trợ lý AI (giới hạn)",
  "Tham gia cộng đồng ẩn danh",
  "Thư viện bài tập cơ bản",
];


export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const [selectedKey, setSelectedKey] = useState(DEFAULT_PACKAGE_KEY);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedPkg = getPackage(selectedKey);

  const initial = prefersReduced ? {} : { y: 30, opacity: 0 };
  const animate = prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };
  const transition = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };

  return (
    <section id="bang-gia" className="relative py-32 overflow-hidden bg-linear-to-b from-background via-hero-sky-start/50 to-background" ref={ref}>
      <div className="relative mx-auto max-w-300 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={initial}
          animate={animate}
          transition={transition()}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-hero-wordmark mb-4">Lựa chọn gói phù hợp với bạn</h2>
          <p className="mt-4 text-hero-wordmark/70 max-w-2xl mx-auto text-lg">
            Bắt đầu miễn phí, nâng cấp khi sẵn sàng để mở khoá toàn bộ hành trình.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 items-start">
          {/* Free card */}
          <motion.div
            className="card-glass-warm flex flex-col rounded-[32px] p-8 shadow-xl hover:bg-white/50 transition-all"
            initial={initial}
            animate={animate}
            transition={transition(0.1)}
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold text-hero-wordmark">Dành cho Cá nhân</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-hero-wordmark">Miễn phí</span>
              </div>
              <p className="mt-2 text-sm text-hero-wordmark/65">Bước đầu tìm lại sự cân bằng.</p>
            </div>
            <ul className="mb-8 flex-1 space-y-4 text-sm text-hero-wordmark/80">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-hero-wordmark/10 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-hero-wordmark" strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" asChild className="w-full rounded-full border-2 border-hero-wordmark/25 py-6 text-base font-bold text-hero-wordmark bg-transparent hover:bg-hero-wordmark/10 transition-all">
              <Link href="/register">Bắt đầu hành trình</Link>
            </Button>
          </motion.div>

          {/* Pro card */}
          <motion.div
            className="relative flex flex-col rounded-[32px] border-2 border-hero-wordmark/25 bg-white/70 backdrop-blur-md p-8 shadow-2xl"
            initial={initial}
            animate={animate}
            transition={transition(0.2)}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-hero-wordmark text-white px-4 py-1 text-xs font-bold shadow-sm whitespace-nowrap">
              PRO - MỞ KHOÁ TẤT CẢ
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-hero-wordmark">Gói Pro</h3>
              <p className="mt-2 text-sm text-hero-wordmark/65">Toàn bộ tính năng, không giới hạn.</p>
            </div>

            {/* Pro features */}
            <ul className="mb-6 space-y-3 text-sm text-hero-wordmark/80">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-hero-wordmark/10 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-hero-wordmark" strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            {/* Package selector */}
            <p className="text-xs font-bold text-hero-wordmark/60 uppercase tracking-widest mb-3">Chọn thời hạn</p>
            <div className="space-y-2 mb-6">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.key}
                  type="button"
                  onClick={() => setSelectedKey(pkg.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all ${
                    selectedKey === pkg.key
                      ? "border-hero-wordmark/40 bg-hero-wordmark/10"
                      : "border-hero-wordmark/12 hover:border-hero-wordmark/25 bg-white/40 hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-hero-wordmark text-sm">{pkg.label}</span>
                    {pkg.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 bg-hero-wordmark text-white">
                        {pkg.badge.text}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="font-bold text-hero-wordmark text-sm">{pkg.price}</span>
                    {pkg.perMonth && (
                      <span className="block text-[11px] text-hero-wordmark/55">{pkg.perMonth}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={() => setDialogOpen(true)}
              className="w-full rounded-full bg-hero-wordmark hover:bg-hero-wordmark/90 py-6 text-base font-bold text-white shadow-lg transition-all"
            >
              Nâng cấp Pro ngay
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">
              Xác nhận nâng cấp Pro
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-1">
              Bạn đang chọn gói{" "}
              <span className="font-bold text-slate-700">{selectedPkg.label}</span>
              {" "}với giá{" "}
              <span className="font-bold text-[#6D8A96] truncate">{selectedPkg.price}</span>
              {selectedPkg.perMonth && (
                <span className="text-slate-400"> ({selectedPkg.perMonth})</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Bạn sẽ nhận được:</p>
            <ul className="space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Button
              asChild
              className="w-full rounded-full bg-[#6D8A96] hover:bg-[#5A737D] text-white font-bold py-5"
            >
              <Link href={`/register?package=${selectedPkg.key}`}>
                Tiếp tục đăng ký
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="w-full rounded-full text-slate-500 hover:text-slate-700 font-medium"
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
