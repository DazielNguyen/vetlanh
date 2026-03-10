import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingSection() {
    return (
        <section className="py-24 bg-[#FAFDFB]" id="bang-gia">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Lựa chọn người bạn đồng hành</h2>
                    <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg">Trong giai đoạn đầu, Vết Lành tập trung xây dựng cộng đồng hỗ trợ an toàn và tối ưu hóa trải nghiệm chữa lành cho bạn.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-3 items-stretch">
                    {/* Tier 1 */}
                    <div className="flex flex-col rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-800">Dành cho Cá nhân</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-[#6D8A96]">Miễn phí</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">Bước đầu tìm lại sự cân bằng.</p>
                        </div>
                        <ul className="mb-8 flex-1 space-y-4 text-sm text-slate-600">
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                                </div>
                                Trò chuyện với Trợ lý AI (Giới hạn)
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                                </div>
                                Tham gia cộng đồng ẩn danh
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                                </div>
                                Thư viện bài tập cơ bản
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full rounded-full border-2 border-slate-200 py-6 text-base font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            Bắt đầu hành trình
                        </Button>
                    </div>

                    {/* Tier 2 */}
                    <div className="relative flex flex-col rounded-[32px] border-2 border-[#E1F0E3] bg-white p-8 shadow-xl">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-100 px-4 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-sm">
                            KHUYÊN DÙNG
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-800">Chữa lành Chuyên sâu</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-[#6D8A96]">Đặt lịch hẹn</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">Kết nối 1:1 với bộ phận chuyên môn.</p>
                        </div>
                        <ul className="mb-8 flex-1 space-y-4 text-sm text-slate-600">
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                                </div>
                                Mọi tính năng của gói Cá nhân
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                                </div>
                                Trị liệu tâm lý chuyên sâu 1:1
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                                </div>
                                Theo dõi biểu đồ cảm xúc AI 24/7
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                                </div>
                                Lộ trình chữa lành cá nhân hóa
                            </li>
                        </ul>
                        <Button className="w-full rounded-full bg-[#6D8A96] hover:bg-[#5A737D] py-6 text-base font-bold text-white shadow-lg shadow-[#6D8A96]/20 transition-all">
                            Tìm chuyên gia ngay
                        </Button>
                    </div>

                    {/* Tier 3 */}
                    <div className="flex flex-col rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-800">Dành cho Chuyên gia</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-[#6D8A96]">Liên hệ</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">Nền tảng vận hành phòng tư vấn.</p>
                        </div>
                        <ul className="mb-8 flex-1 space-y-4 text-sm text-slate-600">
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                                </div>
                                Công cụ AI hỗ trợ chẩn đoán
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                                </div>
                                Quản lý ca bệnh & lịch hẹn
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                                </div>
                                Bảo mật hồ sơ y tế chuẩn HIPPA
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full rounded-full border-2 border-slate-200 py-6 text-base font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            Đăng ký đối tác
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
