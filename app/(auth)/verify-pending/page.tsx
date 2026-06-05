"use client";

import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyPendingPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Kiểm tra email của bạn</h2>
        <p className="text-slate-500 text-base leading-relaxed">
          Chúng tôi đã gửi một email xác minh tới địa chỉ email của bạn. Vui lòng nhấp vào liên kết trong email để xác minh tài khoản.
        </p>
      </div>

      <div className="bg-white px-8 py-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-semibold mb-2">💡 Không thấy email?</p>
            <ul className="space-y-1 text-xs text-blue-600">
              <li>• Kiểm tra thư mục Spam</li>
              <li>• Chắc chắn bạn kiểm tra đúng email đã đăng ký</li>
            </ul>
          </div>

          <div>
            <Link href="/login">
              <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold shadow-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        Liên kết xác minh sẽ hết hạn trong 24 giờ
      </p>
    </div>
  );
}
