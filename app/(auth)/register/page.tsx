"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, Lock, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { useAppDispatch } from "@/lib/redux/hooks";
import { loginAsync, clearError, setToken, decodeToken } from "@/lib/redux/slices/authSlice";

// ── Module-level helpers ────────────────────────────────────────────────────

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,50}$/;

function extractError(err: unknown, fallback = "Đăng ký thất bại. Vui lòng thử lại."): string {
    return typeof err === "string" ? err : (err as { message?: string })?.message ?? fallback;
}

function validatePasswordPair(password: string, confirm: string): string | null {
    if (password !== confirm) return "Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.";
    if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
    return null;
}

function mapRegisterError(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes("already_exists") || lower.includes("already exists") || lower.includes("already registered") || lower.includes("email already"))
        return "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.";
    if (lower.includes("password") && (lower.includes("short") || lower.includes("weak") || lower.includes("length")))
        return "Mật khẩu quá ngắn. Vui lòng dùng ít nhất 8 ký tự.";
    if (lower.includes("invalid email") || lower.includes("invalid_email"))
        return "Email không hợp lệ. Vui lòng kiểm tra lại.";
    return msg;
}

function mapUsernameRegisterError(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes("already taken") || lower.includes("already_taken") || lower.includes("username already"))
        return "Tên đăng nhập này đã được dùng. Vui lòng chọn tên khác.";
    if (lower.includes("invalid") || lower.includes("validation"))
        return "Tên đăng nhập không hợp lệ. Chỉ dùng chữ cái, số, dấu - và _, từ 3 đến 50 ký tự.";
    if (lower.includes("password") && (lower.includes("short") || lower.includes("weak") || lower.includes("length")))
        return "Mật khẩu quá ngắn. Vui lòng dùng ít nhất 8 ký tự.";
    return msg;
}

// ── Local component ─────────────────────────────────────────────────────────

function IconInput({ icon: Icon, ...props }: { icon: LucideIcon } & React.ComponentPropsWithoutRef<"input">) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                <Icon className="h-4 w-4" />
            </div>
            <Input className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl transition-all duration-200" {...props} />
        </div>
    );
}

// ── Page ────────────────────────────────────────────────────────────────────

type Tab = "email" | "username";

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [tab, setTab] = useState<Tab>("email");

    const [email, setEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState("");
    const [emailConfirm, setEmailConfirm] = useState("");

    const [username, setUsername] = useState("");
    const [usernamePassword, setUsernamePassword] = useState("");
    const [usernameConfirm, setUsernameConfirm] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pwErr = validatePasswordPair(emailPassword, emailConfirm);
        if (pwErr) { setError(pwErr); return; }

        setError(null);
        setIsLoading(true);
        let registerOk = false;
        try {
            await fetchAuth.register({ email, password: emailPassword });
            registerOk = true;
            await dispatch(loginAsync({ email, password: emailPassword })).unwrap();
            toast.success("Đăng ký thành công! Chào mừng bạn đến với Vết Lành.");
            router.push("/services");
        } catch (err) {
            const msg = extractError(err);
            if (!registerOk) {
                setError(mapRegisterError(msg));
            } else {
                dispatch(clearError());
                toast.error("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
                router.push("/login");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUsernameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pwErr = validatePasswordPair(usernamePassword, usernameConfirm);
        if (pwErr) { setError(pwErr); return; }
        if (!USERNAME_REGEX.test(username)) {
            setError("Tên đăng nhập không hợp lệ. Chỉ dùng chữ cái, số, dấu - và _, từ 3 đến 50 ký tự.");
            return;
        }

        setError(null);
        setIsLoading(true);
        try {
            const { access_token } = await fetchAuth.registerWithUsername({ username, password: usernamePassword });
            const user = decodeToken(access_token);
            dispatch(setToken({ token: access_token, user }));
            toast.success("Đăng ký thành công! Chào mừng bạn đến với Vết Lành.");
            toast("Thêm email để khôi phục tài khoản nếu quên mật khẩu.", {
                duration: 8000,
                action: { label: "Thêm ngay", onClick: () => router.push("/settings/account") },
            });
            router.push("/services");
        } catch (err) {
            setError(mapUsernameRegisterError(extractError(err)));
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
                {/* Tab switcher */}
                <div className="flex bg-slate-100 rounded-2xl p-1 mb-7">
                    {(["email", "username"] as Tab[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => { setTab(t); setError(null); }}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                tab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {t === "email" ? "Email" : "Tên đăng nhập"}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 text-center font-medium mb-5">
                        {error}
                    </div>
                )}

                {/* ── Email form ── */}
                {tab === "email" && (
                    <form className="space-y-5" onSubmit={handleEmailSubmit}>
                        <div className="space-y-2.5">
                            <Label htmlFor="email" className="text-slate-700 font-semibold ml-1">Email</Label>
                            <IconInput icon={Mail} id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
                        </div>
                        <div className="space-y-2.5">
                            <Label htmlFor="email-password" className="text-slate-700 font-semibold ml-1">Mật khẩu</Label>
                            <IconInput icon={Lock} id="email-password" type="password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} placeholder="Tối thiểu 8 ký tự" required minLength={8} />
                        </div>
                        <div className="space-y-2.5">
                            <Label htmlFor="email-confirm" className="text-slate-700 font-semibold ml-1">Xác nhận mật khẩu</Label>
                            <IconInput icon={Lock} id="email-confirm" type="password" value={emailConfirm} onChange={(e) => setEmailConfirm(e.target.value)} placeholder="Nhập lại mật khẩu" required />
                        </div>
                        <SubmitButton isLoading={isLoading} label="Đăng ký" />
                    </form>
                )}

                {/* ── Username form ── */}
                {tab === "username" && (
                    <form className="space-y-5" onSubmit={handleUsernameSubmit}>
                        <div className="space-y-2.5">
                            <Label htmlFor="username" className="text-slate-700 font-semibold ml-1">Tên đăng nhập</Label>
                            <IconInput icon={User} id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="vd: nguyen_van_a" required minLength={3} maxLength={50} />
                            <p className="text-xs text-slate-400 ml-1">Chữ cái, số, dấu - và _. Từ 3 đến 50 ký tự.</p>
                        </div>
                        <div className="space-y-2.5">
                            <Label htmlFor="username-password" className="text-slate-700 font-semibold ml-1">Mật khẩu</Label>
                            <IconInput icon={Lock} id="username-password" type="password" value={usernamePassword} onChange={(e) => setUsernamePassword(e.target.value)} placeholder="Tối thiểu 8 ký tự" required minLength={8} />
                        </div>
                        <div className="space-y-2.5">
                            <Label htmlFor="username-confirm" className="text-slate-700 font-semibold ml-1">Xác nhận mật khẩu</Label>
                            <IconInput icon={Lock} id="username-confirm" type="password" value={usernameConfirm} onChange={(e) => setUsernameConfirm(e.target.value)} placeholder="Nhập lại mật khẩu" required />
                        </div>
                        <SubmitButton isLoading={isLoading} label="Đăng ký nhanh" />
                    </form>
                )}

                <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
                    Bằng cách đăng ký, bạn đồng ý với{" "}
                    <span className="font-semibold text-slate-600">Điều khoản dịch vụ</span> và{" "}
                    <span className="font-semibold text-slate-600">Chính sách bảo mật</span> của Vết Lành.
                </p>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                Đã có tài khoản?{" "}
                <Link href="/login" className="font-bold text-primary hover:text-emerald-600 transition-colors underline underline-offset-4 decoration-2 decoration-primary/30">
                    Đăng nhập ngay
                </Link>
            </p>
        </div>
    );
}

function SubmitButton({ isLoading, label }: { isLoading: boolean; label: string }) {
    return (
        <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-bold rounded-2xl bg-primary hover:bg-slate-800 text-white shadow-md active:scale-[0.98] transition-all group mt-2">
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <>
                    {label}
                    <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </>
            )}
        </Button>
    );
}
