"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASING } from "@/lib/motion";

interface WordsPullUpProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export function WordsPullUp({ text, className = "", style }: WordsPullUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={`${word}-${i}`}
            initial={prefersReduced ? {} : { y: 20, opacity: 0 }}
            animate={prefersReduced ? {} : isInView ? { y: 0, opacity: 1 } : {}}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.6, delay: i * 0.08, ease: EASING }}
            className="inline-block"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}
