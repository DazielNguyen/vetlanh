import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-16 overflow-y-auto">
      <Image src="/images/bg1.png" alt="" fill className="object-cover object-center" priority />
      <div className="pointer-events-none absolute inset-0 bg-black/55" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-32 bg-linear-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-black/50 to-transparent" />

      <Link
        href="/"
        className="relative z-10 inline-flex items-center gap-2.5 mb-8 hover:opacity-80 transition-opacity"
      >
        <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <Image src="/images/logo.svg" alt="Vết Lành Logo" width={20} height={20} className="brightness-0 invert" />
        </div>
        <span className="text-[1.6rem] font-bold tracking-tight font-dancing text-white">Vết Lành</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>

      <div className="relative z-10 mt-8 text-center text-xs text-white/45 flex items-center justify-center gap-1.5">
        <Sparkles className="h-3 w-3 text-emerald-400 shrink-0" />
        Vết Lành cam kết bảo mật tuyệt đối thông tin của bạn
      </div>
    </div>
  );
}
