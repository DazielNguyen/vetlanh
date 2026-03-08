import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-foreground text-background py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">Vết Lành</h3>
            <p className="text-muted max-w-sm mb-6">
              Hành trình chữa lành và kết nối con người. Dành tặng sức khoẻ tinh thần của bạn một
              khoảng không gian bình yên.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Chính Sách</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted hover:text-primary transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted hover:text-primary transition-colors">
                  Bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted hover:text-primary transition-colors">
                  Trả hàng & Hoàn tiền
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Kết Nối</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted hover:text-primary transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-primary transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-accent-foreground/20 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} Vết Lành. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
