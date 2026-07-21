"use client";

import type { RefObject } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Transition, type MotionValue } from "motion/react";
import { EASING } from "@/lib/motion";

/**
 * Ties vertical drift to scroll progress through the section (not just time),
 * so decor visibly responds while the user scrolls — layered on top of each
 * accent's own ambient loop. Different `distance` values per layer create
 * parallax depth (slower-moving background, faster-moving foreground).
 */
export function useSectionParallax(ref: RefObject<HTMLElement | null>, distance = 50): MotionValue<number> {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [-distance, distance]);
}

interface FloatingBlobProps {
  className?: string;
  color: string;
  size?: number;
  duration?: number;
  delay?: number;
  driftX?: number;
  driftY?: number;
}

/** Soft blurred circle that drifts slowly — ambient light, not a focal element. */
export function FloatingBlob({
  className,
  color,
  size = 150,
  duration = 8,
  delay = 0,
  driftX = 30,
  driftY = 24,
}: FloatingBlobProps) {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? {}
    : {
        animate: { x: [0, driftX, 0], y: [0, -driftY, 0] },
        transition: {
          duration,
          delay,
          repeat: Infinity,
          repeatType: "mirror",
          ease: EASING,
        } satisfies Transition,
      };

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-2xl ${color} ${className ?? ""}`}
      style={{ width: size, height: size }}
      {...motionProps}
    />
  );
}

interface FloatingSparkleProps {
  className?: string;
  color?: string;
  size?: number;
  duration?: number;
  delay?: number;
}

/** Small twinkling star — the same sparkle shape used in the Hero illustration. */
export function FloatingSparkle({
  className,
  color = "var(--color-illustration-sun-yellow)",
  size = 28,
  duration = 2.2,
  delay = 0,
}: FloatingSparkleProps) {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? {}
    : {
        animate: { opacity: [0.35, 1, 0.35], scale: [0.9, 1.15, 0.9] },
        transition: {
          duration,
          delay,
          repeat: Infinity,
          repeatType: "mirror",
          ease: EASING,
        } satisfies Transition,
      };

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`pointer-events-none absolute ${className ?? ""}`}
      {...motionProps}
    >
      <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill={color} />
    </motion.svg>
  );
}

interface FloatingCloudProps {
  className?: string;
  scale?: number;
  duration?: number;
  delay?: number;
  driftX?: number;
}

/** Small drifting cloud — reuses the Hero illustration's cloud shape so the
 *  lower sections read as a continuation of the same sky, not a new motif. */
export function FloatingCloud({
  className,
  scale = 1,
  duration = 10,
  delay = 0,
  driftX = 22,
}: FloatingCloudProps) {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? {}
    : {
        animate: { x: [0, driftX, 0] },
        transition: {
          duration,
          delay,
          repeat: Infinity,
          repeatType: "mirror",
          ease: EASING,
        } satisfies Transition,
      };

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 140 70"
      width={90 * scale}
      height={45 * scale}
      className={`pointer-events-none absolute opacity-90 ${className ?? ""}`}
      {...motionProps}
    >
      <ellipse cx="70" cy="40" rx="46" ry="26" fill="#FFFFFF" />
      <ellipse cx="104" cy="30" rx="34" ry="22" fill="#FFFFFF" />
      <ellipse cx="38" cy="34" rx="30" ry="20" fill="#FFFFFF" />
    </motion.svg>
  );
}
