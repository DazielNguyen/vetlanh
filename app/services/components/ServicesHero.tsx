import { Sparkles } from "lucide-react";

export default function ServicesHero() {
    return (
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-br from-accent/30 via-background to-secondary/20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-foreground text-xs font-bold uppercase tracking-widest mb-6 border border-border/50">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Đồng hành cùng bạn
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.15] mb-6">
                    Mỗi vết thương đều xứng đáng được <br />
                    <span className="text-primary underline decoration-accent decoration-4 underline-offset-4">lắng nghe và chữa lành</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Khám phá các dịch vụ chăm sóc sức khỏe tinh thần tại Vết Lành. Chúng tôi mang đến những phương pháp trị liệu an toàn, cá nhân hóa và chuyên nghiệp nhất dành cho bạn, gia đình và doanh nghiệp.
                </p>
            </div>
            {/* Decorative blurs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/40 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/40 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        </section>
    );
}
