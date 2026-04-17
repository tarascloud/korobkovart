export type ArtworkSeries = 'podilia' | 'destruction' | 'murals' | 'graphics' | 'earlier';
export type ArtworkStatus = 'available' | 'sold' | 'on-exhibition' | 'exists';
export type ArtworkMedium = string;

export interface Artwork {
  id?: string;
  slug: string;
  title: string;
  year: number;
  series: ArtworkSeries;
  medium: string;
  dimensions: string; // e.g. "160x120 cm"
  status: ArtworkStatus;
  image: string; // path in /public/artworks/
  description?: {
    en: string;
    es: string;
    ua: string;
  };
  collaborator?: string;
  limitedEdition?: {
    total: number;
    available: number;
  };
  featured?: boolean;
  order: number;
}

export interface Exhibition {
  id: string;
  title: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  year: number;
  type: 'joint' | 'personal';
  description?: {
    en: string;
    es: string;
    ua: string;
  };
}
