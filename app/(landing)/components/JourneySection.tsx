"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASING } from "@/lib/motion";

export default function JourneySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const initial = prefersReduced ? {} : { y: 30, opacity: 0 };
  const animate = prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };
  const transition = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };

  return (
    <section className="relative py-32 overflow-hidden bg-linear-to-b from-hero-sky-end/50 via-background to-background" ref={ref}>
      <div className="pointer-events-none absolute top-0 inset-x-0 h-28 bg-linear-to-b from-hero-sky-end/40 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={initial}
          animate={animate}
          transition={transition()}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-hero-wordmark mb-5 leading-tight">Hành trình chữa lành diễn ra như thế nào?</h2>
          <p className="text-lg text-hero-wordmark/70">Ba bước đơn giản để thấu hiểu bản thân và tìm lại sự cân bằng.</p>
        </motion.div>

        <motion.div
          className="relative rounded-[40px] overflow-hidden shadow-2xl border-4 border-hero-wordmark/15 aspect-video"
          initial={prefersReduced ? {} : { y: 40, opacity: 0 }}
          animate={prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
          transition={transition(0.2)}
        >
          {isInView && (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover"
              src="https://res.cloudinary.com/dxml1zqnw/video/upload/f_auto,q_auto/v1784279014/vetlanh/tvc/exe201_oc1_vet_lanh_tvc.mp4"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
