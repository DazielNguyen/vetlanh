"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { MessageSquare, Dumbbell, Activity, Map, BookOpen, ShieldCheck } from "lucide-react";
import { EASING } from "@/lib/motion";

const FEATURES = [
  {
    icon: <MessageSquare className="w-7 h-7 text-[#6D8A96]" />,
    bg: "bg-[#F2F6F8]",
    title: "Trợ lý AI thông minh",
    desc: "Trò chuyện 24/7 với AI luôn lắng nghe, phân tích cảm xúc và gợi ý bài tập phù hợp ngay lập tức.",
  },
  {
    icon: <Dumbbell className="w-7 h-7 text-emerald-600" />,
    bg: "bg-emerald-50",
    title: "Bài tập tâm lý",
    desc: "Thư viện bài tập thở, thiền định và thư giãn cơ bắp (PMR) được thiết kế cho từng mức độ căng thẳng.",
  },
  {
    icon: <Activity className="w-7 h-7 text-rose-500" />,
    bg: "bg-rose-50",
    title: "Theo dõi cảm xúc",
    desc: "Biểu đồ trực quan theo dõi tâm trạng theo ngày, phát hiện xu hướng và nhận cảnh báo sớm.",
  },
  {
    icon: <Map className="w-7 h-7 text-violet-500" />,
    bg: "bg-violet-50",
    title: "Lộ trình chữa lành",
    desc: "Hành trình cá nhân hóa với các nhiệm vụ mở khóa dần dần, giúp bạn tiến bộ từng ngày.",
  },
  {
    icon: <BookOpen className="w-7 h-7 text-amber-500" />,
    bg: "bg-amber-50",
    title: "Nhật ký & Hồ sơ tư duy",
    desc: "Ghi lại suy nghĩ, phân tích các kiểu tư duy tiêu cực và xây dựng góc nhìn tích cực hơn.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-blue-500" />,
    bg: "bg-blue-50",
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
    <section id="dich-vu" className="py-32 bg-card" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={initial}
          animate={animate}
          transition={transition()}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Dịch vụ của Vết Lành</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Hệ sinh thái toàn diện giúp bạn chăm sóc sức khỏe tinh thần mỗi ngày.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow group"
              initial={initial}
              animate={animate}
              transition={transition(i * 0.1)}
            >
              <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
