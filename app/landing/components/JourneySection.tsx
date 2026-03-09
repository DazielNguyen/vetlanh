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
                                    <h4 className="text-lg font-bold text-foreground mb-1">Nhận diện cảm xúc</h4>
                                    <p className="text-slate-600">AI của chúng tôi phân tích tần suất sử dụng và từ ngữ để nhận diện mức độ căng thẳng của bạn.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-secondary text-foreground flex-shrink-0 flex items-center justify-center font-bold">2</div>
                                <div>
                                    <h4 className="text-lg font-bold text-foreground mb-1">Đề xuất lộ trình</h4>
                                    <p className="text-slate-600">Dựa trên dữ liệu, hệ thống đề xuất các bài tập thở, thiền hoặc nội dung podcast phù hợp nhất.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-accent text-foreground flex-shrink-0 flex items-center justify-center font-bold">3</div>
                                <div>
                                    <h4 className="text-lg font-bold text-foreground mb-1">Kết nối sâu sắc</h4>
                                    <p className="text-slate-600">Nếu cần thiết, bạn sẽ được kết nối trực tiếp với chuyên gia tâm lý để có những buổi tư vấn chuyên sâu.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                            <img alt="App Workflow" className="w-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdOg4YY44WWemUfGIWsGC6Y6sTrRtp_FLfil0B6-lfLQ1wrdJPuSfSRPiR9xFmpAjxLxi-5CbfsF9it4A-by4kH7Rl2KL4DQCXkn23DWhH12yIf4nQTWgSAtIa6sc29J3CBCIK7onZ4ffLkDMv8njQRmz-0_Nidj8pXwkj-MCOduVcxa1ymAAbiDyHGS5vAvQPGHTG5JsS7NFoq0YEb-4qUEmIoKLVK267-BOpKa7eZskJvpt_EN9kHXqupn667Or16TiYga2UzAsD" />
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
