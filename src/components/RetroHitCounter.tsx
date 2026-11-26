import React, { useEffect, useState } from 'react';
import { siteConfig } from '../data/siteConfig';

const SESSION_KEY = 'fip_visit_counted';
const CACHE_KEY = 'fip_last_visit_count';

export const RetroHitCounter: React.FC = () => {
  const [count, setCount] = useState<number | null>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = Number(cached);
        if (Number.isFinite(parsed) && parsed > 0) return parsed;
      }
    } catch {
      // Ignore storage access failures
    }
    return null;
  });

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      const ns = encodeURIComponent(siteConfig.visitorCounterNamespace);
      const key = encodeURIComponent(siteConfig.visitorCounterKey);

      let alreadyCounted = false;
      try {
        alreadyCounted = sessionStorage.getItem(SESSION_KEY) === '1';
      } catch {
        alreadyCounted = false;
      }

      const mode = alreadyCounted ? 'get' : 'hit';
      const url = `https://abacus.jasoncameron.dev/${mode}/${ns}/${key}`;

      try {
        const res = await fetch(url, { method: 'GET', cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { value?: number };
        if (!cancelled && typeof data.value === 'number' && Number.isFinite(data.value)) {
          setCount(data.value);
          try {
            localStorage.setItem(CACHE_KEY, String(data.value));
            sessionStorage.setItem(SESSION_KEY, '1');
          } catch {
            // Ignore storage access failures
          }
        }
      } catch {
        // Keep cached value if network is unavailable
      }
    };

    fetchCount();
    return () => {
      cancelled = true;
    };
  }, []);

  const paddedDigits =
    count !== null ? String(Math.max(1, Math.floor(count))).padStart(6, '0') : '------';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="inline-flex flex-col items-center gap-2 rounded-xl border border-slate-700/90 bg-[#07090D] px-4 py-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.85),0_4px_20px_rgba(0,0,0,0.4)]">
        <span className="font-mono-tech text-[10px] font-medium uppercase tracking-[0.22em] text-[#94A3B8]">
          You Are Visitor #
        </span>

        <div
          aria-label={count !== null ? `Visitor count ${count}` : 'Visitor count loading'}
          className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-[#040608] p-1.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.95)]"
        >
          {paddedDigits.split('').map((digit, idx) => (
            <div
              key={`${idx}-${digit}`}
              className="relative flex h-9 w-7 items-center justify-center overflow-hidden rounded-[4px] border border-slate-700/80 bg-gradient-to-b from-[#1A212D] via-[#0D1219] to-[#161D28] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            >
              {/* Classic mechanical odometer center split line */}
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/70" />
              <span className="relative font-mono-tech text-lg font-bold leading-none text-[#2DD4BF] drop-shadow-[0_0_8px_rgba(45,212,191,0.55)]">
                {digit}
              </span>
            </div>
          ))}
        </div>

        <span className="font-mono-tech text-[9px] uppercase tracking-[0.2em] text-[#64748B]">
          Classic Web Counter · Est. 2026
        </span>
      </div>
    </div>
  );
};
