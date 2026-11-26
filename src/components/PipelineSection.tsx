import React from 'react';
import {
  Box,
  ExternalLink,
  Gamepad2,
  Palette,
  Printer,
  Sparkles,
} from 'lucide-react';

interface Chapter {
  index: string;
  title: string;
  toolLabel: string;
  story: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'teal' | 'amber';
  spanClass: string;
  link?: { label: string; href: string };
}

const CHAPTERS: Chapter[] = [
  {
    index: '01',
    title: 'Digging Into the Source Material',
    toolLabel: 'Sprites, Box Art & In-Game Graphics',
    story: 'Every build starts by revisiting the original retro pixel artifacts.',
    detail:
      'I gather classic game sprites, vintage box covers, character portraits, and in-game screenshots to lock in the signature gear, proportions, and nostalgia that fans immediately recognize.',
    icon: Gamepad2,
    tone: 'teal',
    spanClass: 'lg:col-span-2',
  },
  {
    index: '02',
    title: 'Prompt Crafting & 2D Concept Art',
    toolLabel: 'Google Gemini',
    story: 'Turning low-res nostalgia into crisp, high-detail 2D character art.',
    detail:
      'I use Google Gemini to craft custom prompts and generate a clean 2D illustration, iterating on pose, lighting, facial likeness, and base composition round by round until the concept truly clicks.',
    icon: Sparkles,
    tone: 'teal',
    spanClass: 'lg:col-span-2',
  },
  {
    index: '03',
    title: 'Virtual 3D Sculpt & Paint Reference',
    toolLabel: 'Google Gemini',
    story: 'Previewing the sculpt and painting it virtually before printing.',
    detail:
      'Next, I ask Google Gemini to reimagine the finalized 2D concept as an unpainted grey-clay virtual 3D figure, and then virtually paint it - giving me a realistic color blueprint to guide future hand-painting.',
    icon: Palette,
    tone: 'teal',
    spanClass: 'lg:col-span-2',
  },
  {
    index: '04',
    title: 'Turning 2D Into a Real 3D Mesh',
    toolLabel: 'MakerWorld MakerLab · AIMIA',
    story: 'Converting the tuned 2D artwork into printable 3D geometry.',
    detail:
      'I bring the finalized 2D image into MakerWorld MakerLab (AIMIA) and test its AI image-to-3D generation models to produce a crisp, multi-angle 3D mesh with real sculptural depth and clean surfaces.',
    icon: Box,
    tone: 'amber',
    spanClass: 'lg:col-span-3',
    link: {
      label: 'MakerLab AIMIA',
      href: 'https://makerworld.com/en/makerlab/aimia',
    },
  },
  {
    index: '05',
    title: 'Export, Slice & Print',
    toolLabel: 'Snapmaker U1 · Orca Slicer',
    story: 'From digital .3mf file to physical filament on the build plate.',
    detail:
      'Finally, I export the mesh, orient and support it for slicing, and send it to the Snapmaker U1. Character figures print in raw matte charcoal PLA ready for future painting, while stained-glass wall art is fabricated across multi-plate colored filament beds.',
    icon: Printer,
    tone: 'amber',
    spanClass: 'lg:col-span-3',
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
              The Creative Journey
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#F1F5F9] sm:text-3xl">
              Five Chapters From Retro Pixel to Print Bed
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#94A3B8]">
            How classic game memories move from sprites and box art through Google Gemini and
            MakerWorld AIMIA onto the Snapmaker U1.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {CHAPTERS.map((chapter) => {
            const Icon = chapter.icon;
            const isTeal = chapter.tone === 'teal';
            const badgeStyle = isTeal
              ? 'text-[#2DD4BF] border-[#2DD4BF]/30 bg-[#2DD4BF]/10'
              : 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10';
            const topRule = isTeal
              ? 'from-[#2DD4BF]/60 via-[#2DD4BF]/15 to-transparent'
              : 'from-[#F59E0B]/60 via-[#F59E0B]/15 to-transparent';

            return (
              <article
                key={chapter.index}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-[#18202C]/75 p-6 transition hover:border-slate-700 hover:bg-[#18202C] ${chapter.spanClass}`}
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${topRule}`}
                />

                <div>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border ${badgeStyle}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`font-mono-tech text-xs font-semibold uppercase tracking-wider ${
                        isTeal ? 'text-[#2DD4BF]' : 'text-[#F59E0B]'
                      }`}
                    >
                      Chapter {chapter.index}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#F1F5F9]">
                    {chapter.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium text-[#CBD5E1]">
                    {chapter.story}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#94A3B8]">
                    {chapter.detail}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/90 pt-3.5">
                  <span className="font-mono-tech text-[11px] text-[#64748B]">
                    {chapter.toolLabel}
                  </span>

                  {chapter.link && (
                    <a
                      href={chapter.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-[#F59E0B]/35 bg-[#F59E0B]/10 px-2.5 py-0.5 font-mono-tech text-[11px] font-medium text-[#F59E0B] transition hover:border-[#F59E0B] hover:bg-[#F59E0B]/20"
                    >
                      <span>{chapter.link.label}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
