import { User, Users, FileText, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
    {
        id: "ca-nhan",
        title: "Tư vấn Tâm lý Cá nhân (1-on-1)",
        description: "Gặp gỡ trực tuyến (Video call/Chat) với chuyên gia tâm lý riêng biệt. Không gian an toàn tuyệt đối để bạn giải tỏa căng thẳng, lo âu và tìm lại sự bình yên.",
        icon: User,
        color: "bg-accent",
        features: ["Thời lượng: 60 phút/buổi", "Bảo mật tuyệt đối", "Theo dõi tiến độ qua AI"]
    },
    {
        id: "cap-doi",
        title: "Trị liệu Cặp đôi & Gia đình",
        description: "Giải quyết các xung đột trong mối quan hệ, cải thiện giao tiếp và xây dựng lại sự thấu hiểu, gắn kết giữa các thành viên gia đình hoặc đối tác.",
        icon: Users,
        color: "bg-secondary",
        features: ["Thời lượng: 90 phút/buổi", "Phương pháp điều hoà mâu thuẫn", "Bài tập thực hành chung"]
    },
    {
        id: "danh-gia",
        title: "Đánh giá & Kiểm tra Tâm lý chuyên sâu",
        description: "Thực hiện các bài test chuẩn mực y khoa (Trầm cảm, Rối loạn lo âu, ADHD...) với sự nhận xét và kết luận từ bác sĩ chuyên khoa.",
        icon: FileText,
        color: "bg-primary/20",
        features: ["Bộ câu hỏi chuẩn y khoa", "Báo cáo chi tiết", "Tư vấn định hướng điều trị"]
    },
    {
        id: "doanh-nghiep",
        title: "Gói Hỗ trợ Doanh nghiệp (B2B)",
        description: "Chương trình chăm sóc sức khỏe tinh thần toàn diện cho nhân viên công ty (EAP), giúp giảm tỷ lệ burnout và tăng hiệu suất làm việc bền vững.",
        icon: Building2,
        color: "bg-blue-100",
        features: ["Workshop tâm lý định kỳ", "Tài khoản Pro cho toàn bộ nhân sự", "Báo cáo sức khỏe tổng quan"]
    }
];

export default function ServicesGrid() {
    return (
        <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-foreground mb-4">Lựa chọn dịch vụ phù hợp</h2>
                    <p className="text-slate-500">Mọi quy trình đều được xây dựng dựa trên tiêu chuẩn y tế quốc tế.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <div key={service.id} className="relative bg-card flex flex-col p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl transition-all group">
                                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-8 h-8 text-foreground" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
                                <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                                    {service.description}
                                </p>
                                <div className="space-y-3 mb-8">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full bg-slate-50 text-primary border border-primary/20 hover:bg-primary hover:text-white rounded-xl py-6 transition-all group-hover:shadow-md">
                                    Chọn dịch vụ này
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}
