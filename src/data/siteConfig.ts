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
    'Classic adventure heroes reimagined as high-detail printable collectibles alongside multi-plate stained-glass 3D wall art — inspect every stage from original illustration and virtual clay sculpt to interactive 3D mesh and physical Snapmaker U1 prints.',
  printerName: 'Snapmaker U1',
  slicerStack: 'Snapmaker Orca / Multi-Plate',
  socialLinks: [
    // Add your links here when ready to publish:
    // { label: 'GitHub', href: 'https://github.com/your-username' },
    // { label: 'Printables', href: 'https://www.printables.com/@your-handle' },
  ] as SocialLink[],
  footerNote:
    'All 3D turntable meshes are web-optimized directly from the original .3mf fabrication files.',
};
