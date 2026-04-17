import { describe, it, expect } from 'vitest';
import {
  parseDimensions,
  detectRegion,
  calculateShipping,
} from '../shipping';

describe('parseDimensions', () => {
  it('parses "160x120 cm" correctly', () => {
    expect(parseDimensions('160x120 cm')).toEqual({ height: 160, width: 120 });
  });

  it('parses "80x75" without unit', () => {
    expect(parseDimensions('80x75')).toEqual({ height: 80, width: 75 });
  });

  it('returns defaults for invalid input', () => {
    expect(parseDimensions('invalid')).toEqual({ height: 100, width: 80 });
  });

  it('parses with spaces around x', () => {
    expect(parseDimensions('100 x 80 cm')).toEqual({ height: 100, width: 80 });
  });
});

describe('detectRegion', () => {
  it('ES → es', () => {
    expect(detectRegion('ES')).toBe('es');
  });

  it('DE → eu', () => {
    expect(detectRegion('DE')).toBe('eu');
  });

  it('GB → uk', () => {
    expect(detectRegion('GB')).toBe('uk');
  });

  it('US → us', () => {
    expect(detectRegion('US')).toBe('us');
  });

  it('JP → other', () => {
    expect(detectRegion('JP')).toBe('other');
  });

  it('CA → us', () => {
    expect(detectRegion('CA')).toBe('us');
  });

  it('FR → eu', () => {
    expect(detectRegion('FR')).toBe('eu');
  });

  it('is case-insensitive', () => {
    expect(detectRegion('es')).toBe('es');
    expect(detectRegion('gb')).toBe('uk');
  });
});

describe('calculateShipping', () => {
  it('returns a quote with carriers, packed dimensions, and weights for ES', () => {
    const quote = calculateShipping('100x85 cm', 'ES', 'en');

    expect(quote.region).toBe('es');
    expect(quote.regionName).toBe('Spain (domestic)');
    expect(quote.packedDimensions).toEqual({ height: 110, width: 95, depth: 30 });
    expect(typeof quote.actualWeight).toBe('number');
    expect(typeof quote.volumetricWeight).toBe('number');
    expect(typeof quote.billableWeight).toBe('number');
    expect(quote.carriers.length).toBeGreaterThan(0);
    expect(quote.carriers[0]).toHaveProperty('id');
    expect(quote.carriers[0]).toHaveProperty('name');
    expect(quote.carriers[0]).toHaveProperty('price');
    expect(quote.carriers[0]).toHaveProperty('currency', 'EUR');
  });

  it('carriers are sorted by price ascending', () => {
    const quote = calculateShipping('80x70 cm', 'ES', 'en');
    for (let i = 1; i < quote.carriers.length; i++) {
      expect(quote.carriers[i].price).toBeGreaterThanOrEqual(quote.carriers[i - 1].price);
    }
  });

  it('carriers are sorted by price ascending for EU', () => {
    const quote = calculateShipping('90x80 cm', 'DE', 'en');
    for (let i = 1; i < quote.carriers.length; i++) {
      expect(quote.carriers[i].price).toBeGreaterThanOrEqual(quote.carriers[i - 1].price);
    }
  });

  it('oversized painting (200x160) has higher prices than small (80x70)', () => {
    const smallQuote = calculateShipping('80x70 cm', 'ES', 'en');
    const largeQuote = calculateShipping('200x160 cm', 'ES', 'en');

    const smallMin = Math.min(...smallQuote.carriers.map(c => c.price));
    const largeMin = Math.min(...largeQuote.carriers.map(c => c.price));

    expect(largeMin).toBeGreaterThan(smallMin);
  });

  it('oversized painting has higher prices than small for US destination', () => {
    const smallQuote = calculateShipping('80x70 cm', 'US', 'en');
    const largeQuote = calculateShipping('200x160 cm', 'US', 'en');

    const smallMin = Math.min(...smallQuote.carriers.map(c => c.price));
    const largeMin = Math.min(...largeQuote.carriers.map(c => c.price));

    expect(largeMin).toBeGreaterThan(smallMin);
  });

  it('billableWeight is max of actual and volumetric', () => {
    const quote = calculateShipping('100x80 cm', 'ES', 'en');
    expect(quote.billableWeight).toBe(
      Math.max(quote.actualWeight, quote.volumetricWeight)
    );
  });

  it('works for UK destination', () => {
    const quote = calculateShipping('90x70 cm', 'GB', 'en');
    expect(quote.region).toBe('uk');
    expect(quote.carriers.length).toBeGreaterThan(0);
  });
});
