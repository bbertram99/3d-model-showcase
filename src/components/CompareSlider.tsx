import React, { useCallback, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

export interface CompareStageOption {
  id: string;
  label: string;
  src: string;
}

interface CompareSliderProps {
  stages: CompareStageOption[];
  initialLeftId?: string;
  initialRightId?: string;
  aspectClass?: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  stages,
  initialLeftId,
  initialRightId,
  aspectClass = 'aspect-[4/3]',
}) => {
  const [leftId, setLeftId] = useState(initialLeftId ?? stages[0]?.id ?? '');
  const [rightId, setRightId] = useState(
    initialRightId ?? stages[stages.length - 1]?.id ?? ''
  );
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const leftStage = stages.find((s) => s.id === leftId) ?? stages[0];
  const rightStage = stages.find((s) => s.id === rightId) ?? stages[stages.length - 1];

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    setPosition(Math.min(98, Math.max(2, pct)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPosition((p) => Math.max(2, p - 4));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPosition((p) => Math.min(98, p + 4));
    }
  };

  if (!leftStage || !rightStage) return null;

  return (
    <div className="flex flex-col gap-3">
      {stages.length > 2 && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-mono-tech uppercase tracking-wider text-[#94A3B8]">
              Left:
            </span>
            {stages.map((stage) => (
              <button
                key={`left-${stage.id}`}
                type="button"
                onClick={() => setLeftId(stage.id)}
                className={`rounded-md px-2.5 py-1 font-medium transition ${
                  stage.id === leftStage.id
                    ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/40'
                    : 'bg-[#18202C] text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {stage.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono-tech uppercase tracking-wider text-[#94A3B8]">
              Right:
            </span>
            {stages.map((stage) => (
              <button
                key={`right-${stage.id}`}
                type="button"
                onClick={() => setRightId(stage.id)}
                className={`rounded-md px-2.5 py-1 font-medium transition ${
                  stage.id === rightStage.id
                    ? 'bg-[#F59E0B]/20 text-[#F59E0B] ring-1 ring-[#F59E0B]/40'
                    : 'bg-[#18202C] text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label={`Compare ${leftStage.label} and ${rightStage.label}`}
        aria-valuemin={2}
        aria-valuemax={98}
        aria-valuenow={Math.round(position)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className={`relative w-full ${aspectClass} touch-none select-none overflow-hidden rounded-xl border border-slate-700/60 bg-[#0B0E13] cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/60`}
      >
        {/* Right (underlay) */}
        <img
          src={rightStage.src}
          alt={rightStage.label}
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain bg-[#0B0E13]"
        />

        {/* Left (clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={leftStage.src}
            alt={leftStage.label}
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain bg-[#0B0E13]"
          />
        </div>

        {/* Labels */}
        <div className="pointer-events-none absolute top-3 left-3 rounded-md bg-[#0B0E13]/85 px-2.5 py-1 text-[11px] font-mono-tech uppercase tracking-wider text-[#2DD4BF] border border-[#2DD4BF]/30 backdrop-blur">
          {leftStage.label}
        </div>
        <div className="pointer-events-none absolute top-3 right-3 rounded-md bg-[#0B0E13]/85 px-2.5 py-1 text-[11px] font-mono-tech uppercase tracking-wider text-[#F59E0B] border border-[#F59E0B]/30 backdrop-blur">
          {rightStage.label}
        </div>

        {/* Divider line + handle */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.75)]"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-[#2DD4BF] bg-[#11161F]/95 text-[#2DD4BF] shadow-lg">
            <MoveHorizontal className="h-4 w-4" />
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-[#64748B] font-mono-tech">
        Drag slider or use Left / Right arrow keys to compare stages
      </p>
    </div>
  );
};
