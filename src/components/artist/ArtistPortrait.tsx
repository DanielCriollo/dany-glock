import React from 'react';
import Image from 'next/image';
import type { Media } from '@/payload-types';

export interface ArtistPortraitProps {
  portraitImage?: Media | number | null;
  stageName: string;
  city: string;
  country: string;
  priority?: boolean;
}

export const ArtistPortrait: React.FC<ArtistPortraitProps> = ({
  portraitImage,
  stageName,
  city,
  country,
  priority = false,
}) => {
  const mediaObj = portraitImage && typeof portraitImage === 'object' && 'url' in portraitImage ? portraitImage : null;
  const hasRealImage = Boolean(mediaObj?.url);

  return (
    <div className="relative aspect-[4/5] w-full max-w-md mx-auto bg-gradient-to-b from-carbon via-ink to-graphite border border-white/15 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden group select-none">
      {/* 1. Fotografía Real Oficial (4:5) cuando existe */}
      {hasRealImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={mediaObj!.url!}
            alt={mediaObj!.alt || `Retrato artístico de ${stageName}`}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Viñeta cinematográfica para contraste y marcas de encuadre */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/60 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(10,10,12,0.6)_100%)] pointer-events-none"
            aria-hidden="true"
          />
        </div>
      )}

      {/* 2. Canvas Editorial Fallback (Cuando no hay foto oficial cargada) */}
      {!hasRealImage && (
        <>
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-crimson-deep/20 via-transparent to-transparent pointer-events-none group-hover:scale-110 transition-transform duration-700"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-30"
            aria-hidden="true"
          />
        </>
      )}

      {/* Marcas técnicas superiores */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-smoke">
        <span className="bg-black/60 px-2 py-0.5 border border-white/10 backdrop-blur-sm">
          {hasRealImage ? 'RETRATO OFICIAL' : 'RETRATO ARTÍSTICO'}
        </span>
        <span className="bg-black/60 px-2 py-0.5 border border-white/10 backdrop-blur-sm">
          {city.toUpperCase()}, {country.toUpperCase()}
        </span>
      </div>

      {/* Monograma y presencia artística */}
      <div className="relative z-10 my-auto text-center space-y-3">
        <span className="font-sans font-black text-7xl sm:text-8xl tracking-tighter text-bone/20 select-none block drop-shadow-lg">
          DG
        </span>
        <span className="font-mono text-sm uppercase tracking-[0.25em] text-bone block drop-shadow">
          {stageName}
        </span>
        <span className="font-mono text-[10px] text-ash block bg-black/60 px-2.5 py-1 border border-white/10 max-w-xs mx-auto backdrop-blur-sm">
          {hasRealImage ? 'Fotografía de Prensa Oficial' : 'Trap Latino · Producción & Visión'}
        </span>
      </div>

      {/* Metadato inferior */}
      <div className="relative z-10 border-t border-white/10 pt-3 flex items-center justify-between font-mono text-[10px] text-smoke">
        <span className="bg-black/60 px-2 py-0.5 border border-white/10">
          OFICIAL ARCHIVE
        </span>
        <span className="bg-black/60 px-2 py-0.5 border border-white/10">
          4:5 FORMAT
        </span>
      </div>
    </div>
  );
};
