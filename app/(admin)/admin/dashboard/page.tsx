"use client";

import { User, ShieldCheck, HeartPulse, Wallet, TriangleAlert, Info, ShieldAlert, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, Cell, XAxis, ResponsiveContainer, Tooltip } from "recharts";

const stats = [
    { title: "TỔNG NGƯỜI DÙNG", value: "12,840", percent: "+12%", bg: "bg-slate-50", iconBg: "bg-slate-100", iconColor: "text-slate-500", icon: User },
    { title: "CHUYÊN GIA HOẠT ĐỘNG", value: "156", percent: "+5%", bg: "bg-emerald-50", iconBg: "bg-emerald-100", iconColor: "text-emerald-500", icon: ShieldCheck },
    { title: "CA CHỮA LÀNH THÀNH CÔNG", value: "8,420", percent: "+18%", bg: "bg-rose-50", iconBg: "bg-rose-100", iconColor: "text-rose-500", icon: HeartPulse },
    { title: "DOANH THU (VNĐ)", value: "450.0M", percent: "+10%", bg: "bg-blue-50", iconBg: "bg-blue-100", iconColor: "text-blue-500", icon: Wallet },
];

const chartData = [
    { name: "00:00", value: 40, type: "low" },
    { name: "", value: 50, type: "low" },
    { name: "06:00", value: 80, type: "medium" },
    { name: "", value: 95, type: "medium" },
    { name: "12:00", value: 65, type: "low" },
    { name: "", value: 120, type: "high" },
    { name: "18:00", value: 100, type: "high" },
    { name: "", value: 85, type: "medium" },
    { name: "23:59", value: 45, type: "low" },
    { name: "", value: 40, type: "low" }
];

const getBarColor = (type: string) => {
    switch (type) {
        case "low": return "#dcfce7"; // bg-green-100
        case "medium": return "#bae6fd"; // bg-sky-100
        case "high": return "#fce7f3"; // bg-pink-100
        default: return "#e2e8f0";
    }
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        let label = "Thấp";
        if (data.type === "medium") label = "Trung bình";
        if (data.type === "high") label = "Cần chú ý";
        return (
            <div className="bg-white p-3 border border-slate-100 shadow-sm rounded-xl text-sm">
                <p className="font-bold text-slate-800 mb-1">{label}</p>
                <p className="text-slate-600">Chỉ số stress: <span className="font-semibold text-slate-800">{data.value}</span></p>
            </div>
        );
    }
    return null;
};

export default function AdminDashboardPage() {
    return (
        <div className="w-full space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-[28px] font-bold text-slate-800 tracking-tight leading-none mb-2">Tổng quan hệ thống</h1>
                <p className="text-slate-500 font-medium">Dữ liệu cập nhật mới nhất hôm nay, 24/05/2024</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.iconBg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.bg} ${stat.iconColor}`}>
                                {stat.percent}
                            </span>
                        </div>
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.title}</h3>
                        <p className="text-[32px] font-extrabold text-slate-800 tabular-nums tracking-tight leading-none">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Main Charts & Tables) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chart Container */}
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-800">
                                Theo dõi mức độ căng thẳng
                                <span className="block text-sm font-medium text-slate-400 mt-1">Phân bổ chỉ số stress trong 24 giờ qua</span>
                            </h3>
                            <button className="text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl transition-colors">
                                Hôm nay
                            </button>
                        </div>

                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={6}>
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} />
                                        ))}
                                    </Bar>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Chart Legend */}
                        <div className="flex items-center justify-center gap-6 mt-8">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-100"></span>
                                <span className="text-xs font-bold text-slate-500 leading-none">Thấp</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-sky-100"></span>
                                <span className="text-xs font-bold text-slate-500 leading-none">Trung bình</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-pink-100"></span>
                                <span className="text-xs font-bold text-slate-500 leading-none">Cần chú ý</span>
                            </div>
                        </div>
                    </div>

                    {/* Pending Experts Table Container */}
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Chuyên gia chờ duyệt</h3>
                            <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                                Xem tất cả
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">HỌ VÀ TÊN</th>
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">CHUYÊN MÔN</th>
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">CHỨNG CHỈ</th>
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right pr-2">THAO TÁC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Mock Empty Space to match visual weight, adding a row for completeness */}
                                    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 pl-2">
                                            <div className="flex items-center gap-3">
                                                <img src="/images/placeholder-user.jpg" alt="" className="w-10 h-10 rounded-full border border-slate-100" />
                                                <span className="font-bold text-sm text-slate-700">Nguyễn Văn A</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm font-medium text-slate-600">Tâm lý học lâm sàng</td>
                                        <td className="py-4"><span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Đã tải lên 2 tệp</span></td>
                                        <td className="py-4 text-right pr-2">
                                            <button className="text-sm font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">Duyệt</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column (Alerts Sidebar) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Cảnh báo hệ thống</h3>
                            <span className="bg-rose-50 text-rose-500 text-xs font-bold px-2 py-0.5 rounded-full">4</span>
                        </div>

                        <div className="space-y-4">
                            {/* Urgent Alert */}
                            <div className="bg-[#fff1f2] rounded-2xl p-5 border border-rose-100">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2 text-rose-600">
                                        <TriangleAlert className="w-4 h-4" />
                                        <span className="text-xs font-bold tracking-wide uppercase">CẢNH BÁO KHẨN CẤP (AI)</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-rose-400">2 phút trước</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-800 mb-4 leading-relaxed">
                                    Người dùng #USR-892 có chỉ số stress vượt ngưỡng an toàn (9.5/10).
                                </p>
                                <div className="flex items-center gap-2">
                                    <button className="flex-1 bg-primary hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                                        Gán chuyên gia
                                    </button>
                                    <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-xl transition-colors">
                                        Bỏ qua
                                    </button>
                                </div>
                            </div>

                            {/* Info Alert */}
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Info className="w-4 h-4 fill-slate-200" />
                                        <span className="text-xs font-bold tracking-wide uppercase">CAN THIỆP HỖ TRỢ</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">15 phút trước</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-800 mb-4 leading-relaxed">
                                    Phát hiện dấu hiệu lo âu kéo dài tại khu vực TP. Hồ Chí Minh.
                                </p>
                                <button className="w-full bg-slate-200/50 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-xl transition-colors">
                                    Xem báo cáo vùng
                                </button>
                            </div>

                            {/* Success Alert */}
                            <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/50">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <ShieldAlert className="w-4 h-4" />
                                        <span className="text-xs font-bold tracking-wide uppercase">HỆ THỐNG</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-400">1 giờ trước</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                                    Dữ liệu sao lưu hoàn tất. Trạng thái: An toàn.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
