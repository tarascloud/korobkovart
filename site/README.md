This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Image Storage (Cloudflare R2)

Artwork images can be served from a Cloudflare R2 bucket instead of the local `/public/` directory. This reduces container image size and enables CDN caching.

### Setup

1. Create an R2 bucket in the Cloudflare dashboard (e.g. `korobkovart-images`).
2. Configure a custom domain for the bucket (e.g. `images.korobkovart.com`).
3. Upload existing images:
   ```bash
   # Dry-run first (lists files without uploading)
   ./scripts/upload-to-r2.sh

   # Actually upload
   ./scripts/upload-to-r2.sh --execute --bucket korobkovart-images
   ```
4. Set `R2_PUBLIC_URL` in your environment:
   ```bash
   R2_PUBLIC_URL=https://images.korobkovart.com
   ```
5. Rebuild and deploy.

### How it works

- `src/lib/r2.ts` exports `getImageUrl(path)` which resolves image paths.
- When `R2_PUBLIC_URL` is set, paths like `/artworks/mural-1.jpg` become `https://images.korobkovart.com/artworks/mural-1.jpg`.
- When `R2_PUBLIC_URL` is not set, images are served from the local `/public/` directory as before.
- `next.config.ts` dynamically adds the R2 domain to `images.remotePatterns` for Next.js Image optimization.
