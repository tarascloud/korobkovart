import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE_URL = "https://ko.taras.cloud";
const locales = ["en", "es", "ua"];

// SMM-20260601-0012: static date for rarely-changing pages — stop using new Date()
// which changes on every request and defeats lastmod freshness signal for Googlebot.
// Dynamic artwork entries use actual DB updatedAt so crawlers see real change dates.
const STATIC_LASTMOD = "2026-06-01";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/gallery",
    "/about",
    "/cv",
    "/partners",
    "/contact",
  ];

  const staticEntries = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    })),
  );

  // Use slug + updatedAt only — no need to mapArtwork for sitemap purposes
  const artworks = await prisma.artwork.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { sortOrder: "asc" },
  });

  const artworkEntries = artworks.flatMap((artwork) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/gallery/${artwork.slug}`,
      lastModified: artwork.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...staticEntries, ...artworkEntries];
}
