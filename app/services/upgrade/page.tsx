"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Copy, Check, CheckCircle2, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PACKAGES, getPackage, DEFAULT_PACKAGE_KEY, type Package } from "@/lib/constants/packages";
import { fetchSubscription } from "@/lib/api/services/fetchSubscription";
import type { ApiError } from "@/lib/api/core";
import { env } from "@/lib/env";

const BANK_ID = env.bankId;
const BANK_ACCOUNT = env.bankAccount;
const BANK_NAME = env.bankName;

const MAX_BILL_SIZE = 10 * 1024 * 1024; // 10 MB

type SubmitStatus = "idle" | "loading" | "success";

function buildTransferNote(pkg: Package): string {
  return `VETLANH ${pkg.key.toUpperCase()} ${pkg.amount}`;
}

function buildVietQRUrl(pkg: Package, note: string): string {
  const params = new URLSearchParams({ amount: String(pkg.amount), addInfo: note, accountName: BANK_NAME });
  return `https://img.vietqr.io/image/${BANK_ID}-${BANK_ACCOUNT}-compact2.png?${params.toString()}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCopied(true);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-[#6D8A96] hover:bg-[#6D8A96]/10 transition-colors"
      aria-label="Sao chép"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

function BankRow({ label, value, copyable = false, highlight = false }: {
  label: string;
  value: string;
  copyable?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-slate-400 shrink-0">{label}</span>
      <div className="flex items-center gap-1 min-w-0">
        <span className={cn("text-sm font-semibold truncate", highlight ? "text-[#6D8A96]" : "text-slate-700")}>
          {value}
        </span>
        {copyable && <CopyButton text={value} />}
      </div>
    </div>
  );
}

function UpgradePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState(searchParams.get("package") ?? DEFAULT_PACKAGE_KEY);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [billFile, setBillFile] = useState<File | null>(null);
  const [billPreviewUrl, setBillPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URL on change or unmount to avoid memory leaks
  useEffect(() => {
    return () => { if (billPreviewUrl) URL.revokeObjectURL(billPreviewUrl); };
  }, [billPreviewUrl]);

  const selectedPkg = getPackage(selectedKey);
  const transferNote = buildTransferNote(selectedPkg);
  const qrUrl = buildVietQRUrl(selectedPkg, transferNote);

  function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh (PNG, JPG, WEBP)");
      return;
    }
    if (file.size > MAX_BILL_SIZE) {
      toast.error("Ảnh không được vượt quá 10 MB");
      return;
    }
    setBillPreviewUrl(URL.createObjectURL(file));
    setBillFile(file);
  }

  function removeBill() {
    setBillFile(null);
    setBillPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  async function handleSubmit() {
    if (!billFile) {
      toast.error("Vui lòng tải lên ảnh bill chuyển khoản trước khi xác nhận");
      return;
    }
    setStatus("loading");
    try {
      await fetchSubscription.notifyPayment(
        { package_key: selectedPkg.key, amount: selectedPkg.amount, transfer_note: transferNote },
        billFile
      );
      setStatus("success");
    } catch (err) {
      toast.error((err as ApiError)?.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Đã nhận thông tin của bạn</h2>
        <p className="text-slate-500 max-w-sm leading-relaxed mb-2">
          Chúng tôi sẽ xác nhận giao dịch và kích hoạt gói Pro trong vòng{" "}
          <span className="font-semibold text-slate-700">24 giờ</span>.
        </p>
        <p className="text-sm text-slate-400 mb-10">
          Bạn sẽ nhận thông báo qua email khi tài khoản được nâng cấp.
        </p>
        <Button asChild className="rounded-2xl bg-[#6D8A96] hover:bg-[#5A737D] text-white font-bold px-8 py-5">
          <Link href="/services">Về trang chủ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full pb-16">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground/60 hover:bg-secondary/40 hover:text-foreground transition-colors"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Nâng cấp lên Pro</h1>
          <p className="text-sm text-foreground/70 mt-1">Chuyển khoản ngân hàng, kích hoạt trong 24 giờ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT — QR + bank details */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden self-start">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-700">Quét mã QR để chuyển khoản</h2>

            <div className="flex justify-center">
              <div className="relative w-52 h-52 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white p-2">
                <Image
                  src={qrUrl}
                  alt={`QR chuyển khoản ${selectedPkg.label}`}
                  fill
                  className="object-contain"
                  unoptimized
                  priority
                />
              </div>
            </div>

            <p className="text-center text-xs text-slate-400">
              QR chuẩn VietQR - tương thích mọi ứng dụng ngân hàng
            </p>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <BankRow label="Ngân hàng" value={BANK_ID} />
              <BankRow label="Số tài khoản" value={BANK_ACCOUNT} copyable />
              <BankRow label="Chủ tài khoản" value={BANK_NAME} />
              <BankRow label="Số tiền" value={selectedPkg.price} />
              <BankRow label="Nội dung CK" value={transferNote} copyable highlight />
            </div>
          </CardContent>
        </Card>

        {/* RIGHT — package selector + instructions + upload + CTA */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-700">Chọn gói</h2>
              <div className="space-y-2">
                {PACKAGES.map((pkg) => {
                  const isSelected = selectedKey === pkg.key;
                  return (
                    <button
                      key={pkg.key}
                      type="button"
                      onClick={() => setSelectedKey(pkg.key)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all",
                        isSelected
                          ? "border-[#6D8A96]/50 bg-[#6D8A96]/8 ring-1 ring-[#6D8A96]/30"
                          : "border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                          isSelected ? "border-[#6D8A96]" : "border-slate-300"
                        )}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#6D8A96]" />}
                        </div>
                        <span className="font-semibold text-slate-700 text-sm">{pkg.label}</span>
                        {pkg.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6D8A96]/15 text-[#6D8A96] shrink-0">
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
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-[#F0F7FA]">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-sm font-bold text-slate-600">Hướng dẫn thanh toán</h2>
              <ol className="space-y-2">
                {[
                  "Mở ứng dụng ngân hàng, chọn chuyển khoản và quét mã QR bên trái.",
                  `Kiểm tra số tiền là ${selectedPkg.price} và nội dung chuyển khoản.`,
                  "Sau khi chuyển khoản thành công, chụp màn hình xác nhận giao dịch.",
                  'Tải ảnh lên bên dưới rồi nhấn "Tôi đã chuyển tiền".',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-[#6D8A96]/20 text-[#6D8A96] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Bill upload */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">
              Ảnh bill chuyển khoản <span className="text-red-400">*</span>
            </p>

            {billPreviewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={billPreviewUrl}
                  alt="Bill chuyển khoản"
                  className="w-full max-h-72 object-contain bg-slate-50"
                />
                <button
                  type="button"
                  onClick={removeBill}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
                  aria-label="Xóa ảnh"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-slate-500 truncate">{billFile?.name}</span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "w-full rounded-2xl border-2 border-dashed py-10 flex flex-col items-center gap-3 transition-colors",
                  isDragging
                    ? "border-[#6D8A96] bg-[#6D8A96]/5"
                    : "border-slate-200 bg-slate-50 hover:border-[#6D8A96]/50 hover:bg-[#6D8A96]/5"
                )}
              >
                <UploadCloud className={cn("w-8 h-8 transition-colors", isDragging ? "text-[#6D8A96]" : "text-slate-400")} />
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">Tải lên ảnh bill</p>
                  <p className="text-xs text-slate-400 mt-0.5">Kéo thả hoặc nhấn để chọn - PNG, JPG, tối đa 10 MB</p>
                </div>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!billFile || status === "loading"}
            className="w-full rounded-2xl bg-[#6D8A96] hover:bg-[#5A737D] active:scale-[0.98] text-white font-bold py-6 text-base shadow-sm transition-all disabled:opacity-50"
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang gửi thông báo...
              </span>
            ) : (
              "Tôi đã chuyển tiền"
            )}
          </Button>

          <p className="text-center text-xs text-slate-400">
            Gặp vấn đề? Liên hệ hỗ trợ tại{" "}
            <a href="mailto:support@vetlanh.vn" className="text-[#6D8A96] hover:underline">
              support@vetlanh.vn
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-400">Đang tải...</div>}>
      <UpgradePageContent />
    </Suspense>
  );
}
