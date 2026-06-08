"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { EASING } from "@/lib/motion";

const FAQS = [
  {
    q: "Ứng dụng Vết Lành có hoàn toàn miễn phí không?",
    a: "Vết Lành cung cấp các tính năng cơ bản hoàn toàn miễn phí: trò chuyện với Trợ lý AI (giới hạn), tham gia cộng đồng ẩn danh và thư viện bài tập cơ bản. Khi bạn sẵn sàng, có thể nâng cấp lên gói Pro để mở khoá toàn bộ trải nghiệm.",
  },
  {
    q: "Gói Pro có giá bao nhiêu?",
    a: "Gói Pro có 5 lựa chọn linh hoạt: 1 tháng (79.000 ₫), 3 tháng (199.000 ₫), 6 tháng (349.000 ₫), 1 năm (599.000 ₫, được khuyên dùng), và Trọn đời (999.000 ₫, một lần dùng mãi mãi). Không có phí ẩn hay tự gia hạn ngoài ý muốn.",
  },
  {
    q: "Làm thế nào để thanh toán khi nâng cấp Pro?",
    a: "Chúng tôi hỗ trợ đa dạng phương thức thanh toán an toàn: ví điện tử (MoMo, ZaloPay), chuyển khoản ngân hàng qua mã QR. Sau khi chọn gói và hoàn tất thanh toán, tài khoản Pro được kích hoạt ngay lập tức.",
  },
  {
    q: "Gói Pro khác gì so với tài khoản miễn phí?",
    a: "Tài khoản miễn phí cho phép trò chuyện AI giới hạn, cộng đồng ẩn danh và bài tập cơ bản. Gói Pro mở khoá hoàn toàn: AI chat không giới hạn, lộ trình chữa lành cá nhân hóa, toàn bộ thư viện bài tập, biểu đồ cảm xúc nâng cao, nhật ký & hồ sơ tư duy đầy đủ, kế hoạch an toàn và ưu tiên hỗ trợ kỹ thuật.",
  },
];

export default function FAQSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const initial = prefersReduced ? {} : { y: 30, opacity: 0 };
  const animate = prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };
  const transition = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };

  return (
    <section id="faq" className="relative py-32 overflow-hidden" ref={ref}>
      <Image src="/images/bg5.png" alt="" fill className="object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-28 bg-linear-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-linear-to-b from-transparent to-black/70" />
      <div className="relative mx-auto max-w-200 px-6">
        <motion.div
          className="mb-16 text-center"
          initial={initial}
          animate={animate}
          transition={transition()}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Câu hỏi thường gặp</h2>
          <p className="mt-4 text-white/75 text-lg">
            Giải đáp các thắc mắc về cách <span className="font-dancing font-bold text-[1.1em]">Vết Lành</span> đồng hành cùng bạn.
          </p>
        </motion.div>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={initial}
              animate={animate}
              transition={transition(0.1 + i * 0.08)}
            >
              <details className="group rounded-[24px] border border-white/20 bg-white/10 backdrop-blur-md p-6 hover:bg-white/15 transition-all">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-white text-lg list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-white/70 transition-transform group-open:rotate-180 shrink-0 ml-4" />
                </summary>
                <div className="mt-4 text-base leading-relaxed text-white/80">
                  {faq.a}
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
