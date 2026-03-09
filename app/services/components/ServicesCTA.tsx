import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ServicesCTA() {
    return (
        <section className="py-24 bg-primary text-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                    Sẵn sàng bắt đầu hành trình <br /> chữa lành của riêng bạn?
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                    Đặt lịch hẹn đầu tiên để trải nghiệm sự khác biệt. Đội ngũ chuyên gia của Vết Lành luôn sẵn sàng lắng nghe và đồng hành cùng bạn 24/7.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild className="w-full sm:w-auto bg-white text-primary hover:bg-slate-50 rounded-2xl px-8 py-6 text-lg font-bold shadow-xl transition-transform hover:-translate-y-1">
                        <Link href="/booking">
                            Đặt lịch hẹn ngay
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto border-white/30 hover:bg-white/10 text-white rounded-2xl px-8 py-6 text-lg font-bold transition-colors">
                        <Link href="/contact">
                            Liên hệ tư vấn
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
            </div>
        </section>
    );
}
