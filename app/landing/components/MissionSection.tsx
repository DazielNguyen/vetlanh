import { Globe } from "lucide-react";

export default function MissionSection() {
    return (
        <section className="py-24" id="su-menh">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-20 text-primary-foreground md:px-20">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform origin-top"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <Globe className="h-16 w-16 opacity-40" />
                        <h2 className="mt-6 text-3xl font-black md:text-5xl">Sứ mệnh của chúng tôi</h2>
                        <p className="mt-8 max-w-3xl text-lg font-medium leading-relaxed opacity-90 md:text-xl">
                            Vết Lành không chỉ là một ứng dụng, mà là nỗ lực xây dựng một cộng đồng sức khỏe tâm thần Việt Nam khỏe mạnh, nơi mọi rào cản về tâm lý được tháo gỡ bởi công nghệ và sự thấu cảm.
                        </p>
                        <div className="mt-12 flex flex-wrap justify-center gap-4">
                            <div className="rounded-2xl bg-white/20 px-6 py-3 backdrop-blur-md">
                                <span className="text-2xl font-bold">100+</span>
                                <span className="block text-xs uppercase tracking-widest opacity-70">Chuyên gia</span>
                            </div>
                            <div className="rounded-2xl bg-white/20 px-6 py-3 backdrop-blur-md">
                                <span className="text-2xl font-bold">50k+</span>
                                <span className="block text-xs uppercase tracking-widest opacity-70">Lượt kiểm tra</span>
                            </div>
                            <div className="rounded-2xl bg-white/20 px-6 py-3 backdrop-blur-md">
                                <span className="text-2xl font-bold">98%</span>
                                <span className="block text-xs uppercase tracking-widest opacity-70">Hài lòng</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
