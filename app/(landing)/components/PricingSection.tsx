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

interface Package {
  key: string;
  label: string;
  price: string;
  perMonth?: string;
  badge?: { text: string; className: string };
}

const PACKAGES: Package[] = [
  { key: "1thang", label: "1 tháng", price: "79.000 ₫" },
  { key: "3thang", label: "3 tháng", price: "199.000 ₫", perMonth: "~66.000 ₫/tháng" },
  { key: "6thang", label: "6 tháng", price: "349.000 ₫", perMonth: "~58.000 ₫/tháng" },
  {
    key: "1nam",
    label: "1 năm",
    price: "599.000 ₫",
    perMonth: "~50.000 ₫/tháng",
    badge: { text: "KHUYÊN DÙNG", className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  },
  {
    key: "tronddoi",
    label: "Trọn đời",
    price: "999.000 ₫",
    badge: { text: "PHỔ BIẾN NHẤT", className: "bg-amber-100 text-amber-700 border border-amber-200" },
  },
];

const FREE_FEATURES = [
  "Trò chuyện với Trợ lý AI (giới hạn)",
  "Tham gia cộng đồng ẩn danh",
  "Thư viện bài tập cơ bản",
];

const PRO_FEATURES = [
  "AI chat không giới hạn",
  "Lộ trình chữa lành cá nhân hóa",
  "Thư viện bài tập đầy đủ",
  "Theo dõi cảm xúc & biểu đồ nâng cao",
  "Nhật ký & Hồ sơ tư duy",
  "Ưu tiên hỗ trợ kỹ thuật",
];


export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const [selectedKey, setSelectedKey] = useState("1nam");
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedPkg = PACKAGES.find((p) => p.key === selectedKey) ?? PACKAGES[3];

  const initial = prefersReduced ? {} : { y: 30, opacity: 0 };
  const animate = prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };
  const transition = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };

  return (
    <section id="bang-gia" className="py-32 bg-[#FAFDFB]" ref={ref}>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={initial}
          animate={animate}
          transition={transition()}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Lựa chọn gói phù hợp với bạn</h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg">
            Bắt đầu miễn phí, nâng cấp khi bạn sẵn sàng để mở khoá toàn bộ hành trình chữa lành.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 items-start">
          {/* Free card */}
          <motion.div
            className="flex flex-col rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
            initial={initial}
            animate={animate}
            transition={transition(0.1)}
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-800">Dành cho Cá nhân</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#6D8A96]">Miễn phí</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">Bước đầu tìm lại sự cân bằng.</p>
            </div>
            <ul className="mb-8 flex-1 space-y-4 text-sm text-slate-600">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" asChild className="w-full rounded-full border-2 border-slate-200 py-6 text-base font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Link href="/register">Bắt đầu hành trình</Link>
            </Button>
          </motion.div>

          {/* Pro card */}
          <motion.div
            className="relative flex flex-col rounded-[32px] border-2 border-[#6D8A96] bg-white p-8 shadow-xl"
            initial={initial}
            animate={animate}
            transition={transition(0.2)}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#6D8A96] px-4 py-1 text-xs font-bold text-white shadow-sm whitespace-nowrap">
              PRO — MỞ KHOÁ TẤT CẢ
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800">Gói Pro</h3>
              <p className="mt-2 text-sm text-slate-500">Toàn bộ tính năng, không giới hạn.</p>
            </div>

            {/* Pro features */}
            <ul className="mb-6 space-y-3 text-sm text-slate-600">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#6D8A96]/10 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-[#6D8A96]" strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            {/* Package selector */}
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Chọn thời hạn</p>
            <div className="space-y-2 mb-6">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.key}
                  type="button"
                  onClick={() => setSelectedKey(pkg.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all ${
                    selectedKey === pkg.key
                      ? "border-[#6D8A96] bg-[#6D8A96]/5"
                      : "border-slate-100 hover:border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-slate-800 text-sm">{pkg.label}</span>
                    {pkg.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${pkg.badge.className}`}>
                        {pkg.badge.text}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="font-bold text-slate-800 text-sm">{pkg.price}</span>
                    {pkg.perMonth && (
                      <span className="block text-[11px] text-slate-400">{pkg.perMonth}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={() => setDialogOpen(true)}
              className="w-full rounded-full bg-[#6D8A96] hover:bg-[#5A737D] py-6 text-base font-bold text-white shadow-lg shadow-[#6D8A96]/20 transition-all"
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
              {/* TODO: replace with checkout route when payment is implemented */}
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
