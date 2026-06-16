"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock, Loader2, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearError, setToken, decodeToken } from "@/lib/redux/slices/authSlice";
import { fetchAuth } from "@/lib/api/services/fetchAuth";

// ── Helpers ─────────────────────────────────────────────────────────────────

function isUnverifiedError(msg: string): boolean {
    const lower = msg.toLowerCase();
    return lower.includes("verify your email") || lower.includes("not verified") || lower.includes("unverified");
}

function mapEmailLoginError(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes("already exists"))
        return "Email này đã được đăng ký. Vui lòng đăng nhập bằng email và mật khẩu.";
    if (lower.includes("incorrect") || lower.includes("invalid credentials") || lower.includes("wrong password") || lower.includes("not found"))
        return "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.";
    if (isUnverifiedError(msg))
        return "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn.";
    if (lower.includes("disabled") || lower.includes("inactive"))
        return "Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ hỗ trợ.";
    return msg;
}

function mapUsernameLoginError(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes("invalid credentials") || lower.includes("incorrect") || lower.includes("not found"))
        return "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.";
    if (lower.includes("deactivated") || lower.includes("disabled") || lower.includes("inactive"))
        return "Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ hỗ trợ.";
    return msg;
}

// ── Local components ─────────────────────────────────────────────────────────

function IconInput({ icon: Icon, ...props }: { icon: LucideIcon } & React.ComponentPropsWithoutRef<"input">) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
                <Icon className="h-4 w-4" />
            </div>
            <Input
                className="pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/35 focus:bg-white/15 focus-visible:ring-white/20 rounded-2xl transition-all duration-200"
                {...props}
            />
        </div>
    );
}

function PasswordInput({ id, value, onChange, placeholder }: {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
                <Lock className="h-4 w-4" />
            </div>
            <Input
                id={id}
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="pl-11 pr-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/35 focus:bg-white/15 focus-visible:ring-white/20 rounded-2xl transition-all duration-200"
            />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white/70 transition-colors"
                tabIndex={-1}
            >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

type Tab = "email" | "username";

export default function LoginPage() {
    const { login, isLoading: emailLoading, error: emailError } = useAuth();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [tab, setTab] = useState<Tab>("email");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [username, setUsername] = useState("");
    const [usernamePassword, setUsernamePassword] = useState("");
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [usernameError, setUsernameError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(clearError());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
        } catch {
            // Error shown via toast + Redux error state inside useAuth
        }
    };

    const handleUsernameLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setUsernameError(null);
        setUsernameLoading(true);
        try {
            const { access_token } = await fetchAuth.loginWithUsername({ username, password: usernamePassword });
            const user = decodeToken(access_token);
            dispatch(setToken({ token: access_token, user }));
            toast.success("Đăng nhập thành công");
            router.push("/services");
        } catch (err: unknown) {
            const msg = typeof err === "string" ? err : (err as { message?: string })?.message ?? "Đăng nhập thất bại. Vui lòng thử lại.";
            setUsernameError(mapUsernameLoginError(msg));
        } finally {
            setUsernameLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2.5 tracking-tight">Chào mừng trở lại</h2>
                <p className="text-white/65 text-base">Hôm nay của bạn thế nào? Hãy đăng nhập để tiếp tục hành trình nhé.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl px-8 py-10 rounded-[28px]">
                {/* Tab switcher */}
                <div className="flex bg-white/10 border border-white/15 rounded-2xl p-1 mb-7">
                    {(["email", "username"] as Tab[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => { setTab(t); setUsernameError(null); dispatch(clearError()); }}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                tab === t
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-white/55 hover:text-white"
                            }`}
                        >
                            {t === "email" ? "Email" : "Tên đăng nhập"}
                        </button>
                    ))}
                </div>

                {/* Email form */}
                {tab === "email" && (
                    <form className="space-y-6" onSubmit={handleEmailLogin}>
                        {emailError && (
                            <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-xl border border-red-400/30 text-center font-medium space-y-1.5">
                                <p>{mapEmailLoginError(emailError)}</p>
                                {isUnverifiedError(emailError) && (
                                    <Link href="/resend-verification" className="inline-block text-xs font-bold text-white/70 underline underline-offset-2 hover:text-white transition-colors">
                                        Gửi lại email xác minh →
                                    </Link>
                                )}
                            </div>
                        )}

                        <div className="space-y-2.5">
                            <Label htmlFor="email" className="text-white/80 font-semibold ml-1">Email</Label>
                            <IconInput icon={Mail} id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-white/80 font-semibold">Mật khẩu</Label>
                                <Link href="/forgot-password" className="text-xs font-semibold text-white/55 hover:text-white transition-colors">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                        </div>

                        <Button type="submit" disabled={emailLoading} className="w-full h-12 text-base font-bold rounded-2xl bg-primary hover:bg-emerald-600 text-white shadow-md active:scale-[0.98] transition-all group">
                            {emailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Đăng nhập</span><ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" /></>}
                        </Button>
                    </form>
                )}

                {/* Username form */}
                {tab === "username" && (
                    <form className="space-y-6" onSubmit={handleUsernameLogin}>
                        {usernameError && (
                            <div className="bg-red-500/20 text-red-300 text-sm p-3 rounded-xl border border-red-400/30 text-center font-medium">
                                {usernameError}
                            </div>
                        )}

                        <div className="space-y-2.5">
                            <Label htmlFor="username" className="text-white/80 font-semibold ml-1">Tên đăng nhập</Label>
                            <IconInput icon={User} id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="User" required />
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="username-password" className="text-white/80 font-semibold ml-1">Mật khẩu</Label>
                            <PasswordInput id="username-password" value={usernamePassword} onChange={(e) => setUsernamePassword(e.target.value)} placeholder="••••••••" />
                        </div>

                        <Button type="submit" disabled={usernameLoading} className="w-full h-12 text-base font-bold rounded-2xl bg-primary hover:bg-emerald-600 text-white shadow-md active:scale-[0.98] transition-all group">
                            {usernameLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Đăng nhập</span><ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" /></>}
                        </Button>
                    </form>
                )}
            </div>

            <p className="mt-8 text-center text-sm text-white/60 font-medium">
                Bạn chưa có tài khoản?{" "}
                <Link href="/register" className="font-bold text-primary hover:text-emerald-400 transition-colors underline underline-offset-4 decoration-2 decoration-primary/40">
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
}
