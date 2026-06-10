"use client";

import { Card } from "@/components/ui/card";
import { User, Shield, Palette, Globe, LogOut, ChevronRight } from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";

const settingsSections = [
    {
        title: "Tài khoản",
        items: [
            { icon: User, label: "Thông tin cá nhân", desc: "Tên, email, số điện thoại" },
            { icon: Shield, label: "Bảo mật", desc: "Mật khẩu, xác thực 2 lớp" },
        ],
    },
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

    function handleLogout() {
        dispatch(logout());
        window.location.replace("/login");
    }

    return (
        <div className="space-y-6">
            {settingsSections.map((section) => (
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

            {/* Logout — same compact row style as settings items, for visual consistency */}
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
