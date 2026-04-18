"use client";

import { motion } from "framer-motion";

/**
 * Exact SVG recreation of the Korobkov Art Studio logo — traced perfectly from original PNG.
 *
 * Structure (derived from the original):
 * 1. Bold outer brackets [ ]
 * 2. K-figure inside:
 *    a) Vertical line — with a distinctive notch on its right side for the circle to nestle into.
 *    b) Circle — head, nestled in the notch.
 *    c) Leaf / Leg — petal-like sweeping curve that points rightward.
 *
 * All strokes are now completely accurate filled paths.
 */

const easePremium = [0.22, 1, 0.36, 1] as const;

const bracketLeft = {
  hidden: { opacity: 0, x: 25 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay, duration: 1.2, ease: easePremium },
  }),
};

const bracketRight = {
  hidden: { opacity: 0, x: -25 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay, duration: 1.2, ease: easePremium },
  }),
};

const kStem = {
  hidden: { opacity: 0, y: -30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 1.0, ease: easePremium },
  }),
};

const kCircle = {
  hidden: { opacity: 0, y: -25 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, type: "spring" as const, stiffness: 280, damping: 18, mass: 0.8 },
  }),
};

const kLeaf = {
  hidden: { opacity: 0, x: -25, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: { delay, duration: 1.0, ease: easePremium },
  }),
};

export function Logo({
  animate = false,
  size = 48,
  showText = true,
  className = "",
}: {
  animate?: boolean;
  size?: number;
  showText?: boolean;
  className?: string;
}) {
  const shouldAnimate = animate;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        initial={shouldAnimate ? "hidden" : "visible"}
        animate="visible"
      >
        {/* === LEFT BOLD BRACKET === */}
        <motion.path
          d="M 9.42 120.00 L 9.42 230.58 37.08 230.58 L 64.73 230.58 64.73 225.96 L 64.73 221.34 41.70 221.34 L 18.66 221.34 18.66 120.00 L 18.66 18.66 41.70 18.66 L 64.73 18.66 64.73 14.04 L 64.73 9.42 37.08 9.42 L 9.42 9.42 9.42 120.00"
          variants={bracketLeft} custom={0}
        />

        {/* === RIGHT BOLD BRACKET === */}
        <motion.path
          d="M 175.27 14.04 L 175.27 18.66 198.26 18.66 L 221.25 18.66 221.25 120.00 L 221.25 221.34 198.26 221.34 L 175.27 221.34 175.27 225.96 L 175.27 230.58 202.92 230.58 L 230.58 230.58 230.58 120.00 L 230.58 9.42 202.92 9.42 L 175.27 9.42 175.27 14.04"
          variants={bracketRight} custom={0.1}
        />

        {/* === K FIGURE === */}

        {/* Vertical Element (with notch for circle) */}
        <motion.path
          d="M 64.73 120.01 C 64.73 172.61 64.74 175.28 64.90 175.24 C 64.99 175.22 73.28 173.15 83.32 170.64 L 101.58 166.08 101.58 120.00 L 101.58 73.92 83.23 69.33 C 73.13 66.80 64.84 64.73 64.81 64.73 C 64.77 64.73 64.73 89.61 64.73 120.01"
          variants={kStem} custom={0.3}
        />

        {/* Nestled Circle */}
        <motion.path
          d="M 140.96 67.09 C 135.76 67.56 131.44 69.65 127.79 73.44 C 124.73 76.63 122.99 80.22 122.35 84.66 C 122.15 86.01 122.12 89.33 122.30 90.55 C 122.51 92.05 122.80 93.33 123.21 94.61 C 125.02 100.13 129.51 104.88 134.97 107.04 C 140.42 109.21 147.17 108.98 152.32 106.45 C 154.38 105.44 155.94 104.32 157.67 102.63 C 161.79 98.60 163.86 93.64 163.86 87.81 C 163.86 82.15 162.00 77.41 158.22 73.48 C 154.85 69.97 150.84 67.88 146.20 67.23 C 144.93 67.05 142.19 66.98 140.96 67.09"
          variants={kCircle} custom={0.5}
        />

        {/* Petal-like Leaf / Leg */}
        <motion.path
          d="M 127.07 120.06 C 121.63 120.46 116.50 122.47 111.94 125.98 C 111.04 126.68 108.08 129.56 108.08 129.75 C 108.08 129.93 126.87 158.03 127.96 159.48 C 129.48 161.50 130.81 163.04 132.44 164.67 C 138.29 170.52 144.99 173.89 152.81 174.89 C 155.48 175.23 157.57 175.27 171.29 175.25 L 184.51 175.22 178.56 166.31 C 164.55 145.37 155.79 132.30 155.35 131.68 C 151.83 126.80 147.54 123.67 141.82 121.80 C 138.78 120.80 135.70 120.27 131.78 120.05 C 129.85 119.94 128.56 119.95 127.07 120.06"
          variants={kLeaf} custom={0.65}
        />
      </motion.svg>

      {showText && (
        <motion.div
          className="hidden sm:block leading-tight"
          initial={shouldAnimate ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: shouldAnimate ? 1.0 : 0, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <span className="text-base font-extrabold tracking-[0.2em] uppercase block">
            Korobkov
          </span>
          <span className="text-[10px] font-normal tracking-[0.35em] uppercase block mt-0.5">
            Art Studio
          </span>
        </motion.div>
      )}
    </div>
  );
}
