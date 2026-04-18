"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArtworkCard } from "@/components/ArtworkCard";
import { InquiryForm } from "@/components/InquiryForm";
import { BuyButton } from "@/components/BuyButton";
import { ArtworkOwnerActions } from "@/components/ArtworkOwnerActions";
import { translateMedium } from "@/lib/translate-medium";
import { getImageUrl } from "@/lib/r2";
import { Link } from "@/i18n/navigation";
import type { Artwork } from "@/lib/types";

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

  const statusLabels: Record<string, string> = {
    available: t("status_available"),
    sold: t("status_sold"),
    "on-exhibition": t("status_exhibition"),
    exists: t("status_exists"),
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <Link
        href="/gallery"
        className="text-sm text-secondary hover:text-foreground transition-colors duration-300 tracking-[0.15em] uppercase mb-8 inline-block"
      >
        &larr; {t("series")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-muted">
          <Image
            src={getImageUrl(artwork.image)}
            alt={artwork.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-[0.1em]">{artwork.title}</h1>
            {artwork.id && (
              <ArtworkOwnerActions
                artwork={{ id: artwork.id, status: artwork.status, featured: artwork.featured }}
                isOwner={isOwner}
              />
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-secondary">{t("year")}</span>
              <span>{artwork.year}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-secondary">{t("medium")}</span>
              <span>{translateMedium(artwork.medium, tMedium)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-secondary">{t("dimensions")}</span>
              <span>{artwork.dimensions}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-secondary">{t("status")}</span>
              <span className="flex items-center gap-2">
                {artwork.status === "available" && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground/60" />
                )}
                {statusLabels[artwork.status]}
              </span>
            </div>
            {artwork.limitedEdition && (
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-secondary">{t("limited_edition")}</span>
                <span>
                  {artwork.limitedEdition.available} {t("of")}{" "}
                  {artwork.limitedEdition.total}
                </span>
              </div>
            )}
          </div>

          {artwork.status === "available" && (
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
          )}
        </div>
      </div>

      {/* Related works */}
      {related.length > 0 && (
        <section className="mt-20 pt-12 border-t border-border">
          <h2 className="text-lg font-semibold tracking-[0.2em] uppercase mb-10">
            {t("related")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((a) => (
              <ArtworkCard key={a.slug} artwork={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
