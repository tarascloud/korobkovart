"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronsDown } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");
  const prefersReducedMotion = useReducedMotion();
  const [isIntro, setIsIntro] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("intro-done")) {
      setIsIntro(false);
    } else {
      sessionStorage.setItem("intro-done", "1");
    }
  }, []);

  const textDelay = prefersReducedMotion ? 0 : isIntro ? 1.4 : 0.2;
  const noMotion = { initial: undefined, animate: undefined, transition: undefined };

  return (
    <section className="relative min-h-[100dvh] flex items-end sm:items-center px-6">
      {/* Background Video and Overlays */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
          src="/hero-bg.mp4?v=2"
          poster="/hero-bg-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Darkening overlay */}
        <div className="absolute inset-0 bg-background/30 sm:bg-background/20" />
        {/* Left-side content area darkening for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent" />
        {/* Bottom fade into next section */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Split layout: text left, logo right */}
      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 sm:gap-16 pb-24 sm:pb-0">
        {/* Left: Text content -- left-aligned, asymmetric */}
        <motion.div
          className="flex flex-col gap-6 max-w-lg"
          {...(prefersReducedMotion
            ? noMotion
            : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: textDelay, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              })}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-none uppercase">
            Korobkov
            <br />
            <span className="font-light text-secondary">Art Studio</span>
          </h1>

          <p className="text-base sm:text-lg text-secondary tracking-[0.2em] uppercase">
            {t("tagline")}
          </p>

          <p className="text-sm text-secondary tracking-wider max-w-sm leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-row flex-wrap gap-3 mt-2">
            <Link
              href="/gallery"
              className="px-6 sm:px-8 py-3.5 min-h-[44px] inline-flex items-center justify-center bg-foreground text-background text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("cta_gallery")}
            </Link>
            <Link
              href="/contact"
              className="px-6 sm:px-8 py-3.5 min-h-[44px] inline-flex items-center justify-center border border-foreground/40 text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("cta_inquire")}
            </Link>
          </div>
        </motion.div>

        {/* Logo only in header nav, not duplicated here */}
      </div>

      {/* Scroll indicator -- bottom center */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        {...(prefersReducedMotion
          ? noMotion
          : {
              initial: { opacity: 0 },
              animate: { opacity: 1, y: [0, 8, 0] },
              transition: {
                opacity: { delay: textDelay + 0.4, duration: 0.8 },
                y: { repeat: Infinity, duration: 2 },
              },
            })}
      >
        <ChevronsDown size={24} strokeWidth={1.5} className="text-secondary" />
      </motion.div>
    </section>
  );
}
