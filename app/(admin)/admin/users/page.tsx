"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const mockUsers = [
    { id: 1,  displayName: "Nguyễn Văn An",   username: "nguyen_van_an",  type: "username", joinDate: "12/01/2026", lastActive: "Hôm nay",       sub: "Pro",     subExpiry: "01/07/2026" },
    { id: 2,  displayName: "Trần Thị Mai",    username: "tran_thi_mai",   type: "username", joinDate: "28/02/2026", lastActive: "Hôm qua",       sub: "Pro",     subExpiry: "15/09/2026" },
    { id: 3,  displayName: "Lê Hoàng Nam",    username: "le_hoang_nam",   type: "email",    joinDate: "05/03/2026", lastActive: "3 ngày trước",  sub: "None",    subExpiry: null },
    { id: 4,  displayName: "Phạm Thu Hà",     username: "pham_thu_ha",    type: "username", joinDate: "17/03/2026", lastActive: "1 tuần trước",  sub: "Expired", subExpiry: "01/06/2026" },
    { id: 5,  displayName: "Hoàng Minh Tú",   username: "minh_tu99",      type: "email",    joinDate: "02/04/2026", lastActive: "Hôm nay",       sub: "Pro",     subExpiry: "20/07/2026" },
    { id: 6,  displayName: "Vũ Ngọc Linh",    username: "ngoc_linh",      type: "username", joinDate: "14/04/2026", lastActive: "2 ngày trước",  sub: "None",    subExpiry: null },
    { id: 7,  displayName: "Đặng Quốc Bảo",   username: "quoc_bao",       type: "email",    joinDate: "22/04/2026", lastActive: "Hôm nay",       sub: "Pro",     subExpiry: "22/07/2026" },
    { id: 8,  displayName: "Bùi Thị Lan",     username: "thi_lan_bui",    type: "username", joinDate: "01/05/2026", lastActive: "5 ngày trước",  sub: "None",    subExpiry: null },
    { id: 9,  displayName: "Ngô Xuân Khoa",   username: "xuan_khoa",      type: "email",    joinDate: "10/05/2026", lastActive: "Hôm qua",       sub: "Expired", subExpiry: "05/06/2026" },
    { id: 10, displayName: "Đinh Thị Hương",  username: "thi_huong_d",    type: "username", joinDate: "18/05/2026", lastActive: "Hôm nay",       sub: "None",    subExpiry: null },
];

const subStyle: Record<string, { label: string; cls: string }> = {
    Pro:     { label: "Pro",      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    Expired: { label: "Hết hạn",  cls: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
    None:    { label: "Miễn phí", cls: "bg-white/8 text-white/45 border-white/10" },
};

const cardStyle = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" };

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");

    const filtered = mockUsers.filter(
        (u) =>
            u.displayName.toLowerCase().includes(search.toLowerCase()) ||
            u.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-[28px] font-bold text-white tracking-tight leading-none mb-1.5">Người dùng</h1>
                <p className="text-white/45 font-medium text-sm">Tổng cộng {mockUsers.length.toLocaleString()} tài khoản</p>
            </div>

            <div className="rounded-[24px] border border-white/[0.09]" style={cardStyle}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc username..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 h-10 rounded-xl text-sm font-medium text-white/80 placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all border border-white/[0.09]"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                        />
                    </div>
                    <p className="text-xs font-bold text-white/30">{filtered.length} kết quả</p>
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
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-white/30 font-medium">
                                        Không tìm thấy người dùng nào.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((u) => {
                                const sub = subStyle[u.sub];
                                return (
                                    <tr key={u.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-white/70 uppercase">{u.displayName[0]}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white/90">{u.displayName}</p>
                                                    <p className="text-xs text-white/35 font-medium">@{u.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-bold px-2 py-1 rounded-md bg-white/8 text-white/45 border border-white/10">
                                                {u.type === "email" ? "Email" : "Username"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md border ${sub.cls}`}>
                                                {sub.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">
                                            {u.subExpiry ?? <span className="text-white/20">-</span>}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">{u.joinDate}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-white/50">{u.lastActive}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="text-xs text-white/25 font-medium text-center">
                Dữ liệu mock. Kết nối BE để hiển thị dữ liệu thực tế.
            </p>
        </div>
    );
}
