"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

export function IntroOverlay() {
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("intro-done");
    if (!seen) {
      setShow(true);
      // Start exit after animation plays
      const timer = setTimeout(() => {
        setExiting(true);
        sessionStorage.setItem("intro-done", "1");
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Remove from DOM after exit animation
  useEffect(() => {
    if (exiting) {
      const timer = setTimeout(() => setShow(false), 900);
      return () => clearTimeout(timer);
    }
  }, [exiting]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Animated logo - large, centered */}
          <Logo animate size={120} showText={false} />

          {/* Title appears after logo draws */}
          <motion.h1
            className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            Korobkov
          </motion.h1>

          <motion.p
            className="mt-1 text-sm sm:text-base tracking-[0.4em] uppercase text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.5 }}
          >
            Art Studio
          </motion.p>

          {/* Horizontal line — booklet style */}
          <motion.div
            className="mt-6 h-[1px] bg-foreground/30"
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ delay: 2.2, duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
