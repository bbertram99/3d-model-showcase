export interface SocialLink {
  label: string;
  href: string;
}

export const siteConfig = {
  studioName: 'FORGED IN PIXELS',
  tagline: '3D Collectibles & Stained-Glass Wall Art',
  creatorName: 'Maker Studio Archive',
  heroEyebrow: 'CONCEPT  →  SCULPT  →  FABRICATION',
  heroTitle: 'From 2D Concept Art to Physical 3D Prints.',
  heroSubtitle:
    'Classic adventure heroes reimagined as high-detail printable collectibles alongside multi-plate stained-glass 3D wall art - inspect every stage from 2D concept and virtually painted 3D preview to interactive mesh and unpainted Snapmaker U1 prints (plus colored filament wall art).',
  printerName: 'Snapmaker U1',
  slicerStack: 'Snapmaker Orca / Multi-Plate',
  makerWorldUrl: 'https://makerworld.com/en/@bbertram',
  visitorCounterNamespace: 'bbertram99-3d-showcase',
  visitorCounterKey: 'visits',
  guestbookApiUrl:
    'https://script.google.com/macros/s/AKfycbzZykEVRUTmXVIXprZIMb_PnKvR9iwlPpoWzMjHdM3ylIK62EfyvbzmO2I_ud1HX9SaDQ/exec',
  socialLinks: [
    { label: 'MakerWorld (@bbertram)', href: 'https://makerworld.com/en/@bbertram' },
  ] as SocialLink[],
  footerNote:
    'All 3D turntable meshes are web-optimized directly from the original .3mf fabrication files.',
};
