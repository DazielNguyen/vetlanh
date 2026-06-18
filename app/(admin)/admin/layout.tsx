"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Bug,
    Settings,
    Search,
    Bell,
    ShieldPlus,
    Music2,
    BookOpen,
} from "lucide-react";

const sidebarNav = [
    { title: "Bảng điều khiển", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Người dùng", href: "/admin/users", icon: Users },
    { title: "Đăng ký gói", href: "/admin/subscriptions", icon: CreditCard },
    { title: "Âm thanh", href: "/admin/sounds", icon: Music2 },
    { title: "Thư viện", href: "/admin/library", icon: BookOpen },
    { title: "Báo lỗi hệ thống", href: "/admin/errors", icon: Bug },
    { title: "Cài đặt", href: "#", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-[100dvh] text-white relative" style={{ background: "#0b0f0d" }}>
            {/* Ambient gradient blobs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div
                    className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full opacity-[0.08]"
                    style={{ background: "radial-gradient(circle, #10b981 0%, transparent 65%)" }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
                    style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 65%)" }}
                />
            </div>

            {/* Sidebar */}
            <aside
                className="fixed inset-y-0 left-0 w-[260px] flex flex-col z-50 border-r border-white/[0.07]"
                style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
            >
                {/* Logo */}
                <div className="h-20 flex items-center px-5 border-b border-white/[0.07]">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                            <Image src="/images/logo.svg" alt="Vết Lành Logo" width={18} height={18} className="brightness-0 invert" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold font-dancing text-white leading-tight">Vết Lành</span>
                            <span className="text-[10px] text-white/40 font-medium">Hệ thống Quản trị</span>
                        </div>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {sidebarNav.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "#" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all text-sm ${
                                    isActive
                                        ? "bg-emerald-500/15 text-white border border-emerald-500/25 shadow-sm"
                                        : "text-white/50 hover:bg-white/[0.06] hover:text-white/90"
                                }`}
                            >
                                <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-emerald-400" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* User footer */}
                <div className="p-3 mt-auto border-t border-white/[0.07]">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-emerald-400 uppercase">D</span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-bold text-white/90 truncate">duy1</span>
                            <span className="text-[10px] text-white/40 font-medium">Quản trị viên</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col pl-[260px] relative z-10">
                {/* Header */}
                <header
                    className="sticky top-0 z-40 h-20 px-8 flex items-center justify-between border-b border-white/[0.06]"
                    style={{ background: "rgba(11,15,13,0.85)", backdropFilter: "blur(16px)" }}
                >
                    <div className="relative w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full pl-10 pr-4 h-10 rounded-xl text-sm font-medium text-white/80 placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all border border-white/[0.09]"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                        />
                    </div>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-all">
                        <Bell className="w-5 h-5" />
                    </button>
                </header>

                {/* Content */}
                <main className="p-8 pt-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
