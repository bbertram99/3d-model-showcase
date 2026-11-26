import React, { useMemo, useState } from 'react';
import { Box, CheckCircle2, Clock, ExternalLink, Sparkles, ArrowUpRight, Layers } from 'lucide-react';
import { CollectiblesModel, qfgDiorama } from '../data/modelsData';
import { assetUrl } from '../utils/assets';

interface ModelsGalleryProps {
  models: CollectiblesModel[];
  onSelectModel: (model: CollectiblesModel, initialTab?: 'concept' | 'virtual' | '3d' | 'printed' | 'compare') => void;
}

type FilterKey = 'all' | 'printed' | 'qfg' | 'progress';

export const ModelsGallery: React.FC<ModelsGalleryProps> = ({ models, onSelectModel }) => {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [dioramaView, setDioramaView] = useState<'painted' | 'virtual' | 'concept'>('painted');

  const filteredModels = useMemo(() => {
    switch (filter) {
      case 'printed':
        return models.filter((m) => m.status === 'printed');
      case 'qfg':
        return models.filter((m) => m.franchise === 'Quest for Glory');
      case 'progress':
        return models.filter((m) => m.status !== 'printed');
      default:
        return models;
    }
  }, [models, filter]);

  const filterTabs: { id: FilterKey; label: string; count: number }[] = [
    { id: 'all', label: 'All Collectibles', count: models.length },
    { id: 'printed', label: 'Printed', count: models.filter((m) => m.status === 'printed').length },
    {
      id: 'qfg',
      label: 'Quest for Glory',
      count: models.filter((m) => m.franchise === 'Quest for Glory').length,
    },
    {
      id: 'progress',
      label: 'Printing / 3D Ready',
      count: models.filter((m) => m.status !== 'printed').length,
    },
  ];

  const dioramaImg =
    dioramaView === 'virtual'
      ? qfgDiorama.images.virtual
      : dioramaView === 'concept'
      ? qfgDiorama.images.concept
      : qfgDiorama.images.painted;

  return (
    <section id="models" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header + Filters */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">
              Character Collectibles
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#F1F5F9] sm:text-4xl">
              3D Printed Models &amp; Sculpt Archive
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94A3B8] sm:text-base">
              Select any character to explore the complete journey - from 2D concept and virtually
              painted preview to grey-clay sculpt, live WebGL turntable, and raw Snapmaker U1 prints.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-3 py-1.5 text-xs text-[#FCD34D]">
              Note: Colored figure images are virtually painted 3D previews showing what each model could look like painted. None of the physical 3D prints are painted yet - click any card to view the raw printed photos.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                  filter === tab.id
                    ? 'bg-[#2DD4BF] text-[#081014] shadow-[0_4px_20px_rgba(45,212,191,0.25)]'
                    : 'border border-slate-800 bg-[#11161F] text-[#94A3B8] hover:border-slate-700 hover:text-[#F1F5F9]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono-tech text-[10px] ${
                    filter === tab.id ? 'bg-[#081014]/20 text-[#081014]' : 'bg-slate-800 text-[#94A3B8]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModels.map((model) => {
            const isPrinted = model.status === 'printed';
            const isPrinting = model.status === 'printing';

            return (
              <article
                key={model.id}
                onClick={() => onSelectModel(model)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#18202C]/75 transition duration-300 hover:-translate-y-1 hover:border-[#2DD4BF]/50 hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#0B0E13]">
                  <img
                    src={assetUrl(model.images.card)}
                    alt={model.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18202C] via-transparent to-transparent opacity-90" />

                  {/* Franchise & Status */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-md border border-slate-700/80 bg-[#0B0E13]/85 px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-wider text-[#E2E8F0] backdrop-blur">
                      {model.franchise}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {isPrinted ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#2DD4BF]/40 bg-[#0B0E13]/85 px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-wider text-[#2DD4BF] backdrop-blur">
                        <CheckCircle2 className="h-3 w-3" />
                        Printed
                      </span>
                    ) : isPrinting ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F59E0B]/40 bg-[#0B0E13]/85 px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-wider text-[#F59E0B] backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                        Printing
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-[#0B0E13]/85 px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-wider text-[#94A3B8] backdrop-blur">
                        <Clock className="h-3 w-3" />
                        3D Ready
                      </span>
                    )}
                  </div>

                  {/* Quick stage indicators */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 font-mono-tech text-[10px]">
                    <span className="rounded bg-[#0B0E13]/80 px-2 py-0.5 text-[#CBD5E1] border border-slate-700/70">
                      2D
                    </span>
                    <span className="rounded bg-[#0B0E13]/80 px-2 py-0.5 text-[#2DD4BF] border border-[#2DD4BF]/30">
                      3D LIVE
                    </span>
                    {isPrinted && (
                      <span className="rounded bg-[#0B0E13]/80 px-2 py-0.5 text-[#F59E0B] border border-[#F59E0B]/30">
                        {model.images.printed.length} PHOTOS
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/80 bg-[#0B0E13]/85 text-[#2DD4BF] opacity-0 transition group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#F1F5F9] transition group-hover:text-[#2DD4BF]">
                      {model.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#94A3B8]">
                      {model.tagline}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-800 pt-3.5 text-xs font-mono-tech text-[#64748B]">
                    <span>{(model.stats?.originalTriangles ?? 0).toLocaleString()} tris</span>
                    <div className="flex items-center gap-3">
                      {model.makerWorldUrl && (
                        <a
                          href={model.makerWorldUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[#94A3B8] transition hover:text-[#F59E0B]"
                        >
                          MakerWorld
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectModel(model, '3d');
                        }}
                        className="inline-flex items-center gap-1 text-[#2DD4BF] hover:underline"
                      >
                        <Box className="h-3.5 w-3.5" />
                        Spin 3D
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Quest for Glory Hero's Choice Diorama Feature Banner */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-slate-800 bg-[#11161F] shadow-xl">
          <div className="grid items-center lg:grid-cols-[1.2fr_1fr]">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0B0E13]">
              <img
                src={assetUrl(dioramaImg)}
                alt={qfgDiorama.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-md border border-[#2DD4BF]/30 bg-[#0B0E13]/85 px-2.5 py-1 font-mono-tech text-[11px] uppercase tracking-wider text-[#2DD4BF] backdrop-blur">
                <Layers className="h-3.5 w-3.5" />
                Diorama Concept Study
              </div>
            </div>

            <div className="flex flex-col gap-4 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono-tech text-xs uppercase tracking-wider text-[#F59E0B]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {qfgDiorama.subtitle}
                </span>
                <div className="flex rounded-lg border border-slate-800 bg-[#0B0E13] p-1 text-xs">
                  {(
                    [
                      { id: 'painted', label: 'Virtual Paint' },
                      { id: 'virtual', label: 'Clay 3D' },
                      { id: 'concept', label: '2D Art' },
                    ] as const
                  ).map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setDioramaView(v.id)}
                      className={`rounded-md px-2.5 py-1 font-medium transition ${
                        dioramaView === v.id
                          ? 'bg-[#1E293B] text-[#F1F5F9]'
                          : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-[#F1F5F9]">
                {qfgDiorama.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#94A3B8]">
                {qfgDiorama.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {['qfg-fighter', 'qfg-magic-user', 'qfg-thief'].map((slug) => {
                  const found = models.find((m) => m.slug === slug);
                  if (!found) return null;
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => onSelectModel(found, '3d')}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#18202C] px-3.5 py-2 text-xs font-semibold text-[#F1F5F9] transition hover:border-[#2DD4BF] hover:text-[#2DD4BF]"
                    >
                      <Box className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      Inspect {found.character}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
