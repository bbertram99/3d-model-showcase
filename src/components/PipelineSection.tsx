import React from 'react';
import { Sparkles, Box, Sliders, Printer } from 'lucide-react';

const STEPS = [
  {
    index: '01',
    title: '2D Concept & Painted Look',
    detail:
      'Every piece begins as custom 2D artwork — establishing pose, silhouette, costume fidelity, and painted color study before touching a mesh.',
    icon: Sparkles,
    accent: 'text-[#2DD4BF] border-[#2DD4BF]/30 bg-[#2DD4BF]/10',
  },
  {
    index: '02',
    title: 'Virtual 3D Sculpting',
    detail:
      'High-resolution digital clay sculpts (600K to 2.4M+ triangles) capture cloth folds, facial likeness, bases, and crisp surface relief.',
    icon: Box,
    accent: 'text-[#2DD4BF] border-[#2DD4BF]/30 bg-[#2DD4BF]/10',
  },
  {
    index: '03',
    title: 'Slicer & Tolerance Prep',
    detail:
      'Supports, wall thicknesses, and multi-plate interlocking puzzle clearances (0.12 mm) are engineered for clean Snapmaker Orca slicing.',
    icon: Sliders,
    accent: 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10',
  },
  {
    index: '04',
    title: 'Physical Fabrication',
    detail:
      'Printed on the Snapmaker U1 in matte charcoal PLA or multi-spool color plates, turning digital nostalgia into tangible shelf pieces.',
    icon: Printer,
    accent: 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10',
  },
];

export const PipelineSection: React.FC = () => {
  return (
    <section
      id="pipeline"
      className="border-y border-slate-800/80 bg-[#11161F]/70 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#2DD4BF]">
              Fabrication Pipeline
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#F1F5F9] sm:text-3xl">
              Four Stages From Pixel to Print Bed
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#94A3B8]">
            Click any piece in the gallery below to inspect each stage individually, spin the
            interactive 3D mesh, or wipe between concept and print.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.index}
                className="group relative rounded-2xl border border-slate-800 bg-[#18202C]/70 p-6 transition hover:border-slate-700 hover:bg-[#18202C]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${step.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono-tech text-xs font-medium text-[#64748B]">
                    STAGE {step.index}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-[#F1F5F9]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                  {step.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
