import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
                <div className="flex flex-col gap-8">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                        </span>
                        Nền tảng tâm lý 4.0
                    </div>
                    <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground md:text-6xl">
                        Vết Lành: Thấu hiểu tâm tư, <span className="text-primary">Kết nối chuyên gia</span>
                    </h1>
                    <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                        Phát hiện sớm dấu hiệu trầm cảm qua AI và kết nối bạn với mạng lưới chuyên gia tâm lý uy tín một cách an toàn và bảo mật.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button size="lg" className="flex items-center gap-2 rounded-xl px-8 py-6 text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                            Bắt đầu kiểm tra ngay
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="flex items-center gap-2 rounded-xl border-2 border-primary/20 px-8 py-6 text-base font-bold text-primary transition-all hover:bg-primary/5">
                            Dành cho chuyên gia
                        </Button>
                    </div>
                    <div className="flex items-center gap-4 border-t border-primary/10 pt-8">
                        <div className="flex -space-x-3">
                            <div className="h-10 w-10 rounded-full border-2 border-background bg-secondary/40" />
                            <div className="h-10 w-10 rounded-full border-2 border-background bg-secondary/60" />
                            <div className="h-10 w-10 rounded-full border-2 border-background bg-secondary/80" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground underline underline-offset-4 decoration-primary/30">Hơn 5,000+ người đã tìm lại sự cân bằng</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -right-4 -top-4 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
                    <div
                        className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-secondary/30 shadow-2xl"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzekUwsX89neMhuQBkaRYe84HxG7JDOcZ_FjbK5kA2BQb7OZAk9tyl77KYb_RGrsJCteXpr7nr6SdoJ60_9XCzRApB6qWvxjA7H1QOIeDeyf592Y6QrJOSh5HrCuGm0WTNlIDgWv5tqD_UmhDPLZThoRXGkv4tU2xW4SaVNw3QWNwaReffHQg6hxVDJeEKmCnQWFoDdTqst9NbxgR5pnqocTtbjsjpoPaHugaJjvjZaSEJjiG7g7P6ojTi3SviboLmSGRqIAQfldI")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    </div>
                </div>
            </div>
        </section>
    );
}
