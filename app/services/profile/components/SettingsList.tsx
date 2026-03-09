import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, Palette, Globe, CreditCard, LogOut, ChevronRight, Moon, Sun } from "lucide-react";

const settingsSections = [
    {
        title: "Tài khoản",
        items: [
            { icon: User, label: "Thông tin cá nhân", desc: "Tên, email, số điện thoại" },
            { icon: Shield, label: "Bảo mật", desc: "Mật khẩu, xác thực 2 lớp" },
            { icon: CreditCard, label: "Thanh toán", desc: "Phương thức thanh toán, lịch sử" },
        ],
    },
    {
        title: "Tùy chỉnh",
        items: [
            { icon: Bell, label: "Thông báo", desc: "Email, push notification, nhắc lịch" },
            { icon: Palette, label: "Giao diện", desc: "Chế độ sáng/tối, màu chủ đề" },
            { icon: Globe, label: "Ngôn ngữ", desc: "Tiếng Việt" },
        ],
    },
];

export function SettingsList() {
    return (
        <div className="space-y-6">
            {settingsSections.map((section) => (
                <div key={section.title} className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{section.title}</h2>
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden divide-y divide-slate-50">
                        {section.items.map((item) => (
                            <button key={item.label} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition text-left">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                    <item.icon className="w-5 h-5 text-slate-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-800 text-sm">{item.label}</h3>
                                    <p className="text-xs text-slate-400">{item.desc}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                            </button>
                        ))}
                    </Card>
                </div>
            ))}

            {/* Theme Toggle */}
            <Card className="border-none shadow-sm rounded-2xl">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                            <Moon className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 text-sm">Chế độ tối</h3>
                            <p className="text-xs text-slate-400">Đang tắt</p>
                        </div>
                    </div>
                    <div className="w-11 h-6 rounded-full bg-slate-200 relative cursor-pointer">
                        <div className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 left-0.5 transition-transform flex items-center justify-center">
                            <Sun className="w-3 h-3 text-amber-400" />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Logout */}
            <Button variant="outline" className="w-full rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" />
                Đăng xuất
            </Button>
        </div>
    );
}
