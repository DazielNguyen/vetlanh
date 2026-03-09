export default function JourneySection() {
    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8 leading-tight">Hành trình của bạn tại Vết Lành diễn ra như thế nào?</h2>
                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex-shrink-0 flex items-center justify-center font-bold">1</div>
                                <div>
                                    <h4 className="text-lg font-bold text-foreground mb-1">Trò chuyện với Trợ lý AI</h4>
                                    <p className="text-slate-600">Chia sẻ cảm xúc của bạn bất cứ lúc nào. AI sẽ lắng nghe, phân tích mức độ căng thẳng và đề xuất bài tập phù hợp.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-secondary text-foreground flex-shrink-0 flex items-center justify-center font-bold">2</div>
                                <div>
                                    <h4 className="text-lg font-bold text-foreground mb-1">Kết nối với Chuyên gia</h4>
                                    <p className="text-slate-600">Tìm kiếm chuyên gia tâm lý phù hợp, xem hồ sơ và đánh giá, sau đó đặt lịch hẹn tư vấn trực tuyến hoặc trực tiếp.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-accent text-foreground flex-shrink-0 flex items-center justify-center font-bold">3</div>
                                <div>
                                    <h4 className="text-lg font-bold text-foreground mb-1">Theo dõi và Chữa lành</h4>
                                    <p className="text-slate-600">Theo dõi tiến trình sức khỏe qua biểu đồ trực quan, hoàn thành lộ trình chữa lành và nhận gợi ý cá nhân hóa mỗi ngày.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                            <img alt="Quy trình sử dụng Vết Lành" className="w-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdOg4YY44WWemUfGIWsGC6Y6sTrRtp_FLfil0B6-lfLQ1wrdJPuSfSRPiR9xFmpAjxLxi-5CbfsF9it4A-by4kH7Rl2KL4DQCXkn23DWhH12yIf4nQTWgSAtIa6sc29J3CBCIK7onZ4ffLkDMv8njQRmz-0_Nidj8pXwkj-MCOduVcxa1ymAAbiDyHGS5vAvQPGHTG5JsS7NFoq0YEb-4qUEmIoKLVK267-BOpKa7eZskJvpt_EN9kHXqupn667Or16TiYga2UzAsD" />
                        </div>
                        {/* Decorative shapes */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/50 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl -z-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
