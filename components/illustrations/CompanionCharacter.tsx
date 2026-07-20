"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { EASING } from "@/lib/motion";

export const COMPANION_STATES = ["idle", "listening", "thinking", "happy", "empathetic"] as const;
export type CompanionState = (typeof COMPANION_STATES)[number];

interface CompanionCharacterProps {
  /** Expressive state to render. Switching state cross-fades the face/accent
   * layer over ~0.35s rather than cutting instantly. Defaults to "idle". */
  state?: CompanionState;
  /** Classes on the root <svg> for sizing/positioning — safe at avatar scale
   * (e.g. `w-10 h-10`) and hero scale (e.g. `w-48 h-48`); the viewBox keeps
   * proportions at any size. */
  className?: string;
}

/** A single stroked eye/mouth curve shared by every face state. */
function FaceStroke({ d }: { d: string }) {
  return <path d={d} stroke="var(--color-hero-wordmark)" strokeWidth="4" strokeLinecap="round" fill="none" />;
}

/** Per-state visual config: antenna tilt (degrees) + face accents. Single
 * source of truth so Phase 3 (real app-state wiring) only touches one table. */
const FACE_CONFIG: Record<CompanionState, { antennaTilt: number; face: React.ReactNode }> = {
  idle: {
    antennaTilt: 0,
    face: (
      <>
        <FaceStroke d="M74 108 q6 6 12 0" />
        <FaceStroke d="M114 108 q6 6 12 0" />
        <FaceStroke d="M88 128 q12 6 24 0" />
      </>
    ),
  },
  listening: {
    antennaTilt: -8,
    face: (
      <>
        <circle cx="80" cy="108" r="7" fill="var(--color-hero-wordmark)" />
        <circle cx="120" cy="108" r="7" fill="var(--color-hero-wordmark)" />
        <FaceStroke d="M84 130 q16 8 32 0" />
      </>
    ),
  },
  thinking: {
    antennaTilt: 6,
    face: (
      <>
        <FaceStroke d="M74 106 q6 -6 12 0" />
        <FaceStroke d="M114 106 q6 -6 12 0" />
        <FaceStroke d="M88 128 q12 -4 24 0" />
        <circle cx="140" cy="80" r="3.5" fill="var(--color-illustration-sky-blue)" />
        <circle cx="150" cy="68" r="5" fill="var(--color-illustration-sky-blue)" />
      </>
    ),
  },
  happy: {
    antennaTilt: 0,
    face: (
      <>
        <FaceStroke d="M72 104 q8 10 16 0" />
        <FaceStroke d="M112 104 q8 10 16 0" />
        <FaceStroke d="M78 126 q22 20 44 0" />
        <path
          d="M56 90 L60 100 L70 104 L60 108 L56 118 L52 108 L42 104 L52 100 Z"
          fill="var(--color-illustration-sun-yellow)"
        />
        <path
          d="M146 96 L149 104 L157 107 L149 110 L146 118 L143 110 L135 107 L143 104 Z"
          fill="var(--color-illustration-coral)"
        />
      </>
    ),
  },
  empathetic: {
    antennaTilt: 0,
    face: (
      <>
        <FaceStroke d="M76 110 q6 6 12 0" />
        <FaceStroke d="M112 110 q6 6 12 0" />
        <FaceStroke d="M86 130 q14 8 28 0" />
        <circle cx="100" cy="118" r="30" fill="var(--color-illustration-coral)" opacity="0.14" />
      </>
    ),
  },
};

/**
 * Hand-authored SVG companion mascot (no third-party asset). Clones
 * HealingHeroIllustration's layering convention: motion.g layers, shared
 * EASING, useReducedMotion() gating, transform/opacity-only animation.
 */
export default function CompanionCharacter({ state = "idle", className }: CompanionCharacterProps) {
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

  const crossFade: Transition = prefersReduced ? { duration: 0 } : { duration: 0.35, ease: EASING };
  const { antennaTilt, face } = FACE_CONFIG[state];

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Layer 1: ambient glow — soft pulse behind the body */}
      <motion.circle
        cx="100"
        cy="105"
        r="72"
        fill="var(--color-illustration-sun-yellow)"
        opacity={0.18}
        {...loop({ opacity: [0.14, 0.24, 0.14] }, 3.6)}
      />

      {/* Layer 2: body — always-present breathing bounce */}
      <motion.g id="layer-body" {...loop({ y: [0, -4, 0] }, 3.2)}>
        <ellipse cx="100" cy="112" rx="56" ry="52" fill="var(--color-illustration-mint)" />
        <motion.g
          animate={{ rotate: antennaTilt }}
          transition={crossFade}
          style={{ transformOrigin: "100px 66px" }}
        >
          <rect x="97" y="50" width="6" height="20" rx="3" fill="var(--color-illustration-coral)" />
          <circle cx="100" cy="46" r="7" fill="var(--color-illustration-coral)" />
        </motion.g>
      </motion.g>

      {/* Layer 3: expressive face — cross-fades between states, never a jump-cut.
          Exit fades out faster than enter fades in, so two dissimilar face
          shapes don't sit at full double-opacity mid-transition. */}
      <AnimatePresence>
        <motion.g
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: crossFade }}
          exit={{ opacity: 0, transition: { ...crossFade, duration: crossFade.duration === 0 ? 0 : 0.15 } }}
        >
          {face}
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
