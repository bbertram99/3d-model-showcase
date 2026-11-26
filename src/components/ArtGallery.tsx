import React from 'react';
import { Layers, Ruler, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ArtProject } from '../data/artData';
import { assetUrl } from '../utils/assets';

interface ArtGalleryProps {
  artworks: ArtProject[];
  onSelectArt: (art: ArtProject) => void;
}

export const ArtGallery: React.FC<ArtGalleryProps> = ({ artworks, onSelectArt }) => {
  return (
    <section id="art" className="border-t border-slate-800/80 bg-[#0E1219] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-3 py-1 text-xs font-mono-tech uppercase tracking-wider text-[#F59E0B]">
              <Sparkles className="h-3.5 w-3.5" />
              Multi-Plate 3D Intarsia Reliefs
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold text-[#F1F5F9] sm:text-4xl">
              Stained-Glass 3D Wall Art
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94A3B8] sm:text-base">
              Lead-came illustrations engineered into multi-plate 3D-printable puzzle reliefs -
              fabricated from separate colored filament plates, each tile numbered, beveled, and
              calibrated with 0.12 mm inlay clearance on the Snapmaker U1.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono-tech text-xs text-[#94A3B8]">
            <span className="rounded-lg border border-slate-800 bg-[#11161F] px-3 py-2">
              {artworks.length} Finished Designs
            </span>
            <span className="rounded-lg border border-slate-800 bg-[#11161F] px-3 py-2">
              0.12 mm Fit Clearance
            </span>
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {artworks.map((art) => (
            <article
              key={art.id}
              onClick={() => onSelectArt(art)}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#18202C]/75 transition duration-300 hover:-translate-y-1 hover:border-[#F59E0B]/50 hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
            >
              {/* Render image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0B0E13]">
                <img
                  src={assetUrl(art.images.card)}
                  alt={`${art.title} studio render`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18202C] via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="rounded-md border border-slate-700/80 bg-[#0B0E13]/85 px-2.5 py-1 font-mono-tech text-[11px] uppercase tracking-wider text-[#F59E0B] backdrop-blur">
                    {art.category}
                  </span>
                </div>

                {art.images.printed && art.images.printed.length > 0 ? (
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-[#2DD4BF]/40 bg-[#0B0E13]/85 px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-wider text-[#2DD4BF] backdrop-blur">
                    <CheckCircle2 className="h-3 w-3" />
                    Printed
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/80 bg-[#0B0E13]/85 text-[#F1F5F9] opacity-0 transition group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4 text-[#F59E0B]" />
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#F1F5F9] transition group-hover:text-[#F59E0B]">
                    {art.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[#2DD4BF]">{art.subtitle}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#94A3B8]">
                    {art.description}
                  </p>
                </div>

                <div className="mt-5 space-y-3 border-t border-slate-800/90 pt-4">
                  {/* Palette swatches */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-tech text-[11px] uppercase tracking-wider text-[#64748B]">
                      Filament Palette ({art.colorPlateCount})
                    </span>
                    <div className="flex -space-x-1">
                      {art.palette.slice(0, 9).map((swatch) => (
                        <span
                          key={swatch.name}
                          title={swatch.name}
                          className="h-4 w-4 rounded-full border border-[#0B0E13] shadow-sm"
                          style={{ backgroundColor: swatch.hex }}
                        />
                      ))}
                      {art.palette.length > 9 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-700 bg-[#11161F] text-[9px] font-mono-tech text-[#94A3B8]">
                          +{art.palette.length - 9}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Specs row */}
                  <div className="flex items-center justify-between text-xs font-mono-tech text-[#94A3B8]">
                    <span className="inline-flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      {art.plateCount} Build Plates
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Ruler className="h-3.5 w-3.5 text-[#F59E0B]" />
                      {art.dimensionsMm.split(' × ').slice(0, 2).join('×')} mm
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
