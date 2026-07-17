"use client";

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
        scrolled ? "sticky-nav shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-hero-wordmark/8 backdrop-blur-sm">
              <Image src="/images/logo.svg" alt="Vết Lành Logo" width={24} height={24} />
            </div>
            <span className="text-[1.75rem] font-bold tracking-tight font-baloo text-hero-wordmark">
              Vết Lành
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6 items-center font-medium text-hero-wordmark/70">
            <Link className="hover:text-primary transition-colors" href="/">Trang chủ</Link>
            <Link className="hover:text-primary transition-colors" href="/#dich-vu">Dịch vụ</Link>
            <Link className="hover:text-primary transition-colors" href="/#bang-gia">Bảng giá</Link>
            <Link className="hover:text-primary transition-colors" href="/#cau-chuyen">Câu chuyện</Link>
            <Link className="hover:text-primary transition-colors" href="/#faq">FAQ</Link>
            <Link className="hover:text-primary transition-colors" href="/#lien-he">Liên hệ</Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:block text-sm font-semibold text-hero-wordmark/70 hover:text-hero-wordmark transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-full border border-hero-wordmark/25 bg-hero-wordmark/10 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-hero-wordmark transition-all hover:bg-hero-wordmark/15 active:scale-95"
            >
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
