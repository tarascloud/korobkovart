"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { motion } from "framer-motion";
import { ChevronsDown } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");
  const [isIntro, setIsIntro] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("intro-done")) {
      setIsIntro(false);
    } else {
      sessionStorage.setItem("intro-done", "1");
    }
  }, []);

  const textDelay = isIntro ? 1.4 : 0.2;

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6">
      {/* Background Video and Overlays */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
          src="/hero-bg.mp4?v=2"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Darkening overlay for high contrast */}
        <div className="absolute inset-0 bg-background/20 sm:bg-background/10" />
        {/* Gradient fade to blend softly into the next section */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="relative flex flex-col items-center gap-8 text-center mt-12">
        {/* Logo container dynamically drops down during intro */}
        <motion.div
          initial={{ scale: isIntro ? 1.2 : 1, y: isIntro ? 20 : 0 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: isIntro ? 0.4 : 0 }}
        >
          <Logo animate={isIntro} size={100} showText={false} />
        </motion.div>

        {/* The rest of the hero elements gracefully fade in */}
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: textDelay, duration: 0.8, ease: "easeOut" }}
        >
          {/* Decorative line */}
          <div className="h-[1px] bg-foreground/20 w-24" />

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase">
            Korobkov
            <br />
            Art Studio
          </h1>

          <p className="text-lg sm:text-xl text-secondary tracking-widest uppercase">
            {t("tagline")}
          </p>

          <p className="text-sm text-secondary tracking-wider max-w-sm mx-auto">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/gallery"
              className="px-10 py-4 bg-foreground text-background text-sm tracking-widest uppercase hover:opacity-90 transition-all hover:scale-[1.02]"
            >
              {t("cta_gallery")}
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 border border-foreground text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all hover:scale-[1.02]"
            >
              {t("cta_inquire")}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ 
          opacity: { delay: textDelay + 0.4, duration: 0.8 },
          y: { repeat: Infinity, duration: 2 } 
        }}
      >
        <ChevronsDown size={24} strokeWidth={1.5} className="text-secondary" />
      </motion.div>
    </section>
  );
}
