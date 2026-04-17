"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { motion } from "framer-motion";
import { ChevronsDown } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6">
      <motion.div
        className="flex flex-col items-center gap-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <Logo size={80} showText={false} />

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase">
          Korobkov
          <br />
          Art Studio
        </h1>

        <p className="text-lg sm:text-xl text-secondary tracking-widest uppercase">
          {t("tagline")}
        </p>

        <p className="text-sm text-secondary tracking-wider">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/gallery"
            className="px-8 py-3 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            {t("cta_gallery")}
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 border border-foreground text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            {t("cta_inquire")}
          </Link>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronsDown size={24} strokeWidth={1.5} className="text-secondary" />
      </motion.div>
    </section>
  );
}
