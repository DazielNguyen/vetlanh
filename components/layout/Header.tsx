import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-primary">Vết Lành</span>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Tính năng</Link>
                    <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">Về chúng tôi</Link>
                    <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Liên hệ</Link>
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
    )
}
