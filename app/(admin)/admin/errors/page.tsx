"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";

type Severity  = "HIGH" | "MEDIUM" | "LOW";
type Status    = "open" | "resolved";
type FilterTab = "all" | "open" | "resolved";

type ErrorEntry = { id: number; timestamp: string; type: string; route: string; severity: Severity; status: Status; description: string };

const initialErrors: ErrorEntry[] = [
    { id: 1, timestamp: "08/06/2026 14:23", type: "SignalR 401",         route: "/services/chat",               severity: "HIGH",   status: "open",     description: "Failed to complete negotiation with the server: Invalid or expired token. Status code 401." },
    { id: 2, timestamp: "08/06/2026 11:05", type: "API Timeout",         route: "/api/exercises",               severity: "MEDIUM", status: "open",     description: "Request timeout after 30s. Endpoint /api/exercises/list did not respond." },
    { id: 3, timestamp: "08/06/2026 08:47", type: "404 Not Found",       route: "/services/journal/undefined",  severity: "LOW",    status: "open",     description: "User navigated to journal entry with id=undefined. Missing null guard before route push." },
    { id: 4, timestamp: "07/06/2026 22:10", type: "Redux State Mismatch",route: "/services",                    severity: "MEDIUM", status: "resolved", description: "authSlice token decoded as null after Google OAuth callback. User was logged out immediately." },
    { id: 5, timestamp: "07/06/2026 18:33", type: "Image Load Error",    route: "/landing",                     severity: "LOW",    status: "resolved", description: "bg3.png failed to load on Safari iOS 17. Missing webp fallback." },
    { id: 6, timestamp: "06/06/2026 09:14", type: "CORS Error",          route: "/api/auth/google/callback",    severity: "HIGH",   status: "resolved", description: "Cross-origin request blocked. Backend CORS policy missing localhost:5173 in allowed origins." },
];

const severityStyle: Record<Severity, string> = {
    HIGH:   "bg-rose-500/15 text-rose-400 border-rose-500/20",
    MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    LOW:    "bg-white/8 text-white/40 border-white/10",
};

const cardStyle = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" };

export default function AdminErrorsPage() {
    const [errors, setErrors]     = useState<ErrorEntry[]>(initialErrors);
    const [filter, setFilter]     = useState<FilterTab>("all");
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const filtered     = errors.filter((e) => filter === "all" ? true : e.status === filter);
    const openCount    = errors.filter((e) => e.status === "open").length;
    const resolvedCount = errors.filter((e) => e.status === "resolved").length;

    const markResolved = (id: number) => setErrors((p) => p.map((e) => e.id === id ? { ...e, status: "resolved" } : e));

    const copyError = (e: ErrorEntry) => {
        navigator.clipboard.writeText(`[${e.timestamp}] ${e.type} - ${e.route}\n${e.description}`).catch(() => {});
        setCopiedId(e.id);
        setTimeout(() => setCopiedId(null), 1800);
    };

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-[28px] font-bold text-white tracking-tight leading-none mb-1.5">Báo lỗi hệ thống</h1>
                <p className="text-white/45 font-medium text-sm">Ghi nhận lỗi để DEV cập nhật và xử lý</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Tổng lỗi",     value: errors.length,  accent: "rgba(255,255,255,0.04)", border: "border-white/9",        textCls: "text-white" },
                    { label: "Chưa xử lý",   value: openCount,      accent: "rgba(239,68,68,0.08)",  border: "border-rose-500/20",    textCls: "text-rose-400" },
                    { label: "Đã xử lý",     value: resolvedCount,  accent: "rgba(16,185,129,0.08)", border: "border-emerald-500/20", textCls: "text-emerald-400" },
                ].map((s) => (
                    <div key={s.label} className={`rounded-[20px] border ${s.border} px-5 py-4`} style={{ background: s.accent, backdropFilter: "blur(12px)" }}>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${s.textCls} opacity-60`}>{s.label}</p>
                        <p className={`text-2xl font-extrabold tabular-nums ${s.textCls}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex p-1 w-fit rounded-2xl border border-white/9" style={{ background: "rgba(255,255,255,0.04)" }}>
                {([["all", "Tất cả", errors.length], ["open", "Chưa xử lý", openCount], ["resolved", "Đã xử lý", resolvedCount]] as [FilterTab, string, number][]).map(([value, label, count]) => (
                    <button
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            filter === value
                                ? "bg-emerald-500/20 text-white border border-emerald-500/25"
                                : "text-white/45 hover:text-white/80"
                        }`}
                    >
                        {label}
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${filter === value ? "bg-white/15 text-white" : "bg-white/8 text-white/40"}`}>{count}</span>
                    </button>
                ))}
            </div>

            {/* Error List */}
            <div className="rounded-[24px] border border-white/9 divide-y divide-white/[0.06]" style={cardStyle}>
                {filtered.length === 0 && (
                    <div className="py-16 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <p className="text-sm font-bold text-white/70">Không có lỗi nào</p>
                        <p className="text-xs text-white/35 font-medium">Hệ thống đang hoạt động bình thường</p>
                    </div>
                )}
                {filtered.map((e) => (
                    <div key={e.id} className="px-6 py-5 hover:bg-white/[0.03] transition-colors">
                        <div className="flex items-start gap-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md border shrink-0 mt-0.5 ${severityStyle[e.severity]}`}>
                                {e.severity}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <p className="text-sm font-bold text-white/90">{e.type}</p>
                                    <code className="text-[11px] font-mono bg-white/8 text-white/40 px-1.5 py-0.5 rounded-md border border-white/10">{e.route}</code>
                                    {e.status === "resolved" && (
                                        <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">Đã xử lý</span>
                                    )}
                                </div>
                                <p className="text-xs text-white/35 font-medium mb-2">{e.timestamp}</p>
                                {expandedId === e.id ? (
                                    <p className="text-sm text-white/60 font-medium leading-relaxed rounded-xl p-3 border border-white/[0.07]" style={{ background: "rgba(255,255,255,0.04)" }}>
                                        {e.description}
                                    </p>
                                ) : (
                                    <p className="text-sm text-white/45 font-medium truncate">{e.description}</p>
                                )}
                                <button
                                    onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}
                                    className="mt-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                    {expandedId === e.id ? "Thu gọn" : "Xem chi tiết"}
                                </button>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => copyError(e)}
                                    title="Copy để gửi DEV"
                                    className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/12 text-white/40 hover:text-white/70 transition-colors border border-white/10"
                                >
                                    {copiedId === e.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                {e.status === "open" && (
                                    <button
                                        onClick={() => markResolved(e.id)}
                                        className="h-8 px-3.5 bg-white/8 hover:bg-white/12 text-white/60 hover:text-white text-xs font-bold rounded-xl transition-colors border border-white/10 active:scale-[0.97]"
                                    >
                                        Đánh dấu xử lý
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-xs text-white/25 font-medium text-center">Dữ liệu mock. Kết nối BE để lưu lỗi thực tế.</p>
        </div>
    );
}
