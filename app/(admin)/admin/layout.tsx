"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    UserSquare2,
    CalendarCheck,
    BarChart3,
    Settings,
    Search,
    Bell,
    HelpCircle,
    ShieldPlus
} from "lucide-react";

const sidebarNav = [
    { title: "Bảng điều khiển", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Người dùng", href: "/admin/users", icon: Users },
    { title: "Chuyên gia", href: "#", icon: UserSquare2 },
    { title: "Lịch hẹn", href: "#", icon: CalendarCheck },
    { title: "Báo cáo", href: "#", icon: BarChart3 },
    { title: "Cài đặt", href: "#", icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-[#FEF9F2] text-slate-800 font-sans">
            {/* Sidebar (Left) */}
            <aside className="fixed inset-y-0 left-0 w-[260px] bg-white border-r border-slate-200 flex flex-col z-50">
                {/* Logo Area */}
                <div className="h-24 flex items-center px-6 border-b border-transparent">
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm shrink-0 text-white">
                            <ShieldPlus className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tracking-tight text-slate-800 leading-tight">VẾT LÀNH</span>
                            <span className="text-xs text-slate-400 font-medium">Hệ thống Quản trị</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {sidebarNav.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "#" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all ${isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer */}
                <div className="p-4 mt-auto">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-2">
                        <img
                            src="/images/placeholder-user.jpg"
                            alt="Admin Avatar"
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-bold text-slate-800 truncate">Admin Vết Lành</span>
                            <span className="text-[10px] text-slate-400 font-medium truncate">Quản trị viên cấp cao</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area (Right) */}
            <div className="flex-1 flex flex-col pl-[260px]">
                {/* Header */}
                <header className="sticky top-0 z-40 h-20 bg-[#FEF9F2] px-8 flex items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative w-[400px]">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm dữ liệu, chuyên gia..."
                            className="w-full pl-10 pr-4 h-11 bg-white border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                        />
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <Bell className="w-5 h-5 fill-slate-700 text-slate-700" />
                        </button>
                        <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <HelpCircle className="w-5 h-5 fill-slate-700 text-white" />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-8 pt-4">
                    {children}
                </main>
            </div>
        </div>
    );
}
