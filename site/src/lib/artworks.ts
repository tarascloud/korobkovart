import { prisma } from "./prisma";
import type { Artwork as PrismaArtwork } from "@prisma/client";
import type { Artwork } from "./types";

export function mapArtwork(a: PrismaArtwork): Artwork {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    year: a.year,
    series: a.series as Artwork["series"],
    medium: a.medium,
    dimensions: a.dimensions,
    status: (a.status === "on_exhibition" ? "on-exhibition" : a.status) as Artwork["status"],
    image: a.imagePath,
    featured: a.featured,
    order: a.sortOrder,
    collaborator: a.collaborator || undefined,
    limitedEdition: a.limitedEditionTotal
      ? { total: a.limitedEditionTotal, available: a.limitedEditionAvailable || 0 }
      : undefined,
    description:
      a.descriptionEn || a.descriptionEs || a.descriptionUa
        ? {
            en: a.descriptionEn || "",
            es: a.descriptionEs || "",
            ua: a.descriptionUa || "",
          }
        : undefined,
  };
}

export async function getAllArtworks(): Promise<Artwork[]> {
  const rows = await prisma.artwork.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(mapArtwork);
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const row = await prisma.artwork.findUnique({ where: { slug } });
  return row ? mapArtwork(row) : null;
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  const rows = await prisma.artwork.findMany({
    where: { featured: true },
    orderBy: { sortOrder: "asc" },
    take: 8,
  });
  return rows.map(mapArtwork);
}

export async function getArtworksBySeries(series: string): Promise<Artwork[]> {
  const rows = await prisma.artwork.findMany({
    where: { series: series as PrismaArtwork["series"] },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(mapArtwork);
}

export async function getRelatedArtworks(
  series: string,
  excludeSlug: string,
  limit = 4,
): Promise<Artwork[]> {
  const rows = await prisma.artwork.findMany({
    where: { series: series as PrismaArtwork["series"], slug: { not: excludeSlug } },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
  return rows.map(mapArtwork);
}
