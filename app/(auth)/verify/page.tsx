"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { AuthCard, AuthIconCircle } from "@/components/auth/auth-card";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="w-full max-w-md">
      <AuthCard className="text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-6">
              <AuthIconCircle>
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </AuthIconCircle>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Đang xác minh email...</h2>
            <p className="text-white/65 text-sm">Vui lòng chờ trong giây lát.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <AuthIconCircle>
                <CheckCircle className="w-8 h-8 text-emerald-300" />
              </AuthIconCircle>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Xác minh thành công!</h2>
            <p className="text-white/65 text-sm mb-8">Bạn có thể đăng nhập ngay bây giờ.</p>

            <Link href="/login">
              <Button className="w-full h-12 text-base font-bold rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/25 shadow-md active:scale-[0.98] transition-all group focus-visible:ring-2 focus-visible:ring-white/50">
                <span>Đăng nhập ngay</span>
                <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-6">
              <AuthIconCircle>
                <AlertCircle className="w-8 h-8 text-red-300" />
              </AuthIconCircle>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Xác minh thất bại</h2>
            <p className="text-white/65 text-sm mb-8">{errorMsg}</p>

            <div className="space-y-3">
              <Link href="/resend-verification">
                <Button className="w-full h-12 text-base font-bold rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/25 shadow-md active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-white/50">
                  Gửi lại email xác minh
                </Button>
              </Link>

              <Link href="/login">
                <Button variant="outline" className="w-full h-12 rounded-2xl bg-white/10 border-white/25 text-white hover:bg-white/20 hover:text-white font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-white/50">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Button>
              </Link>
            </div>
          </>
        )}
      </AuthCard>
    </div>
  );
}
