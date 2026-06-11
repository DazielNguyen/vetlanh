"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { AuthCard, AuthIconCircle } from "@/components/auth/auth-card";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Liên kết xác minh không hợp lệ. Vui lòng kiểm tra email của bạn.");
      return;
    }

    fetchAuth.verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message || "Email đã được xác minh thành công!");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Liên kết đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại.");
      });
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResending(true);
    try {
      const res = await fetchAuth.resendVerification(resendEmail);
      setResendMessage(res.message || "Email xác minh đã được gửi lại!");
    } catch {
      setResendMessage("Không thể gửi lại. Vui lòng thử lại sau.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <AuthCard className="text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-6">
              <AuthIconCircle>
                <Loader2 className="h-8 w-8 text-white animate-spin" />
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
                <CheckCircle className="h-8 w-8 text-emerald-300" />
              </AuthIconCircle>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Xác minh thành công!</h2>
            <p className="text-white/65 text-sm mb-8">{message}</p>
            <Link href="/login">
              <Button className="w-full h-12 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/25 font-bold transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/50">
                Đăng nhập ngay
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-6">
              <AuthIconCircle>
                <XCircle className="h-8 w-8 text-red-300" />
              </AuthIconCircle>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Xác minh thất bại</h2>
            <p className="text-white/65 text-sm mb-6">{message}</p>

            <div className="text-left">
              <p className="text-white/80 text-sm font-semibold mb-3">Gửi lại email xác minh:</p>
              <form onSubmit={handleResend} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="resend-email" className="text-white/80 font-semibold text-sm ml-1">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/50">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      id="resend-email"
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="pl-11 h-12 bg-white/10 border-white/25 text-white placeholder:text-white/35 rounded-2xl focus:bg-white/15 focus:border-white/40 transition-all focus-visible:ring-2 focus-visible:ring-white/30"
                    />
                  </div>
                </div>
                {resendMessage && (
                  <p className="text-sm text-white/75 font-medium">{resendMessage}</p>
                )}
                <Button
                  type="submit"
                  disabled={resending}
                  className="w-full h-12 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/25 font-bold transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gửi lại email"}
                </Button>
              </form>
            </div>

            <div className="mt-6">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                Quay lại đăng nhập
              </Link>
            </div>
          </>
        )}
      </AuthCard>
    </div>
  );
}
