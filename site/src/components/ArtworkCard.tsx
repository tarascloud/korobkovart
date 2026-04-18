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
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative overflow-hidden bg-muted aspect-[3/4]">
          <Image
            src={getImageUrl(artwork.image)}
            alt={artwork.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
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
