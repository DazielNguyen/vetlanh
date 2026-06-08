"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { fetchAdmin, type AdminError } from "@/lib/api/services/fetchAdmin";

type FilterTab = "all" | "open" | "resolved";

const fmtDateTime = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const severityStyle: Record<string, string> = {
    HIGH:   "bg-rose-500/15 text-rose-400 border-rose-500/20",
    MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    LOW:    "bg-white/8 text-white/40 border-white/10",
};

const cardStyle = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" };

export default function AdminErrorsPage() {
    const [errors, setErrors]         = useState<AdminError[]>([]);
    const [filter, setFilter]         = useState<FilterTab>("all");
    const [loading, setLoading]       = useState(false);
    const [copiedId, setCopiedId]     = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const status = filter === "all" ? undefined : filter;
        fetchAdmin.getErrors(status)
            .then(setErrors)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [filter]);

    // counts for summary cards (from current loaded list — all when filter=all)
    const openCount     = errors.filter(e => e.status === "open").length;
    const resolvedCount = errors.filter(e => e.status === "resolved").length;

    const markResolved = async (id: string) => {
        try {
            const updated = await fetchAdmin.resolveError(id);
            setErrors(prev => prev.map(e => e.id === id ? updated : e));
        } catch (err) {
            console.error(err);
        }
    };

    const copyError = (e: AdminError) => {
        navigator.clipboard.writeText(`[${fmtDateTime(e.timestamp)}] ${e.type} - ${e.route}\n${e.description}`).catch(() => {});
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
                    { label: "Tổng lỗi",   value: errors.length, accent: "rgba(255,255,255,0.04)", border: "border-white/9",        textCls: "text-white" },
                    { label: "Chưa xử lý", value: openCount,     accent: "rgba(239,68,68,0.08)",   border: "border-rose-500/20",    textCls: "text-rose-400" },
                    { label: "Đã xử lý",   value: resolvedCount, accent: "rgba(16,185,129,0.08)",  border: "border-emerald-500/20", textCls: "text-emerald-400" },
                ].map((s) => (
                    <div key={s.label} className={`rounded-[20px] border ${s.border} px-5 py-4`} style={{ background: s.accent, backdropFilter: "blur(12px)" }}>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${s.textCls} opacity-60`}>{s.label}</p>
                        <p className={`text-2xl font-extrabold tabular-nums ${s.textCls}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex p-1 w-fit rounded-2xl border border-white/9" style={{ background: "rgba(255,255,255,0.04)" }}>
                {([["all", "Tất cả"], ["open", "Chưa xử lý"], ["resolved", "Đã xử lý"]] as [FilterTab, string][]).map(([value, label]) => (
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
                    </button>
                ))}
            </div>

            {/* Error List */}
            <div className="rounded-[24px] border border-white/9 divide-y divide-white/6" style={cardStyle}>
                {loading && (
                    <div className="py-12 flex items-center justify-center">
                        <p className="text-sm text-white/30 font-medium">Đang tải...</p>
                    </div>
                )}
                {!loading && errors.length === 0 && (
                    <div className="py-16 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <p className="text-sm font-bold text-white/70">Không có lỗi nào</p>
                        <p className="text-xs text-white/35 font-medium">Hệ thống đang hoạt động bình thường</p>
                    </div>
                )}
                {!loading && errors.map((e) => (
                    <div key={e.id} className="px-6 py-5 hover:bg-white/3 transition-colors">
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
                                <p className="text-xs text-white/35 font-medium mb-2">{fmtDateTime(e.timestamp)}</p>
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
        </div>
    );
}
