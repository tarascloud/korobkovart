"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { translateMedium } from "@/lib/translate-medium";
import { getImageUrl } from "@/lib/r2";
import type { Artwork } from "@/lib/types";

export function ArtworkCard({ artwork, index = 0 }: { artwork: Artwork; index?: number }) {
  const tMedium = useTranslations("medium");
  return (
    <Link href={`/gallery/${artwork.slug}`}>
      <motion.article
        className="group cursor-pointer stagger-item hover-tinted-shadow"
        style={{ "--index": index } as React.CSSProperties}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <div className="relative overflow-hidden bg-muted aspect-[3/4]">
          <Image
            src={getImageUrl(artwork.image)}
            alt={artwork.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading={index < 4 ? "eager" : "lazy"}
            decoding="async"
          />
          {/* Hover overlay with quick info */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-4">
            <span className="text-background text-xs tracking-[0.2em] uppercase font-medium">
              {artwork.year} &middot; {artwork.dimensions}
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium tracking-wide">
            {artwork.title}
          </h3>
          <p className="text-xs text-secondary leading-relaxed">
            {artwork.year} &middot; {translateMedium(artwork.medium, tMedium)}
          </p>
          <p className="text-xs text-secondary">{artwork.dimensions}</p>
        </div>
      </motion.article>
    </Link>
  );
}
