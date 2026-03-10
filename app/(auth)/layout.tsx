import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFDFB]">
            {/* Left side - Branding & Image */}
            <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-slate-800 p-12 flex-col justify-between relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-emerald-900/40 to-slate-800 rounded-full blur-3xl -z-10"></div>

                <div className="z-10 text-white">
                    <Link href="/" className="inline-flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Image src="/images/logo.svg" alt="Vết Lành Logo" width={24} height={24} className="brightness-0 invert" />
                        </div>
                        <span className="text-[1.75rem] font-bold tracking-tight font-dancing">Vết Lành</span>
                    </Link>

                    <h1 className="text-4xl lg:text-5xl font-bold leading-[1.2] mb-6">
                        Bắt đầu hành trình <br />
                        <span className="text-emerald-400">chữa lành</span> của bạn.
                    </h1>
                    <p className="text-slate-300 text-lg max-w-md font-light leading-relaxed">
                        Nơi an toàn để chia sẻ, kết nối và tìm lại sự bình yên trong tâm hồn giữa những bộn bề cuộc sống.
                    </p>
                </div>

                <div className="z-10 bg-white/5 backdrop-blur-md rounded-[24px] p-6 border border-white/10 mt-12 w-full max-w-sm">
                    <div className="flex gap-1 text-amber-400 mb-3">
                        {[1, 2, 3, 4, 5].map(star => (
                            <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                        ))}
                    </div>
                    <p className="text-white text-sm font-medium italic mb-4 leading-relaxed">
                        "Vết Lành giống như một khoảng xanh trong ngày của mình. Từ khi dùng app, mình học được cách hít thở và đối diện với cảm xúc tốt hơn rất nhiều."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">MA</div>
                        <span className="text-slate-300 text-xs font-semibold">@minhanh_9x</span>
                    </div>
                </div>
            </div>

            {/* Right side - Auth Content */}
            <div className="flex-1 flex flex-col pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-h-screen overflow-y-auto w-full">
                {/* Mobile Header (Hidden on Desktop) */}
                <div className="md:hidden flex justify-between items-center w-full mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Image src="/images/logo.svg" alt="Vết Lành Logo" width={20} height={20} className="text-primary" />
                        </div>
                        <span className="text-[1.5rem] font-bold tracking-tight font-dancing text-primary">Vết Lành</span>
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center w-full max-w-md mx-auto">
                    {children}
                </div>

                {/* Footer disclaimer */}
                <div className="mt-8 text-center text-xs text-slate-500 w-full max-w-md mx-auto flex items-center justify-center gap-1.5 opacity-80">
                    <Sparkles className="h-3 w-3 text-emerald-500" />
                    Vết Lành cam kết bảo mật tuyệt đối thông tin của bạn
                </div>
            </div>
        </div>
    );
}
