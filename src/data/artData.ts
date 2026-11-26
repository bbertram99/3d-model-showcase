export interface ArtSwatch {
  name: string;
  hex: string;
  parts?: number;
}

export interface ArtProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  dimensionsMm: string;
  plateCount: number;
  colorPlateCount: number;
  tileCountLabel: string;
  toleranceMm: number;
  printer: string;
  mountStyle: string;
  buildStyle: string;
  palette: ArtSwatch[];
  images: {
    card: string;
    render: string;
    input: string;
    exploded: string;
    plates: string;
    topology: string;
    relief: string;
    construction?: string;
    printed?: string[];
  };
}

export const artProjects: ArtProject[] = [
  {
    id: 'art-kq5',
    slug: 'art-kq5',
    title: "King's Quest V - Daventry Horizon",
    subtitle: 'Stained-Glass Intarsia Wall Art',
    category: 'Retro Adventure Tribute',
    description:
      "King Graham overlooking the icy spire of Mordack's castle, engineered as a front-facing stained-glass puzzle relief with recessed numbered pockets, precision 0.12 mm tile clearances, and an integrated keyhole wall mount.",
    dimensionsMm: '250.0 × 139.5 × 9.9 mm',
    plateCount: 14,
    colorPlateCount: 13,
    tileCountLabel: '150+ interlocking tiles',
    toleranceMm: 0.12,
    printer: 'Snapmaker U1 (270×270 mm)',
    mountStyle: 'Keyhole Mount',
    buildStyle: 'Opaque Relief',
    palette: [
      { name: 'Black Frame', hex: '#1A1A1A' },
      { name: 'Steel Blue', hex: '#5A6C84' },
      { name: 'Lavender', hex: '#BAA5D6' },
      { name: 'White', hex: '#EAF2F6' },
      { name: 'Periwinkle', hex: '#7D83C7' },
      { name: 'Crimson', hex: '#951F24' },
      { name: 'Beige', hex: '#F9DCB6' },
      { name: 'Maroon', hex: '#5C1523' },
      { name: 'Tan', hex: '#B18358' },
      { name: 'Brown', hex: '#794D2D' },
      { name: 'Blue', hex: '#2E51A1' },
      { name: 'Dark Brown', hex: '#54392C' },
      { name: 'Ivory', hex: '#DCBFBE' },
    ],
    images: {
      card: 'media/art-kq5/card.webp',
      render: 'media/art-kq5/render.webp',
      input: 'media/art-kq5/input.webp',
      exploded: 'media/art-kq5/exploded.webp',
      plates: 'media/art-kq5/plates.webp',
      topology: 'media/art-kq5/topology.webp',
      relief: 'media/art-kq5/relief.webp',
      printed: ['media/art-kq5/printed-1.webp'],
    },
  },
  {
    id: 'art-roll-initiative',
    slug: 'art-roll-initiative',
    title: 'Roll For Initiative!',
    subtitle: 'D20 & Weapons Crest Relief',
    category: 'Tabletop RPG Crest',
    description:
      'A richly layered stained-glass crest featuring a raised D20 centerpiece, crossed mace and battleaxe, filigree flourishes, and Dungeons & Dragons emblem - split across 10 multi-plate slicer beds with engraved assembly indices.',
    dimensionsMm: '170.5 × 239.7 × 9.9 mm',
    plateCount: 10,
    colorPlateCount: 9,
    tileCountLabel: '418 color parts',
    toleranceMm: 0.12,
    printer: 'Snapmaker U1 (270×270 mm)',
    mountStyle: 'Keyhole Mount',
    buildStyle: 'Opaque Relief',
    palette: [
      { name: 'Black Frame', hex: '#1A1A1A' },
      { name: 'Dark Brown', hex: '#775C50' },
      { name: 'Copper', hex: '#B17A4A' },
      { name: 'Grey', hex: '#9B9EA0' },
      { name: 'Light Grey', hex: '#E2DEDB' },
      { name: 'Red', hex: '#C4281F' },
      { name: 'Terracotta', hex: '#691108' },
      { name: 'Maroon', hex: '#8B3040' },
      { name: 'Crimson', hex: '#A62321' },
    ],
    images: {
      card: 'media/art-roll-initiative/card.webp',
      render: 'media/art-roll-initiative/render.webp',
      input: 'media/art-roll-initiative/input.webp',
      exploded: 'media/art-roll-initiative/exploded.webp',
      plates: 'media/art-roll-initiative/plates.webp',
      topology: 'media/art-roll-initiative/topology.webp',
      relief: 'media/art-roll-initiative/relief.webp',
      construction: 'media/art-roll-initiative/construction.webp',
    },
  },
  {
    id: 'art-grade-4',
    slug: 'art-grade-4',
    title: 'Welcome to Grade 4!',
    subtitle: 'Classroom Door Stained-Glass Plaque',
    category: 'Custom Commission / Gift',
    description:
      'Playful stained-glass classroom welcome plaque with 118 verified puzzle tiles - books, globe, beaker, ruler, and bunting banner - color-matched to Snapmaker PLA spools and validated with zero frame interference.',
    dimensionsMm: '198.6 × 246.7 × 9.9 mm',
    plateCount: 12,
    colorPlateCount: 11,
    tileCountLabel: '118 verified tiles',
    toleranceMm: 0.12,
    printer: 'Snapmaker U1 (270×270 mm)',
    mountStyle: 'Keyhole Mount',
    buildStyle: 'Opaque Relief',
    palette: [
      { name: 'Black Frame', hex: '#1A1A1A' },
      { name: 'Indigo', hex: '#5B2E87' },
      { name: 'Yellow', hex: '#F0C826' },
      { name: 'Light Blue', hex: '#8ED0DC' },
      { name: 'Light Purple', hex: '#A08ACD' },
      { name: 'Green', hex: '#6FB460' },
      { name: 'Magenta', hex: '#B3338F' },
      { name: 'Sky Blue', hex: '#0078BF' },
      { name: 'Coral', hex: '#E27272' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Light Yellow', hex: '#D4B56B' },
    ],
    images: {
      card: 'media/art-grade-4/card.webp',
      render: 'media/art-grade-4/render.webp',
      input: 'media/art-grade-4/input.webp',
      exploded: 'media/art-grade-4/exploded.webp',
      plates: 'media/art-grade-4/plates.webp',
      topology: 'media/art-grade-4/topology.webp',
      relief: 'media/art-grade-4/relief.webp',
    },
  },
];
