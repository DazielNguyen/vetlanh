"use client";

import Link from "next/link";
import { Users, Activity, Wallet, Bug, CreditCard, ChevronRight, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const stats = [
    { title: "TỔNG NGƯỜI DÙNG", value: "12,840", sub: "+127 tháng này", icon: Users, accent: "rgba(255,255,255,0.08)", iconColor: "text-white/60", badge: "+1%", badgeCls: "bg-white/10 text-white/60" },
    { title: "ĐANG HOẠT ĐỘNG", value: "847", sub: "Trực tuyến 24h qua", icon: Activity, accent: "rgba(16,185,129,0.10)", iconColor: "text-emerald-400", badge: "+12%", badgeCls: "bg-emerald-500/15 text-emerald-400" },
    { title: "DOANH THU THÁNG", value: "45.9M", sub: "VND · tháng 06/2026", icon: Wallet, accent: "rgba(59,130,246,0.10)", iconColor: "text-blue-400", badge: "+18%", badgeCls: "bg-blue-500/15 text-blue-400" },
    { title: "LỖI CHƯA XỬ LÝ", value: "3", sub: "Cần báo cho DEV", icon: Bug, accent: "rgba(239,68,68,0.10)", iconColor: "text-rose-400", badge: "Mới", badgeCls: "bg-rose-500/15 text-rose-400" },
];

const subChartData = [
    { day: "T2", value: 3 },
    { day: "T3", value: 5 },
    { day: "T4", value: 2 },
    { day: "T5", value: 7 },
    { day: "T6", value: 4 },
    { day: "T7", value: 8 },
    { day: "CN", value: 6 },
];

const pendingSubs = [
    { username: "nguyen_van_an", plan: "Pro 1 tháng", amount: "199,000đ", date: "07/06/2026" },
    { username: "tran_thi_mai", plan: "Pro 3 tháng", amount: "499,000đ", date: "07/06/2026" },
    { username: "le_hoang_nam", plan: "Pro 1 tháng", amount: "199,000đ", date: "06/06/2026" },
];

const recentErrors = [
    { type: "SignalR 401", route: "/services/chat", severity: "HIGH", time: "14:23 hôm nay" },
    { type: "API Timeout", route: "/api/exercises", severity: "MEDIUM", time: "11:05 hôm nay" },
    { type: "404 Not Found", route: "/services/journal/undefined", severity: "LOW", time: "08:47 hôm nay" },
];

const severityStyle: Record<string, string> = {
    HIGH:   "bg-rose-500/15 text-rose-400 border-rose-500/20",
    MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    LOW:    "bg-white/8 text-white/45 border-white/10",
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
        return (
            <div className="px-3 py-2 rounded-xl border border-white/15 text-sm font-bold text-white" style={{ background: "rgba(11,15,13,0.92)", backdropFilter: "blur(12px)" }}>
                {payload[0].value} đăng ký
            </div>
        );
    }
    return null;
};

const cardCls = "rounded-[24px] border border-white/[0.09] p-6" ;
const cardStyle = { background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)" };

export default function AdminDashboardPage() {
    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-[28px] font-bold text-white tracking-tight leading-none mb-1.5">Tổng quan</h1>
                <p className="text-white/45 font-medium text-sm">Dữ liệu cập nhật: Chủ nhật, 08/06/2026</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((s, i) => (
                    <div key={i} className={cardCls} style={{ ...cardStyle, background: s.accent }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                            </div>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.badgeCls}`} style={{ borderColor: "transparent" }}>
                                {s.badge}
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-1">{s.title}</p>
                        <p className="text-[32px] font-extrabold text-white tabular-nums tracking-tight leading-none mb-1">{s.value}</p>
                        <p className="text-xs text-white/40 font-medium">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Chart */}
                <div className={`lg:col-span-2 ${cardCls}`} style={cardStyle}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-white">Đăng ký mới trong tuần</h3>
                            <p className="text-xs text-white/40 font-medium mt-0.5">Gói Pro được cấp theo ngày</p>
                        </div>
                        <span className="text-sm font-bold text-white/60 bg-white/[0.07] px-4 py-2 rounded-xl border border-white/[0.08]">Tuần này</span>
                    </div>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subChartData} barGap={6}>
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={32}>
                                    {subChartData.map((_, idx) => (
                                        <Cell key={idx} fill={idx === 5 ? "#10b981" : "rgba(255,255,255,0.10)"} />
                                    ))}
                                </Bar>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.30)", fontSize: 12, fontWeight: 600 }} dy={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-white/30 font-medium text-center mt-4">Tổng 35 gói trong 7 ngày qua</p>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-4">
                    <div className={cardCls} style={cardStyle}>
                        <h3 className="text-sm font-bold text-white mb-4">Phân loại gói</h3>
                        <div className="space-y-3">
                            {[
                                { label: "Pro 1 tháng", count: 21, color: "bg-emerald-400" },
                                { label: "Pro 3 tháng", count: 9,  color: "bg-blue-400" },
                                { label: "Pro 6 tháng", count: 5,  color: "bg-violet-400" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                                    <span className="text-sm font-medium text-white/60 flex-1">{item.label}</span>
                                    <span className="text-sm font-bold text-white tabular-nums">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[20px] border border-amber-500/20 p-5 flex items-center gap-4" style={{ background: "rgba(245,158,11,0.08)" }}>
                        <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white">4 yêu cầu chờ duyệt</p>
                            <p className="text-xs text-white/45 font-medium">Cần xác nhận chuyển khoản</p>
                        </div>
                        <Link href="/admin/subscriptions" className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0">
                            Xem
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Pending Subs */}
                <div className={cardCls} style={cardStyle}>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-white/40" />
                            Chờ cấp gói
                        </h3>
                        <Link href="/admin/subscriptions" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
                            Xem tất cả <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {pendingSubs.map((s, i) => (
                            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.06] last:border-0">
                                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-white/70 uppercase">{s.username[0]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white/85 truncate">{s.username}</p>
                                    <p className="text-xs text-white/40 font-medium">{s.plan} · {s.date}</p>
                                </div>
                                <span className="text-sm font-bold text-emerald-400 shrink-0">{s.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Errors */}
                <div className={cardCls} style={cardStyle}>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Bug className="w-4 h-4 text-white/40" />
                            Lỗi gần đây
                        </h3>
                        <Link href="/admin/errors" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
                            Xem tất cả <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentErrors.map((e, i) => (
                            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.06] last:border-0">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border shrink-0 ${severityStyle[e.severity]}`}>
                                    {e.severity}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white/85 truncate">{e.type}</p>
                                    <p className="text-xs text-white/40 font-medium truncate">{e.route}</p>
                                </div>
                                <span className="text-[11px] text-white/35 font-medium shrink-0">{e.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
