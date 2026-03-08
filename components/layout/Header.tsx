import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-primary">Vết Lành</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#quy-trinh"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Quy trình
          </Link>
          <Link
            href="#nguoi-dung"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Người dùng
          </Link>
          <Link
            href="#chuyen-gia"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Chuyên gia
          </Link>
          <Link
            href="#bang-gia"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Bảng giá
          </Link>
          <Link
            href="#su-menh"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Sứ mệnh
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Bắt đầu ngay</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
