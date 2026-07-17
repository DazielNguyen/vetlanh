import Link from "next/link";
import { Facebook } from "lucide-react";
import Image from "next/image";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82c-.9-.86-1.5-2.05-1.6-3.32V2h-3.4v13.4a2.6 2.6 0 1 1-2.6-2.6c.24 0 .48.03.7.09V9.44a5.9 5.9 0 0 0-.7-.04A6.05 6.05 0 1 0 15 15.4V9.1a8.14 8.14 0 0 0 4.6 1.42V7.14a4.86 4.86 0 0 1-3-1.32Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="lien-he" className="relative overflow-hidden text-hero-wordmark pt-20 pb-10 bg-linear-to-b from-hero-sky-end/40 via-background to-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-hero-wordmark/8">
                <Image src="/images/logo.svg" alt="Vết Lành Logo" width={20} height={20} />
              </div>
              <span className="text-[1.5rem] font-bold tracking-tight font-baloo">Vết Lành</span>
            </div>
            <p className="text-hero-wordmark/60 text-sm leading-relaxed mb-6">
              Vì một Việt Nam hạnh phúc và bình an hơn mỗi ngày.
            </p>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full bg-hero-wordmark/8 flex items-center justify-center hover:bg-hero-wordmark/15 transition-colors"
                href="https://www.facebook.com/people/V%E1%BA%BFt-L%C3%A0nh-Healing-Together/61590074923894/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Vết Lành"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                className="w-10 h-10 rounded-full bg-hero-wordmark/8 flex items-center justify-center hover:bg-hero-wordmark/15 transition-colors"
                href="https://www.tiktok.com/@vetlanh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Vết Lành"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-6">Khám phá</h5>
            <ul className="space-y-4 text-hero-wordmark/60 text-sm">
              <li><a className="hover:text-hero-wordmark transition-colors" href="#">Về chúng tôi</a></li>
              <li><a className="hover:text-hero-wordmark transition-colors" href="#">Cộng đồng</a></li>
              <li><a className="hover:text-hero-wordmark transition-colors" href="#">Hướng dẫn sử dụng</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-6">Tài nguyên</h5>
            <ul className="space-y-4 text-hero-wordmark/60 text-sm">
              <li><a className="hover:text-hero-wordmark transition-colors" href="#">Thư viện thiền</a></li>
              <li><a className="hover:text-hero-wordmark transition-colors" href="#">Blog tâm lý</a></li>
              <li><a className="hover:text-hero-wordmark transition-colors" href="#">Kiểm tra stress</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-6">Nhận bản tin tâm hồn</h5>
            <p className="text-hero-wordmark/60 text-sm mb-4">Nhận những lời khuyên nuôi dưỡng tâm hồn mỗi tuần.</p>
            <form className="flex flex-col gap-3">
              <input className="bg-white/60 border-hero-wordmark/15 rounded-2xl px-4 py-3 text-sm focus:ring-primary focus:border-primary text-hero-wordmark placeholder:text-hero-wordmark/40" placeholder="Email của bạn" type="email" />
              <Link href="/register" className="inline-flex items-center justify-center rounded-full border border-hero-wordmark/25 bg-hero-wordmark/10 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-hero-wordmark transition-all hover:bg-hero-wordmark/15 active:scale-95">Đăng ký ngay</Link>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-hero-wordmark/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-hero-wordmark/45">
          <p>© {new Date().getFullYear()} <span className="font-baloo font-bold text-sm">Vết Lành</span>. Mọi quyền được bảo lưu.</p>
          <div className="flex gap-6">
            <a className="hover:text-hero-wordmark" href="#">Chính sách bảo mật</a>
            <a className="hover:text-hero-wordmark" href="#">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
