import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function PricingSection() {
    return (
        <section className="py-24 bg-background" id="bang-gia">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-black md:text-4xl">Kế hoạch Tài chính & Bảng giá Năm đầu</h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Trong năm đầu tiên, Vết Lành tập trung vào việc xây dựng cộng đồng và tối ưu hóa dữ liệu để mang lại giá trị tốt nhất cho sức khỏe tâm thần.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-3 items-stretch">
                    {/* Tier 1 */}
                    <div className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-sm">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold">Gói Cơ bản</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-black">Miễn phí</span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">Dành cho sự phát triển của cộng đồng.</p>
                        </div>
                        <ul className="mb-8 flex-1 space-y-4 text-sm text-muted-foreground">
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Theo dõi tâm trạng bằng AI
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Truy cập diễn đàn cộng đồng
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Thông tin giáo dục tâm lý
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full rounded-xl border-2 border-primary/20 py-6 text-sm font-bold text-primary transition-all hover:bg-primary/5">
                            Tham gia ngay
                        </Button>
                    </div>

                    {/* Tier 2 */}
                    <div className="relative flex flex-col rounded-3xl border-2 border-primary bg-card p-8 shadow-xl">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                            PHỔ BIẾN NHẤT
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-primary">Gói Trị liệu (C2C)</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-black">Cạnh tranh</span>
                                <span className="text-sm text-muted-foreground">/tháng</span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">Kết nối trực tiếp với chuyên gia.</p>
                        </div>
                        <ul className="mb-8 flex-1 space-y-4 text-sm text-muted-foreground">
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Trị liệu 1 kèm 1
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Theo dõi tiến trình với hỗ trợ AI
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Công cụ chăm sóc sức khỏe cá nhân hóa
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Ưu tiên đặt lịch hẹn
                            </li>
                        </ul>
                        <Button className="w-full rounded-xl bg-primary py-6 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
                            Bắt đầu trị liệu
                        </Button>
                    </div>

                    {/* Tier 3 */}
                    <div className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-sm">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold">Gói Chuyên gia</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-black text-foreground">Liên hệ</span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">Dành cho các nhà tâm lý và bác sĩ.</p>
                        </div>
                        <ul className="mb-8 flex-1 space-y-4 text-sm text-muted-foreground">
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Công cụ chẩn đoán AI nâng cao
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Bảng điều khiển quản lý bệnh nhân
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Phân tích dữ liệu lâm sàng
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Quản lý hồ sơ bảo mật
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full rounded-xl border-2 py-6 text-sm font-bold transition-all">
                            Ghi danh ngay
                        </Button>
                    </div>
                </div>
                <p className="mt-12 text-center text-xs text-muted-foreground italic">*Lưu ý: Trong giai đoạn đầu, mục tiêu của chúng tôi là phát triển cộng đồng và nâng cao chất lượng dữ liệu trước khi thương mại hóa toàn diện.</p>
            </div>
        </section>
    );
}
