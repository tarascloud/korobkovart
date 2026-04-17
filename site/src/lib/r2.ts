/**
 * Cloudflare R2 image URL helper.
 *
 * When R2_PUBLIC_URL is set (e.g. "https://images.korobkovart.com"),
 * all artwork image paths are resolved against the R2 bucket.
 * Otherwise, they fall back to the local /public/ directory.
 *
 * Usage:
 *   import { getImageUrl } from "@/lib/r2";
 *   <Image src={getImageUrl(artwork.image)} ... />
 */

const R2_PUBLIC_URL: string | undefined = process.env.R2_PUBLIC_URL;

/**
 * Resolve an image path to a full URL.
 *
 * @param path - Relative image path, e.g. "/artworks/mural-1.jpg"
 * @returns Full R2 URL or the original path for local fallback
 *
 * Examples:
 *   R2_PUBLIC_URL set:   getImageUrl("/artworks/mural-1.jpg")
 *     => "https://images.korobkovart.com/artworks/mural-1.jpg"
 *
 *   R2_PUBLIC_URL unset: getImageUrl("/artworks/mural-1.jpg")
 *     => "/artworks/mural-1.jpg"
 */
export function getImageUrl(path: string): string {
  if (!R2_PUBLIC_URL) {
    return path;
  }

  // Strip leading slash to avoid double-slash in URL
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const baseUrl = R2_PUBLIC_URL.endsWith("/")
    ? R2_PUBLIC_URL.slice(0, -1)
    : R2_PUBLIC_URL;

  return `${baseUrl}/${cleanPath}`;
}

/**
 * Get the full absolute URL for an image (for OG tags, JSON-LD, etc.).
 *
 * @param path - Relative image path, e.g. "/artworks/mural-1.jpg"
 * @param siteUrl - Base site URL, defaults to "https://ko.taras.cloud"
 * @returns Absolute URL to the image
 */
export function getAbsoluteImageUrl(
  path: string,
  siteUrl = "https://ko.taras.cloud",
): string {
  if (R2_PUBLIC_URL) {
    return getImageUrl(path);
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${cleanPath}`;
}
