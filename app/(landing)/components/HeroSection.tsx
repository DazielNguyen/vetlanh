import { Button } from "@/components/ui/button";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
                {/* Content */}
                <div className="flex-1 text-center lg:text-left z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-foreground text-xs font-bold uppercase tracking-widest mb-6">
                        SỨC KHỎE TÂM THẦN 4.0
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.15] mb-6">
                        Chữa lành tâm hồn,<br />
                        <span className="text-primary underline decoration-accent decoration-4 underline-offset-4">Giảm bớt căng thẳng</span> cùng VẾT LÀNH
                    </h1>
                    <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Nền tảng ứng dụng công nghệ AI tiên tiến giúp phát hiện sớm dấu hiệu stress và kết nối bạn với những phương pháp chữa lành tự nhiên, an toàn và cá nhân hóa.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <Button className="w-full sm:w-auto px-8 py-6 bg-primary text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 hover:translate-y-[-2px] transition-transform">
                            Dùng thử miễn phí 7 ngày
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto px-8 py-6 bg-white border-2 border-primary/20 text-primary text-lg font-bold rounded-2xl hover:bg-gray-50 transition-colors">
                            Xem cách hoạt động
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-slate-400">Không yêu cầu thẻ tín dụng. Hủy bất cứ lúc nào.</p>
                </div>

                {/* Hero Image Placeholder */}
                <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
                    <div className="aspect-square bg-gradient-to-br from-accent via-secondary to-primary/20 rounded-[40px] relative overflow-hidden shadow-2xl float-animation">
                        <img alt="Vết Lành Hero" className="w-full h-full object-cover mix-blend-multiply opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb87K6SEDyhP8UooMsQNtKtJW8YuKX5Vp47NBtAd_AWV9Gd2M1CnOEpdVTQTGuIwfn9lp6KttuXg-crWRCGQLkbv7CdCIj6bO-78-vitbavEDkE-N3Q8NFCCFPUePDCcALwzCiTRwIc4oeC17ZAmKST_yOX4DyTkn47NPz50dvmOL0ozSTY-V1UXMq_0qXtUUCOS07CRH5jAz5Ai0OccnU1qgnobt548DV8OFMy1gPJ__fvbbz3ZrXILizS7M5iuRRRrdMpnHZxhYF" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl max-w-[280px]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-secondary"></div>
                                    <div className="text-sm font-bold text-foreground">AI Companion</div>
                                </div>
                                <p className="text-xs text-slate-600 italic">"Chào bạn, hôm nay bạn cảm thấy thế nào? Hãy hít thở sâu cùng mình nhé..."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
