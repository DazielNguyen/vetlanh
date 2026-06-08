import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer id="lien-he" className="relative overflow-hidden text-white pt-20 pb-10">
      <Image src="/images/bg5.png" alt="" fill className="object-cover object-top" />
      <div className="pointer-events-none absolute inset-0 bg-black/65" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-32 bg-linear-to-b from-black/70 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10">
                <Image src="/images/logo.svg" alt="Vết Lành Logo" width={20} height={20} className="brightness-0 invert" />
              </div>
              <span className="text-[1.5rem] font-bold tracking-tight font-dancing">Vết Lành</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Vì một Việt Nam hạnh phúc và bình an hơn mỗi ngày.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" href="#">
                <Facebook className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" href="#">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-6">Khám phá</h5>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><a className="hover:text-white transition-colors" href="#">Về chúng tôi</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Cộng đồng</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Hướng dẫn sử dụng</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-6">Tài nguyên</h5>
            <ul className="space-y-4 text-white/60 text-sm">
              <li><a className="hover:text-white transition-colors" href="#">Thư viện thiền</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Blog tâm lý</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Kiểm tra stress</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-widest mb-6">Nhận bản tin tâm hồn</h5>
            <p className="text-white/60 text-sm mb-4">Nhận những lời khuyên nuôi dưỡng tâm hồn mỗi tuần.</p>
            <form className="flex flex-col gap-3">
              <input className="bg-white/10 border-white/20 rounded-2xl px-4 py-3 text-sm focus:ring-primary focus:border-primary text-white" placeholder="Email của bạn" type="email" />
              <button className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-95">Đăng ký ngay</button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/45">
          <p>© {new Date().getFullYear()} <span className="font-dancing font-bold text-sm">Vết Lành</span>. Mọi quyền được bảo lưu.</p>
          <div className="flex gap-6">
            <a className="hover:text-white" href="#">Chính sách bảo mật</a>
            <a className="hover:text-white" href="#">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
