"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearError } from "@/lib/redux/slices/authSlice";
import { fetchAuth } from "@/lib/api/services/fetchAuth";

// Maps Google OAuth ?error= param to Vietnamese
// Handles both fastapi-users error codes (underscores) and plain messages
function toViOAuthError(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes("already_exists") || lower.includes("already exists"))
        return "Email này đã được đăng ký bằng mật khẩu. Vui lòng đăng nhập bằng email và mật khẩu.";
    if (lower.includes("not_verified") || lower.includes("not verified"))
        return "Tài khoản chưa xác minh. Vui lòng kiểm tra hộp thư của bạn.";
    if (lower.includes("bad_credentials") || lower.includes("unauthorized"))
        return "Đăng nhập Google thất bại. Vui lòng thử lại.";
    return "Đăng nhập Google thất bại. Vui lòng thử lại.";
}

// Maps BE login error messages to Vietnamese
function mapLoginError(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes("already exists"))
        return "Tài khoản này sử dụng đăng nhập Google. Vui lòng dùng nút Google bên dưới.";
    if (lower.includes("incorrect") || lower.includes("invalid credentials") || lower.includes("wrong password") || lower.includes("not found"))
        return "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.";
    if (lower.includes("not verified") || lower.includes("unverified"))
        return "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn.";
    if (lower.includes("disabled") || lower.includes("inactive"))
        return "Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ hỗ trợ.";
    return msg;
}

export default function LoginPage() {
    const { login, isLoading, error } = useAuth();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        // Clear any stale error from previous login attempts or OAuth redirects
        dispatch(clearError());

        const oauthError = searchParams.get("error");
        if (!oauthError) return;
        toast.error(toViOAuthError(oauthError), { duration: 8000 });
        // router.replace("/login") on the current page is a no-op in Next.js App Router.
        // Use window.history.replaceState to strip ?error= synchronously without navigation.
        window.history.replaceState({}, "", "/login");
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
        } catch {
            // Error already shown via toast inside useAuth
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { authorization_url } = await fetchAuth.googleLogin();
            // Security: only allow redirect to Google's OAuth endpoint
            try {
                const parsed = new URL(authorization_url);
                if (parsed.hostname !== "accounts.google.com") {
                    console.error("[Google OAuth] Unexpected redirect host:", parsed.hostname);
                    toast.error("Không thể kết nối Google. Thử lại sau.");
                    return;
                }
            } catch {
                console.error("[Google OAuth] Invalid authorization_url:", authorization_url);
                toast.error("Không thể kết nối Google. Thử lại sau.");
                return;
            }
            window.location.href = authorization_url;
        } catch (err) {
            console.error("[Google OAuth] Failed to get authorization URL:", err);
            toast.error("Không thể kết nối Google. Thử lại sau.");
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-10 text-pretty">
                <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Chào mừng bạn trở lại</h2>
                <p className="text-slate-500 text-base">Hôm nay của bạn thế nào? Hãy đăng nhập để tiếp tục hành trình nhé.</p>
            </div>

            <div className="bg-white px-8 py-10 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
                <form className="space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 text-center font-medium">
                            {mapLoginError(error)}
                        </div>
                    )}

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

                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between ml-1">
                            <Label htmlFor="password" className="text-slate-700 font-semibold">Mật khẩu</Label>
                            <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-emerald-600 transition-colors">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                <Lock className="h-4 w-4" />
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-bold rounded-2xl bg-primary hover:bg-slate-800 text-white shadow-md active:scale-[0.98] transition-all group">
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                Đăng nhập
                                <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-8 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-200 after:mt-0.5 after:flex-1 after:border-t after:border-slate-200">
                    <p className="mx-4 mb-0 text-center text-xs font-medium text-slate-400 uppercase tracking-widest">Hoặc</p>
                </div>

                <div className="mt-8">
                    <Button type="button" onClick={handleGoogleLogin} variant="outline" className="h-12 w-full rounded-2xl border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 text-slate-600 font-semibold shadow-sm overflow-hidden flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Đăng nhập với Google
                    </Button>
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                Bạn chưa có tài khoản?{" "}
                <Link href="/register" className="font-bold text-primary hover:text-emerald-600 transition-colors underline underline-offset-4 decoration-2 decoration-primary/30">
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
}
