import React from 'react';
import { Box, Printer } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0B0E13] py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <Box className="h-4 w-4 text-[#2DD4BF]" />
            <span className="font-display text-sm font-bold tracking-[0.08em] text-[#F1F5F9]">
              {siteConfig.studioName}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-[#94A3B8]">{siteConfig.creatorName}</span>
          </div>
          <p className="text-xs text-[#64748B]">{siteConfig.footerNote}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#94A3B8]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-[#11161F] px-3 py-1 font-mono-tech">
            <Printer className="h-3.5 w-3.5 text-[#F59E0B]" />
            {siteConfig.printerName}
          </span>
          {siteConfig.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#2DD4BF]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
