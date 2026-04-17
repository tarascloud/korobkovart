import { describe, it, expect } from 'vitest';
import { mapArtwork } from '../artworks';

// Minimal PrismaArtwork-shaped object for testing (matches schema fields)
function makePrismaArtwork(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-id-001',
    slug: 'test-artwork',
    title: 'Test Artwork',
    year: 2022,
    series: 'podilia' as const,
    medium: 'oil on canvas',
    dimensions: '80x60 cm',
    status: 'available' as const,
    imagePath: '/artworks/test.jpg',
    descriptionEn: null,
    descriptionEs: null,
    descriptionUa: null,
    collaborator: null,
    limitedEditionTotal: null,
    limitedEditionAvailable: null,
    featured: false,
    sortOrder: 5,
    price: null,
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01'),
    ...overrides,
  };
}

describe('mapArtwork', () => {
  it('maps status on_exhibition → on-exhibition', () => {
    const artwork = mapArtwork(makePrismaArtwork({ status: 'on_exhibition' }) as any);
    expect(artwork.status).toBe('on-exhibition');
  });

  it('preserves "available" status as-is', () => {
    const artwork = mapArtwork(makePrismaArtwork({ status: 'available' }) as any);
    expect(artwork.status).toBe('available');
  });

  it('preserves "sold" status as-is', () => {
    const artwork = mapArtwork(makePrismaArtwork({ status: 'sold' }) as any);
    expect(artwork.status).toBe('sold');
  });

  it('maps imagePath → image', () => {
    const artwork = mapArtwork(makePrismaArtwork({ imagePath: '/artworks/painting.jpg' }) as any);
    expect(artwork.image).toBe('/artworks/painting.jpg');
    expect((artwork as any).imagePath).toBeUndefined();
  });

  it('maps sortOrder → order', () => {
    const artwork = mapArtwork(makePrismaArtwork({ sortOrder: 42 }) as any);
    expect(artwork.order).toBe(42);
    expect((artwork as any).sortOrder).toBeUndefined();
  });

  it('maps featured boolean correctly (true)', () => {
    const artwork = mapArtwork(makePrismaArtwork({ featured: true }) as any);
    expect(artwork.featured).toBe(true);
  });

  it('maps featured boolean correctly (false)', () => {
    const artwork = mapArtwork(makePrismaArtwork({ featured: false }) as any);
    expect(artwork.featured).toBe(false);
  });

  it('maps limitedEdition when total is set', () => {
    const artwork = mapArtwork(
      makePrismaArtwork({ limitedEditionTotal: 50, limitedEditionAvailable: 12 }) as any
    );
    expect(artwork.limitedEdition).toEqual({ total: 50, available: 12 });
  });

  it('maps limitedEdition to undefined when total is null', () => {
    const artwork = mapArtwork(
      makePrismaArtwork({ limitedEditionTotal: null, limitedEditionAvailable: null }) as any
    );
    expect(artwork.limitedEdition).toBeUndefined();
  });

  it('maps limitedEditionAvailable to 0 when null but total is set', () => {
    const artwork = mapArtwork(
      makePrismaArtwork({ limitedEditionTotal: 10, limitedEditionAvailable: null }) as any
    );
    expect(artwork.limitedEdition).toEqual({ total: 10, available: 0 });
  });

  it('sets collaborator to undefined when null', () => {
    const artwork = mapArtwork(makePrismaArtwork({ collaborator: null }) as any);
    expect(artwork.collaborator).toBeUndefined();
  });

  it('preserves collaborator when set', () => {
    const artwork = mapArtwork(makePrismaArtwork({ collaborator: 'Javier' }) as any);
    expect(artwork.collaborator).toBe('Javier');
  });

  it('maps description when at least one locale is set', () => {
    const artwork = mapArtwork(
      makePrismaArtwork({ descriptionEn: 'English desc', descriptionEs: null, descriptionUa: null }) as any
    );
    expect(artwork.description).toEqual({ en: 'English desc', es: '', ua: '' });
  });

  it('sets description to undefined when all locales are null', () => {
    const artwork = mapArtwork(
      makePrismaArtwork({ descriptionEn: null, descriptionEs: null, descriptionUa: null }) as any
    );
    expect(artwork.description).toBeUndefined();
  });

  it('maps core fields correctly', () => {
    const artwork = mapArtwork(
      makePrismaArtwork({ id: 'abc', slug: 'my-painting', title: 'My Painting', year: 2021 }) as any
    );
    expect(artwork.id).toBe('abc');
    expect(artwork.slug).toBe('my-painting');
    expect(artwork.title).toBe('My Painting');
    expect(artwork.year).toBe(2021);
  });
});
