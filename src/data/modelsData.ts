import rawStats from './generatedModelStats.json';

export interface ModelStat {
  sourceFile: string;
  originalTriangles: number;
  originalVertices: number;
  dimensionsMm: number[];
  webTriangles?: number;
  glbSizeMb?: number;
}

const modelStats = rawStats as Record<string, ModelStat>;

export type ModelStatus = 'printed' | 'printing' | 'virtual';

export interface CollectiblesModel {
  id: string;
  slug: string;
  title: string;
  character: string;
  franchise: string;
  year: string;
  status: ModelStatus;
  statusLabel: string;
  tagline: string;
  description: string;
  printer: string;
  filament: string;
  glbPath: string;
  stats: ModelStat;
  images: {
    card: string;
    concept?: string;
    painted: string;
    virtual: string;
    triptych?: string;
    printed: string[];
  };
  tags: string[];
}

export const modelsCatalog: CollectiblesModel[] = [
  {
    id: 'king-graham',
    slug: 'king-graham',
    title: 'King Graham of Daventry',
    character: 'King Graham',
    franchise: "King's Quest",
    year: '1990 · Sierra On-Line',
    status: 'printed',
    statusLabel: 'Printed',
    tagline: 'Hero of Daventry atop the snowy crags of Serenia',
    description:
      "Inspired by the iconic King's Quest V key art, King Graham stands poised on a sculpted rocky outcrop in his plumed adventurer's cap, red tunic, and flowing cloak. Captured across full 2D painterly concept, virtual clay sculpt, interactive 3D mesh, and finished charcoal PLA print.",
    printer: 'Snapmaker U1',
    filament: 'Matte Charcoal PLA',
    glbPath: 'models/king-graham.glb',
    stats: modelStats['king-graham'],
    images: {
      card: 'media/king-graham/card.webp',
      concept: 'media/king-graham/concept.webp',
      painted: 'media/king-graham/painted.webp',
      virtual: 'media/king-graham/virtual.webp',
      triptych: 'media/king-graham/triptych.webp',
      printed: [
        'media/king-graham/printed-1.webp',
        'media/king-graham/printed-2.webp',
        'media/king-graham/printed-3.webp',
        'media/king-graham/printed-4.webp',
        'media/king-graham/printed-5.webp',
        'media/king-graham/printed-6.webp',
      ],
    },
    tags: ['Hero', 'Sierra', 'Fantasy', 'Printed'],
  },
  {
    id: 'gorath',
    slug: 'gorath',
    title: 'Gorath of Krondor',
    character: 'Gorath the Moredhel',
    franchise: 'Betrayal at Krondor',
    year: '1993 · Dynamix / Sierra',
    status: 'printed',
    statusLabel: 'Printed',
    tagline: 'Renegade Moredhel warrior perched on shattered battlements',
    description:
      'Gorath stands watch atop a ruined stone parapet, clad in ornate embossed plate armor, chainmail skirt, and tattered crimson cloak with drawn longsword. Engineered with crisp masonry brickwork and armor filigree that resolves cleanly on the Snapmaker U1.',
    printer: 'Snapmaker U1',
    filament: 'Matte Charcoal PLA',
    glbPath: 'models/gorath.glb',
    stats: modelStats['gorath'],
    images: {
      card: 'media/gorath/card.webp',
      concept: 'media/gorath/concept.webp',
      painted: 'media/gorath/painted.webp',
      virtual: 'media/gorath/virtual.webp',
      triptych: 'media/gorath/triptych.webp',
      printed: [
        'media/gorath/printed-1.webp',
        'media/gorath/printed-2.webp',
        'media/gorath/printed-3.webp',
        'media/gorath/printed-4.webp',
        'media/gorath/printed-5.webp',
        'media/gorath/printed-6.webp',
      ],
    },
    tags: ['RPG', 'Sierra', 'Armor', 'Printed'],
  },
  {
    id: 'roger-wilco',
    slug: 'roger-wilco',
    title: 'Roger Wilco — Space Janitor',
    character: 'Roger Wilco',
    franchise: 'Space Quest',
    year: '1986 · Sierra On-Line',
    status: 'printed',
    statusLabel: 'Printed',
    tagline: 'Armed with a tactical plunger and high-tech mop bucket',
    description:
      'The galaxy’s most accidental hero steps onto a weathered sci-fi deck plate, brandishing his trusty plunger and industrial mop rig. Every rivet, cable conduit, and uniform emblem is preserved from digital sculpt to physical print.',
    printer: 'Snapmaker U1',
    filament: 'Matte Charcoal PLA',
    glbPath: 'models/roger-wilco.glb',
    stats: modelStats['roger-wilco'],
    images: {
      card: 'media/roger-wilco/card.webp',
      concept: 'media/roger-wilco/concept.webp',
      painted: 'media/roger-wilco/painted.webp',
      virtual: 'media/roger-wilco/virtual.webp',
      triptych: 'media/roger-wilco/triptych.webp',
      printed: [
        'media/roger-wilco/printed-1.webp',
        'media/roger-wilco/printed-2.webp',
        'media/roger-wilco/printed-3.webp',
        'media/roger-wilco/printed-4.webp',
      ],
    },
    tags: ['Sci-Fi', 'Sierra', 'Comedy', 'Printed'],
  },
  {
    id: 'sonny-bonds',
    slug: 'sonny-bonds',
    title: 'Officer Sonny Bonds',
    character: 'Sonny Bonds',
    franchise: 'Police Quest',
    year: '1987 · Sierra On-Line',
    status: 'printed',
    statusLabel: 'Printed',
    tagline: 'Lytton Police Department badge, traffic cone, and duty belt',
    description:
      'Lytton PD’s finest rendered in crisp tactical detail — complete with shoulder patches, duty revolver, radio, baton, and a sculpted pavement base featuring the Lytton Police Dept. shield and weathered traffic cone.',
    printer: 'Snapmaker U1',
    filament: 'Matte Charcoal PLA',
    glbPath: 'models/sonny-bonds.glb',
    stats: modelStats['sonny-bonds'],
    images: {
      card: 'media/sonny-bonds/card.webp',
      painted: 'media/sonny-bonds/painted.webp',
      virtual: 'media/sonny-bonds/virtual.webp',
      triptych: 'media/sonny-bonds/triptych.webp',
      printed: [
        'media/sonny-bonds/printed-1.webp',
        'media/sonny-bonds/printed-2.webp',
        'media/sonny-bonds/printed-3.webp',
        'media/sonny-bonds/printed-4.webp',
        'media/sonny-bonds/printed-5.webp',
        'media/sonny-bonds/printed-6.webp',
      ],
    },
    tags: ['Adventure', 'Sierra', 'Printed'],
  },
  {
    id: 'larry-laffer',
    slug: 'larry-laffer',
    title: 'Leisure Suit Larry',
    character: 'Larry Laffer',
    franchise: 'Leisure Suit Larry',
    year: '1987 · Sierra On-Line',
    status: 'printed',
    statusLabel: 'Printed',
    tagline: 'White polyester suit, gold medallion, rose, and casino floor base',
    description:
      'Larry Laffer strikes his signature suave pose on a Lost Wages casino carpet base strewn with poker chips, playing cards, and a tipped martini glass — sculpted with expressive stylized proportions and crisp lapel details.',
    printer: 'Snapmaker U1',
    filament: 'Matte Charcoal PLA',
    glbPath: 'models/larry-laffer.glb',
    stats: modelStats['larry-laffer'],
    images: {
      card: 'media/larry-laffer/card.webp',
      painted: 'media/larry-laffer/painted.webp',
      virtual: 'media/larry-laffer/virtual.webp',
      printed: [
        'media/larry-laffer/printed-1.webp',
        'media/larry-laffer/printed-2.webp',
        'media/larry-laffer/printed-3.webp',
      ],
    },
    tags: ['Comedy', 'Sierra', 'Stylized', 'Printed'],
  },
  {
    id: 'qfg-paladin',
    slug: 'qfg-paladin',
    title: 'The Paladin — Flaming Sword',
    character: 'Hero of Spielburg',
    franchise: 'Quest for Glory',
    year: '1989 · Sierra On-Line',
    status: 'printed',
    statusLabel: 'Printed',
    tagline: 'Raising the enchanted blue-flame blade on rocky ground',
    description:
      'Channeling the classic Quest for Glory II/IV hero pose, the Paladin hoists a roaring magic-flame sword high above a craggy plinth with billowing crimson cape folds that printed cleanly in single-piece charcoal PLA.',
    printer: 'Snapmaker U1',
    filament: 'Matte Charcoal PLA',
    glbPath: 'models/qfg-paladin.glb',
    stats: modelStats['qfg-paladin'],
    images: {
      card: 'media/qfg-paladin/card.webp',
      concept: 'media/qfg-paladin/concept.webp',
      painted: 'media/qfg-paladin/painted.webp',
      virtual: 'media/qfg-paladin/virtual.webp',
      triptych: 'media/qfg-paladin/triptych.webp',
      printed: [
        'media/qfg-paladin/printed-1.webp',
        'media/qfg-paladin/printed-2.webp',
        'media/qfg-paladin/printed-3.webp',
        'media/qfg-paladin/printed-4.webp',
      ],
    },
    tags: ['Quest for Glory', 'RPG', 'Sierra', 'Printed'],
  },
  {
    id: 'iceman',
    slug: 'iceman',
    title: 'Lt. Johnny Westland — Iceman',
    character: 'Johnny Westland',
    franchise: 'Codename: ICEMAN',
    year: '1989 · Sierra On-Line',
    status: 'printing',
    statusLabel: 'Printing Now',
    tagline: 'U.S. Navy submarine combat diver on deck-plate pedestal',
    description:
      'Inspired by the classic submarine thriller Codename: ICEMAN, Lt. Westland stands ready in twin-hose dive gear, speargun, and dive knife atop a riveted submarine deck plate. Sliced and currently on the Snapmaker U1 build plate.',
    printer: 'Snapmaker U1',
    filament: 'Matte Charcoal PLA (In Progress)',
    glbPath: 'models/iceman.glb',
    stats: modelStats['iceman'],
    images: {
      card: 'media/iceman/card.webp',
      concept: 'media/iceman/concept.webp',
      painted: 'media/iceman/painted.webp',
      virtual: 'media/iceman/virtual.webp',
      printed: [],
    },
    tags: ['Tactical', 'Sierra', 'In Progress'],
  },
  {
    id: 'qfg-fighter',
    slug: 'qfg-fighter',
    title: 'Quest for Glory — Fighter',
    character: 'The Fighter',
    franchise: 'Quest for Glory',
    year: '1989 · Hero Selection',
    status: 'virtual',
    statusLabel: '3D Ready',
    tagline: 'Broad-bladed stance on carved stone cobblestone plinth',
    description:
      'Part of the three-class Quest for Glory Hero Selection collection. Sculpted with leather jerkin, rolled tunic sleeves, broadsword, and recessed serif class plaque on the circular cobblestone base.',
    printer: 'Snapmaker U1',
    filament: 'Ready for Print (.3mf)',
    glbPath: 'models/qfg-fighter.glb',
    stats: modelStats['qfg-fighter'],
    images: {
      card: 'media/qfg-fighter/card.webp',
      painted: 'media/qfg-fighter/painted.webp',
      virtual: 'media/qfg-fighter/virtual.webp',
      printed: [],
    },
    tags: ['Quest for Glory', 'RPG', 'Class Trio'],
  },
  {
    id: 'qfg-magic-user',
    slug: 'qfg-magic-user',
    title: 'Quest for Glory — Magic User',
    character: 'The Magic User',
    franchise: 'Quest for Glory',
    year: '1989 · Hero Selection',
    status: 'virtual',
    statusLabel: '3D Ready',
    tagline: 'Channeling arcane gestures above the Magic User pedestal',
    description:
      'Completing the arcane pillar of the Quest for Glory character-creation screen, poised mid-incantation with expressive hand sculpting and matching cobblestone base.',
    printer: 'Snapmaker U1',
    filament: 'Ready for Print (.3mf)',
    glbPath: 'models/qfg-magic-user.glb',
    stats: modelStats['qfg-magic-user'],
    images: {
      card: 'media/qfg-magic-user/card.webp',
      painted: 'media/qfg-magic-user/painted.webp',
      virtual: 'media/qfg-magic-user/virtual.webp',
      printed: [],
    },
    tags: ['Quest for Glory', 'RPG', 'Class Trio'],
  },
  {
    id: 'qfg-thief',
    slug: 'qfg-thief',
    title: 'Quest for Glory — Thief',
    character: 'The Thief',
    franchise: 'Quest for Glory',
    year: '1989 · Hero Selection',
    status: 'virtual',
    statusLabel: '3D Ready',
    tagline: 'Crouched agile silhouette ready for Spielburg rooftops',
    description:
      'The agile Thief class from Quest for Glory I, sculpted in an alert crouched poise with open-collared tunic and weathered stone plinth matching Fighter and Magic User.',
    printer: 'Snapmaker U1',
    filament: 'Ready for Print (.3mf)',
    glbPath: 'models/qfg-thief.glb',
    stats: modelStats['qfg-thief'],
    images: {
      card: 'media/qfg-thief/card.webp',
      painted: 'media/qfg-thief/painted.webp',
      virtual: 'media/qfg-thief/virtual.webp',
      printed: [],
    },
    tags: ['Quest for Glory', 'RPG', 'Class Trio'],
  },
];

export const qfgDiorama = {
  title: "Quest for Glory — Hero's Choice Diorama",
  subtitle: 'Three Arches · Fighter · Magic User · Thief',
  description:
    'A full gothic-archway diorama concept uniting all three classic starting classes beneath moonlit stone ruins, complete with twin wall torches, twisted dead tree, and carved wooden stage plinth.',
  images: {
    concept: 'media/qfg-diorama/concept.webp',
    painted: 'media/qfg-diorama/painted.webp',
    virtual: 'media/qfg-diorama/virtual.webp',
    lineupPainted: 'media/qfg-diorama/lineup-painted.webp',
    lineupVirtual: 'media/qfg-diorama/lineup-virtual.webp',
  },
};
