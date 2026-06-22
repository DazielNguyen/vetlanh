"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { User, Shield, Palette, Globe, LogOut, ChevronRight, MailCheck, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { useCurrentUser } from "@/hooks/useUser";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { toast } from "sonner";

const appearanceSections = [
    {
        title: "Tùy chỉnh",
        items: [
            { icon: Palette, label: "Giao diện", desc: "Chế độ sáng/tối, màu chủ đề" },
            { icon: Globe, label: "Ngôn ngữ", desc: "Tiếng Việt" },
        ],
    },
];

export function SettingsList() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { data: user } = useCurrentUser();
    const [sendingVerify, setSendingVerify] = useState(false);

    function handleLogout() {
        dispatch(logout());
        window.location.replace("/login");
    }

    async function handleResendVerification() {
        if (!user?.email || sendingVerify) return;
        setSendingVerify(true);
        try {
            await fetchAuth.resendVerification(user.email);
            router.push(`/verify-pending?email=${encodeURIComponent(user.email)}`);
        } catch {
            toast.error("Không thể gửi email. Vui lòng thử lại sau.");
        } finally {
            setSendingVerify(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Tài khoản — includes dynamic email verification row */}
            <Card className="card-lifted border-none rounded-3xl overflow-hidden divide-y divide-border/30">
                <h2 className="px-4 pt-4 pb-2 text-sm font-bold text-foreground/40 uppercase tracking-wider">Tài khoản</h2>

                <button className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition text-left">
                    <div className="w-10 h-10 rounded-2xl bg-secondary/60 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">Thông tin cá nhân</h3>
                        <p className="text-xs text-foreground/40">Tên, email, số điện thoại</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/20 shrink-0" strokeWidth={2} />
                </button>

                <button className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition text-left">
                    <div className="w-10 h-10 rounded-2xl bg-secondary/60 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">Bảo mật</h3>
                        <p className="text-xs text-foreground/40">Mật khẩu, xác thực 2 lớp</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/20 shrink-0" strokeWidth={2} />
                </button>

                {/* Email verification row — always visible */}
                <button
                    onClick={!user?.is_verified ? handleResendVerification : undefined}
                    disabled={sendingVerify || user?.is_verified}
                    className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition text-left disabled:cursor-default disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${user?.is_verified ? "bg-emerald-100/80" : "bg-amber-100/80"}`}>
                        {sendingVerify
                            ? <Loader2 className="w-5 h-5 text-amber-500 animate-spin" strokeWidth={2} />
                            : <MailCheck className={`w-5 h-5 ${user?.is_verified ? "text-emerald-500" : "text-amber-500"}`} strokeWidth={2} />
                        }
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">Xác minh email</h3>
                        <p className="text-xs text-foreground/40">
                            {user?.is_verified ? "Email đã được xác minh" : "Nhấn để gửi lại email xác minh"}
                        </p>
                    </div>
                    {user?.is_verified ? (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full shrink-0">
                            Đã xác minh
                        </span>
                    ) : (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-100/80 px-2 py-0.5 rounded-full shrink-0">
                            Chưa xác minh
                        </span>
                    )}
                </button>
            </Card>

            {/* Appearance sections */}
            {appearanceSections.map((section) => (
                <Card key={section.title} className="card-lifted border-none rounded-3xl overflow-hidden divide-y divide-border/30">
                    <h2 className="px-4 pt-4 pb-2 text-sm font-bold text-foreground/40 uppercase tracking-wider">{section.title}</h2>
                    {section.items.map((item) => (
                        <button key={item.label} className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition text-left">
                            <div className="w-10 h-10 rounded-2xl bg-secondary/60 flex items-center justify-center shrink-0">
                                <item.icon className="w-5 h-5 text-primary" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground text-sm">{item.label}</h3>
                                <p className="text-xs text-foreground/40">{item.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-foreground/20 shrink-0" strokeWidth={2} />
                        </button>
                    ))}
                </Card>
            ))}

            {/* Logout */}
            <Card className="card-lifted border-none rounded-3xl overflow-hidden">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 hover:bg-destructive/5 transition text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                >
                    <div className="w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
                        <LogOut className="w-5 h-5 text-destructive" strokeWidth={2} />
                    </div>
                    <span className="font-semibold text-destructive text-sm">Đăng xuất</span>
                </button>
            </Card>
        </div>
    );
}
