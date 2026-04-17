"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { translateMedium } from "@/lib/translate-medium";
import type { Artwork } from "@/lib/types";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const tMedium = useTranslations("medium");
  return (
    <Link href={`/gallery/${artwork.slug}`}>
      <motion.article
        className="group cursor-pointer"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative overflow-hidden bg-muted aspect-[3/4]">
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium tracking-wide">
            {artwork.title}
          </h3>
          <p className="text-xs text-secondary">
            {artwork.year} &middot; {translateMedium(artwork.medium, tMedium)}
          </p>
          <p className="text-xs text-secondary">{artwork.dimensions}</p>
        </div>
      </motion.article>
    </Link>
  );
}
