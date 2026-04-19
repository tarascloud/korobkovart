"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArtworkCard } from "@/components/ArtworkCard";
import { InquiryForm } from "@/components/InquiryForm";
import { BuyButton } from "@/components/BuyButton";
import { ArtworkOwnerActions } from "@/components/ArtworkOwnerActions";
import { ScrollReveal } from "@/components/ScrollReveal";
import { translateMedium } from "@/lib/translate-medium";
import { getImageUrl } from "@/lib/r2";
import { Link } from "@/i18n/navigation";
import type { Artwork } from "@/lib/types";

function ImageLightbox({
  src,
  alt,
  open,
  onClose,
}: {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-zoom-out"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] aspect-[3/4]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </motion.div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-secondary hover:text-foreground transition-colors z-10"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ArtworkDetail({
  artwork,
  related,
  isOwner = false,
}: {
  artwork: Artwork;
  related: Artwork[];
  isOwner?: boolean;
}) {
  const t = useTranslations("artwork");
  const tMedium = useTranslations("medium");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleImageClick = useCallback(() => setLightboxOpen(true), []);
  const handleLightboxClose = useCallback(() => setLightboxOpen(false), []);

  const statusLabels: Record<string, string> = {
    available: t("status_available"),
    sold: t("status_sold"),
    "on-exhibition": t("status_exhibition"),
    exists: t("status_exists"),
  };

  const metaRows = [
    { label: t("year"), value: String(artwork.year) },
    { label: t("medium"), value: translateMedium(artwork.medium, tMedium) },
    { label: t("dimensions"), value: artwork.dimensions },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <ScrollReveal>
        <Link
          href="/gallery"
          className="text-sm text-secondary hover:text-foreground transition-colors duration-300 tracking-[0.15em] uppercase mb-8 inline-block"
        >
          &larr; {t("series")}
        </Link>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
        {/* Image */}
        <ScrollReveal>
          <div
            className="relative aspect-[3/4] bg-muted cursor-zoom-in group"
            onClick={handleImageClick}
          >
            <Image
              src={getImageUrl(artwork.image)}
              alt={artwork.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <span className="bg-foreground/80 text-background px-3 py-1.5 text-xs tracking-[0.2em] uppercase">
                {t("zoom") || "View"}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <ScrollReveal delay={0.1}>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-[0.1em]">{artwork.title}</h1>
              {artwork.id && (
                <ArtworkOwnerActions
                  artwork={{ id: artwork.id, status: artwork.status, featured: artwork.featured }}
                  isOwner={isOwner}
                />
              )}
            </div>
          </ScrollReveal>

          <div className="space-y-3 text-sm">
            {metaRows.map((row, i) => (
              <ScrollReveal key={row.label} delay={0.15 + i * 0.05}>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-secondary">{row.label}</span>
                  <span>{row.value}</span>
                </div>
              </ScrollReveal>
            ))}

            <ScrollReveal delay={0.3}>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-secondary">{t("status")}</span>
                <span className="flex items-center gap-2">
                  {artwork.status === "available" && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground/60" />
                  )}
                  {statusLabels[artwork.status]}
                </span>
              </div>
            </ScrollReveal>

            {artwork.limitedEdition && (
              <ScrollReveal delay={0.35}>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-secondary">{t("limited_edition")}</span>
                  <span>
                    {artwork.limitedEdition.available} {t("of")}{" "}
                    {artwork.limitedEdition.total}
                  </span>
                </div>
              </ScrollReveal>
            )}
          </div>

          {artwork.status === "available" && (
            <ScrollReveal delay={0.4}>
              <div className="mt-4 space-y-6">
                <BuyButton artwork={artwork} />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-4 text-xs text-secondary uppercase tracking-wider">
                      {t("inquire")}
                    </span>
                  </div>
                </div>

                <InquiryForm artworkTitle={artwork.title} type="artwork" />
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* Related works */}
      {related.length > 0 && (
        <section className="mt-20 pt-12 border-t border-border">
          <ScrollReveal>
            <h2 className="text-lg font-semibold tracking-[0.2em] uppercase mb-10">
              {t("related")}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((a, i) => (
              <ScrollReveal key={a.slug} delay={i * 0.08}>
                <ArtworkCard artwork={a} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      <ImageLightbox
        src={getImageUrl(artwork.image)}
        alt={artwork.title}
        open={lightboxOpen}
        onClose={handleLightboxClose}
      />
    </div>
  );
}
