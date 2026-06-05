"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { useAppDispatch } from "@/lib/redux/hooks";
import { loginAsync, clearError } from "@/lib/redux/slices/authSlice";

function mapRegisterError(msg: string): string {
    const lower = msg.toLowerCase();
    // fastapi-users returns "REGISTER_USER_ALREADY_EXISTS" (underscores, no spaces)
    if (lower.includes("already_exists") || lower.includes("already exists") || lower.includes("already registered") || lower.includes("email already"))
        return "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.";
    if (lower.includes("password") && (lower.includes("short") || lower.includes("weak") || lower.includes("length")))
        return "Mật khẩu quá ngắn. Vui lòng dùng ít nhất 8 ký tự.";
    if (lower.includes("invalid email") || lower.includes("invalid_email"))
        return "Email không hợp lệ. Vui lòng kiểm tra lại.";
    return msg;
}

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        let registerOk = false;
        try {
            await fetchAuth.register({ email, password });
            registerOk = true;
            // Auto-login after register — bypass useAuth.login() to avoid duplicate toast
            await dispatch(loginAsync({ email, password })).unwrap();
            toast.success("Đăng ký thành công! Chào mừng bạn đến với Vết Lành.");
            router.push("/services");
        } catch (err: unknown) {
            // loginAsync.unwrap() rejects with a plain string (rejectWithValue payload);
            // fetchAuth.register() rejects with an ApiError object — handle both shapes
            const msg = typeof err === "string"
                ? err
                : (err as { message?: string })?.message ?? "Đăng ký thất bại. Vui lòng thử lại.";
            if (!registerOk) {
                setError(mapRegisterError(msg));
            } else {
                // Register succeeded but auto-login failed — clear Redux error before redirecting
                // to prevent the stale error from flashing on the login page's first render
                dispatch(clearError());
                toast.error("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
                router.push("/login");
            }
        } finally {
            setIsLoading(false);
        }
    };

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
