import type { Exhibition } from '@/lib/types';

export const exhibitions: Exhibition[] = [
  // Joint exhibitions
  {
    id: 'bsmt-london-2022',
    title: 'Group Exhibition',
    venue: 'BSMT Art Gallery',
    city: 'London',
    country: 'United Kingdom',
    date: '2022',
    year: 2022,
    type: 'joint',
  },
  {
    id: 'krakow-charity-2022',
    title: 'Charity Auction',
    venue: 'Charity Auction',
    city: 'Krakow',
    country: 'Poland',
    date: '05.2022',
    year: 2022,
    type: 'joint',
  },
  {
    id: 'helicon-izmit-2021',
    title: 'Exhibition',
    venue: 'Helicon Art Center',
    city: 'Izmit',
    country: 'Turkey',
    date: '2021',
    year: 2021,
    type: 'joint',
  },
  {
    id: 'modern-art-kyiv-2019',
    title: 'Exhibition',
    venue: 'Ukraine Modern Art Research Institute',
    city: 'Kyiv',
    country: 'Ukraine',
    date: '2019',
    year: 2019,
    type: 'joint',
  },
  {
    id: 'expocenter-2018',
    title: 'Exhibition',
    venue: 'National Expocenter of Ukraine',
    city: 'Kyiv',
    country: 'Ukraine',
    date: '07.2018',
    year: 2018,
    type: 'joint',
  },
  {
    id: 'art-zavod-2018',
    title: 'AKT Exhibition',
    venue: 'Art-zavod Platforma',
    city: 'Kyiv',
    country: 'Ukraine',
    date: '06-10.2018',
    year: 2018,
    type: 'joint',
  },

  // Personal exhibitions
  {
    id: 'cordoba-2023',
    title: 'Personal Exhibition',
    venue: 'Gallery Circulo de la Amistad',
    city: 'Cordoba',
    country: 'Spain',
    date: '06.2023',
    year: 2023,
    type: 'personal',
  },
  {
    id: 'wroclaw-2022',
    title: 'Personal Exhibition',
    venue: 'Gallery OKiS',
    city: 'Wroclaw',
    country: 'Poland',
    date: '08.2022',
    year: 2022,
    type: 'personal',
  },
  {
    id: 'khmelnytskyi-2022',
    title: 'Personal Exhibition',
    venue: 'Khmelnytskyi Regional Art Museum',
    city: 'Khmelnytskyi',
    country: 'Ukraine',
    date: '2022',
    year: 2022,
    type: 'personal',
  },
  {
    id: 'nato-kyiv-2019',
    title: 'Exhibition',
    venue: 'NATO Liaison Office in Ukraine',
    city: 'Kyiv',
    country: 'Ukraine',
    date: '2019',
    year: 2019,
    type: 'personal',
  },
  {
    id: 'lviv-2013',
    title: 'Personal Exhibition',
    venue: 'Lviv Modern Art Museum',
    city: 'Lviv',
    country: 'Ukraine',
    date: '2013',
    year: 2013,
    type: 'personal',
  },
];

// Helper functions
export function getExhibitionsByType(type: Exhibition['type']): Exhibition[] {
  return exhibitions
    .filter((e) => e.type === type)
    .sort((a, b) => b.year - a.year);
}

export function getExhibitionsByYear(year: number): Exhibition[] {
  return exhibitions.filter((e) => e.year === year);
}
