"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Loader2, ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { AuthCard, AuthIconCircle } from "@/components/auth/auth-card";

export default function ResendVerificationPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await fetchAuth.resendVerification(email);
      toast.success("Email xác minh đã được gửi!");
      setSentEmail(email);
      setEmail("");
    } catch {
      toast.error("Không thể gửi email. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <AuthCard>
        {!sentEmail ? (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <AuthIconCircle>
                  <Mail className="w-8 h-8 text-white" />
                </AuthIconCircle>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Gửi lại email xác minh</h2>
              <p className="text-white/65 text-sm">Nhập email của bạn và chúng tôi sẽ gửi lại liên kết xác minh.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80 font-semibold text-sm ml-1">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/50">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="pl-11 h-12 bg-white/10 border-white/25 text-white placeholder:text-white/35 rounded-2xl focus:bg-white/15 focus:border-white/40 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/30"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-bold rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/25 shadow-md active:scale-[0.98] transition-all group focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Gửi lại email
                    <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                Quay lại đăng nhập
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <AuthIconCircle className="animate-pulse">
                <Mail className="w-8 h-8 text-white" />
              </AuthIconCircle>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Email đã được gửi!</h3>
              <p className="text-white/65 text-sm leading-relaxed">
                Nếu email <span className="font-semibold text-white/90">{sentEmail}</span> được đăng ký, bạn sẽ nhận được email xác minh trong vài phút.
              </p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-left">
              <p className="text-white/90 text-sm font-semibold mb-1 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-300 shrink-0" />
                Mẹo
              </p>
              <p className="text-white/65 text-xs">Kiểm tra thư mục Spam nếu không thấy email trong hộp thư đến.</p>
            </div>
            <Link href="/login">
              <Button className="w-full h-12 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/25 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-white/50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        )}
      </AuthCard>
    </div>
  );
}
