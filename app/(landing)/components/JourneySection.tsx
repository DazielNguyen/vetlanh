export default function JourneySection() {
    return (
        <section className="py-24 bg-[#FAFDFB] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-5 leading-tight">Hành trình chữa lành của bạn diễn ra như thế nào?</h2>
                        <p className="text-lg text-slate-500 mb-10">Ba bước đơn giản để thấu hiểu bản thân và tìm lại sự cân bằng trong cuộc sống.</p>
                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#6D8A96] text-white flex-shrink-0 flex items-center justify-center font-bold shadow-sm">1</div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-2">Trò chuyện với Trợ lý AI</h4>
                                    <p className="text-slate-500 leading-relaxed">Chia sẻ cảm xúc của bạn bất cứ lúc nào. AI sẽ lắng nghe, phân tích mức độ căng thẳng và đề xuất bài tập phù hợp.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#E1F0E3] text-emerald-700 flex-shrink-0 flex items-center justify-center font-bold shadow-sm">2</div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-2">Kết nối với Chuyên gia</h4>
                                    <p className="text-slate-500 leading-relaxed">Tìm kiếm chuyên gia tâm lý phù hợp, xem hồ sơ và đánh giá, sau đó đặt lịch hẹn tư vấn trực tuyến hoặc trực tiếp.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex-shrink-0 flex items-center justify-center font-bold shadow-sm">3</div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-2">Theo dõi và Chữa lành</h4>
                                    <p className="text-slate-500 leading-relaxed">Theo dõi tiến trình sức khỏe qua biểu đồ trực quan, hoàn thành lộ trình chữa lành và nhận gợi ý cá nhân hóa mỗi ngày.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                            <img alt="Quy trình sử dụng Vết Lành" className="w-full aspect-[4/5] object-cover" src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1000&auto=format&fit=crop" />
                        </div>
                        {/* Decorative shapes */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#E1F0E3] rounded-full blur-3xl -z-10 opacity-60"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#F2F6F8] rounded-full blur-3xl -z-10 opacity-80"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
