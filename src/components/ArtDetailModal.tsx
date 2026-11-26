import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Ruler,
  Wrench,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ArtProject } from '../data/artData';
import { assetUrl } from '../utils/assets';
import { CompareSlider } from './CompareSlider';

interface ArtDetailModalProps {
  artwork: ArtProject | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

type ArtTab = 'printed' | 'render' | 'input' | 'exploded' | 'plates' | 'engineering' | 'compare';

export const ArtDetailModal: React.FC<ArtDetailModalProps> = ({
  artwork,
  onClose,
  onPrev,
  onNext,
}) => {
  const hasPrinted = Boolean(artwork?.images.printed && artwork.images.printed.length > 0);
  const [activeTab, setActiveTab] = useState<ArtTab>(hasPrinted ? 'printed' : 'render');
  const [activePrintIdx, setActivePrintIdx] = useState(0);
  const [engineeringView, setEngineeringView] = useState<'topology' | 'relief' | 'construction'>(
    'topology'
  );
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null);

  useEffect(() => {
    const printedReady = Boolean(artwork?.images.printed && artwork.images.printed.length > 0);
    setActiveTab(printedReady ? 'printed' : 'render');
    setActivePrintIdx(0);
    setEngineeringView('topology');
    setZoomedSrc(null);
  }, [artwork?.id]);

  useEffect(() => {
    if (!artwork) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomedSrc) setZoomedSrc(null);
        else onClose();
      } else if (e.key === 'ArrowLeft' && !zoomedSrc) {
        onPrev();
      } else if (e.key === 'ArrowRight' && !zoomedSrc) {
        onNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [artwork, zoomedSrc, onClose, onPrev, onNext]);

  if (!artwork) return null;

  const printedList = artwork.images.printed ?? [];

  const tabs: { id: ArtTab; label: string }[] = [
    ...(printedList.length > 0 ? [{ id: 'printed' as ArtTab, label: 'Actual Print' }] : []),
    { id: 'render', label: 'Studio Render' },
    { id: 'input', label: '2D Design' },
    { id: 'exploded', label: 'Exploded 3D' },
    { id: 'plates', label: 'Slicer Plates' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'compare', label: '2D ↔ 3D Compare' },
  ];

  const activeEngineeringSrc =
    engineeringView === 'construction' && artwork.images.construction
      ? artwork.images.construction
      : engineeringView === 'relief'
      ? artwork.images.relief
      : artwork.images.topology;

  const renderStageImage = (src: string, alt: string, caption: string) => (
    <div className="flex flex-col gap-3">
      <div className="group relative overflow-hidden rounded-xl border border-slate-700/70 bg-[#0B0E13]">
        <img
          src={assetUrl(src)}
          alt={alt}
          className="max-h-[540px] w-full object-contain bg-[#0B0E13]"
        />
        <button
          type="button"
          onClick={() => setZoomedSrc(assetUrl(src))}
          className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-[#0B0E13]/85 px-3 py-1.5 text-xs font-medium text-[#F1F5F9] backdrop-blur transition hover:border-[#F59E0B] hover:text-[#F59E0B]"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Inspect Fullscreen
        </button>
      </div>
      <p className="text-xs text-[#94A3B8]">{caption}</p>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={artwork.title}
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-in relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-[#11161F] shadow-2xl"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-2.5 py-0.5 font-mono-tech text-[11px] uppercase tracking-wider text-[#F59E0B]">
              {artwork.category}
            </span>
            <h2 className="font-display text-lg font-bold text-[#F1F5F9] sm:text-xl">
              {artwork.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous artwork"
              className="rounded-lg border border-slate-700/80 bg-[#18202C] p-1.5 text-[#94A3B8] transition hover:border-[#F59E0B]/50 hover:text-[#F1F5F9]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next artwork"
              className="rounded-lg border border-slate-700/80 bg-[#18202C] p-1.5 text-[#94A3B8] transition hover:border-[#F59E0B]/50 hover:text-[#F1F5F9]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="ml-1 rounded-lg border border-slate-700/80 bg-[#18202C] p-1.5 text-[#94A3B8] transition hover:border-slate-500 hover:text-[#F1F5F9]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="grid flex-1 overflow-y-auto lg:grid-cols-[1fr_340px]">
          {/* Left media stage */}
          <div className="flex flex-col gap-4 p-5 sm:p-6">
            <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-[#F59E0B]/20 text-[#F59E0B] ring-1 ring-[#F59E0B]/40'
                      : 'bg-[#18202C]/70 text-[#94A3B8] hover:bg-[#18202C] hover:text-[#F1F5F9]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'printed' && printedList.length > 0 && (
              <div className="flex flex-col gap-3">
                {renderStageImage(
                  printedList[Math.min(activePrintIdx, printedList.length - 1)],
                  `${artwork.title} actual 3D printed stained-glass wall art`,
                  `Real multi-plate 3D-printed stained-glass relief fabricated on the ${artwork.printer} and assembled from interlocking colored filament tiles.`
                )}
                {printedList.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {printedList.map((src, idx) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setActivePrintIdx(idx)}
                        className={`overflow-hidden rounded-lg border transition ${
                          idx === activePrintIdx
                            ? 'border-[#2DD4BF] ring-1 ring-[#2DD4BF]/50'
                            : 'border-slate-700 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={assetUrl(src)}
                          alt={`${artwork.title} print photo ${idx + 1}`}
                          className="h-14 w-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'render' &&
              renderStageImage(
                artwork.images.render,
                `${artwork.title} Blender studio render`,
                'Photorealistic Blender studio render showing finished matte filament relief and lead-came outline geometry.'
              )}

            {activeTab === 'input' &&
              renderStageImage(
                artwork.images.input,
                `${artwork.title} 2D stained-glass design`,
                '2D vector-clean lead-came artwork engineered with enclosed solid color tiles and high-contrast boundaries.'
              )}

            {activeTab === 'exploded' &&
              renderStageImage(
                artwork.images.exploded,
                `${artwork.title} exploded 3D assembly`,
                '4-panel CAD breakdown: assembled relief, exploded tile stack, engraved pocket indices, and back-engraved tile labels.'
              )}

            {activeTab === 'plates' &&
              renderStageImage(
                artwork.images.plates,
                `${artwork.title} multi-plate slicer layout`,
                `Color-separated build plates arranged for ${artwork.printer} fabrication.`
              )}

            {activeTab === 'engineering' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setEngineeringView('topology')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      engineeringView === 'topology'
                        ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/40'
                        : 'bg-[#18202C] text-[#94A3B8] hover:text-[#F1F5F9]'
                    }`}
                  >
                    Segmentation &amp; Topology
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngineeringView('relief')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      engineeringView === 'relief'
                        ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/40'
                        : 'bg-[#18202C] text-[#94A3B8] hover:text-[#F1F5F9]'
                    }`}
                  >
                    Depth Relief Map
                  </button>
                  {artwork.images.construction && (
                    <button
                      type="button"
                      onClick={() => setEngineeringView('construction')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        engineeringView === 'construction'
                          ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/40'
                          : 'bg-[#18202C] text-[#94A3B8] hover:text-[#F1F5F9]'
                      }`}
                    >
                      Virtual Construction Layout
                    </button>
                  )}
                </div>
                {renderStageImage(
                  activeEngineeringSrc,
                  `${artwork.title} engineering view`,
                  'Automated fabrication inspection verifying watertight tile topology, Z-relief heights, and puzzle clearances.'
                )}
              </div>
            )}

            {activeTab === 'compare' && (
              <CompareSlider
                stages={[
                  { id: 'input', label: '2D Artwork', src: assetUrl(artwork.images.input) },
                  { id: 'render', label: '3D Relief Render', src: assetUrl(artwork.images.render) },
                  ...(printedList.length > 0
                    ? [{ id: 'printed', label: 'Actual Print', src: assetUrl(printedList[0]) }]
                    : []),
                ]}
                initialLeftId="input"
                initialRightId={printedList.length > 0 ? 'printed' : 'render'}
                aspectClass="aspect-[4/3]"
              />
            )}
          </div>

          {/* Right sidebar specs */}
          <aside className="flex flex-col gap-5 border-t border-slate-800 bg-[#0E131B] p-5 sm:p-6 lg:border-t-0 lg:border-l">
            <div>
              <p className="font-mono-tech text-[11px] uppercase tracking-wider text-[#2DD4BF]">
                {artwork.subtitle}
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-[#CBD5E1]">
                {artwork.description}
              </p>
            </div>

            <div className="space-y-2.5 rounded-xl border border-slate-800 bg-[#151C27] p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[#94A3B8]">
                  <Ruler className="h-3.5 w-3.5 text-[#F59E0B]" />
                  Dimensions
                </span>
                <span className="font-mono-tech text-[#F1F5F9]">{artwork.dimensionsMm}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[#94A3B8]">
                  <Layers className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  Build Plates
                </span>
                <span className="font-mono-tech text-[#F1F5F9]">
                  {artwork.plateCount} ({artwork.tileCountLabel})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[#94A3B8]">
                  <Wrench className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  Inlay Clearance
                </span>
                <span className="font-mono-tech text-[#F1F5F9]">
                  {artwork.toleranceMm} mm · {artwork.mountStyle}
                </span>
              </div>
            </div>

            <div>
              <h4 className="mb-2.5 font-mono-tech text-[11px] uppercase tracking-wider text-[#94A3B8]">
                Filament Color Plates ({artwork.palette.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {artwork.palette.map((swatch) => (
                  <div
                    key={swatch.name}
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-[#151C27] px-2.5 py-1.5 text-xs"
                  >
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-full border border-slate-600"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span className="truncate text-[#E2E8F0]">{swatch.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Fullscreen lightbox */}
      {zoomedSrc && (
        <div
          onClick={() => setZoomedSrc(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
        >
          <button
            type="button"
            onClick={() => setZoomedSrc(null)}
            className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#11161F] px-3 py-1.5 text-xs text-[#F1F5F9]"
          >
            <Minimize2 className="h-4 w-4" />
            Close Zoom
          </button>
          <img
            src={zoomedSrc}
            alt="Fullscreen artwork inspection"
            className="max-h-[92vh] max-w-[94vw] rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
};
