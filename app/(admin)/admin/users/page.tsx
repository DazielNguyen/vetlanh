"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchAdmin, type AdminUser } from "@/lib/api/services/fetchAdmin";

const PAGE_LIMIT = 20;

const fmtDate = (iso: string | null) => {
    if (!iso) return null;
    const d = new Date(iso);
    return [d.getDate(), d.getMonth() + 1, d.getFullYear()].map(n => String(n).padStart(2, "0")).join("/");
};

const subStyle: Record<string, { label: string; cls: string }> = {
    Pro:     { label: "Pro",      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    Expired: { label: "Hết hạn",  cls: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
    None:    { label: "Miễn phí", cls: "bg-white/8 text-white/45 border-white/10" },
};

const accountTypeLabel: Record<string, string> = {
    email:    "Email",
    username: "Username",
    google:   "Google",
};

const cardStyle = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" };

export default function AdminUsersPage() {
    const [search, setSearch]               = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [users, setUsers]                 = useState<AdminUser[]>([]);
    const [total, setTotal]                 = useState(0);
    const [page, setPage]                   = useState(1);
    const [loading, setLoading]             = useState(false);

    // debounce: reset to page 1 when search changes
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 300);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        setLoading(true);
        fetchAdmin
            .getUsers({ page, limit: PAGE_LIMIT, search: debouncedSearch || undefined })
            .then(data => { setUsers(data.items); setTotal(data.total); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [debouncedSearch, page]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-[28px] font-bold text-white tracking-tight leading-none mb-1.5">Người dùng</h1>
                <p className="text-white/45 font-medium text-sm">Tổng cộng {total.toLocaleString("vi-VN")} tài khoản</p>
            </div>

            <div className="rounded-[24px] border border-white/9" style={cardStyle}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc username..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 h-10 rounded-xl text-sm font-medium text-white/80 placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all border border-white/9"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                        />
                    </div>
                    <p className="text-xs font-bold text-white/30">{loading ? "Đang tải..." : `${total} kết quả`}</p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/[0.07]">
                                <th className="px-6 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">Người dùng</th>
                                <th className="px-4 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">Loại tài khoản</th>
                                <th className="px-4 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">Gói hiện tại</th>
                                <th className="px-4 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">Hết hạn</th>
                                <th className="px-4 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">Tham gia</th>
                                <th className="px-4 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">Hoạt động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-white/30 font-medium">
                                        Không tìm thấy người dùng nào.
                                    </td>
                                </tr>
                            )}
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-white/30 font-medium">
                                        Đang tải...
                                    </td>
                                </tr>
                            )}
                            {!loading && users.map((u) => {
                                const sub = subStyle[u.subscriptionStatus];
                                return (
                                    <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-white/70 uppercase">{(u.displayName ?? u.username ?? "?")[0]}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white/90">{u.displayName ?? u.username}</p>
                                                    <p className="text-xs text-white/35 font-medium">@{u.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-bold px-2 py-1 rounded-md bg-white/8 text-white/45 border border-white/10">
                                                {accountTypeLabel[u.accountType] ?? u.accountType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md border ${sub.cls}`}>
                                                {sub.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">
                                            {fmtDate(u.subscriptionExpiry) ?? <span className="text-white/20">-</span>}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">{fmtDate(u.joinDate)}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">
                                            {fmtDate(u.lastActiveAt) ?? <span className="text-white/20">-</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-white/[0.07] flex items-center justify-between gap-4">
                        <p className="text-xs font-medium text-white/30">
                            Trang {page} / {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/12 text-white/40 hover:text-white/80 transition-colors border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/12 text-white/40 hover:text-white/80 transition-colors border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
