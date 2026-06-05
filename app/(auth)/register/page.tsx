"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock, Loader2, CheckCircle } from "lucide-react";
import { fetchAuth } from "@/lib/api/services/fetchAuth";

function mapRegisterError(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes("already exists") || lower.includes("already registered") || lower.includes("email already"))
        return "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.";
    if (lower.includes("password") && (lower.includes("short") || lower.includes("weak") || lower.includes("length")))
        return "Mật khẩu quá ngắn. Vui lòng dùng ít nhất 8 ký tự.";
    if (lower.includes("invalid email"))
        return "Email không hợp lệ. Vui lòng kiểm tra lại.";
    return msg;
}

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
            return;
        }

        if (password.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự.");
            return;
        }

        setIsLoading(true);
        try {
            await fetchAuth.register({ email, password });
            setSuccess(true);
        } catch (err: unknown) {
            const msg = (err as { message?: string })?.message || "Đăng ký thất bại. Vui lòng thử lại.";
            setError(mapRegisterError(msg));
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full">
                <div className="bg-white px-8 py-12 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 text-center flex flex-col items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Đăng ký thành công!</h2>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                            Chúng tôi đã gửi email xác minh đến <span className="font-semibold text-slate-700">{email}</span>.
                            Vui lòng kiểm tra hộp thư và nhấp vào liên kết để kích hoạt tài khoản.
                        </p>
                    </div>
                    <p className="text-xs text-slate-400">Không nhận được email? Kiểm tra thư mục Spam hoặc</p>
                    <Link
                        href="/verify-email"
                        className="text-sm font-semibold text-primary hover:text-emerald-600 transition-colors underline underline-offset-4 decoration-2 decoration-primary/30"
                    >
                        Gửi lại email xác minh
                    </Link>
                </div>

                <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                    Đã có tài khoản?{" "}
                    <Link
                        href="/login"
                        className="font-bold text-primary hover:text-emerald-600 transition-colors underline underline-offset-4 decoration-2 decoration-primary/30"
                    >
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="text-center mb-10 text-pretty">
                <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Tạo tài khoản mới</h2>
                <p className="text-slate-500 text-base">Bắt đầu hành trình chữa lành của bạn ngay hôm nay.</p>
            </div>

            <div className="bg-white px-8 py-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 text-center font-medium">
                            {error}
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-2.5">
                        <Label htmlFor="email" className="text-slate-700 font-semibold ml-1">Email</Label>
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
                                className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2.5">
                        <Label htmlFor="password" className="text-slate-700 font-semibold ml-1">Mật khẩu</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                <Lock className="h-4 w-4" />
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Tối thiểu 8 ký tự"
                                className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl transition-all duration-200"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2.5">
                        <Label htmlFor="confirm-password" className="text-slate-700 font-semibold ml-1">Xác nhận mật khẩu</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                <Lock className="h-4 w-4" />
                            </div>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                                className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl transition-all duration-200"
                                required
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
                                Đăng ký
                                <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
                    Bằng cách đăng ký, bạn đồng ý với{" "}
                    <span className="font-semibold text-slate-600">Điều khoản dịch vụ</span> và{" "}
                    <span className="font-semibold text-slate-600">Chính sách bảo mật</span> của Vết Lành.
                </p>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                Đã có tài khoản?{" "}
                <Link
                    href="/login"
                    className="font-bold text-primary hover:text-emerald-600 transition-colors underline underline-offset-4 decoration-2 decoration-primary/30"
                >
                    Đăng nhập ngay
                </Link>
            </p>
        </div>
    );
}
