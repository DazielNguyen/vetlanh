import { MessageSquare, Users, CalendarDays, Activity } from "lucide-react";

export default function FeaturesSection() {
    return (
        <section className="py-24 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Bạn sẽ nhận được gì từ Vết Lành?</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">Chúng tôi cung cấp hệ sinh thái toàn diện để nuôi dưỡng sức khỏe tinh thần của bạn mỗi ngày.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Feature 1: Chuyên gia */}
                    <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow group">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Kết nối Chuyên gia</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Tìm kiếm và kết nối với đội ngũ chuyên gia tâm lý hàng đầu. Xem hồ sơ, đánh giá và đặt lịch tư vấn trực tiếp.</p>
                    </div>

                    {/* Feature 2: Tin nhắn AI */}
                    <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow group">
                        <div className="w-14 h-14 bg-[#F2F6F8] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-7 h-7 text-[#6D8A96]" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Trợ lý AI thông minh</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Trò chuyện 24/7 với trợ lý AI luôn lắng nghe và thấu hiểu. Nhận phân tích cảm xúc và gợi ý bài tập phù hợp ngay lập tức.</p>
                    </div>

                    {/* Feature 3: Lịch hẹn */}
                    <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow group">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <CalendarDays className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Quản lý Lịch hẹn</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Đặt lịch, theo dõi và quản lý các buổi tư vấn trực tuyến hoặc trực tiếp với chuyên gia một cách dễ dàng.</p>
                    </div>

                    {/* Feature 4: Theo dõi sức khỏe */}
                    <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow group">
                        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Activity className="w-7 h-7 text-rose-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Theo dõi Sức khỏe</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Biểu đồ trực quan theo dõi mức độ căng thẳng, lộ trình chữa lành cá nhân và bài tập thở giúp bạn cân bằng mỗi ngày.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
