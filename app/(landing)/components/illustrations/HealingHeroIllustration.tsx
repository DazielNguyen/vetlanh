"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import { EASING } from "@/lib/motion";

interface HealingHeroIllustrationProps {
  className?: string;
}

/**
 * Hand-authored original illustration (no third-party asset) — a calm character
 * resting on a grassy mound under a glowing sun, clouds, and sparkles.
 * Each ambient loop animates only opacity/transform (x/y), never scale-with-origin
 * or filters, to stay compositor-cheap on mid-range mobile.
 */
export default function HealingHeroIllustration({ className }: HealingHeroIllustrationProps) {
  const prefersReduced = useReducedMotion();

  const loop = (animate: Record<string, number[]>, duration: number, delay = 0) =>
    prefersReduced
      ? {}
      : {
          animate,
          transition: {
            duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: EASING,
            delay,
          } satisfies Transition,
        };

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Layer 1: sun glow — ambient opacity pulse */}
      <motion.g id="layer-sun-glow" {...loop({ opacity: [0.85, 1, 0.85] }, 4)}>
        <circle cx="600" cy="150" r="130" fill="var(--color-illustration-sun-yellow)" opacity="0.22" />
        <circle cx="600" cy="150" r="95" fill="var(--color-illustration-sun-yellow)" opacity="0.28" />
        <circle cx="600" cy="150" r="62" fill="var(--color-illustration-sun-yellow)" />
      </motion.g>

      {/* Layer 2: far clouds — slow horizontal drift */}
      <motion.g id="layer-clouds-back" opacity="0.85" {...loop({ x: [0, 14, 0] }, 9)}>
        <g transform="translate(90,110)">
          <ellipse cx="0" cy="10" rx="46" ry="26" fill="#FFFFFF" />
          <ellipse cx="34" cy="0" rx="34" ry="22" fill="#FFFFFF" />
          <ellipse cx="-32" cy="4" rx="30" ry="20" fill="#FFFFFF" />
        </g>
        <g transform="translate(700,240)">
          <ellipse cx="0" cy="8" rx="38" ry="20" fill="#FFFFFF" />
          <ellipse cx="26" cy="0" rx="26" ry="16" fill="#FFFFFF" />
        </g>
      </motion.g>

      {/* Layer 3: near clouds — opposite drift, offset timing */}
      <motion.g id="layer-clouds-front" {...loop({ x: [0, -18, 0] }, 11, 0.5)}>
        <g transform="translate(150,340)">
          <ellipse cx="0" cy="10" rx="52" ry="28" fill="#FFFFFF" />
          <ellipse cx="40" cy="2" rx="36" ry="24" fill="#FFFFFF" />
          <ellipse cx="-38" cy="6" rx="32" ry="20" fill="#FFFFFF" />
        </g>
      </motion.g>

      {/* Layer 4: sparkles — twinkle opacity, staggered from clouds */}
      <motion.g id="layer-sparkles" {...loop({ opacity: [0.35, 1, 0.35] }, 2.4)}>
        <path d="M470 90 L478 108 L496 116 L478 124 L470 142 L462 124 L444 116 L462 108 Z" fill="var(--color-illustration-sky-blue)" />
        <path d="M690 320 L695 332 L707 337 L695 342 L690 354 L685 342 L673 337 L685 332 Z" fill="var(--color-illustration-coral)" />
        <path d="M120 460 L125 472 L137 477 L125 482 L120 494 L115 482 L103 477 L115 472 Z" fill="var(--color-illustration-sun-yellow)" />
        <circle cx="560" cy="260" r="6" fill="var(--color-illustration-coral)" />
        <circle cx="240" cy="200" r="5" fill="var(--color-illustration-sky-blue)" />
      </motion.g>

      {/* Layer 5: grassy mound — static ground plane, no animation */}
      <g id="layer-ground">
        <ellipse cx="400" cy="580" rx="420" ry="110" fill="var(--color-illustration-mint)" opacity="0.55" />
        <ellipse cx="400" cy="560" rx="360" ry="90" fill="var(--color-illustration-mint)" />
      </g>

      {/* Layer 6: character — slow breathing bounce (y only) */}
      <motion.g id="layer-character" {...loop({ y: [0, -6, 0] }, 4.5)}>
        {/* crossed legs */}
        <path d="M310 540 Q400 590 490 540 Q470 520 400 520 Q330 520 310 540 Z" fill="var(--color-hero-wordmark)" opacity="0.85" />
        {/* torso */}
        <ellipse cx="400" cy="450" rx="80" ry="95" fill="var(--color-illustration-coral)" />
        {/* arms resting on knees */}
        <ellipse cx="335" cy="500" rx="22" ry="34" fill="var(--color-illustration-coral)" transform="rotate(-20 335 500)" />
        <ellipse cx="465" cy="500" rx="22" ry="34" fill="var(--color-illustration-coral)" transform="rotate(20 465 500)" />
        {/* head */}
        <circle cx="400" cy="360" r="58" fill="#F4C9A0" />
        {/* hair */}
        <path d="M344 350 Q340 296 400 292 Q460 296 456 350 Q400 320 344 350 Z" fill="var(--color-hero-wordmark)" />
        {/* closed calm eyes */}
        <path d="M374 362 q10 8 20 0" stroke="var(--color-hero-wordmark)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M406 362 q10 8 20 0" stroke="var(--color-hero-wordmark)" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* soft smile */}
        <path d="M386 384 q14 12 28 0" stroke="var(--color-hero-wordmark)" strokeWidth="4" strokeLinecap="round" fill="none" />
      </motion.g>
    </svg>
  );
}
