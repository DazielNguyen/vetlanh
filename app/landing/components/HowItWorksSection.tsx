import { Sparkles, Users, ClipboardCheck } from "lucide-react";

export default function HowItWorksSection() {
    return (
        <section className="bg-primary/5 py-24" id="quy-trinh">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-black md:text-4xl">Quy trình hoạt động</h2>
                    <p className="mt-4 text-muted-foreground">Hệ thống thông minh giúp bạn tìm lại sự cân bằng trong cuộc sống qua 3 bước đơn giản.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="group relative flex flex-col items-center rounded-3xl bg-card text-card-foreground p-8 text-center shadow-sm transition-all hover:shadow-xl">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold">1. Phân tích AI thông minh</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">Công nghệ AI tiên tiến phân tích dấu hiệu trầm cảm qua văn bản và giọng nói, đưa ra cảnh báo sớm về các nguy cơ tiềm ẩn.</p>
                    </div>
                    <div className="group relative flex flex-col items-center rounded-3xl bg-card text-card-foreground p-8 text-center shadow-sm transition-all hover:shadow-xl">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                            <Users className="h-8 w-8" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold">2. Kết nối chuyên gia C2C</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">Nền tảng kết nối bạn trực tiếp với đội ngũ chuyên gia tâm lý uy tín, giúp giảm thiểu rủi ro pháp lý và đảm bảo chất lượng tư vấn.</p>
                    </div>
                    <div className="group relative flex flex-col items-center rounded-3xl bg-card text-card-foreground p-8 text-center shadow-sm transition-all hover:shadow-xl">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                            <ClipboardCheck className="h-8 w-8" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold">3. Theo dõi & Trị liệu</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">AI hỗ trợ theo dõi tiến trình và điều chỉnh liệu trình cá nhân hóa dưới sự giám sát và phán quyết cuối cùng từ chuyên gia.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
