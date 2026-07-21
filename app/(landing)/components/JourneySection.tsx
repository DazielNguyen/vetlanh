"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASING } from "@/lib/motion";
import { FloatingBlob, FloatingSparkle, FloatingCloud, useSectionParallax } from "./decor/FloatingAccents";

export default function JourneySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();
  const parallaxSlow = useSectionParallax(ref, 30);
  const parallaxFast = useSectionParallax(ref, 45);

  const initial = prefersReduced ? {} : { y: 30, opacity: 0 };
  const animate = prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 };
  const transition = (delay = 0) =>
    prefersReduced ? { duration: 0 } : { duration: 0.7, ease: EASING, delay };

  return (
    <section className="relative py-32 overflow-hidden bg-linear-to-b from-background via-hero-sky-end/45 to-background" ref={ref}>
      {isInView && (
        <>
          <motion.div className="pointer-events-none absolute inset-0" style={{ y: parallaxSlow }}>
            <FloatingBlob color="bg-illustration-mint/40" className="top-12 left-[6%]" size={160} duration={8.5} />
            <FloatingCloud className="top-14 right-[6%]" scale={1} duration={10} />
          </motion.div>
          <motion.div className="pointer-events-none absolute inset-0" style={{ y: parallaxFast }}>
            <FloatingSparkle className="bottom-16 right-[12%]" color="var(--color-illustration-sky-blue)" size={30} delay={1} />
          </motion.div>
        </>
      )}
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
