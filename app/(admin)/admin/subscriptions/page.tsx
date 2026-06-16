"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, X, ShieldCheck, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { fetchAdmin, type PendingSubscription, type ActiveSubscription } from "@/lib/api/services/fetchAdmin";
import { env } from "@/lib/env";

type Tab = "pending" | "active";

const fmtDate = (iso: string | null | undefined) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return [d.getDate(), d.getMonth() + 1, d.getFullYear()].map(n => String(n).padStart(2, "0")).join("/");
};

// BE may return a relative path (e.g. "/uploads/bill_x.jpg") instead of a full URL —
// resolve it against the API origin so <img> doesn't request it from the FE's own domain.
const resolveImageUrl = (url: string) =>
    /^https?:\/\//.test(url) ? url : `${env.apiUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;

const cardStyle = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" };

export default function AdminSubscriptionsPage() {
    const [tab, setTab]           = useState<Tab>("pending");
    const [pending, setPending]   = useState<PendingSubscription[]>([]);
    const [active, setActive]     = useState<ActiveSubscription[]>([]);
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [loading, setLoading]   = useState(false);
    const [acting, setActing]     = useState(false);

    const refetch = () => {
        setLoading(true);
        Promise.all([
            fetchAdmin.getPendingSubscriptions(),
            fetchAdmin.getActiveSubscriptions(),
        ])
            .then(([p, a]) => { setPending(p); setActive(a); })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { refetch(); }, []);

    const handleGrant = async (item: PendingSubscription) => {
        setActing(true);
        try {
            const granted = await fetchAdmin.grantSubscription(item.id, item.duration);
            setActive(prev => [granted, ...prev]);
            setPending(prev => prev.filter(x => x.id !== item.id));
            setConfirmId(null);
            toast.success(`Đã cấp gói ${item.plan} cho @${item.username}`);
        } catch (err) {
            toast.error((err as { message?: string })?.message ?? "Cấp gói thất bại. Vui lòng thử lại.");
        } finally {
            setActing(false);
        }
    };

    const handleReject = async (id: string) => {
        setActing(true);
        try {
            await fetchAdmin.rejectSubscription(id);
            setPending(prev => prev.filter(x => x.id !== id));
            toast.success("Đã từ chối yêu cầu");
        } catch (err) {
            toast.error((err as { message?: string })?.message ?? "Từ chối thất bại. Vui lòng thử lại.");
        } finally {
            setActing(false);
        }
    };

    const confirmItem = pending.find(p => p.id === confirmId);

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-[28px] font-bold text-white tracking-tight leading-none mb-1.5">Đăng ký gói</h1>
                <p className="text-white/45 font-medium text-sm">Cấp gói Pro thủ công sau khi xác nhận chuyển khoản</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 w-fit rounded-2xl border border-white/9" style={{ background: "rgba(255,255,255,0.04)" }}>
                {([["pending", "Chờ duyệt", pending.length], ["active", "Đang hoạt động", active.length]] as [Tab, string, number][]).map(([value, label, count]) => (
                    <button
                        key={value}
                        onClick={() => setTab(value)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            tab === value
                                ? "bg-emerald-500/20 text-white border border-emerald-500/25"
                                : "text-white/45 hover:text-white/80"
                        }`}
                    >
                        {label}
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                            tab === value ? "bg-white/15 text-white" : "bg-white/8 text-white/40"
                        }`}>{count}</span>
                    </button>
                ))}
            </div>

            {/* Pending */}
            {tab === "pending" && (
                <div className="rounded-[24px] border border-white/9" style={cardStyle}>
                    {!loading && pending.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            </div>
                            <p className="text-sm font-bold text-white/70">Tất cả đã được xử lý</p>
                            <p className="text-xs text-white/35 font-medium">Không còn yêu cầu chờ duyệt</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/[0.07]">
                                    {["Người dùng", "Gói", "Số tiền", "Ngày chuyển", "Nội dung CK", "Ảnh bill", "Thao tác"].map((h, i) => (
                                        <th key={i} className={`${i === 0 ? "px-6" : "px-4"} py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest${i === 6 ? " text-right pr-6" : ""}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-white/30 font-medium">Đang tải...</td>
                                    </tr>
                                )}
                                {!loading && pending.map((item) => (
                                    <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-white/60 uppercase">{(item.displayName ?? item.username ?? "?")[0]}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white/90">{item.displayName ?? item.username}</p>
                                                    <p className="text-xs text-white/35 font-medium">@{item.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{item.plan}</span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-bold text-white/90">{item.amount}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">{fmtDate(item.transferDate)}</td>
                                        <td className="px-4 py-4 max-w-50">
                                            <p className="text-xs font-medium text-white/40 truncate" title={item.note}>{item.note}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            {item.bill_image_url ? (
                                                <a href={resolveImageUrl(item.bill_image_url)} target="_blank" rel="noopener noreferrer">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={resolveImageUrl(item.bill_image_url)}
                                                        alt="Bill CK"
                                                        className="w-12 h-12 rounded-lg object-cover border border-white/10 hover:opacity-80 transition-opacity cursor-zoom-in"
                                                    />
                                                </a>
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                                                    <ImageOff className="w-4 h-4 text-white/20" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setConfirmId(item.id)}
                                                    disabled={acting}
                                                    className="h-8 px-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl transition-colors border border-emerald-500/25 active:scale-[0.97] disabled:opacity-50"
                                                >
                                                    Duyệt
                                                </button>
                                                <button
                                                    onClick={() => handleReject(item.id)}
                                                    disabled={acting}
                                                    className="h-8 w-8 flex items-center justify-center bg-white/8 hover:bg-rose-500/15 text-white/35 hover:text-rose-400 rounded-xl transition-colors border border-white/10 disabled:opacity-50"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Active */}
            {tab === "active" && (
                <div className="rounded-[24px] border border-white/9" style={cardStyle}>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/[0.07]">
                                {["Người dùng", "Gói", "Ngày cấp", "Hết hạn", "Trạng thái"].map((h, i) => (
                                    <th key={i} className={`${i === 0 ? "px-6" : "px-4"} py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-white/30 font-medium">Đang tải...</td>
                                </tr>
                            )}
                            {!loading && active.map((item) => {
                                const daysLeft = Math.ceil((new Date(item.expiresAt).getTime() - Date.now()) / 86400000);
                                const soon    = daysLeft <= 7 && daysLeft > 0;
                                const expired = daysLeft <= 0;
                                return (
                                    <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-emerald-400 uppercase">{(item.displayName ?? item.username ?? "?")[0]}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white/90">{item.displayName ?? item.username}</p>
                                                    <p className="text-xs text-white/35 font-medium">@{item.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{item.plan}</span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">{fmtDate(item.grantedAt)}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">{fmtDate(item.expiresAt)}</td>
                                        <td className="px-4 py-4">
                                            {expired ? (
                                                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/20">Hết hạn</span>
                                            ) : soon ? (
                                                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20">Sắp hết ({daysLeft}d)</span>
                                            ) : (
                                                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Còn {daysLeft} ngày</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Confirm Modal */}
            {confirmItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmId(null)} />
                    <div className="relative rounded-[28px] p-8 w-full max-w-sm border border-white/15 shadow-2xl" style={{ background: "rgba(15,20,17,0.95)", backdropFilter: "blur(24px)" }}>
                        <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-5">
                            <ShieldCheck className="w-7 h-7 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white text-center mb-1.5">Xác nhận cấp gói</h3>
                        <p className="text-sm text-white/50 text-center font-medium mb-6">
                            Cấp <span className="font-bold text-white">{confirmItem.plan}</span> cho <span className="font-bold text-white">@{confirmItem.username}</span>?
                        </p>
                        <div className="rounded-2xl p-4 mb-4 space-y-2 text-sm border border-white/8" style={{ background: "rgba(255,255,255,0.05)" }}>
                            {[["Số tiền", confirmItem.amount], ["Ngày chuyển", fmtDate(confirmItem.transferDate)], ["Nội dung CK", confirmItem.note]].map(([k, v]) => (
                                <div key={k} className="flex justify-between gap-4">
                                    <span className="text-white/45 font-medium shrink-0">{k}</span>
                                    <span className="font-bold text-white/90 text-right truncate">{v}</span>
                                </div>
                            ))}
                        </div>
                        {confirmItem.bill_image_url && (
                            <div className="mb-6">
                                <p className="text-xs font-semibold text-white/35 mb-2">Ảnh bill chuyển khoản</p>
                                <a href={resolveImageUrl(confirmItem.bill_image_url)} target="_blank" rel="noopener noreferrer">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={resolveImageUrl(confirmItem.bill_image_url)}
                                        alt="Bill chuyển khoản"
                                        className="w-full max-h-52 object-contain rounded-xl border border-white/10 hover:opacity-90 transition-opacity cursor-zoom-in"
                                    />
                                </a>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmId(null)} className="flex-1 h-11 rounded-2xl border border-white/15 text-white/60 text-sm font-bold hover:bg-white/6 transition-colors">
                                Hủy
                            </button>
                            <button
                                onClick={() => handleGrant(confirmItem)}
                                disabled={acting}
                                className="flex-1 h-11 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-bold transition-colors border border-emerald-500/25 active:scale-[0.98] disabled:opacity-50"
                            >
                                {acting ? "Đang xử lý..." : "Xác nhận cấp"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
