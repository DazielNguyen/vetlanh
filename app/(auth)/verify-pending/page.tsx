"use client";

import Link from "next/link";
import { Mail, ArrowLeft, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyPendingPage() {
  return (
    <div className="w-full max-w-md">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] px-8 py-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white/15 border border-white/25 flex items-center justify-center animate-pulse">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Kiểm tra email của bạn
          </h2>
          <p className="text-white/65 text-sm leading-relaxed">
            Chúng tôi đã gửi email xác minh tới địa chỉ của bạn. Vui lòng nhấp vào liên kết trong email để xác minh tài khoản.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6">
          <p className="text-white/90 text-sm font-semibold mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-300 shrink-0" />
            Không thấy email?
          </p>
          <ul className="space-y-1">
            <li className="text-white/65 text-xs">• Kiểm tra thư mục Spam</li>
            <li className="text-white/65 text-xs">• Chắc chắn bạn kiểm tra đúng email đã đăng ký</li>
          </ul>
        </div>

        {/* Back button */}
        <Link href="/login">
          <Button
            variant="outline"
            className="w-full h-12 rounded-2xl bg-white/10 border-white/25 text-white hover:bg-white/20 hover:text-white font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại đăng nhập
          </Button>
        </Link>

        {/* Expiry */}
        <p className="mt-5 text-center text-xs text-white/40">
          Liên kết xác minh sẽ hết hạn trong 24 giờ
        </p>
      </div>
    </div>
  );
}
