import { Network, Bot, Activity } from "lucide-react";

export default function ForExpertsSection() {
    return (
        <section className="bg-foreground py-24 text-background" id="chuyen-gia">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="mb-16 flex flex-col items-center text-center">
                    <h2 className="text-3xl font-black md:text-4xl text-background">Đồng hành cùng Chuyên gia</h2>
                    <p className="mt-4 max-w-2xl text-muted/70">Nâng cao hiệu quả điều trị và mở rộng tầm ảnh hưởng của bạn với bộ công cụ phân tích hiện đại.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="flex flex-col gap-4 rounded-3xl bg-background/5 p-8 border border-background/10 transition-colors hover:bg-background/10">
                        <Network className="h-10 w-10 text-primary" />
                        <h3 className="text-xl font-bold">Mở rộng mạng lưới</h3>
                        <p className="text-sm text-muted/80">Tiếp cận dễ dàng với hàng ngàn người đang thực sự cần sự giúp đỡ chuyên môn của bạn.</p>
                    </div>
                    <div className="flex flex-col gap-4 rounded-3xl bg-background/5 p-8 border border-background/10 transition-colors hover:bg-background/10">
                        <Bot className="h-10 w-10 text-primary" />
                        <h3 className="text-xl font-bold">Công cụ hỗ trợ AI</h3>
                        <p className="text-sm text-muted/80">Hệ thống gợi ý chẩn đoán dựa trên dữ liệu hành vi giúp chuyên gia đưa ra quyết định chính xác hơn.</p>
                    </div>
                    <div className="flex flex-col gap-4 rounded-3xl bg-background/5 p-8 border border-background/10 transition-colors hover:bg-background/10">
                        <Activity className="h-10 w-10 text-primary" />
                        <h3 className="text-xl font-bold">Dữ liệu chất lượng</h3>
                        <p className="text-sm text-muted/80">Báo cáo trực quan và chi tiết về tiến trình tâm lý của bệnh nhân qua biểu đồ thời gian thực.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
