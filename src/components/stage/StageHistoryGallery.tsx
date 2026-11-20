'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { StageHistoryItem } from '@/lib/stage-history';

export interface StageHistoryGalleryProps {
  items: StageHistoryItem[];
  /** Encabezado de nivel de los títulos de cada tarjeta (según la jerarquía de la página). */
  headingLevel?: 'h2' | 'h3';
}

/**
 * Archivo de presentaciones en vivo: rejilla de flyers completos (sin recortes) y visor ampliado
 * con `<dialog>` nativo (foco atrapado por el navegador, Escape para cerrar, flechas para navegar).
 * Los eventos sin flyer aprobado se muestran como ficha tipográfica.
 */
export const StageHistoryGallery: React.FC<StageHistoryGalleryProps> = ({ items, headingLevel = 'h3' }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const viewable = items.filter((item) => item.flyer);
  const active = activeIndex !== null ? viewable[activeIndex] : null;

  const open = (item: StageHistoryItem, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setActiveIndex(viewable.findIndex((v) => v.id === item.id));
  };

  const close = useCallback(() => setActiveIndex(null), []);

  const step = useCallback(
    (delta: number) => {
      setActiveIndex((i) => (i === null ? i : (i + delta + viewable.length) % viewable.length));
    },
    [viewable.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active) {
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = 'hidden';
      closeRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (viewable.length < 2) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  if (items.length === 0) return null;
  const Heading = headingLevel;

  return (
    <>
      <ul className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12" aria-label="Eventos anteriores">
        {items.map((item) => (
          <li key={item.id} className="group flex flex-col">
            {item.flyer ? (
              <button
                type="button"
                onClick={(e) => open(item, e.currentTarget)}
                className="relative block w-full aspect-[4/5] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.06),_transparent_70%)] bg-carbon/40 border border-white/10 overflow-hidden transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-crimson/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
                aria-label={`Ampliar flyer: ${item.title}`}
              >
                <Image
                  src={item.flyer.url}
                  alt={item.flyer.alt}
                  fill
                  sizes="(max-width: 420px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  className="object-contain p-3 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-widest bg-ink/90 border border-white/15 text-bone px-2 py-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"
                >
                  Ampliar ↗
                </span>
              </button>
            ) : (
              <div className="relative w-full aspect-[4/5] bg-carbon/40 border border-white/10 flex items-end p-6 overflow-hidden">
                <span aria-hidden="true" className="absolute -top-6 -left-2 font-sans font-black text-[9rem] leading-none text-white/[0.04] select-none">
                  DG
                </span>
                <span className="font-sans font-black uppercase text-2xl leading-tight text-bone/80">{item.title}</span>
              </div>
            )}

            <div className="pt-5 space-y-2 border-t border-transparent">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {item.dateLabel && (
                  <span className="font-mono text-xs uppercase tracking-wider text-crimson-text">{item.dateLabel}</span>
                )}
                {item.role && (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ash border border-white/15 px-2 py-0.5">
                    {item.role}
                  </span>
                )}
              </div>
              <Heading className="font-sans font-bold text-lg leading-snug text-bone">{item.title}</Heading>
              {item.place && <p className="font-mono text-xs text-ash">{item.place}</p>}
            </div>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onKeyDown={onKeyDown}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        aria-label={active ? `Flyer: ${active.title}` : 'Visor de flyers'}
        className="m-0 p-0 w-full h-full max-w-none max-h-none bg-ink/95 text-bone backdrop:bg-ink/90 backdrop:backdrop-blur-md open:flex"
      >
        {active?.flyer && (
          <div className="flex flex-col lg:flex-row w-full h-full">
            <div className="relative flex-1 min-h-0 flex items-center justify-center p-4 pt-16 lg:p-12">
              <Image
                key={active.id}
                src={active.flyer.url}
                alt={active.flyer.alt}
                width={active.flyer.width}
                height={active.flyer.height}
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="max-h-full w-auto h-auto max-w-full object-contain shadow-2xl"
              />
            </div>

            <aside className="lg:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 bg-carbon/60 p-6 lg:p-10 lg:pt-24 flex flex-col gap-4 max-h-[40vh] lg:max-h-none overflow-y-auto">
              <div className="flex flex-wrap items-center gap-3">
                {active.dateLabel && (
                  <span className="font-mono text-xs uppercase tracking-wider text-crimson-text">{active.dateLabel}</span>
                )}
                {active.role && (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ash border border-white/15 px-2 py-0.5">
                    {active.role}
                  </span>
                )}
              </div>
              <p className="font-sans font-black uppercase text-2xl lg:text-3xl leading-tight tracking-tight">{active.title}</p>
              {active.place && <p className="font-mono text-xs text-ash">{active.place}</p>}
              {active.summary && <p className="font-sans text-sm text-bone/85 leading-relaxed">{active.summary}</p>}
              {active.credit && <p className="font-mono text-[10px] text-smoke">{active.credit}</p>}
              {viewable.length > 1 && (
                <p className="mt-auto font-mono text-[10px] uppercase tracking-widest text-smoke">
                  {(activeIndex ?? 0) + 1} / {viewable.length}
                </p>
              )}
            </aside>

            <div className="absolute top-3 right-3 flex gap-2">
              {viewable.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="w-11 h-11 border border-white/20 bg-ink/80 hover:border-crimson hover:text-crimson-text transition-colors"
                    aria-label="Flyer anterior"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="w-11 h-11 border border-white/20 bg-ink/80 hover:border-crimson hover:text-crimson-text transition-colors"
                    aria-label="Flyer siguiente"
                  >
                    →
                  </button>
                </>
              )}
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="h-11 px-4 border border-white/20 bg-ink/80 font-mono text-xs uppercase tracking-widest hover:border-crimson hover:text-crimson-text transition-colors"
              >
                Cerrar ✕
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
};
