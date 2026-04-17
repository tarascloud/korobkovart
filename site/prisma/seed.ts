import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, ArtworkSeries, ArtworkStatus } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface ArtworkData {
  slug: string;
  title: string;
  year: number;
  series: string;
  medium: string;
  dimensions: string;
  status: string;
  image: string;
  collaborator?: string;
  limitedEdition?: { total: number; available: number };
  featured?: boolean;
  order: number;
}

const artworksData: ArtworkData[] = [
  // ===== PODILIA SERIES (2023) =====
  { slug: 'peace-in-our-hands', title: 'Peace in our hands', year: 2023, series: 'podilia', medium: 'mural', dimensions: '800x1200 cm', status: 'available', image: '/artworks/mural-1.jpg', featured: true, order: 1 },
  { slug: 'podilia-ermilov', title: 'Podilia+Ermilov', year: 2023, series: 'podilia', medium: 'canvas, acrylic/oil/spray', dimensions: '160x120 cm', status: 'available', image: '/artworks/integracion.jpg', featured: true, order: 2 },
  { slug: 'concrete-flowers', title: 'Concrete flowers', year: 2023, series: 'podilia', medium: 'canvas, oil/acrylic', dimensions: '100x85 cm', status: 'available', image: '/artworks/concrete-flowers.jpg', featured: true, order: 3 },
  { slug: 'podolyanka5', title: 'Podolyanka5', year: 2023, series: 'podilia', medium: 'canvas, acrylic/oil/spray', dimensions: '170x150 cm', status: 'available', image: '/artworks/podolyanka5.jpg', featured: true, order: 4 },
  { slug: 'collage-2023', title: 'Collage', year: 2023, series: 'podilia', medium: 'oil on canvas', dimensions: '100x105 cm', status: 'available', image: '/artworks/collage.jpg', order: 5 },
  { slug: 'childhood', title: 'Childhood', year: 2023, series: 'podilia', medium: 'canvas, oil/acrylic', dimensions: '100x125 cm', status: 'available', image: '/artworks/childhood.jpg', order: 6 },
  { slug: 'podilia-mural', title: 'Podilia mural', year: 2023, series: 'podilia', medium: 'mural, acrylic/spray', dimensions: '400x1000 cm', status: 'available', image: '/artworks/mural-5.jpg', order: 7 },
  { slug: 'deep-dreaming', title: 'Deep dreaming', year: 2023, series: 'podilia', medium: 'canvas, acrylic/oil/spray', dimensions: '180x150 cm', status: 'available', image: '/artworks/deep-dreaming.jpg', featured: true, order: 8 },
  { slug: 'podolyanka', title: 'Podolyanka', year: 2023, series: 'podilia', medium: 'oil on canvas', dimensions: '120x100 cm', status: 'available', image: '/artworks/podolyanka.jpg', order: 9 },
  { slug: 'podolyanka1', title: 'Podolyanka1', year: 2023, series: 'podilia', medium: 'canvas, acrylic/oil/spray', dimensions: '80x75 cm', status: 'available', image: '/artworks/podolyanka1.jpg', order: 10 },
  { slug: 'black-flowers', title: 'Black flowers', year: 2023, series: 'podilia', medium: 'oil on canvas', dimensions: '120x95 cm', status: 'available', image: '/artworks/black-flowers.jpg', order: 11 },
  { slug: 'podolyanka2', title: 'Podolyanka2', year: 2023, series: 'podilia', medium: 'canvas, acrylic/oil/spray', dimensions: '80x75 cm', status: 'available', image: '/artworks/podolyanka2.jpg', order: 12 },
  { slug: 'podolyanka3', title: 'Podolyanka3', year: 2023, series: 'podilia', medium: 'canvas, acrylic/oil/spray', dimensions: '80x70 cm', status: 'available', image: '/artworks/podolyanka3.jpg', order: 13 },
  { slug: 'podolyanka4', title: 'Podolyanka4', year: 2023, series: 'podilia', medium: 'two canvases, acrylic/oil/spray', dimensions: '80x70 cm', status: 'available', image: '/artworks/podolyanka4.jpg', order: 14 },
  { slug: 'cabaret-in-podilia', title: 'Cabaret in Podilia', year: 2023, series: 'podilia', medium: 'canvas, acrylic/oil/spray', dimensions: '80x70 cm', status: 'available', image: '/artworks/cabaret-in-podilia.jpg', order: 15 },
  { slug: 'family', title: 'Family', year: 2023, series: 'podilia', medium: 'canvas, acrylic/oil/spray', dimensions: '80x65 cm', status: 'available', image: '/artworks/family.jpg', order: 16 },
  { slug: 'sympatia', title: 'Sympatia', year: 2023, series: 'podilia', medium: 'canvas, acrylic/oil/spray', dimensions: '115x90 cm', status: 'available', image: '/artworks/sympatia.jpg', order: 17 },
  { slug: 'sasha', title: 'Sasha', year: 2023, series: 'podilia', medium: 'canvas, acrylic/oil/spray', dimensions: '80x65 cm', status: 'available', image: '/artworks/sasha.jpg', order: 18 },
  // ===== DESTRUCTION SERIES (2022) =====
  { slug: 'lucretia', title: 'Lucretia', year: 2022, series: 'destruction', medium: 'canvas, acrylic/oil/spray', dimensions: '80x65 cm', status: 'available', image: '/artworks/lucretia.jpg', order: 19 },
  { slug: 'bulvarno-kudriavska-34', title: 'Bulvarno-Kudriavska Street 34', year: 2022, series: 'destruction', medium: 'canvas, acrylic/oil/spray', dimensions: '80x65 cm', status: 'available', image: '/artworks/bulvarno-kudriavska-34.jpg', order: 20 },
  { slug: 'destruction-activation', title: 'Destruction/Activation', year: 2022, series: 'destruction', medium: 'canvas, textile, collage, acrylic, oil, spray', dimensions: '200x350 cm', status: 'available', image: '/artworks/destruction-activation.jpg', collaborator: 'Liza Obukhovska', featured: true, order: 21 },
  { slug: 'destruction-activation-2', title: 'Destruction/Activation 2', year: 2022, series: 'destruction', medium: 'plywood, canvas, textile, collage, acrylic, spray', dimensions: '180x80 cm', status: 'available', image: '/artworks/destruction-activation-2.jpg', collaborator: 'Liza Obukhovska', order: 22 },
  { slug: 'destruction', title: 'Destruction', year: 2022, series: 'destruction', medium: 'canvas, acrylic/spray', dimensions: '120x80 cm', status: 'available', image: '/artworks/destruction.jpg', featured: true, order: 23 },
  { slug: 'memento-mori', title: 'Memento mori', year: 2022, series: 'destruction', medium: 'canvas, acrylic/oil/spray', dimensions: '95x85 cm', status: 'available', image: '/artworks/memento-mori.jpg', order: 24 },
  { slug: 'destruction-silkscreen', title: 'Destruction (silkscreen)', year: 2022, series: 'destruction', medium: 'silkscreen, 5 layers, astroprint paper, 280 g.', dimensions: '70x50 cm', status: 'available', image: '/artworks/destruction-silkscreen.jpg', limitedEdition: { total: 50, available: 50 }, order: 25 },
  { slug: 'reflection-silkscreen', title: 'Reflection (silkscreen)', year: 2022, series: 'destruction', medium: 'silkscreen, 2 layers, dali camoscio paper, 285 g.', dimensions: '70x50 cm', status: 'available', image: '/artworks/reflection-silkscreen.jpg', limitedEdition: { total: 50, available: 50 }, order: 26 },
  { slug: 'destruction-4', title: 'Destruction 4', year: 2022, series: 'destruction', medium: 'canvas, acrylic/spray', dimensions: '95x85 cm', status: 'available', image: '/artworks/destruction-4.jpg', order: 27 },
  { slug: 'destruction-2', title: 'Destruction 2', year: 2022, series: 'destruction', medium: 'canvas, acrylic/oil/spray', dimensions: '100x90 cm', status: 'available', image: '/artworks/destruction-2.jpg', order: 28 },
  { slug: 'destruction-3', title: 'Destruction 3', year: 2022, series: 'destruction', medium: 'canvas, acrylic/oil/spray', dimensions: '100x90 cm', status: 'available', image: '/artworks/destruction-3.jpg', order: 29 },
  { slug: 'stop', title: 'Stop', year: 2022, series: 'destruction', medium: 'canvas, acrylic/oil/spray', dimensions: '110x90 cm', status: 'available', image: '/artworks/stop.jpg', order: 30 },
  { slug: 'print', title: 'Print', year: 2022, series: 'destruction', medium: 'canvas, collage/oil', dimensions: '139x123 cm', status: 'available', image: '/artworks/print.jpg', order: 31 },
  { slug: 'destruction-sculpture', title: 'Destruction sculpture', year: 2022, series: 'destruction', medium: 'air hardening modeling clay, acrylic, spray', dimensions: '40x25 cm', status: 'available', image: '/artworks/destruction-sculpture.jpg', order: 32 },
  { slug: 'go-where-its-scary', title: "Go where it's scary", year: 2022, series: 'destruction', medium: 'canvas/oil', dimensions: '200x160 cm', status: 'available', image: '/artworks/go-where-its-scary.jpg', featured: true, order: 33 },
  { slug: 'skin', title: 'Skin', year: 2022, series: 'destruction', medium: 'canvas, acrylic/oil', dimensions: '120x100 cm', status: 'available', image: '/artworks/skin.jpg', order: 34 },
  { slug: 'children-of-nature', title: 'Children of nature', year: 2022, series: 'destruction', medium: 'canvas, collage, acrylic, oil, spray', dimensions: '130x115 cm', status: 'available', image: '/artworks/children-of-nature.jpg', order: 35 },
  { slug: 'collage-2022', title: 'Collage', year: 2022, series: 'destruction', medium: 'canvas/oil', dimensions: '160x120 cm', status: 'available', image: '/artworks/collage-2022.jpg', order: 36 },
  // ===== MURALS =====
  { slug: 'mural-cordoba-1', title: 'Mural (Cordoba)', year: 2023, series: 'murals', medium: 'mural, acrylic/spray', dimensions: 'large scale', status: 'exists', image: '/artworks/mural-1.jpg', order: 37 },
  { slug: 'mural-cordoba-2', title: 'Mural 2 (Cordoba)', year: 2024, series: 'murals', medium: 'mural, acrylic/spray', dimensions: 'large scale', status: 'exists', image: '/artworks/mural-2.jpg', order: 38 },
  { slug: 'mural-cordoba-3', title: 'Mural 3 (Cordoba)', year: 2024, series: 'murals', medium: 'mural, acrylic/spray', dimensions: 'large scale', status: 'exists', image: '/artworks/mural-3.jpg', order: 39 },
  { slug: 'mural-cordoba-4', title: 'Mural 4 (Cordoba)', year: 2024, series: 'murals', medium: 'mural, acrylic/spray', dimensions: 'large scale', status: 'exists', image: '/artworks/mural-4.jpg', order: 40 },
  { slug: 'mural-khmelnytskyi-5', title: 'Mural 5 (Khmelnytskyi)', year: 2022, series: 'murals', medium: 'mural, acrylic/spray', dimensions: 'large scale', status: 'exists', image: '/artworks/mural-5.jpg', order: 41 },
  { slug: 'mural-khmelnytskyi-6', title: 'Mural 6 (Khmelnytskyi)', year: 2020, series: 'murals', medium: 'mural, acrylic/spray', dimensions: 'large scale', status: 'exists', image: '/artworks/mural-6.jpg', order: 42 },
  { slug: 'mural-bacota-7', title: 'Mural 7 (Bacota)', year: 2019, series: 'murals', medium: 'mural, acrylic/spray', dimensions: 'large scale', status: 'exists', image: '/artworks/mural-7.jpg', order: 43 },
  { slug: 'mural-odesa-8', title: 'Mural 8 (Odesa)', year: 2019, series: 'murals', medium: 'mural, acrylic/spray', dimensions: 'large scale', status: 'exists', image: '/artworks/mural-8.jpg', order: 44 },
  { slug: 'mural-odesa-9', title: 'Mural 9 (Odesa)', year: 2019, series: 'murals', medium: 'mural, acrylic/spray', dimensions: 'large scale', status: 'exists', image: '/artworks/mural-9.jpg', order: 45 },
  // ===== GRAPHICS =====
  { slug: 'sin-titulo-2', title: 'Sin titulo 2', year: 2025, series: 'graphics', medium: 'mixed media, acrylic on canvas', dimensions: '50x40 cm', status: 'available', image: '/artworks/graficos2.jpg', order: 46 },
  { slug: 'sin-titulo-3', title: 'Sin titulo 3', year: 2025, series: 'graphics', medium: 'mixed media, acrylic on canvas', dimensions: '50x40 cm', status: 'available', image: '/artworks/graficos3.jpg', order: 47 },
  { slug: 'sin-titulo-4', title: 'Sin titulo 4', year: 2025, series: 'graphics', medium: 'mixed media, acrylic on canvas', dimensions: '50x40 cm', status: 'available', image: '/artworks/graficos4.jpg', order: 48 },
  // ===== EARLIER WORKS =====
  { slug: 'adaptacion', title: 'Adaptacion', year: 2025, series: 'earlier', medium: 'oil, oil stick, acrylic, esparto blinds', dimensions: '200x180 cm', status: 'available', image: '/artworks/adaptacion.jpg', order: 49 },
  { slug: 'retrato', title: 'Retrato', year: 2025, series: 'earlier', medium: 'oil on canvas', dimensions: '50x40 cm', status: 'available', image: '/artworks/retrato.jpg', order: 50 },
  { slug: 'choque-cultural-diptych-left', title: 'Choque cultural (diptych, left)', year: 2025, series: 'earlier', medium: 'canvas, oil, oil stick', dimensions: '200x160 cm', status: 'available', image: '/artworks/choque-cultural-1.jpg', order: 51 },
  { slug: 'choque-cultural-diptych-right', title: 'Choque cultural (diptych, right)', year: 2025, series: 'earlier', medium: 'canvas, oil, oil stick', dimensions: '200x150 cm', status: 'available', image: '/artworks/choque-cultural-2.jpg', order: 52 },
  { slug: 'protegido-temporalmente', title: 'Protegido Temporalmente', year: 2025, series: 'earlier', medium: 'canvas, oil, oil stick', dimensions: '110x80 cm', status: 'available', image: '/artworks/protegido-temporalmente.jpg', order: 53 },
  { slug: 'la-luna-de-miel-diptych-left', title: 'La luna de miel (diptych, left)', year: 2025, series: 'earlier', medium: 'acrylic on canvas', dimensions: '200x160 cm', status: 'available', image: '/artworks/la-luna-de-miel-1.jpg', order: 54 },
  { slug: 'la-luna-de-miel-diptych-right', title: 'La luna de miel (diptych, right)', year: 2025, series: 'earlier', medium: 'acrylic on canvas', dimensions: '200x105 cm', status: 'available', image: '/artworks/la-luna-de-miel-2.jpg', order: 55 },
  { slug: 'otro-paisaje', title: 'Otro paisaje', year: 2025, series: 'earlier', medium: 'canvas, oil, acrylic, oil stick', dimensions: '200x200 cm', status: 'available', image: '/artworks/otro-paisaje.jpg', order: 56 },
  { slug: 'sol', title: 'Sol', year: 2025, series: 'earlier', medium: 'oil on canvas', dimensions: '170x150 cm', status: 'available', image: '/artworks/sol.jpg', order: 57 },
  { slug: 'entrado-a-la-ciudad', title: 'Entrado a la ciudad', year: 2024, series: 'earlier', medium: 'oil on canvas', dimensions: '160x150 cm', status: 'available', image: '/artworks/entrado-a-la-ciudad.jpg', order: 58 },
  { slug: 'pequenas-partes-de-la-ciudad', title: 'Pequenas partes de la ciudad', year: 2024, series: 'earlier', medium: 'canvas, oil, acrylic, oil stick', dimensions: '54x138 cm', status: 'available', image: '/artworks/pequenas-partes-de-la-ciudad.jpg', order: 59 },
  { slug: 'camarera', title: 'Camarera', year: 2025, series: 'earlier', medium: 'canvas, oil, acrylic', dimensions: '120x95 cm', status: 'available', image: '/artworks/camarera.jpg', order: 60 },
  { slug: 'estrellas-diptych-left', title: 'Estrellas (diptych, left)', year: 2025, series: 'earlier', medium: 'canvas, oil, acrylic', dimensions: '80x70 cm', status: 'available', image: '/artworks/estrellas-1.jpg', order: 61 },
  { slug: 'estrellas-diptych-right', title: 'Estrellas (diptych, right)', year: 2025, series: 'earlier', medium: 'canvas, oil, acrylic', dimensions: '80x70 cm', status: 'available', image: '/artworks/estrellas-2.jpg', order: 62 },
  { slug: 'torre-del-mar', title: 'Torre del mar', year: 2024, series: 'earlier', medium: 'oil on canvas', dimensions: '150x120 cm', status: 'available', image: '/artworks/torre-del-mar.jpg', order: 63 },
  { slug: 'sinnerman', title: 'Sinnerman', year: 2024, series: 'earlier', medium: 'oil on canvas', dimensions: '114x73 cm', status: 'available', image: '/artworks/sinnerman.jpg', order: 64 },
  { slug: 'dasein', title: 'Dasein', year: 2021, series: 'earlier', medium: 'canvas, acrylic/spray', dimensions: '150x120 cm', status: 'available', image: '/artworks/dasein.jpg', order: 65 },
  { slug: 'sculpture-2', title: 'Sculpture 2', year: 2021, series: 'earlier', medium: 'gypsum, marble', dimensions: '30x30 cm', status: 'available', image: '/artworks/sculpture-2.jpg', order: 66 },
  { slug: 'architecture-1', title: 'Architecture 1', year: 2020, series: 'earlier', medium: 'canvas, collage, acrylic, oil', dimensions: '120x90 cm', status: 'available', image: '/artworks/architecture-1.jpg', order: 67 },
  { slug: 'architecture-2', title: 'Architecture 2', year: 2020, series: 'earlier', medium: 'canvas, collage, acrylic, oil', dimensions: '120x90 cm', status: 'available', image: '/artworks/architecture-2.jpg', order: 68 },
  { slug: 'czech-magazine', title: 'Czech magazine', year: 2021, series: 'earlier', medium: 'canvas, collage, acrylic, oil', dimensions: '130x100 cm', status: 'available', image: '/artworks/czech-magazine.jpg', order: 69 },
  { slug: 'nose', title: 'Nose', year: 2022, series: 'earlier', medium: 'air hardening modeling clay, acrylic, spray', dimensions: '16x10 cm', status: 'available', image: '/artworks/nose.jpg', order: 70 },
  { slug: 'red', title: 'Red', year: 2022, series: 'earlier', medium: 'air hardening modeling clay, acrylic, spray', dimensions: '18x14 cm', status: 'available', image: '/artworks/red.jpg', order: 71 },
  { slug: 'untitled-1', title: 'Untitled 1', year: 2020, series: 'earlier', medium: 'canvas, acrylic, spray', dimensions: '110x75 cm', status: 'available', image: '/artworks/untitled-1.jpg', order: 72 },
  { slug: 'untitled-2', title: 'Untitled 2', year: 2020, series: 'earlier', medium: 'canvas, acrylic, spray', dimensions: '110x75 cm', status: 'available', image: '/artworks/untitled-2.jpg', order: 73 },
  { slug: 'zebra', title: 'Zebra', year: 2020, series: 'earlier', medium: 'canvas, acrylic, spray', dimensions: '138x112 cm', status: 'available', image: '/artworks/zebra.jpg', order: 74 },
  { slug: 'bird', title: 'Bird', year: 2020, series: 'earlier', medium: 'canvas, acrylic, oil, spray', dimensions: '120x100 cm', status: 'available', image: '/artworks/bird.jpg', order: 75 },
  { slug: 'bakota-carpet', title: 'Bakota, carpet', year: 2020, series: 'earlier', medium: 'canvas, acrylic, spray', dimensions: '120x100 cm', status: 'available', image: '/artworks/bakota-carpet.jpg', order: 76 },
  { slug: 'bakota-carpet-2', title: 'Bakota, carpet 2', year: 2020, series: 'earlier', medium: 'canvas, collage, acrylic, spray', dimensions: '120x100 cm', status: 'available', image: '/artworks/bakota-carpet-2.jpg', order: 77 },
  { slug: 'bakota-cypress', title: 'Bakota, cypress', year: 2020, series: 'earlier', medium: 'canvas, collage, acrylic, spray', dimensions: '120x100 cm', status: 'available', image: '/artworks/bakota-cypress.jpg', order: 78 },
  { slug: 'bakota-3', title: 'Bakota 3', year: 2020, series: 'earlier', medium: 'canvas, collage, acrylic, spray', dimensions: '120x100 cm', status: 'available', image: '/artworks/bakota-3.jpg', order: 79 },
  { slug: 'dollar-corona', title: 'Dollar, corona', year: 2020, series: 'earlier', medium: 'canvas, acrylic, oil, spray', dimensions: '200x225 cm', status: 'available', image: '/artworks/dollar-corona.jpg', order: 80 },
];

function mapStatus(status: string): ArtworkStatus {
  switch (status) {
    case 'available': return ArtworkStatus.available;
    case 'sold': return ArtworkStatus.sold;
    case 'on-exhibition': return ArtworkStatus.on_exhibition;
    case 'exists': return ArtworkStatus.exists;
    default: return ArtworkStatus.available;
  }
}

function mapSeries(series: string): ArtworkSeries {
  switch (series) {
    case 'podilia': return ArtworkSeries.podilia;
    case 'destruction': return ArtworkSeries.destruction;
    case 'murals': return ArtworkSeries.murals;
    case 'graphics': return ArtworkSeries.graphics;
    case 'earlier': return ArtworkSeries.earlier;
    default: return ArtworkSeries.earlier;
  }
}

async function main() {
  console.log('Seeding artworks...');

  for (const artwork of artworksData) {
    await prisma.artwork.upsert({
      where: { slug: artwork.slug },
      update: {
        title: artwork.title,
        year: artwork.year,
        series: mapSeries(artwork.series),
        medium: artwork.medium,
        dimensions: artwork.dimensions,
        status: mapStatus(artwork.status),
        imagePath: artwork.image,
        collaborator: artwork.collaborator ?? null,
        limitedEditionTotal: artwork.limitedEdition?.total ?? null,
        limitedEditionAvailable: artwork.limitedEdition?.available ?? null,
        featured: artwork.featured ?? false,
        sortOrder: artwork.order,
      },
      create: {
        slug: artwork.slug,
        title: artwork.title,
        year: artwork.year,
        series: mapSeries(artwork.series),
        medium: artwork.medium,
        dimensions: artwork.dimensions,
        status: mapStatus(artwork.status),
        imagePath: artwork.image,
        collaborator: artwork.collaborator ?? null,
        limitedEditionTotal: artwork.limitedEdition?.total ?? null,
        limitedEditionAvailable: artwork.limitedEdition?.available ?? null,
        featured: artwork.featured ?? false,
        sortOrder: artwork.order,
      },
    });
  }

  console.log(`Seeded ${artworksData.length} artworks.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
