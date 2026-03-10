"use client";

import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Simple Admin Header */}
            <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/admin/dashboard" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                <Image src="/images/logo.svg" alt="Vết Lành Logo" width={18} height={18} className="brightness-0 invert" />
                            </div>
                            <span className="text-xl font-bold tracking-tight font-dancing">Vết Lành Admin</span>
                        </Link>

                        {/* Top Right Controls */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-300 font-medium">Xin chào, Administrator</span>
                            {/* Logout button mimicking the layout style */}
                            <Link href="/login" className="text-sm px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors text-slate-300" onClick={() => document.cookie = "authToken=; max-age=0; path=/;"}>
                                Đăng xuất
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
                {/* Simple Admin Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 hidden md:block">
                    <nav className="p-4 space-y-1">
                        <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                            Tổng quan
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            Quản lý người dùng
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                            Quản lý bài viết
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
                            Quản lý lịch hẹn
                        </Link>
                    </nav>
                </aside>

                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
