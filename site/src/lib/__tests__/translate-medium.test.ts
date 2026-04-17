import { describe, it, expect } from 'vitest';
import { translateMedium } from '../translate-medium';

// Mock t function: returns key in uppercase for easy assertion
const t = (key: string) => key.toUpperCase();

describe('translateMedium', () => {
  it('translates "mural" directly', () => {
    expect(translateMedium('mural', t)).toBe('MURAL');
  });

  it('translates "acrylic on canvas"', () => {
    expect(translateMedium('acrylic on canvas', t)).toBe('ACRYLIC ON canvas');
  });

  it('translates comma-separated parts like "canvas, acrylic/oil/spray"', () => {
    const result = translateMedium('canvas, acrylic/oil/spray', t);
    expect(result).toBe('CANVAS, ACRYLIC/OIL/SPRAY');
  });

  it('translates silkscreen format with layers and paper', () => {
    const result = translateMedium('silkscreen, 5 layers, astroprint paper, 280 g.', t);
    expect(result).toContain('SILKSCREEN');
    expect(result).toContain('LAYERS');
    expect(result).toContain('PAPER');
  });

  it('handles silkscreen without extra parts', () => {
    const result = translateMedium('silkscreen', t);
    expect(result).toBe('SILKSCREEN');
  });

  it('translates "mixed media" prefix', () => {
    const result = translateMedium('mixed media, acrylic, oil', t);
    expect(result).toContain('MIXED_MEDIA');
    expect(result).toContain('ACRYLIC');
    expect(result).toContain('OIL');
  });

  it('translates "two canvases" prefix', () => {
    const result = translateMedium('two canvases, oil, acrylic', t);
    expect(result).toContain('TWO_CANVASES');
  });

  it('handles unknown words by returning them as-is', () => {
    const result = translateMedium('someunknownmedium', t);
    expect(result).toBe('someunknownmedium');
  });

  it('translates "acrylic" part correctly', () => {
    const result = translateMedium('acrylic', t);
    expect(result).toBe('ACRYLIC');
  });

  it('handles "air hardening modeling clay" prefix', () => {
    const result = translateMedium('air hardening modeling clay, acrylic', t);
    expect(result).toContain('CLAY');
    expect(result).toContain('ACRYLIC');
  });
});
