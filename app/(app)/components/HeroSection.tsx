import { Button } from "@/components/ui/button"

export default function HeroSection() {
    return (
        <section className="relative w-full py-16 md:py-32 overflow-hidden bg-background">
            <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl">
                    Chữa Lành & Phát Triển Cùng <span className="text-primary">Vết Lành</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
                    Nền tảng hỗ trợ sức khỏe tinh thần, kết nối bạn với các chuyên gia và cộng đồng để cùng hướng tới một cuộc sống cân bằng và hạnh phúc hơn.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="h-12 px-8 text-base">
                        Tìm Hiểu Thêm
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                        Làm Bài Test Phân Loại
                    </Button>
                </div>
            </div>

            {/* Decorative background elements matching the theme */}
            <div className="absolute top-1/4 left-0 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl -z-10"></div>
        </section>
    )
}
