import React from 'react';
import Image from 'next/image';
import type { Media } from '@/payload-types';

export interface ReleaseCoverProps {
  coverImage?: Media | number | null;
  title: string;
  type?: 'single' | 'ep' | 'album';
  coverStatus?: 'confirmed' | 'pending' | 'placeholder' | null;
  priority?: boolean;
  catalogNumber?: string | null;
  releaseYear?: string | number | null;
  isLead?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ReleaseCover: React.FC<ReleaseCoverProps> = ({
  coverImage,
  title,
  type = 'single',
  coverStatus = 'confirmed',
  priority = false,
  catalogNumber = 'DG-DSP',
  releaseYear,
  isLead = true,
  size = 'md',
}) => {
  const mediaObj = coverImage && typeof coverImage === 'object' && 'url' in coverImage ? coverImage : null;
  const hasRealImage = Boolean(mediaObj?.url && coverStatus === 'confirmed');

  const typeLabel = type === 'single' ? 'Single' : type === 'ep' ? 'EP' : 'Álbum';

  return (
    <div
      className={`relative aspect-square w-full bg-gradient-to-br from-carbon via-ink to-graphite border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between group-hover:border-white/30 transition-colors duration-300 ${
        size === 'lg' ? 'p-6 sm:p-8' : 'p-5 sm:p-6'
      }`}
    >
      {/* 1. Arte Real Oficial cuando existe */}
      {hasRealImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={mediaObj!.url!}
            alt={mediaObj!.alt || `Portada oficial de ${title}`}
            fill
            priority={priority}
            sizes={size === 'lg' ? '(max-width: 768px) 100vw, 40vw' : '(max-width: 768px) 100vw, 25vw'}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Sutil viñeta para asegurar legibilidad de metadatos */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/60 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      )}

      {/* 2. Arte de Vinilo Concéntrico (Fallback elegante y para artes en proceso) */}
      {!hasRealImage && (
        <>
          {/* Anillos concéntricos de vinilo */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity"
            aria-hidden="true"
          >
            <div className="w-[90%] h-[90%] rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-[75%] h-[75%] rounded-full border border-white/5 flex items-center justify-center">
                <div className="w-[60%] h-[60%] rounded-full border border-white/10 flex items-center justify-center">
                  <div className="w-[45%] h-[45%] rounded-full border border-white/5 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-carbon border border-white/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-crimson animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-crimson-deep/15 via-transparent to-transparent opacity-50 pointer-events-none"
            aria-hidden="true"
          />
        </>
      )}

      {/* Cabecera del arte: Tipo y Rol */}
      <div className="relative z-10 flex items-start justify-between font-mono text-[10px]">
        <span className="uppercase tracking-wider bg-black/70 backdrop-blur-sm border border-white/10 px-2 py-0.5 text-ash">
          {typeLabel}
        </span>

        <span
          className={`uppercase tracking-widest px-2 py-0.5 border backdrop-blur-sm ${
            isLead
              ? 'bg-black/70 border-white/10 text-bone'
              : 'bg-crimson/25 border-crimson text-crimson-text'
          }`}
        >
          {isLead ? 'Artista Principal' : 'Artista Invitado'}
        </span>
      </div>

      {/* Centro: Título y Artista */}
      <div className="relative z-10 text-center my-auto py-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-smoke block mb-1 drop-shadow">
          DANY GLOCK
        </span>
        <h3
          className={`font-sans font-black tracking-tighter uppercase line-clamp-2 text-bone drop-shadow-md ${
            size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          }`}
        >
          {title}
        </h3>
      </div>

      {/* Metadato inferior: Código de Catálogo y Año */}
      <div className="relative z-10 flex items-end justify-between font-mono text-[10px] text-smoke pt-2 border-t border-white/5">
        <span className="bg-black/60 px-1.5 py-0.5 border border-white/5">
          {catalogNumber || 'DG-DSP'}
        </span>
        <span className="bg-black/60 px-1.5 py-0.5 border border-white/5">
          {releaseYear}
        </span>
      </div>
    </div>
  );
};
