import { MessageSquare, Users, Headphones, Activity } from "lucide-react";

export default function FeaturesSection() {
    return (
        <section className="py-24 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Bạn sẽ nhận được gì từ Vết Lành?</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Chúng tôi cung cấp hệ sinh thái toàn diện để nuôi dưỡng sức khỏe tinh thần của bạn mỗi ngày.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Feature 1 */}
                    <div className="p-8 rounded-2xl bg-background border border-gray-100 hover:shadow-xl transition-shadow group">
                        <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-8 h-8 text-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">Chatbot AI 24/7</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Người bạn tâm giao luôn lắng nghe và phản hồi bằng sự thấu cảm, hỗ trợ bạn bất cứ lúc nào.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 rounded-2xl bg-background border border-gray-100 hover:shadow-xl transition-shadow group">
                        <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8 text-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">Kết nối Chuyên gia</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Đặt lịch tư vấn trực tuyến với đội ngũ chuyên gia tâm lý giàu kinh nghiệm và tận tâm.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 rounded-2xl bg-background border border-gray-100 hover:shadow-xl transition-shadow group">
                        <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Headphones className="w-8 h-8 text-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">Thiền & Podcast</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Thư viện âm thanh đa dạng giúp bạn thư giãn, tập trung và cải thiện chất lượng giấc ngủ.</p>
                    </div>

                    {/* Feature 4 */}
                    <div className="p-8 rounded-2xl bg-background border border-gray-100 hover:shadow-xl transition-shadow group">
                        <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Activity className="w-8 h-8 text-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">Theo dõi Stress</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Biểu đồ trực quan theo dõi tâm trạng hàng ngày, giúp bạn hiểu rõ bản thân hơn qua từng giai đoạn.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
