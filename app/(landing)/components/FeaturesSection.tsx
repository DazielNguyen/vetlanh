"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { MessageSquare, Dumbbell, Activity, Map, BookOpen, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { EASING } from "@/lib/motion";

const FEATURES = [
  {
    icon: <MessageSquare className="w-7 h-7 text-white" />,
    bg: "bg-white/20",
    title: "Trợ lý AI thông minh",
    desc: "Trò chuyện 24/7 với AI luôn lắng nghe, phân tích cảm xúc và gợi ý bài tập phù hợp ngay lập tức.",
  },
  {
    icon: <Dumbbell className="w-7 h-7 text-white" />,
    bg: "bg-white/20",
    title: "Bài tập tâm lý",
    desc: "Thư viện bài tập thở, thiền định và thư giãn cơ bắp (PMR) được thiết kế cho từng mức độ căng thẳng.",
  },
  {
    icon: <Activity className="w-7 h-7 text-white" />,
    bg: "bg-white/20",
    title: "Theo dõi cảm xúc",
    desc: "Biểu đồ trực quan theo dõi tâm trạng theo ngày, phát hiện xu hướng và nhận cảnh báo sớm.",
  },
  {
    icon: <Map className="w-7 h-7 text-white" />,
    bg: "bg-white/20",
    title: "Lộ trình chữa lành",
    desc: "Hành trình cá nhân hóa với các nhiệm vụ mở khóa dần dần, giúp bạn tiến bộ từng ngày.",
  },
  {
    icon: <BookOpen className="w-7 h-7 text-white" />,
    bg: "bg-white/20",
    title: "Nhật ký & Hồ sơ tư duy",
    desc: "Ghi lại suy nghĩ, phân tích các kiểu tư duy tiêu cực và xây dựng góc nhìn tích cực hơn.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-white" />,
    bg: "bg-white/20",
    title: "Kế hoạch an toàn",
    desc: "Tạo và lưu kế hoạch ứng phó khủng hoảng cá nhân với danh sách liên hệ khẩn cấp.",
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const initial = prefersReduced ? {} : { y: 30, opacity: 0 };
  const animate = prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };
  const transition = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };

  return (
    <section id="dich-vu" className="relative py-32 overflow-hidden" ref={ref}>
      <Image src="/images/bg1.png" alt="" fill className="object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-28 bg-linear-to-b from-black/80 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28 bg-linear-to-b from-transparent to-black/70" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={initial}
          animate={animate}
          transition={transition()}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Dịch vụ của Vết Lành</h2>
          <p className="text-white/75 max-w-2xl mx-auto text-lg">Hệ sinh thái toàn diện giúp bạn chăm sóc sức khỏe tinh thần mỗi ngày.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="p-8 rounded-[32px] bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all group"
              initial={initial}
              animate={animate}
              transition={transition(i * 0.1)}
            >
              <div className={`w-14 h-14 ${f.bg} backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/25`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-white/75 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
