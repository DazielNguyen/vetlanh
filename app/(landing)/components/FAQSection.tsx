"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { EASING } from "@/lib/motion";

const FAQS = [
  {
    q: "Ứng dụng Vết Lành có hoàn toàn miễn phí không?",
    a: "Các tính năng cơ bản hoàn toàn miễn phí — AI chat giới hạn, cộng đồng ẩn danh và bài tập cơ bản. Nâng cấp Pro khi bạn muốn mở khoá toàn bộ.",
  },
  {
    q: "Gói Pro có giá bao nhiêu?",
    a: "4 lựa chọn linh hoạt: 79.000 ₫/tháng, 199.000 ₫/3 tháng, 349.000 ₫/6 tháng, hoặc 599.000 ₫/năm (khuyên dùng). Không phí ẩn, không tự gia hạn.",
  },
  {
    q: "Làm thế nào để thanh toán khi nâng cấp Pro?",
    a: "Ví điện tử (MoMo, ZaloPay) hoặc chuyển khoản QR. Tài khoản Pro kích hoạt ngay sau khi thanh toán.",
  },
  {
    q: "Gói Pro khác gì so với tài khoản miễn phí?",
    a: "Gói Pro mở khoá AI chat không giới hạn, lộ trình cá nhân hóa, toàn bộ thư viện bài tập, biểu đồ cảm xúc nâng cao và ưu tiên hỗ trợ.",
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
    <section id="faq" className="relative py-32 overflow-hidden bg-linear-to-b from-background via-background to-illustration-mint/15" ref={ref}>
      <div className="relative mx-auto max-w-200 px-6">
        <motion.div
          className="mb-16 text-center"
          initial={initial}
          animate={animate}
          transition={transition()}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-hero-wordmark mb-4">Câu hỏi thường gặp</h2>
          <p className="mt-4 text-hero-wordmark/70 text-lg">
            Giải đáp các thắc mắc về cách <span className="font-baloo font-bold text-[1.1em]">Vết Lành</span> đồng hành cùng bạn.
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
              <details className="card-glass-warm group rounded-[24px] p-6 transition-all hover:bg-white/50">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-hero-wordmark text-lg list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-hero-wordmark/60 transition-transform group-open:rotate-180 shrink-0 ml-4" />
                </summary>
                <div className="mt-4 text-base leading-relaxed text-hero-wordmark/75">
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
