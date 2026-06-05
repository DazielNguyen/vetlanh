"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchAuth } from "@/lib/api/services/fetchAuth";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await fetchAuth.resendVerification(email);
      toast.success("Email xác minh đã được gửi!");
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      toast.error("Không thể gửi email. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10 text-pretty">
        <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Gửi lại email xác minh</h2>
        <p className="text-slate-500 text-base">Nhập email của bạn và chúng tôi sẽ gửi lại liên kết xác minh.</p>
      </div>

      <div className="bg-white px-8 py-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
        {!submitted ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-slate-700 font-semibold ml-1">
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl transition-all duration-200"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-bold rounded-2xl bg-primary hover:bg-slate-800 text-white shadow-md active:scale-[0.98] transition-all group mt-2"
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
        ) : (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Email đã được gửi!</h3>
              <p className="text-slate-500 text-sm">
                Nếu email <span className="font-semibold text-slate-700">{email}</span> được đăng ký, bạn sẽ nhận được email xác minh trong vài phút.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
              <p className="font-semibold mb-2">💡 Mẹo</p>
              <p className="text-xs text-blue-600">Kiểm tra thư mục Spam nếu không thấy email trong hộp thư đến.</p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-slate-500 font-medium">
        <Link href="/login" className="font-bold text-primary hover:text-emerald-600 transition-colors underline underline-offset-4 decoration-2 decoration-primary/30 inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
