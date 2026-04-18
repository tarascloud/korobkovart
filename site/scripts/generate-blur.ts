import { getPlaiceholder } from "plaiceholder";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter } as any);

  const artworks = await prisma.artwork.findMany();
  console.log(`Found ${artworks.length} artworks`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const artwork of artworks) {
    if (artwork.blurDataUrl) {
      console.log(`SKIP (already has blur): ${artwork.slug}`);
      skipped++;
      continue;
    }

    const imgPath = path.join(process.cwd(), "public", artwork.imagePath);
    if (!fs.existsSync(imgPath)) {
      console.log(`SKIP (file not found): ${artwork.slug} - ${imgPath}`);
      skipped++;
      continue;
    }

    try {
      const file = fs.readFileSync(imgPath);
      const { base64 } = await getPlaiceholder(file, { size: 10 });

      await prisma.artwork.update({
        where: { id: artwork.id },
        data: { blurDataUrl: base64 },
      });
      console.log(`OK: ${artwork.slug}`);
      updated++;
    } catch (err) {
      console.error(`ERR: ${artwork.slug} - ${err}`);
      errors++;
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${errors} errors`);
  await prisma.$disconnect();
}

main();
