import React from 'react';
import { Box, ExternalLink, Layers } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

interface NavbarProps {
  modelCount: number;
  artCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ modelCount, artCount }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0B0E13]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#2DD4BF]/40 bg-[#11161F] text-[#2DD4BF] shadow-[0_0_20px_rgba(45,212,191,0.12)] transition group-hover:border-[#2DD4BF]">
            <Box className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-[0.08em] text-[#F1F5F9]">
              {siteConfig.studioName}
            </span>
            <span className="text-[11px] text-[#94A3B8] hidden sm:block">
              {siteConfig.tagline}
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#94A3B8]">
          <a href="#models" className="transition hover:text-[#2DD4BF]">
            3D Collectibles
          </a>
          <a href="#art" className="transition hover:text-[#2DD4BF]">
            Stained-Glass Art
          </a>
          <a href="#pipeline" className="transition hover:text-[#2DD4BF]">
            The Pipeline
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-700/70 bg-[#11161F] px-3 py-1 text-xs font-mono-tech text-[#94A3B8]">
            <Layers className="h-3.5 w-3.5 text-[#2DD4BF]" />
            <span>
              {modelCount} Models · {artCount} Artworks
            </span>
          </div>
          <a
            href={siteConfig.makerWorldUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-3 py-1 text-xs font-medium text-[#F59E0B] transition hover:border-[#F59E0B] hover:bg-[#F59E0B]/20"
          >
            <span>MakerWorld</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
