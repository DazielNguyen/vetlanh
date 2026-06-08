"use client";

import { useState } from "react";
import { CheckCircle2, X, ShieldCheck } from "lucide-react";

type Pending = { id: number; username: string; displayName: string; plan: string; duration: number; amount: string; transferDate: string; note: string };
type Active  = { id: number; username: string; displayName: string; plan: string; grantedAt: string; expiresAt: string };
type Tab     = "pending" | "active";

const initialPending: Pending[] = [
    { id: 1, username: "nguyen_van_an",  displayName: "Nguyễn Văn An",  plan: "Pro 1 tháng", duration: 1, amount: "199,000đ", transferDate: "07/06/2026", note: "VET LANH PRO NGUYEN_VAN_AN" },
    { id: 2, username: "tran_thi_mai",   displayName: "Trần Thị Mai",   plan: "Pro 3 tháng", duration: 3, amount: "499,000đ", transferDate: "07/06/2026", note: "CK VETLANH tran_thi_mai pro 3 thang" },
    { id: 3, username: "le_hoang_nam",   displayName: "Lê Hoàng Nam",   plan: "Pro 1 tháng", duration: 1, amount: "199,000đ", transferDate: "06/06/2026", note: "VET LANH 199K" },
    { id: 4, username: "pham_thu_ha",    displayName: "Phạm Thu Hà",    plan: "Pro 6 tháng", duration: 6, amount: "899,000đ", transferDate: "05/06/2026", note: "dang ky pro 6 thang pham_thu_ha" },
];

const initialActive: Active[] = [
    { id: 1, username: "minh_tu99",    displayName: "Hoàng Minh Tú", plan: "Pro 1 tháng", grantedAt: "01/06/2026", expiresAt: "01/07/2026" },
    { id: 2, username: "minh_tran99",  displayName: "Minh Trần",     plan: "Pro 3 tháng", grantedAt: "15/05/2026", expiresAt: "15/08/2026" },
    { id: 3, username: "hoa_nguyen",   displayName: "Hoa Nguyễn",    plan: "Pro 1 tháng", grantedAt: "28/05/2026", expiresAt: "28/06/2026" },
    { id: 4, username: "quoc_bao",     displayName: "Đặng Quốc Bảo", plan: "Pro 1 tháng", grantedAt: "22/05/2026", expiresAt: "22/06/2026" },
];

const cardStyle = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" };

export default function AdminSubscriptionsPage() {
    const [tab, setTab] = useState<Tab>("pending");
    const [pending, setPending] = useState<Pending[]>(initialPending);
    const [active, setActive]   = useState<Active[]>(initialActive);
    const [confirmId, setConfirmId] = useState<number | null>(null);

    const handleGrant = (item: Pending) => {
        const today  = new Date();
        const expiry = new Date(today);
        expiry.setMonth(expiry.getMonth() + item.duration);
        const fmt = (d: Date) => d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
        setActive((p) => [{ id: Date.now(), username: item.username, displayName: item.displayName, plan: item.plan, grantedAt: fmt(today), expiresAt: fmt(expiry) }, ...p]);
        setPending((p) => p.filter((x) => x.id !== item.id));
        setConfirmId(null);
    };

    const confirmItem = pending.find((p) => p.id === confirmId);

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-[28px] font-bold text-white tracking-tight leading-none mb-1.5">Đăng ký gói</h1>
                <p className="text-white/45 font-medium text-sm">Cấp gói Pro thủ công sau khi xác nhận chuyển khoản</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 w-fit rounded-2xl border border-white/[0.09]" style={{ background: "rgba(255,255,255,0.04)" }}>
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
                <div className="rounded-[24px] border border-white/[0.09]" style={cardStyle}>
                    {pending.length === 0 ? (
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
                                    {["Người dùng", "Gói", "Số tiền", "Ngày chuyển", "Nội dung CK", "Thao tác"].map((h, i) => (
                                        <th key={i} className={`px-${i === 0 ? "6" : "4"} py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest${i === 5 ? " text-right pr-6" : ""}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pending.map((item) => (
                                    <tr key={item.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-white/60 uppercase">{item.displayName[0]}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white/90">{item.displayName}</p>
                                                    <p className="text-xs text-white/35 font-medium">@{item.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{item.plan}</span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-bold text-white/90">{item.amount}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">{item.transferDate}</td>
                                        <td className="px-4 py-4 max-w-[200px]">
                                            <p className="text-xs font-medium text-white/40 truncate" title={item.note}>{item.note}</p>
                                        </td>
                                        <td className="px-4 py-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setConfirmId(item.id)}
                                                    className="h-8 px-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl transition-colors border border-emerald-500/25 active:scale-[0.97]"
                                                >
                                                    Duyệt
                                                </button>
                                                <button
                                                    onClick={() => setPending((p) => p.filter((x) => x.id !== item.id))}
                                                    className="h-8 w-8 flex items-center justify-center bg-white/8 hover:bg-rose-500/15 text-white/35 hover:text-rose-400 rounded-xl transition-colors border border-white/10"
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
                <div className="rounded-[24px] border border-white/[0.09]" style={cardStyle}>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/[0.07]">
                                {["Người dùng", "Gói", "Ngày cấp", "Hết hạn", "Trạng thái"].map((h, i) => (
                                    <th key={i} className={`px-${i === 0 ? "6" : "4"} py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {active.map((item) => {
                                const [d, m, y] = item.expiresAt.split("/").map(Number);
                                const daysLeft  = Math.ceil((new Date(y, m - 1, d).getTime() - Date.now()) / 86400000);
                                const soon      = daysLeft <= 7 && daysLeft > 0;
                                const expired   = daysLeft <= 0;
                                return (
                                    <tr key={item.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-emerald-400 uppercase">{item.displayName[0]}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white/90">{item.displayName}</p>
                                                    <p className="text-xs text-white/35 font-medium">@{item.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{item.plan}</span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">{item.grantedAt}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">{item.expiresAt}</td>
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
                        <div className="rounded-2xl p-4 mb-6 space-y-2 text-sm border border-white/[0.08]" style={{ background: "rgba(255,255,255,0.05)" }}>
                            {[["Số tiền", confirmItem.amount], ["Ngày chuyển", confirmItem.transferDate], ["Nội dung CK", confirmItem.note]].map(([k, v]) => (
                                <div key={k} className="flex justify-between gap-4">
                                    <span className="text-white/45 font-medium shrink-0">{k}</span>
                                    <span className="font-bold text-white/90 text-right truncate">{v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmId(null)} className="flex-1 h-11 rounded-2xl border border-white/15 text-white/60 text-sm font-bold hover:bg-white/[0.06] transition-colors">
                                Hủy
                            </button>
                            <button onClick={() => handleGrant(confirmItem)} className="flex-1 h-11 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-bold transition-colors border border-emerald-500/25 active:scale-[0.98]">
                                Xác nhận cấp
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-xs text-white/25 font-medium text-center">Dữ liệu mock. Kết nối BE để lưu trữ thực tế.</p>
        </div>
    );
}
