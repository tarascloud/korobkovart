import type { MetadataRoute } from "next";
import { getAllArtworks } from "@/lib/artworks";

export const dynamic = "force-dynamic";

const BASE_URL = "https://ko.taras.cloud";
const locales = ["en", "es", "ua"];

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
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    })),
  );

  const artworks = await getAllArtworks();

  const artworkEntries = artworks.flatMap((artwork) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/gallery/${artwork.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...staticEntries, ...artworkEntries];
}
