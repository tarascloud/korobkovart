import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Parse R2 hostname for next/image remotePatterns
const r2Url = process.env.R2_PUBLIC_URL;
const r2RemotePattern = r2Url
  ? (() => {
      const parsed = new URL(r2Url);
      return {
        protocol: parsed.protocol.replace(":", "") as "https" | "http",
        hostname: parsed.hostname,
      };
    })()
  : null;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    ...(r2RemotePattern
      ? { remotePatterns: [r2RemotePattern] }
      : {}),
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.cloudflare.com; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
