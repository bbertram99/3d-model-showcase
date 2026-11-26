import React, { useState } from 'react';
import { ArrowDown, Box, ExternalLink, Printer, Sparkles, Maximize2 } from 'lucide-react';
import { CollectiblesModel } from '../data/modelsData';
import { siteConfig } from '../data/siteConfig';
import { assetUrl } from '../utils/assets';
import { ModelViewer3D } from './ModelViewer3D';

interface HeroSectionProps {
  featuredModels: CollectiblesModel[];
  isModalOpen: boolean;
  onInspectModel: (model: CollectiblesModel) => void;
}

type HeroViewMode = 'painted' | '3d' | 'printed';

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredModels,
  isModalOpen,
  onInspectModel,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [viewMode, setViewMode] = useState<HeroViewMode>('painted');

  const active = featuredModels[selectedIdx] ?? featuredModels[0];

  const heroImageSrc =
    viewMode === 'printed' && active.images.printed.length > 0
      ? assetUrl(active.images.printed[0])
      : assetUrl(active.images.painted);

  return (
    <section id="top" className="relative overflow-hidden studio-radial-glow">
      <div className="pointer-events-none absolute inset-0 studio-grid-bg opacity-40" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-8 lg:py-20">
        {/* Left editorial column */}
        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/30 bg-[#11161F]/90 px-3.5 py-1.5 text-xs font-mono-tech uppercase tracking-[0.18em] text-[#2DD4BF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
            {siteConfig.heroEyebrow}
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.06] text-[#F1F5F9] sm:text-5xl lg:text-[3.4rem]">
            {siteConfig.heroTitle}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
            {siteConfig.heroSubtitle}
          </p>

          {/* 3-stage micro strip */}
          <div className="mt-7 grid w-full max-w-lg grid-cols-3 gap-2.5">
            <div className="rounded-xl border border-slate-800 bg-[#11161F]/80 p-3">
              <div className="flex items-center gap-1.5 font-mono-tech text-[11px] text-[#2DD4BF]">
                <Sparkles className="h-3.5 w-3.5" />
                STAGE 01
              </div>
              <p className="mt-1 text-xs font-semibold text-[#F1F5F9]">2D Concept</p>
              <p className="text-[11px] text-[#64748B]">Art &amp; Virtual Paint</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#11161F]/80 p-3">
              <div className="flex items-center gap-1.5 font-mono-tech text-[11px] text-[#2DD4BF]">
                <Box className="h-3.5 w-3.5" />
                STAGE 02
              </div>
              <p className="mt-1 text-xs font-semibold text-[#F1F5F9]">Virtual 3D</p>
              <p className="text-[11px] text-[#64748B]">Live WebGL Mesh</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#11161F]/80 p-3">
              <div className="flex items-center gap-1.5 font-mono-tech text-[11px] text-[#F59E0B]">
                <Printer className="h-3.5 w-3.5" />
                STAGE 03
              </div>
              <p className="mt-1 text-xs font-semibold text-[#F1F5F9]">Actual Print</p>
              <p className="text-[11px] text-[#64748B]">{siteConfig.printerName}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href="#models"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#081014] shadow-[0_8px_30px_rgba(45,212,191,0.28)] transition hover:bg-[#5EEAD4]"
            >
              Explore 3D Collectibles
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="#art"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#11161F] px-5 py-3 text-sm font-semibold text-[#F1F5F9] transition hover:border-[#F59E0B]/60 hover:text-[#F59E0B]"
            >
              View Stained-Glass Art
            </a>
            <a
              href={siteConfig.makerWorldUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#11161F]/70 px-4 py-3 text-sm font-medium text-[#94A3B8] transition hover:border-[#F59E0B]/50 hover:text-[#F59E0B]"
            >
              MakerWorld Profile
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Right interactive showcase card */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/90 bg-[#11161F]/90 p-3.5 shadow-2xl backdrop-blur-md">
          {/* Top switcher bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <p className="font-mono-tech text-[10px] uppercase tracking-widest text-[#2DD4BF]">
                Featured Workbench · {active.franchise}
              </p>
              <h2 className="font-display text-lg font-bold text-[#F1F5F9]">
                {active.title}
              </h2>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0B0E13] p-1">
              {(
                [
                  { id: 'painted', label: 'Virtual Paint' },
                  { id: '3d', label: 'Live 3D' },
                  { id: 'printed', label: 'Printed' },
                ] as { id: HeroViewMode; label: string }[]
              ).map((tab) => {
                const disabled = tab.id === 'printed' && active.images.printed.length === 0;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => setViewMode(tab.id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      viewMode === tab.id
                        ? tab.id === '3d'
                          ? 'bg-[#2DD4BF]/20 text-[#2DD4BF]'
                          : 'bg-[#1E293B] text-[#F1F5F9]'
                        : 'text-[#94A3B8] hover:text-[#F1F5F9] disabled:opacity-40'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage area */}
          {viewMode === '3d' ? (
            <ModelViewer3D
              glbPath={active.glbPath}
              title={active.title}
              paused={isModalOpen}
              compact
            />
          ) : (
            <div className="group relative h-[380px] sm:h-[440px] w-full overflow-hidden rounded-xl border border-slate-700/70 bg-[#0B0E13]">
              <img
                src={heroImageSrc}
                alt={`${active.title} - ${viewMode}`}
                className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
              />
              {viewMode === 'painted' && (
                <div className="pointer-events-none absolute top-3 left-3 rounded-md border border-[#F59E0B]/35 bg-[#0B0E13]/85 px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-wider text-[#F59E0B] backdrop-blur">
                  Virtually Painted Preview
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0E13]/90 to-transparent" />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#2DD4BF]/40 bg-[#0B0E13]/85 px-3 py-1.5 text-xs font-medium text-[#2DD4BF] backdrop-blur transition hover:bg-[#2DD4BF] hover:text-[#081014]"
                >
                  <Box className="h-3.5 w-3.5" />
                  Spin Live 3D
                </button>
                <button
                  type="button"
                  onClick={() => onInspectModel(active)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#0B0E13]/85 px-3 py-1.5 text-xs font-medium text-[#F1F5F9] backdrop-blur transition hover:border-slate-500"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  Inspect All Stages
                </button>
              </div>
            </div>
          )}

          {/* Bottom character selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-0.5">
            <div className="flex flex-wrap gap-1.5">
              {featuredModels.map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    idx === selectedIdx
                      ? 'bg-[#2DD4BF]/15 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/40'
                      : 'bg-[#18202C] text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  {m.character}
                </button>
              ))}
            </div>
            <span className="font-mono-tech text-[11px] text-[#64748B]">
              {(active.stats?.originalTriangles ?? 0).toLocaleString()} source tris
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
