import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <>
      {/* Announcement Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4" />
        Vết Lành - Hành trình chữa lành tâm hồn & tìm lại sự bình yên trong bạn.
      </div>

      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 sticky-nav border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Image src="/images/logo.svg" alt="Vết Lành Logo" width={24} height={24} className="text-primary" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-primary">VẾT LÀNH</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex space-x-8 items-center font-medium text-slate-700/80">
              <Link className="hover:text-primary transition-colors" href="/">Trang chủ</Link>
              <Link className="hover:text-primary transition-colors" href="/services">Dịch vụ</Link>
              <Link className="hover:text-primary transition-colors" href="/#chuyen-gia">Chuyên gia</Link>
              <Link className="hover:text-primary transition-colors" href="/#bang-gia">Bảng giá</Link>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-sm font-semibold text-slate-700 hover:text-primary transition-colors">Đăng nhập</Link>
              <Button asChild className="rounded-2xl px-6 py-5 shadow-md active:scale-95 transition-all">
                <Link href="/register">Bắt đầu miễn phí</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
