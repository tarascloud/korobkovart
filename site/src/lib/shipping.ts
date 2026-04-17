/**
 * Shipping cost calculator for artwork.
 * Artists are based in Spain (Cordoba).
 *
 * Price calculation based on actual dimensions:
 * - Packed: height+10 x width+10 x 30cm (canvas depth with packaging)
 * - Volumetric weight = (L x W x H) / 5000 (industry standard)
 * - Actual weight estimate from area
 * - Billable weight = max(actual, volumetric)
 * - Price = base rate + per-kg rate * billable weight
 *
 * Carriers from Spain:
 * - Domestic: SEUR, MRW, Correos (small only)
 * - EU: SEUR/GLS, DHL Express, MRW
 * - UK: DHL Express, UPS
 * - US/Canada: DHL Express, UPS
 * - Other: DHL Express
 */

export type ShippingRegion = 'es' | 'eu' | 'uk' | 'us' | 'other';

export interface ShippingCarrier {
  id: string;
  name: string;
  estimatedDays: string;
  price: number;
  currency: string;
}

export interface ShippingQuote {
  region: ShippingRegion;
  regionName: string;
  packedDimensions: { height: number; width: number; depth: number };
  actualWeight: number;
  volumetricWeight: number;
  billableWeight: number;
  carriers: ShippingCarrier[];
}

// Parse "160x120 cm" → height=160, width=120
export function parseDimensions(dim: string): { height: number; width: number } {
  const match = dim.match(/(\d+)\s*x\s*(\d+)/i);
  if (!match) return { height: 100, width: 80 };
  return { height: parseInt(match[1]), width: parseInt(match[2]) };
}

const CANVAS_DEPTH = 30; // cm — standard canvas depth with packaging
const PACKING_MARGIN = 10; // cm each side for cardboard/foam

function getPackedDimensions(h: number, w: number) {
  return {
    height: h + PACKING_MARGIN,
    width: w + PACKING_MARGIN,
    depth: CANVAS_DEPTH,
  };
}

// Weight: canvas ~0.4kg/m² + stretcher bars + packaging
function estimateActualWeight(h: number, w: number): number {
  const areaM2 = (h * w) / 10000;
  const canvasKg = areaM2 * 0.4;
  // Stretcher bars: perimeter-based, ~0.15 kg per 10cm
  const perimeterCm = 2 * (h + w);
  const stretcherKg = (perimeterCm / 10) * 0.15;
  const packagingKg = 1.5 + areaM2 * 0.5; // cardboard, foam, tape
  return Math.round((canvasKg + stretcherKg + packagingKg) * 10) / 10;
}

// Volumetric weight: L * W * H / 5000 (DHL/UPS/SEUR standard)
function volumetricWeight(h: number, w: number, d: number): number {
  return Math.round((h * w * d) / 5000 * 10) / 10;
}

const euCountries = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE',
  'IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','SE',
  'NO','CH','IS','LI','AL','ME','MK','RS','BA','MD','GE','TR','UA',
]);

export function detectRegion(countryCode: string): ShippingRegion {
  const cc = countryCode.toUpperCase();
  if (cc === 'ES') return 'es';
  if (cc === 'GB') return 'uk';
  if (cc === 'US' || cc === 'CA') return 'us';
  if (euCountries.has(cc)) return 'eu';
  return 'other';
}

export function getRegionName(region: ShippingRegion, locale: string): string {
  const names: Record<ShippingRegion, Record<string, string>> = {
    es: { en: 'Spain (domestic)', es: 'España (nacional)', ua: 'Іспанія (внутрішня)' },
    eu: { en: 'Europe', es: 'Europa', ua: 'Європа' },
    uk: { en: 'United Kingdom', es: 'Reino Unido', ua: 'Великобританія' },
    us: { en: 'USA / Canada', es: 'EE.UU. / Canadá', ua: 'США / Канада' },
    other: { en: 'International', es: 'Internacional', ua: 'Міжнародна' },
  };
  return names[region][locale] || names[region].en;
}

// Carrier rate configs: base (EUR) + per-kg (EUR), max longest side (cm)
interface CarrierRate {
  id: string;
  name: string;
  estimatedDays: string;
  base: number;      // base price EUR
  perKg: number;     // price per billable kg
  maxSide: number;   // max longest side in cm
  oversizeExtra: number; // extra charge if longest side > 120cm
}

const carrierRates: Record<ShippingRegion, CarrierRate[]> = {
  es: [
    { id: 'seur', name: 'SEUR', estimatedDays: '1-2', base: 6, perKg: 0.80, maxSide: 250, oversizeExtra: 8 },
    { id: 'mrw', name: 'MRW', estimatedDays: '1-2', base: 5, perKg: 0.70, maxSide: 250, oversizeExtra: 7 },
    { id: 'correos', name: 'Correos Paq Premium', estimatedDays: '2-3', base: 4, perKg: 0.60, maxSide: 150, oversizeExtra: 0 },
  ],
  eu: [
    { id: 'seur', name: 'SEUR / GLS Europe', estimatedDays: '3-5', base: 12, perKg: 2.20, maxSide: 200, oversizeExtra: 15 },
    { id: 'mrw', name: 'MRW Internacional', estimatedDays: '4-7', base: 14, perKg: 2.00, maxSide: 250, oversizeExtra: 12 },
    { id: 'dhl', name: 'DHL Express', estimatedDays: '2-3', base: 25, perKg: 3.50, maxSide: 300, oversizeExtra: 20 },
  ],
  uk: [
    { id: 'dhl', name: 'DHL Express', estimatedDays: '2-4', base: 28, perKg: 3.80, maxSide: 300, oversizeExtra: 20 },
    { id: 'ups', name: 'UPS', estimatedDays: '3-5', base: 30, perKg: 4.00, maxSide: 274, oversizeExtra: 22 },
  ],
  us: [
    { id: 'dhl', name: 'DHL Express', estimatedDays: '4-7', base: 40, perKg: 5.50, maxSide: 300, oversizeExtra: 30 },
    { id: 'ups', name: 'UPS Worldwide', estimatedDays: '5-8', base: 45, perKg: 6.00, maxSide: 274, oversizeExtra: 35 },
  ],
  other: [
    { id: 'dhl', name: 'DHL Express', estimatedDays: '5-10', base: 50, perKg: 7.00, maxSide: 300, oversizeExtra: 40 },
  ],
};

function calculateCarrierPrice(rate: CarrierRate, packed: { height: number; width: number; depth: number }, billableKg: number): ShippingCarrier | null {
  const longestSide = Math.max(packed.height, packed.width, packed.depth);

  // Skip carrier if package exceeds max dimensions
  if (longestSide > rate.maxSide) return null;

  let price = rate.base + rate.perKg * billableKg;

  // Oversize surcharge for paintings > 120cm longest side
  if (longestSide > 120) {
    price += rate.oversizeExtra;
  }
  // Extra surcharge for very large > 180cm
  if (longestSide > 180) {
    price += rate.oversizeExtra * 0.5;
  }

  return {
    id: rate.id,
    name: rate.name,
    estimatedDays: rate.estimatedDays,
    price: Math.round(price),
    currency: 'EUR',
  };
}

export function calculateShipping(
  dimensions: string,
  countryCode: string,
  locale: string = 'en',
): ShippingQuote {
  const { height, width } = parseDimensions(dimensions);
  const packed = getPackedDimensions(height, width);
  const actualWt = estimateActualWeight(height, width);
  const volWt = volumetricWeight(packed.height, packed.width, packed.depth);
  const billableWt = Math.max(actualWt, volWt);
  const region = detectRegion(countryCode);
  const regionName = getRegionName(region, locale);

  const rates = carrierRates[region] || [];
  const carriers: ShippingCarrier[] = [];
  for (const rate of rates) {
    const carrier = calculateCarrierPrice(rate, packed, billableWt);
    if (carrier) carriers.push(carrier);
  }

  // Sort by price ascending
  carriers.sort((a, b) => a.price - b.price);

  return {
    region,
    regionName,
    packedDimensions: packed,
    actualWeight: actualWt,
    volumetricWeight: volWt,
    billableWeight: billableWt,
    carriers,
  };
}

export const countries = [
  { code: 'ES', name: { en: 'Spain', es: 'España', ua: 'Іспанія' } },
  { code: 'DE', name: { en: 'Germany', es: 'Alemania', ua: 'Німеччина' } },
  { code: 'FR', name: { en: 'France', es: 'Francia', ua: 'Франція' } },
  { code: 'IT', name: { en: 'Italy', es: 'Italia', ua: 'Італія' } },
  { code: 'PT', name: { en: 'Portugal', es: 'Portugal', ua: 'Португалія' } },
  { code: 'PL', name: { en: 'Poland', es: 'Polonia', ua: 'Польща' } },
  { code: 'GB', name: { en: 'United Kingdom', es: 'Reino Unido', ua: 'Великобританія' } },
  { code: 'NL', name: { en: 'Netherlands', es: 'Países Bajos', ua: 'Нідерланди' } },
  { code: 'BE', name: { en: 'Belgium', es: 'Bélgica', ua: 'Бельгія' } },
  { code: 'AT', name: { en: 'Austria', es: 'Austria', ua: 'Австрія' } },
  { code: 'CH', name: { en: 'Switzerland', es: 'Suiza', ua: 'Швейцарія' } },
  { code: 'CZ', name: { en: 'Czech Republic', es: 'República Checa', ua: 'Чехія' } },
  { code: 'SE', name: { en: 'Sweden', es: 'Suecia', ua: 'Швеція' } },
  { code: 'NO', name: { en: 'Norway', es: 'Noruega', ua: 'Норвегія' } },
  { code: 'DK', name: { en: 'Denmark', es: 'Dinamarca', ua: 'Данія' } },
  { code: 'FI', name: { en: 'Finland', es: 'Finlandia', ua: 'Фінляндія' } },
  { code: 'GR', name: { en: 'Greece', es: 'Grecia', ua: 'Греція' } },
  { code: 'RO', name: { en: 'Romania', es: 'Rumanía', ua: 'Румунія' } },
  { code: 'HU', name: { en: 'Hungary', es: 'Hungría', ua: 'Угорщина' } },
  { code: 'IE', name: { en: 'Ireland', es: 'Irlanda', ua: 'Ірландія' } },
  { code: 'HR', name: { en: 'Croatia', es: 'Croacia', ua: 'Хорватія' } },
  { code: 'BG', name: { en: 'Bulgaria', es: 'Bulgaria', ua: 'Болгарія' } },
  { code: 'SK', name: { en: 'Slovakia', es: 'Eslovaquia', ua: 'Словаччина' } },
  { code: 'SI', name: { en: 'Slovenia', es: 'Eslovenia', ua: 'Словенія' } },
  { code: 'LT', name: { en: 'Lithuania', es: 'Lituania', ua: 'Литва' } },
  { code: 'LV', name: { en: 'Latvia', es: 'Letonia', ua: 'Латвія' } },
  { code: 'EE', name: { en: 'Estonia', es: 'Estonia', ua: 'Естонія' } },
  { code: 'TR', name: { en: 'Turkey', es: 'Turquía', ua: 'Туреччина' } },
  { code: 'UA', name: { en: 'Ukraine', es: 'Ucrania', ua: 'Україна' } },
  { code: 'US', name: { en: 'United States', es: 'Estados Unidos', ua: 'США' } },
  { code: 'CA', name: { en: 'Canada', es: 'Canadá', ua: 'Канада' } },
  { code: 'MX', name: { en: 'Mexico', es: 'México', ua: 'Мексика' } },
  { code: 'AR', name: { en: 'Argentina', es: 'Argentina', ua: 'Аргентина' } },
  { code: 'BR', name: { en: 'Brazil', es: 'Brasil', ua: 'Бразилія' } },
  { code: 'AU', name: { en: 'Australia', es: 'Australia', ua: 'Австралія' } },
  { code: 'JP', name: { en: 'Japan', es: 'Japón', ua: 'Японія' } },
  { code: 'KR', name: { en: 'South Korea', es: 'Corea del Sur', ua: 'Південна Корея' } },
  { code: 'CN', name: { en: 'China', es: 'China', ua: 'Китай' } },
  { code: 'AE', name: { en: 'UAE', es: 'EAU', ua: 'ОАЕ' } },
  { code: 'IL', name: { en: 'Israel', es: 'Israel', ua: 'Ізраїль' } },
] as const;
