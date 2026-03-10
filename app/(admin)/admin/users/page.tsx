"use client";

import {
    Mail,
    Video,
    Sparkles,
    Activity,
    TriangleAlert,
    CheckCircle2,
    MoreHorizontal,
    Lock,
    Calendar,
    Share2,
    ArrowRightCircle,
    FileText,
    Download,
    Plus
} from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid } from "recharts";

const stressData = [
    { name: "MON", value: 30 },
    { name: "TUE", value: 35 },
    { name: "WED", value: 60 },
    { name: "THU", value: 55 },
    { name: "FRI", value: 40 },
    { name: "SAT", value: 30 },
    { name: "SUN", value: 25 },
];

const testData = [
    { name: "JAN", phq9: 22, gad7: 18 },
    { name: "FEB", phq9: 20, gad7: 19 },
    { name: "MAR", phq9: 18, gad7: 16 },
    { name: "MAY", phq9: 15, gad7: 17 },
    { name: "JUL", phq9: 12, gad7: 14 },
    { name: "SEP", phq9: 14, gad7: 12 },
    { name: "OCT", phq9: 14, gad7: 16 },
];

export default function AdminClientDetailsPage() {
    return (
        <div className="w-full space-y-6 max-w-[1200px] mx-auto">
            {/* Page Header */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <img
                        src="/images/placeholder-user.jpg"
                        alt="Nguyen Van An"
                        className="w-16 h-16 rounded-full border border-slate-200 object-cover"
                    />
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Nguyễn Văn An</h1>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#e6f4ea] text-[#1e8e3e] uppercase tracking-wider">
                                Đang chữa lành
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                            28 tuổi • ID: #VL-9012 • Tham gia từ Th01 2024
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-10 px-4 flex items-center gap-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">
                        <Mail className="w-4 h-4 text-primary" />
                        Nhắn tin
                    </button>
                    <button className="h-10 px-5 flex items-center gap-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors shadow-sm text-sm">
                        <Video className="w-4 h-4" />
                        Bắt đầu phiên
                    </button>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Main Insights & Progress */}
                <div className="lg:col-span-2 space-y-6">

                    {/* AI Insights Card */}
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-500" />
                                Phân tích AI (7 ngày qua)
                            </h2>
                            <span className="text-[11px] font-medium text-slate-400">Cập nhật 2 giờ trước</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Mood Trend */}
                            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                        <span className="text-[10px]">😐</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Xu hướng tâm trạng</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">Tương đối ổn định</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">Thỉnh thoảng có biểu hiện lo âu vào buổi tối.</p>
                            </div>

                            {/* Stress Trend */}
                            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 relative">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chỉ số căng thẳng</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-[#5b82a3]">Trung bình</span>
                                        <span className="block text-[10px] font-bold text-slate-400 text-right">~12%</span>
                                    </div>
                                </div>
                                <div className="h-16 w-full mt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stressData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#789dbc" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#789dbc" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="value" stroke="#789dbc" strokeWidth={2} fillOpacity={1} fill="url(#colorStress)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} dy={5} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Detected Triggers Alert */}
                        <div className="bg-[#fff0f0] rounded-2xl p-4 border border-[#ffe0e0] flex items-start gap-3">
                            <TriangleAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 mb-1">Nguyên nhân kích hoạt</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Nhiều ghi chép nhật ký đề cập đến <span className="font-bold underline decoration-rose-200 decoration-2 underline-offset-2">áp lực công việc</span> và <span className="font-bold underline decoration-rose-200 decoration-2 underline-offset-2">thiếu ngủ</span> trước các chu kỳ căng thẳng cao.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Healing Path Progress Card */}
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <h2 className="text-base font-bold text-slate-800 mb-1">Tiến trình chữa lành</h2>
                                <p className="text-xs font-semibold text-slate-500">Phác đồ: Vượt qua Rối loạn Lo âu Lan tỏa</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-extrabold text-[#75c68f] leading-none">65%</span>
                                <span className="block text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Đã hoàn thành 14/22 mục tiêu</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6 flex">
                            <div className="h-full bg-[#a8d4b8] w-[65%] rounded-full relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                            </div>
                        </div>

                        {/* Path Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-transparent">
                                <div className="w-8 h-8 rounded-full bg-[#f0f9f4] flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-[#4ecb71]" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 leading-tight">Mở đầu liệu pháp nhận thức - hành vi (CBT)</h4>
                                    <p className="text-[11px] text-slate-400 font-medium">Đã xong ngày 12/03</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                <div className="w-8 h-8 rounded-full bg-[#f0f4f8] flex items-center justify-center shrink-0">
                                    <MoreHorizontal className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 leading-tight">Liệu pháp phơi nhiễm Giai đoạn 1</h4>
                                    <p className="text-[11px] font-semibold text-primary">Đang thực hiện - Còn 4 buổi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Session History Card */}
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <h2 className="text-base font-bold text-slate-800 mb-6">Lịch sử tư vấn</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <th className="pb-3 pl-2">Ngày</th>
                                    <th className="pb-3">Loại phiên tư vấn</th>
                                    <th className="pb-3">Thời gian</th>
                                    <th className="pb-3">Trạng thái</th>
                                    <th className="pb-3 text-right pr-2">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 pl-2 font-bold text-slate-800">14/10/2023</td>
                                    <td className="py-4 font-medium text-slate-600">Tái khám định kỳ</td>
                                    <td className="py-4 text-slate-500">50 phút</td>
                                    <td className="py-4">
                                        <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-500 uppercase">Hoàn thành</span>
                                    </td>
                                    <td className="py-4 text-right pr-2">
                                        <button className="text-[13px] font-bold text-primary hover:underline">Xem ghi chú</button>
                                    </td>
                                </tr>
                                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 pl-2 font-bold text-slate-800">21/10/2023</td>
                                    <td className="py-4 font-medium text-slate-600">Liệu pháp phơi nhiễm</td>
                                    <td className="py-4 text-slate-400">-</td>
                                    <td className="py-4">
                                        <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-[#e8f3fb] text-[#3498db] uppercase">Sắp tới</span>
                                    </td>
                                    <td className="py-4 text-right pr-2">
                                        <button className="text-[13px] font-bold text-primary hover:underline">Chuẩn bị</button>
                                    </td>
                                </tr>
                                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 pl-2 font-bold text-slate-800">07/10/2023</td>
                                    <td className="py-4 font-medium text-slate-600">Buổi đánh giá ban đầu</td>
                                    <td className="py-4 text-slate-500">60 phút</td>
                                    <td className="py-4">
                                        <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-500 uppercase">Hoàn thành</span>
                                    </td>
                                    <td className="py-4 text-right pr-2">
                                        <button className="text-[13px] font-bold text-primary hover:underline">Xem ghi chú</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Sidebar Insights & Utilities */}
            <div className="lg:col-span-1 space-y-6">

                {/* Clinical Notes */}
                <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-[280px]">
                    <div className="p-5 flex items-center justify-between border-b border-slate-50">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                            <FileText className="w-4 h-4 text-slate-500" />
                            Ghi chú lâm sàng
                        </h3>
                        <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 p-5 relative">
                        <textarea
                            className="w-full h-full resize-none bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300 font-medium leading-relaxed"
                            placeholder="Bắt đầu nhập các quan sát cá nhân định kỳ dành cho Nguyễn Văn An..."
                        ></textarea>
                        <div className="absolute bottom-4 inset-x-5 flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                            <span>Tự động lưu 10s trước</span>
                            <button className="text-primary hover:underline">Xem lịch sử chỉnh sửa</button>
                        </div>
                    </div>
                </div>

                {/* Management Actions */}
                <div>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">Thao tác quản lý</h3>
                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-4 bg-white rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#f0f4f8] flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Điều chỉnh phác đồ</span>
                            </div>
                            <ArrowRightCircle className="w-4 h-4 text-slate-300" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 bg-white rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#f0f4f8] flex items-center justify-center">
                                    <Share2 className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Xem nhật ký cá nhân</span>
                            </div>
                            <ArrowRightCircle className="w-4 h-4 text-slate-300" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 bg-white rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#f0f4f8] flex items-center justify-center">
                                    <ArrowRightCircle className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Chuyển tiếp chuyên gia</span>
                            </div>
                            <ArrowRightCircle className="w-4 h-4 text-slate-300" />
                        </button>
                    </div>
                </div>

                {/* Psychological Test Data */}
                <div>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">Dữ liệu kiểm tra tâm lý</h3>
                    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-5">
                        {/* Chart Header */}
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Xu hướng đánh giá</span>
                            <div className="flex items-center gap-3 text-[10px] font-bold">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#789dbc]"></div>PHQ-9</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#a8d4b8]"></div>GAD-7</div>
                            </div>
                        </div>

                        {/* Quick filters mock */}
                        <div className="flex items-center justify-between gap-3">
                            <select className="flex-1 bg-slate-50 border-none text-xs font-bold text-slate-600 rounded-xl px-3 py-2 outline-none appearance-none">
                                <option>2023</option>
                            </select>
                            <select className="flex-1 bg-slate-50 border-none text-xs font-bold text-slate-600 rounded-xl px-3 py-2 outline-none appearance-none">
                                <option>Q4</option>
                                <option>Q3</option>
                                <option>Q2</option>
                                <option>Q1</option>
                            </select>
                        </div>

                        {/* Dual Line Chart */}
                        <div className="h-32 w-full mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={testData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#cbd5e1' }} domain={[0, 25]} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} dy={5} />
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }} />
                                    <Line type="monotone" dataKey="phq9" stroke="#789dbc" strokeWidth={3} dot={{ r: 3, fill: '#789dbc', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                    <Line type="monotone" dataKey="gad7" stroke="#a8d4b8" strokeWidth={3} dot={{ r: 3, fill: '#a8d4b8', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 font-medium italic mt-2">Biểu đồ cho thấy xu hướng điểm giảm tương đối định chuẩn (tích cực).</p>

                        {/* Score Cards */}
                        <div className="space-y-3 pt-4 border-t border-slate-50">
                            {/* PHQ-9 */}
                            <div className="bg-slate-50/80 rounded-[16px] p-4 border border-slate-100">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">PHQ-9</h4>
                                        <p className="text-[10px] text-slate-400 font-medium">12/10/2023</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-extrabold text-slate-800 leading-none">14</span>
                                        <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Trung bình</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                                        <FileText className="w-3.5 h-3.5 text-primary" /> Xem báo cáo chi tiết
                                    </button>
                                    <button className="w-10 flex shrink-0 items-center justify-center bg-white border border-slate-200 text-slate-400 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-colors">
                                        <Download className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* GAD-7 */}
                            <div className="bg-slate-50/80 rounded-[16px] p-4 border border-slate-100">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">GAD-7</h4>
                                        <p className="text-[10px] text-slate-400 font-medium">12/10/2023</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-extrabold text-slate-800 leading-none">16</span>
                                        <span className="block text-[9px] font-bold text-rose-400 uppercase tracking-widest mt-0.5">Nghiêm trọng</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                                        <FileText className="w-3.5 h-3.5 text-primary" /> Xem báo cáo chi tiết
                                    </button>
                                    <button className="w-10 flex shrink-0 items-center justify-center bg-white border border-slate-200 text-slate-400 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-colors">
                                        <Download className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient Documents */}
                <div>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">Hồ sơ khám chữa</h3>
                    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
                        <div className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <span className="text-[9px] font-extrabold text-slate-500 uppercase">PDF</span>
                                </div>
                                <span className="text-[13px] font-bold text-slate-700 group-hover:text-primary transition-colors">Tai_Lieu_Danh_Gia_Ban_Dau.pdf</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">1.2 MB</span>
                        </div>
                        <div className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <span className="text-[9px] font-extrabold text-slate-500 uppercase">PDF</span>
                                </div>
                                <span className="text-[13px] font-bold text-slate-700 group-hover:text-primary transition-colors">Khao_Sat_Giac_Ngu.pdf</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">0.8 MB</span>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-primary hover:bg-slate-50 hover:border-primary/50 transition-all mt-2">
                            <Plus className="w-3.5 h-3.5" /> Tải lên tài liệu
                        </button>
                    </div>
                </div>

            </div>
        </div >
    );
}
