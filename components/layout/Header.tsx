"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 72);
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200/40 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${scrolled ? "bg-primary/10" : "bg-white/10 backdrop-blur-sm"}`}>
              <Image src="/images/logo.svg" alt="Vết Lành Logo" width={24} height={24} />
            </div>
            <span className={`text-[1.75rem] font-bold tracking-tight font-dancing transition-colors duration-500 ${scrolled ? "text-primary" : "text-white"}`}>
              Vết Lành
            </span>
          </Link>

          {/* Nav Links */}
          <div className={`hidden md:flex space-x-8 items-center font-medium transition-colors duration-500 ${scrolled ? "text-slate-700/80" : "text-white/80"}`}>
            <Link className="hover:text-primary transition-colors" href="/">Trang chủ</Link>
            <Link className="hover:text-primary transition-colors" href="/#dich-vu">Dịch vụ</Link>
            <Link className="hover:text-primary transition-colors" href="/#bang-gia">Bảng giá</Link>
            <Link className="hover:text-primary transition-colors" href="/#cau-chuyen">Câu chuyện</Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className={`hidden md:block text-sm font-semibold transition-colors duration-500 hover:text-primary ${scrolled ? "text-slate-700" : "text-white/80"}`}
            >
              Đăng nhập
            </Link>
            {scrolled ? (
              <Button asChild className="rounded-2xl px-6 py-5 shadow-md active:scale-95 transition-all">
                <Link href="/register">Bắt đầu miễn phí</Link>
              </Button>
            ) : (
              <Link
                href="/register"
                className="inline-flex items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-95"
              >
                Bắt đầu miễn phí
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
