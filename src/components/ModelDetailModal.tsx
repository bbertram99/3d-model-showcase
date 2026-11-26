import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Box,
  CheckCircle2,
  Clock,
  ExternalLink,
  Printer,
  Maximize2,
  Minimize2,
  Layers,
} from 'lucide-react';
import { CollectiblesModel } from '../data/modelsData';
import { assetUrl } from '../utils/assets';
import { ModelViewer3D } from './ModelViewer3D';
import { CompareSlider, CompareStageOption } from './CompareSlider';

export type ModelModalTab = 'concept' | 'virtual' | '3d' | 'printed' | 'compare';

interface ModelDetailModalProps {
  model: CollectiblesModel | null;
  initialTab?: ModelModalTab;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const ModelDetailModal: React.FC<ModelDetailModalProps> = ({
  model,
  initialTab = 'concept',
  onClose,
  onPrev,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState<ModelModalTab>(initialTab);
  const [conceptVariant, setConceptVariant] = useState<'painted' | 'concept'>('painted');
  const [activePrintIdx, setActivePrintIdx] = useState(0);
  const [showTriptych, setShowTriptych] = useState(false);
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!model) return;
    setActiveTab(initialTab);
    setConceptVariant('painted');
    setActivePrintIdx(0);
    setShowTriptych(false);
    setZoomedSrc(null);
  }, [model?.id, initialTab]);

  useEffect(() => {
    if (!model) return;
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
  }, [model, zoomedSrc, onClose, onPrev, onNext]);

  if (!model) return null;

  const tabs: { id: ModelModalTab; label: string }[] = [
    { id: 'concept', label: '01 2D Concept' },
    { id: 'virtual', label: '02 Virtual 3D' },
    { id: '3d', label: '03 Interactive 3D' },
    { id: 'printed', label: '04 Actual Print' },
    { id: 'compare', label: 'Compare Stages' },
  ];

  const compareStages: CompareStageOption[] = [
    { id: 'painted', label: 'Painted Concept', src: assetUrl(model.images.painted) },
    { id: 'virtual', label: 'Virtual 3D', src: assetUrl(model.images.virtual) },
  ];
  if (model.images.concept) {
    compareStages.unshift({
      id: 'concept',
      label: 'Original 2D Art',
      src: assetUrl(model.images.concept),
    });
  }
  if (model.images.printed.length > 0) {
    compareStages.push({
      id: 'printed',
      label: 'Actual Print',
      src: assetUrl(model.images.printed[0]),
    });
  }

  const activeConceptSrc =
    conceptVariant === 'concept' && model.images.concept
      ? model.images.concept
      : model.images.painted;

  const activePrintedSrc = showTriptych && model.images.triptych
    ? model.images.triptych
    : model.images.printed[activePrintIdx];

  const dims = model.stats?.dimensionsMm ?? [];
  const dimsText = dims.length === 3 ? `${dims[0]} × ${dims[1]} × ${dims[2]} mm` : '100 mm scale';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={model.title}
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-in relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-[#11161F] shadow-2xl"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-md border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-2.5 py-0.5 font-mono-tech text-[11px] uppercase tracking-wider text-[#2DD4BF]">
              {model.franchise}
            </span>
            <h2 className="font-display text-lg font-bold text-[#F1F5F9] sm:text-xl">
              {model.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous model"
              className="rounded-lg border border-slate-700/80 bg-[#18202C] p-1.5 text-[#94A3B8] transition hover:border-[#2DD4BF]/50 hover:text-[#F1F5F9]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next model"
              className="rounded-lg border border-slate-700/80 bg-[#18202C] p-1.5 text-[#94A3B8] transition hover:border-[#2DD4BF]/50 hover:text-[#F1F5F9]"
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

        {/* Body */}
        <div className="grid flex-1 overflow-y-auto lg:grid-cols-[1fr_340px]">
          {/* Left media viewport */}
          <div className="flex flex-col gap-4 p-5 sm:p-6">
            <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/40'
                      : 'bg-[#18202C]/70 text-[#94A3B8] hover:bg-[#18202C] hover:text-[#F1F5F9]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'concept' && (
              <div className="flex flex-col gap-3">
                {model.images.concept && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConceptVariant('painted')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        conceptVariant === 'painted'
                          ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/40'
                          : 'bg-[#18202C] text-[#94A3B8] hover:text-[#F1F5F9]'
                      }`}
                    >
                      Painted Maquette Study
                    </button>
                    <button
                      type="button"
                      onClick={() => setConceptVariant('concept')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        conceptVariant === 'concept'
                          ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/40'
                          : 'bg-[#18202C] text-[#94A3B8] hover:text-[#F1F5F9]'
                      }`}
                    >
                      2D Key Illustration
                    </button>
                  </div>
                )}

                <div className="relative overflow-hidden rounded-xl border border-slate-700/70 bg-[#0B0E13]">
                  <img
                    src={assetUrl(activeConceptSrc)}
                    alt={`${model.title} 2D concept`}
                    className="max-h-[540px] w-full object-contain bg-[#0B0E13]"
                  />
                  <button
                    type="button"
                    onClick={() => setZoomedSrc(assetUrl(activeConceptSrc))}
                    className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-[#0B0E13]/85 px-3 py-1.5 text-xs font-medium text-[#F1F5F9] backdrop-blur transition hover:border-[#2DD4BF] hover:text-[#2DD4BF]"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    Fullscreen
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'virtual' && (
              <div className="flex flex-col gap-3">
                <div className="relative overflow-hidden rounded-xl border border-slate-700/70 bg-[#0B0E13]">
                  <img
                    src={assetUrl(model.images.virtual)}
                    alt={`${model.title} virtual 3D render`}
                    className="max-h-[540px] w-full object-contain bg-[#0B0E13]"
                  />
                  <button
                    type="button"
                    onClick={() => setZoomedSrc(assetUrl(model.images.virtual))}
                    className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-[#0B0E13]/85 px-3 py-1.5 text-xs font-medium text-[#F1F5F9] backdrop-blur transition hover:border-[#2DD4BF] hover:text-[#2DD4BF]"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    Fullscreen
                  </button>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Grey-clay virtual 3D sculpt render prior to slicing. Switch to{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('3d')}
                    className="text-[#2DD4BF] hover:underline"
                  >
                    03 Interactive 3D
                  </button>{' '}
                  to orbit the actual mesh in real time.
                </p>
              </div>
            )}

            {activeTab === '3d' && (
              <ModelViewer3D glbPath={model.glbPath} title={model.title} />
            )}

            {activeTab === 'printed' && (
              <div className="flex flex-col gap-3">
                {model.images.printed.length > 0 && activePrintedSrc ? (
                  <>
                    <div className="relative overflow-hidden rounded-xl border border-slate-700/70 bg-[#0B0E13]">
                      <img
                        src={assetUrl(activePrintedSrc)}
                        alt={`${model.title} physical 3D print`}
                        className="max-h-[500px] w-full object-contain bg-[#0B0E13]"
                      />
                      <button
                        type="button"
                        onClick={() => setZoomedSrc(assetUrl(activePrintedSrc))}
                        className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-[#0B0E13]/85 px-3 py-1.5 text-xs font-medium text-[#F1F5F9] backdrop-blur transition hover:border-[#F59E0B] hover:text-[#F59E0B]"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        Fullscreen
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {model.images.printed.map((imgPath, i) => (
                        <button
                          key={imgPath}
                          type="button"
                          onClick={() => {
                            setShowTriptych(false);
                            setActivePrintIdx(i);
                          }}
                          className={`relative h-16 w-16 overflow-hidden rounded-lg border transition ${
                            !showTriptych && activePrintIdx === i
                              ? 'border-[#F59E0B] ring-2 ring-[#F59E0B]/40'
                              : 'border-slate-700/80 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={assetUrl(imgPath)}
                            alt={`Print angle ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                      {model.images.triptych && (
                        <button
                          type="button"
                          onClick={() => setShowTriptych(true)}
                          className={`inline-flex h-16 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition ${
                            showTriptych
                              ? 'border-[#2DD4BF] bg-[#2DD4BF]/15 text-[#2DD4BF]'
                              : 'border-slate-700/80 bg-[#18202C] text-[#94A3B8] hover:text-[#F1F5F9]'
                          }`}
                        >
                          <Layers className="h-4 w-4" />
                          3-Stage Triptych
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#0B0E13]/80 p-8 text-center">
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full border ${
                        model.status === 'printing'
                          ? 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]'
                          : 'border-slate-700 bg-[#18202C] text-[#94A3B8]'
                      }`}
                    >
                      {model.status === 'printing' ? (
                        <Printer className="h-6 w-6 animate-pulse" />
                      ) : (
                        <Clock className="h-6 w-6" />
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#F1F5F9]">
                      {model.status === 'printing'
                        ? 'Currently Printing on Snapmaker U1'
                        : 'Sliced & Queued for Fabrication'}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-[#94A3B8]">
                      {model.status === 'printing'
                        ? 'The physical print for Lt. Johnny Westland is actively running on the printer. Build-plate photography will be added once cured and cleaned.'
                        : 'The .3mf sculpt is complete and ready for the Snapmaker U1 build queue. Spin the interactive 3D mesh in Stage 03 right now.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('3d')}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-4 py-2 text-xs font-semibold text-[#081014]"
                    >
                      <Box className="h-4 w-4" />
                      Inspect Live 3D Mesh Instead
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'compare' && (
              <CompareSlider
                stages={compareStages}
                initialLeftId={compareStages[0]?.id}
                initialRightId={compareStages[compareStages.length - 1]?.id}
                aspectClass="aspect-[4/3]"
              />
            )}
          </div>

          {/* Right spec sidebar */}
          <aside className="flex flex-col gap-5 border-t border-slate-800 bg-[#0E131B] p-5 sm:p-6 lg:border-t-0 lg:border-l">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono-tech text-[11px] text-[#64748B]">{model.year}</span>
                {model.status === 'printed' ? (
                  <span className="inline-flex items-center gap-1 font-mono-tech text-[11px] text-[#2DD4BF]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Physical Print Complete
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono-tech text-[11px] text-[#F59E0B]">
                    <Clock className="h-3.5 w-3.5" />
                    {model.statusLabel}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
                {model.description}
              </p>
            </div>

            <div className="space-y-2.5 rounded-xl border border-slate-800 bg-[#151C27] p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Source Mesh</span>
                <span className="font-mono-tech text-[#F1F5F9]">
                  {(model.stats?.originalTriangles ?? 0).toLocaleString()} tris
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Web Turntable</span>
                <span className="font-mono-tech text-[#2DD4BF]">
                  {(model.stats?.webTriangles ?? 0).toLocaleString()} tris ({model.stats?.glbSizeMb ?? '—'} MB)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Print Dimensions</span>
                <span className="font-mono-tech text-[#F1F5F9]">{dimsText}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Hardware</span>
                <span className="font-mono-tech text-[#F1F5F9]">{model.printer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Material</span>
                <span className="font-mono-tech text-[#F1F5F9]">{model.filament}</span>
              </div>
            </div>

            {model.makerWorldUrl && (
              <a
                href={model.makerWorldUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#F59E0B]/40 bg-[#F59E0B]/15 px-4 py-2.5 text-xs font-semibold text-[#F59E0B] transition hover:border-[#F59E0B] hover:bg-[#F59E0B]/25"
              >
                <span>View Print Profile on MakerWorld</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            <div>
              <h4 className="mb-2.5 font-mono-tech text-[11px] uppercase tracking-wider text-[#94A3B8]">
                Stage Checklist
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#151C27] px-3 py-2">
                  <span className="text-[#E2E8F0]">2D Concept &amp; Color Study</span>
                  <CheckCircle2 className="h-4 w-4 text-[#2DD4BF]" />
                </li>
                <li className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#151C27] px-3 py-2">
                  <span className="text-[#E2E8F0]">High-Poly Sculpt (.3mf)</span>
                  <CheckCircle2 className="h-4 w-4 text-[#2DD4BF]" />
                </li>
                <li className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#151C27] px-3 py-2">
                  <span className="text-[#E2E8F0]">Physical Print Photos</span>
                  {model.status === 'printed' ? (
                    <CheckCircle2 className="h-4 w-4 text-[#2DD4BF]" />
                  ) : (
                    <span className="font-mono-tech text-[10px] text-[#F59E0B]">
                      {model.statusLabel.toUpperCase()}
                    </span>
                  )}
                </li>
              </ul>
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
            alt="Fullscreen stage inspection"
            className="max-h-[92vh] max-w-[94vw] rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
};
