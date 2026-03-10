import { Button } from "@/components/ui/button";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
                {/* Content */}
                <div className="flex-1 text-center lg:text-left z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-8 border border-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Ứng dụng Chăm sóc Sức khỏe Tâm thần
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-[1.2] mb-6">
                        Tìm lại sự bình yên,<br />
                        <span className="text-[#6D8A96]">chữa lành tâm hồn</span> cùng <span className="font-dancing font-bold text-[1.1em]">Vết Lành</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                        Hệ sinh thái chăm sóc sức khỏe tinh thần toàn diện. Ứng dụng công nghệ AI tiên tiến giúp bạn xoa dịu căng thẳng và kết nối với các chuyên gia tâm lý tận tâm.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <Button className="w-full sm:w-auto px-8 py-6 bg-[#6D8A96] hover:bg-[#5A737D] text-white text-lg font-medium rounded-full shadow-md transition-all">
                            Bắt đầu miễn phí
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto px-8 py-6 bg-white border-2 border-slate-200 text-slate-600 text-lg font-medium rounded-full hover:bg-slate-50 transition-colors">
                            Khám phá dịch vụ
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-slate-500">Đồng hành cùng bạn trên mọi bước đường chữa lành.</p>
                </div>

                {/* Hero Image Placeholder */}
                <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
                    <div className="aspect-[4/3] rounded-[32px] relative overflow-hidden shadow-xl float-animation bg-slate-100 border border-white/50">
                        {/* Placeholder generic healing image from unsplash (nature/meditation) */}
                        <img alt="Sự bình yên" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6 flex justify-center">
                            <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg w-full max-w-sm border border-slate-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">AI</div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-800"><span className="font-dancing">Vết Lành</span> AI</div>
                                        <div className="text-[10px] text-emerald-600 font-medium">Đang hoạt động</div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">"Chào bạn, hãy hít một hơi thật sâu. Hôm nay mọi thứ vẫn ổn chứ?"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
