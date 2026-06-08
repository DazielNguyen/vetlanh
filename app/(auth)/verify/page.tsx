"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchAuth } from "@/lib/api/services/fetchAuth";

type Status = "loading" | "success" | "error" | "idle";

function mapVerifyError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("invalid verification link") || lower.includes("not found") || lower.includes("invalid token"))
    return "Liên kết xác minh không hợp lệ. Vui lòng yêu cầu gửi lại email.";
  if (lower.includes("expired"))
    return "Liên kết xác minh đã hết hạn. Vui lòng yêu cầu gửi lại email.";
  if (lower.includes("already verified"))
    return "Email này đã được xác minh rồi. Vui lòng đăng nhập.";
  return "Xác minh email thất bại. Vui lòng thử lại.";
}

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Không tìm thấy token xác minh. Vui lòng kiểm tra liên kết email.");
      return;
    }

    const verify = async () => {
      setStatus("loading");
      try {
        await fetchAuth.verifyEmail(token);
        setStatus("success");
        toast.success("Email đã được xác minh thành công!");
        setTimeout(() => router.push("/login"), 2000);
      } catch (err) {
        const msg = typeof err === "string" ? err : (err as { message?: string })?.message ?? "Xác minh email thất bại.";
        setErrorMsg(mapVerifyError(msg));
        setStatus("error");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="w-full max-w-md">
      {status === "loading" && (
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Đang xác minh email...</h2>
          <p className="text-slate-500 text-base">Vui lòng chờ trong giây lát.</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Email xác minh thành công!</h2>
          <p className="text-slate-500 text-base mb-8">Bạn có thể đăng nhập ngay bây giờ.</p>

          <Link href="/login">
            <Button className="w-full h-12 text-base font-bold rounded-2xl bg-primary hover:bg-slate-800 text-white shadow-md active:scale-[0.98] transition-all group">
              <span>Đăng nhập ngay</span>
              <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Xác minh email thất bại</h2>
          <p className="text-slate-500 text-base mb-8">{errorMsg}</p>

          <div className="space-y-3">
            <Link href="/resend-verification">
              <Button className="w-full h-12 text-base font-bold rounded-2xl bg-primary hover:bg-slate-800 text-white shadow-md active:scale-[0.98] transition-all">
                Gửi lại email xác minh
              </Button>
            </Link>

            <Link href="/login">
              <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold shadow-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
